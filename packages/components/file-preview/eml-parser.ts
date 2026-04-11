/**
 * EML (MIME) 解析器
 * 支持 multipart/alternative、multipart/mixed、multipart/related 等嵌套结构
 * 支持 base64、quoted-printable、7bit、8bit 编码
 * 支持 GBK / GB2312 / UTF-8 等常见中文编码
 */

import type { EmlAttachment, ParsedEml } from './types'

/* ------------------------------------------------------------------ */
/* 编码处理                                                          */
/* ------------------------------------------------------------------ */

function decodeEncodedWord(word: string): string {
  // =?charset?encoding?encoded_text?=
  const m = word.match(/^\s*=\?([^?]+)\?([BQbq])\?([^?]*)\?=\s*$/i)
  if (!m) return word

  const [, charset, encoding, encoded] = m
  let decoded: string

  if (encoding.toUpperCase() === 'B') {
    try {
      decoded = atob(encoded.trim())
    } catch {
      return word
    }
  } else if (encoding.toUpperCase() === 'Q') {
    try {
      decoded = decodeQ(encoded)
    } catch {
      return word
    }
  } else {
    return word
  }

  return charset.toUpperCase() === 'GBK' || charset.toUpperCase() === 'GB2312'
    ? tryConvertGb2312(decoded)
    : tryConvert(decoded, charset)
}

function decodeQ(str: string): string {
  return str
    .replace(/_/g, ' ')
    .replace(/=([0-9A-Fa-f]{2})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    )
}

function tryConvert(buf: string, charset: string): string {
  try {
    const decoder = new TextDecoder(charset, { fatal: false })
    return decoder.decode(new TextEncoder().encode(buf).buffer)
  } catch {
    return buf
  }
}

function tryConvertGb2312(buf: string): string {
  try {
    // Node Buffer 在浏览器中不存在，手动用 TextEncoder -> Uint8Array
    const encoded = new TextEncoder().encode(buf)
    const decoder = new TextDecoder('gbk', { fatal: false })
    return decoder.decode(encoded)
  } catch {
    return buf
  }
}

function decodeText(content: string, encoding: string, charset: string): string {
  let raw: string
  if (encoding === 'base64') {
    raw = atob(content.trim())
  } else if (encoding === 'quoted-printable') {
    raw = decodeQuotedPrintable(content)
  } else {
    // 7bit / 8bit / binary → 直接使用
    raw = content
  }

  // 统一按 charset 转换到 UTF-8
  const norm = (charset || 'utf-8').toLowerCase().replace(/['"]/g, '')
  if (norm === 'gbk' || norm === 'gb2312' || norm === 'gb18030') {
    return tryConvertGb2312(raw)
  }
  return tryConvert(raw, norm)
}

function decodeQuotedPrintable(str: string): string {
  return str
    .replace(/=\r?\n/g, '')   // 软换行
    .replace(/=([0-9A-Fa-f]{2})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    )
}

/* ------------------------------------------------------------------ */
/* MIME 头部解析                                                      */
/* ------------------------------------------------------------------ */

/** 把冒号拆分的 header line（支持多行展开）规范化 */
function decodeHeader(headerValue: string): string {
  // 合并 =? ... =? ... =? 形式的 encoded-word
  const parts = headerValue.match(/(?:=\?[^?]+\?[BQbq]\?[^?]*\?=)/gi) || []
  if (!parts.length) return headerValue.trim()
  return parts.map(decodeEncodedWord).join('')
}

function parseHeaders(lines: string[]): Map<string, string> {
  const headers = new Map<string, string>()
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    // 第一个空行或非 header 行（不以空格/Tab 开头）时停止
    if (line === '' || (line[0] !== ' ' && line[0] !== '\t' && !line.includes(':'))) break
    if (!line.includes(':')) { i++; continue }

    const colonIdx = line.indexOf(':')
    const key = line.slice(0, colonIdx).toLowerCase()
    let value = line.slice(colonIdx + 1).trim()

    // 合并多行 header
    while (i + 1 < lines.length && (lines[i + 1].startsWith(' ') || lines[i + 1].startsWith('\t'))) {
      i++
      value += ' ' + lines[i + 1].trim()
    }

    headers.set(key, value)
    i++
  }
  return headers
}

function getCharset(headers: Map<string, string>): string {
  const ct = headers.get('content-type') || ''
  const m = ct.match(/charset\s*=\s*["']?([^"';\s]+)/i)
  return m ? m[1] : 'utf-8'
}

function getBoundary(headers: Map<string, string>): string | null {
  const ct = headers.get('content-type') || ''
  const m = ct.match(/boundary\s*=\s*["']?([^"';\s]+)/i)
  return m ? m[1] : null
}

function getDisposition(headers: Map<string, string>): { type: string; params: Map<string, string> } {
  const raw = headers.get('content-disposition') || 'inline'
  const [type, ...pairs] = raw.split(';')
  const params = new Map<string, string>()
  for (const p of pairs) {
    const kv = p.split('=')
    if (kv.length >= 2) {
      params.set(kv[0].trim().toLowerCase(), kv.slice(1).join('=').replace(/^["']|["']$/g, ''))
    }
  }
  return { type: type.toLowerCase().trim(), params }
}

function getFilename(headers: Map<string, string>): string | undefined {
  const cd = headers.get('content-disposition') || ''
  const ct = headers.get('content-type') || ''

  for (const header of [cd, ct]) {
    const m = header.match(/filename\*?\*?=\s*(?:["']?)([^"';\r\n]+)(?:["']?)/i)
    if (m) return m[1].replace(/^.*filename\*?\*?=\s*/i, '').trim()
  }
  return undefined
}

function getContentId(headers: Map<string, string>): string | undefined {
  const raw = headers.get('content-id') || ''
  const m = raw.match(/<([^>]+)>/)
  return m ? m[1] : undefined
}

function getTransferEncoding(headers: Map<string, string>): string {
  const raw = headers.get('content-transfer-encoding') || '7bit'
  return raw.toLowerCase().trim()
}

/* ------------------------------------------------------------------ */
/* MIME 多层递归解析                                                  */
/* ------------------------------------------------------------------ */

/** 找到第一个 boundary 前后的范围索引 */
function findBoundary(lines: string[], boundary: string, fromIdx = 0): { start: number; end: number } {
  // 支持 "boundary" 或 "--boundary" 两种形式（RFC 2046 允许前缀 --）
  const normalized = boundary.replace(/^--+/, '')
  const prefix1 = '--' + normalized
  const prefix2 = '----' + normalized   // 部分客户端 boundary 本身以 -- 开头
  let start = -1, end = -1
  for (let i = fromIdx; i < lines.length; i++) {
    const line = lines[i]
    if (line.startsWith(prefix1) || line.startsWith(prefix2)) {
      if (start === -1) start = i
      else { end = i; break }
    }
  }
  if (start !== -1 && end === -1) end = lines.length
  return { start, end }
}

function isMultipart(headers: Map<string, string>): boolean {
  const ct = headers.get('content-type') || ''
  return /^multipart\//i.test(ct)
}

/** 递归解析 MIME 部分 */
function parsePart(lines: string[], startIdx: number, endIdx: number): { headers: Map<string, string>; bodyLines: string[] } {
  const slice = lines.slice(startIdx, endIdx)
  const headers = parseHeaders(slice)
  // body 从 header 之后的第一个空行开始
  let bodyStart = 0
  for (let i = 0; i < slice.length; i++) {
    if (slice[i].trim() === '') { bodyStart = i + 1; break }
  }
  const bodyLines = slice.slice(bodyStart)
  return { headers, bodyLines }
}

function parseMultipart(
  lines: string[],
  boundary: string,
  startIdx: number,
  endIdx: number
): EmlAttachment[] {
  const parts: EmlAttachment[] = []
  const { start, end } = findBoundary(lines, boundary, startIdx)

  if (start === -1) return parts

  let cursor = start + 1
  while (cursor < (end === -1 ? lines.length : end)) {
    const { start: pStart, end: pEnd } = findBoundary(lines, boundary, cursor)
    if (pStart === -1) break

    const pEndActual = pEnd === -1 ? lines.length : pEnd
    const { headers, bodyLines } = parsePart(lines, pStart, pEndActual)
    const ct = (headers.get('content-type') || 'text/plain').toLowerCase()

    if (isMultipart(headers)) {
      const innerBoundary = getBoundary(headers)
      if (innerBoundary) {
        parts.push(...parseMultipart(lines, innerBoundary, pStart, pEndActual))
      }
    } else {
      const disp = getDisposition(headers)
      const isInline = disp.type === 'inline'
      const contentId = getContentId(headers)
      const filename = getFilename(headers)
      const te = getTransferEncoding(headers)
      const charset = getCharset(headers)
      const bodyRaw = bodyLines.join('\n')

      const isText = ct.startsWith('text/')

      if (isText) {
        parts.push({
          filename,
          contentType: ct,
          content: decodeText(bodyRaw, te, charset),
          isText: true,
          isInline,
          contentId,
        })
      } else {
        // 二进制附件：保留 base64 原文，由调用方决定如何处理
        parts.push({
          filename,
          contentType: ct,
          content: bodyRaw.replace(/\s/g, ''),
          isText: false,
          isInline,
          contentId,
        })
      }
    }

    cursor = pEnd === -1 ? lines.length : pEnd + 1
  }

  return parts
}

/* ------------------------------------------------------------------ */
/* 主入口                                                            */
/* ------------------------------------------------------------------ */

export function parseEml(raw: string): ParsedEml {
  const result: ParsedEml = {
    subject: '',
    from: '',
    fromText: '',
    to: '',
    toText: '',
    date: '',
    html: undefined,
    text: undefined,
    attachments: [],
  }

  const lines = raw.split(/\r?\n/)
  const headers = parseHeaders(lines)

  // 提取邮件头
  result.subject = decodeHeader(headers.get('subject') || '')
  result.from    = headers.get('from') || ''
  result.fromText = decodeHeader(result.from)
  result.to      = headers.get('to') || ''
  result.toText   = decodeHeader(result.to)
  result.date    = headers.get('date') || ''

  // 找 body 开始位置（header 之后第一个空行）
  let bodyStartIdx = 0
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '') { bodyStartIdx = i + 1; break }
  }

  // 解析 body
  if (isMultipart(headers)) {
    const boundary = getBoundary(headers)
    if (boundary) {
      const parts = parseMultipart(lines, boundary, bodyStartIdx, lines.length)
      for (const p of parts) {
        if (!p.isInline && p.isText) {
          const ct = p.contentType || ''
          if (ct.includes('html')) result.html = p.content
          else if (!result.html && !result.text) result.text = p.content
        } else {
          result.attachments.push(p)
        }
      }
    }
  } else {
    const te = getTransferEncoding(headers)
    const charset = getCharset(headers)
    const bodyRaw = lines.slice(bodyStartIdx).join('\n')
    const ct = (headers.get('content-type') || '').toLowerCase()
    const decoded = decodeText(bodyRaw, te, charset)
    if (ct.includes('html')) result.html = decoded
    else result.text = decoded
  }

  return result
}
