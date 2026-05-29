<template>
  <div>
    <!-- 缩略图：已解析出邮件信息 -->
    <div
      v-if="parsed && !error"
      class="hx-eml-viewer__thumb"
      :style="{ width, height }"
      @click="openModal"
    >
      <div class="hx-eml-viewer__icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      </div>
      <div class="hx-eml-viewer__subject">{{ parsed.subject || '无主题' }}</div>
      <div class="hx-eml-viewer__meta">
        <span>{{ parsed.fromText || '未知发件人' }}</span>
        <span>{{ parsed.date }}</span>
      </div>
    </div>

    <!-- 空状态：无 url -->
    <div v-else-if="!url" class="hx-eml-viewer__empty" :style="{ width, height }">
      <div class="hx-eml-viewer__empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      </div>
      <span>无文件</span>
    </div>

    <!-- 加载中 -->
    <div v-else-if="isLoading" class="hx-eml-viewer__loading" :style="{ width, height }">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      <span>加载中...</span>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="hx-eml-viewer__error" :style="{ width, height }">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <span>{{ error }}</span>
    </div>

    <!-- 空数据：已加载但无邮件信息 -->
    <div v-else class="hx-eml-viewer__empty" :style="{ width, height }">
      <span>邮件解析失败</span>
    </div>

    <!-- 全屏预览弹窗 -->
    <teleport to="body">
      <Transition name="fade">
        <div v-if="showModal" class="hx-eml-viewer__modal" @click.self="closeModal">
          <div class="hx-eml-viewer__content">
            <div class="hx-eml-viewer__toolbar">
              <div class="hx-eml-viewer__toolbar-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span>{{ parsed?.subject || '邮件预览' }}</span>
              </div>
              <div class="hx-eml-viewer__toolbar-actions">
                <button class="hx-eml-viewer__close-btn" @click="closeModal">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            <div class="hx-eml-viewer__header">
              <div class="hx-eml-viewer__header-item hx-eml-viewer__subject-item">
                <span class="hx-eml-viewer__label">主题</span>
                <span class="hx-eml-viewer__value">{{ parsed?.subject || '无主题' }}</span>
              </div>
              <div class="hx-eml-viewer__header-item">
                <span class="hx-eml-viewer__label">发件人</span>
                <span class="hx-eml-viewer__value">{{ parsed?.fromText || '未知' }}</span>
              </div>
              <div class="hx-eml-viewer__header-item">
                <span class="hx-eml-viewer__label">收件人</span>
                <span class="hx-eml-viewer__value">{{ parsed?.toText || '未知' }}</span>
              </div>
              <div class="hx-eml-viewer__header-item">
                <span class="hx-eml-viewer__label">时间</span>
                <span class="hx-eml-viewer__value">{{ parsed?.date || '未知' }}</span>
              </div>
            </div>

            <div class="hx-eml-viewer__body-wrapper">
              <!-- HTML 正文：替换内嵌图片 CID -->
              <div
                v-if="parsed?.html"
                class="hx-eml-viewer__html-body"
                v-html="processedHtml"
              />
              <!-- 纯文本正文 -->
              <pre v-else-if="parsed?.text" class="hx-eml-viewer__text-body">{{ parsed.text }}</pre>
              <!-- 无正文 -->
              <div v-else class="hx-eml-viewer__no-body">无正文内容</div>
            </div>

            <!-- 附件列表 -->
            <div v-if="parsed?.attachments?.length" class="hx-eml-viewer__attachments">
              <div class="hx-eml-viewer__attachments-header" @click="attachmentsExpanded = !attachmentsExpanded">
                <div class="hx-eml-viewer__header-left">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                  <h4>附件 ({{ parsed.attachments.length }})</h4>
                </div>
                <svg class="hx-eml-viewer__collapse-icon" :class="{ collapsed: !attachmentsExpanded }" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              <Transition name="collapse">
                <div v-show="attachmentsExpanded" class="hx-eml-viewer__attachments-list">
                  <div v-for="(att, index) in parsed.attachments" :key="index" class="hx-eml-viewer__attachment-item">
                    <div class="hx-eml-viewer__attachment-info">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                        <polyline points="13 2 13 9 20 9" />
                      </svg>
                      <span>{{ att.filename || '未命名文件' }}</span>
                      <span v-if="att.isInline" class="hx-eml-viewer__inline-badge">内嵌</span>
                    </div>
                    <div class="hx-eml-viewer__attachment-actions">
                      <button
                        v-if="att.isText && att.contentType?.includes('image/')"
                        @click="previewImage(att)"
                        class="hx-eml-viewer__action-btn hx-eml-viewer__preview-btn"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        <span>预览</span>
                      </button>
                      <button @click="downloadAttachment(att)" class="hx-eml-viewer__action-btn hx-eml-viewer__download-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        <span>下载</span>
                      </button>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </Transition>

      <!-- 图片预览浮层 -->
      <Transition name="fade">
        <div v-if="imagePreviewUrl" class="hx-eml-viewer__image-preview" @click="closeImagePreview">
          <div class="hx-eml-viewer__image-preview-header">
            <button class="hx-eml-viewer__image-close-btn" @click="closeImagePreview">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <img :src="imagePreviewUrl" alt="附件图片预览" @click.stop />
        </div>
      </Transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onUnmounted, onMounted } from 'vue'
import { parseEml } from './eml-parser'
import type { EmlViewerProps, ParsedEml, EmlAttachment } from './types'

const props = withDefaults(defineProps<EmlViewerProps>(), {
  width: '120px',
  height: '80px',
})

const parsed = ref<ParsedEml | null>(null)
const showModal = ref(false)
const error = ref<string | null>(null)
const isLoading = ref(false)
const imagePreviewUrl = ref('')
const attachmentsExpanded = ref(true)

/* ---------------- 内容加载 ---------------- */

async function loadContent() {
  if (!props.url) return
  isLoading.value = true
  error.value = null
  parsed.value = null

  try {
    const res = await fetch(props.url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const raw = await res.text()
    parsed.value = parseEml(raw)
  } catch (e: any) {
    error.value = e?.message?.includes('HTTP') ? '邮件加载失败（文件不存在或无法访问）' : '邮件解析失败'
  } finally {
    isLoading.value = false
  }
}

/* ---------------- HTML 正文处理（替换内嵌图片 CID） ---------------- */

const processedHtml = computed(() => {
  if (!parsed.value?.html) return ''
  let html = parsed.value.html

  for (const att of parsed.value.attachments) {
    if (att.isInline && att.contentId && att.isText) {
      // 内嵌图片：以 text/plain 存的是 base64 PNG/JPEG，需要生成 data URL
      const ct = att.contentType || 'image/png'
      try {
        const binary = atob(att.content.replace(/\s/g, ''))
        const bytes = new Uint8Array(binary.length)
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
        const blob = new Blob([bytes], { type: ct })
        const blobUrl = URL.createObjectURL(blob)
        html = html.replace(new RegExp(`(src|background)\\s*=\\s*["']cid:${att.contentId}["']`, 'gi'),
          `$1="${blobUrl}"`)
      } catch { /* base64 解码失败则忽略 */ }
    }
  }

  return html
})

/* ---------------- 弹窗 ---------------- */

function openModal() {
  if (!props.url) return
  showModal.value = true
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  showModal.value = false
  document.body.style.overflow = ''
  closeImagePreview()
}

/* ---------------- 图片预览 ---------------- */

function previewImage(att: EmlAttachment) {
  if (imagePreviewUrl.value) URL.revokeObjectURL(imagePreviewUrl.value)
  const ct = att.contentType || 'image/png'
  try {
    const binary = atob(att.content.replace(/\s/g, ''))
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    const blob = new Blob([bytes], { type: ct })
    imagePreviewUrl.value = URL.createObjectURL(blob)
  } catch {
    imagePreviewUrl.value = ''
  }
}

function closeImagePreview() {
  if (imagePreviewUrl.value) URL.revokeObjectURL(imagePreviewUrl.value)
  imagePreviewUrl.value = ''
}

/* ---------------- 附件下载 ---------------- */

function downloadAttachment(att: EmlAttachment) {
  if (!att.content) return

  if (att.isText) {
    // 文本附件 → Blob as text
    const blob = new Blob([att.content], { type: att.contentType || 'text/plain' })
    triggerDownload(blob, att.filename || 'attachment.txt')
  } else {
    // 二进制附件 → base64 → Blob
    try {
      const binary = atob(att.content.replace(/\s/g, ''))
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
      const blob = new Blob([bytes], { type: att.contentType || 'application/octet-stream' })
      triggerDownload(blob, att.filename || 'attachment')
    } catch {
      error.value = '附件下载失败（编码错误）'
    }
  }
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/* ---------------- 键盘 / 生命周期 ---------------- */

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    if (imagePreviewUrl.value) closeImagePreview()
    else if (showModal.value) closeModal()
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  closeImagePreview()
  document.body.style.overflow = ''
})

watch(showModal, val => {
  document.body.style.overflow = val ? 'hidden' : ''
})

watch(
  () => props.url,
  () => {
    parsed.value = null
    error.value = null
    if (props.url) loadContent()
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
@use './transitions.scss' as *;
$primary-color: var(--hx-primary-color);
$bg: var(--hx-bg-color);
$bg-page: var(--hx-bg-color-page);
$bg-hover: var(--hx-bg-color-hover);
$border-color: var(--hx-border-color-base);
$border-light: var(--hx-border-color-light);
$text-primary: var(--hx-text-color-primary);
$text-regular: var(--hx-text-color-regular);
$text-secondary: var(--hx-text-color-secondary);
$text-muted: var(--hx-text-color-secondary);
$shadow: var(--hx-shadow-color);
$danger-bg: var(--hx-danger-color-bg, #fff5f5);
$danger-border: var(--hx-danger-color-border, #ffcdd2);
$danger-color: var(--hx-danger-color, #e57373);

.hx-eml-viewer {
  &__thumb {
    width: 100%;
    height: 100%;
    border: 1px solid $border-color;
    padding: 8px;
    cursor: pointer;
    border-radius: 6px;
    background: $bg;
    box-shadow: 0 2px 6px $shadow;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    overflow: hidden;

    &:hover {
      box-shadow: 0 4px 12px $shadow;
      /* transform: translateY(-2px); */
      border-color: $primary-color;
    }
  }

  &__icon {
    color: $primary-color;
    margin-bottom: 6px;
    flex-shrink: 0;
  }

  &__subject {
    font-weight: 600;
    margin-bottom: 4px;
    font-size: 12px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    line-height: 1.3;
    color: $text-primary;
  }

  &__meta {
    font-size: 10px;
    color: $text-secondary;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    width: 100%;

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
      text-align: center;

      &:last-child { color: $text-muted; }
    }
  }

  &__empty,
  &__loading,
  &__error {
    width: 100%;
    height: 100%;
    border: 1px solid $border-color;
    border-radius: 6px;
    background: $bg-page;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    box-sizing: border-box;
    padding: 8px;

    span {
      font-size: 11px;
      color: $text-muted;
      text-align: center;
    }
  }

  &__empty-icon { color: $text-muted; }
  &__loading-icon { color: $text-secondary; }

  &__loading {
    svg { color: $text-secondary; }
    span { color: $text-secondary; }
  }

  &__error {
    background: $danger-bg;
    border-color: $danger-border;

    svg { color: $danger-color; }
    span { color: $danger-color; }
  }

  &__modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 40px 20px;
    overflow-y: auto;
    z-index: 9999;
  }

  &__content {
    background: $bg;
    max-width: 1000px;
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 80px);
    min-height: 300px;
  }

  &__toolbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 56px;
    background: rgba(30, 30, 30, 0.95);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    z-index: 10000;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

    &-title {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
      min-width: 0;
      font-size: 18px;
      font-weight: 600;
      color: #fff;

      svg { flex-shrink: 0; }

      span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    &-actions { display: flex; align-items: center; gap: 8px; }
  }

  &__close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 6px;
    color: #fff;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;

    &:hover {
      background: rgba(255, 77, 77, 0.2);
      border-color: rgba(255, 77, 77, 0.4);
      transform: rotate(90deg);
    }
  }

  &__header {
    padding: 72px 24px 16px;
    background: $bg-page;
    border-bottom: 1px solid $border-light;
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex-shrink: 0;

    &-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
    }

    &-item.hx-eml-viewer__subject-item {
      padding-bottom: 8px;
      border-bottom: 1px solid $border-light;
      margin-bottom: 2px;
    }
  }

  &__label {
    font-weight: 600;
    color: $text-regular;
    min-width: 60px;
    font-size: 13px;
  }

  &__value {
    color: $text-primary;
    flex: 1;
    word-break: break-all;
    font-size: 13px;
  }

  &__body-wrapper {
    flex: 1 1 0;
    overflow-y: auto;
    padding: 24px;
    min-height: 200px;
  }

  &__html-body {
    max-width: 100%;
    word-break: break-word;
    line-height: 1.6;
    color: $text-primary;

    :deep(img) {
      max-width: 100%;
      height: auto;
      border-radius: 6px;
      margin: 8px 0;
    }

    :deep(table) {
      max-width: 100%;
      overflow-x: auto;
      display: block;
    }
  }

  &__text-body {
    font-family: 'Courier New', 'Consolas', 'Monaco', monospace;
    font-size: 14px;
    white-space: pre-wrap;
    background: $bg-page;
    padding: 16px;
    border-radius: 6px;
    border: 1px solid $border-light;
    word-break: break-word;
    line-height: 1.6;
    color: $text-primary;
  }

  &__no-body {
    color: $text-muted;
    font-size: 14px;
    text-align: center;
    padding: 40px;
  }

  &__attachments {
    padding: 16px 24px;
    background: $bg-page;
    border-top: 1px solid $border-light;
    max-height: calc((100vh - 80px) * 0.45);
    min-height: 120px;
    overflow-y: auto;
    overflow-x: hidden;
    flex-shrink: 0;

    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 12px;
      flex-shrink: 0;
      cursor: pointer;
      user-select: none;
      padding: 4px 0;
      transition: background-color 0.2s ease;
      border-radius: 4px;

      &:hover { background-color: $bg-hover; }

      h4 { margin: 0; font-size: 15px; font-weight: 600; color: $text-primary; }
    }

    &-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-height: 0;
      width: 100%;
    }
  }

  &__header-left {
    display: flex;
    align-items: center;
    gap: 8px;
    color: $primary-color;
  }

  &__collapse-icon {
    color: $primary-color;
    transition: transform 0.3s ease;
    flex-shrink: 0;

    &.collapsed { transform: rotate(-90deg); }
  }

  &__attachment-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    background: $bg;
    border: 1px solid $border-light;
    border-radius: 6px;
    transition: all 0.2s ease;
    flex-shrink: 0;
    min-width: 0;
    width: 100%;
    box-sizing: border-box;

    &:hover {
      border-color: $primary-color;
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
    }
  }

  &__attachment-info {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    min-width: 0;

    svg { color: $primary-color; flex-shrink: 0; }

    span {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: $text-primary;
      font-size: 13px;
    }
  }

  &__inline-badge {
    padding: 2px 8px;
    background: var(--hx-eml-badge-bg);
    color: var(--hx-eml-badge-color);
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    flex-shrink: 0;
  }

  &__attachment-actions {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
  }

  &__action-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 5px 10px;
    border: 1px solid $border-color;
    border-radius: 5px;
    background: $bg;
    color: $text-regular;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: $bg-hover;
      border-color: $primary-color;
      color: $primary-color;
    }

    svg { flex-shrink: 0; }
  }

  &__preview-btn:hover {
    background: var(--hx-eml-preview-btn-hover-bg);
    border-color: var(--hx-eml-preview-btn-hover-border);
    color: var(--hx-eml-preview-btn-hover-color);
  }

  &__download-btn:hover {
    background: var(--hx-eml-download-btn-hover-bg);
    border-color: var(--hx-eml-download-btn-hover-border);
    color: var(--hx-eml-download-btn-hover-color);
  }

  &__image-preview {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    padding: 40px;

    &-header {
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 10001;
    }

    img {
      max-width: 100%;
      max-height: calc(100vh - 80px);
      border-radius: 8px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
      object-fit: contain;
    }
  }

  &__image-close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: #fff;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(255, 77, 77, 0.3);
      border-color: rgba(255, 77, 77, 0.5);
      transform: rotate(90deg);
    }
  }
}


@media (max-width: 768px) {
  .hx-eml-viewer {
    &__modal { padding: 0; }
    &__content {
      max-height: 100vh;
      border-radius: 0;
      min-height: 100vh;
    }
    &__header {
      padding: 60px 12px 12px;
    }
    &__header-item {
      flex-direction: column;
      gap: 4px;
    }
    &__body-wrapper { padding: 12px; }
    &__attachments { padding: 12px; }
    &__attachment-item { flex-direction: column; align-items: flex-start; gap: 12px; }
    &__attachment-actions { width: 100%; justify-content: flex-end; }
    &__action-btn span { display: none; }
    &__image-preview { padding: 0; }
  }
}
</style>
