/**
 * 从 URL 中提取文件名和扩展名
 */
export function extractFileInfo(url: string): { filename: string; extension: string; name: string } {
  const empty = { filename: '', extension: '', name: '' }
  if (!url) return empty

  let pathname = ''
  try {
    pathname = new URL(url).pathname
  } catch {
    pathname = url
  }

  const parts = pathname.split('/')
  const filename = parts[parts.length - 1] || url.split('/').pop() || ''
  const cleanFilename = filename.split('?')[0].split('#')[0]

  if (!cleanFilename) return empty

  const lastDotIndex = cleanFilename.lastIndexOf('.')
  const extension = lastDotIndex > 0 ? cleanFilename.slice(lastDotIndex + 1).toLowerCase() : ''
  const name = lastDotIndex > 0 ? cleanFilename.slice(0, lastDotIndex) : cleanFilename
  return { filename: cleanFilename, extension, name }
}