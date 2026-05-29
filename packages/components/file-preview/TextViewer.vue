<template>
  <div class="hx-text-viewer" :style="{ width, height }">
    <div class="hx-text-viewer__thumb" @click="open">
      <div class="hx-text-viewer__icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
          <polyline points="13 2 13 9 20 9" />
        </svg>
      </div>
      <div class="hx-text-viewer__label">文本</div>
    </div>

    <teleport to="body">
      <Transition name="fade">
        <div v-if="visible" class="hx-text-viewer__modal" @click.self="close">
          <div class="hx-text-viewer__content">
            <div class="hx-text-viewer__toolbar">
              <div class="hx-text-viewer__toolbar-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                  <polyline points="13 2 13 9 20 9" />
                </svg>
                <span>文本预览</span>
              </div>
              <div class="hx-text-viewer__toolbar-actions">
                <button class="hx-text-viewer__action-btn" @click="copyContent">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>复制</span>
                </button>
                <button class="hx-text-viewer__action-btn" @click="download">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>下载</span>
                </button>
                <button class="hx-text-viewer__close-btn" @click="close">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="hx-text-viewer__body">
              <pre class="hx-text-viewer__text-content" ref="textContentRef">{{ content }}</pre>
            </div>
          </div>
        </div>
      </Transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import type { TextViewerProps } from './types'

const props = withDefaults(defineProps<TextViewerProps>(), {
  width: '120px',
  height: '80px',
})

const visible = ref(false)
const content = ref('')
const textContentRef = ref<HTMLElement | null>(null)

async function loadContent() {
  if (!props.url) return
  try {
    const res = await fetch(props.url)
    content.value = await res.text()
  } catch {
    content.value = '加载失败'
  }
}

function open() {
  visible.value = true
  document.body.style.overflow = 'hidden'
  if (!content.value) loadContent()
}

function close() {
  visible.value = false
  document.body.style.overflow = ''
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(content.value)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = content.value
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }
}

function download() {
  const blob = new Blob([content.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'document.txt'
  a.click()
  URL.revokeObjectURL(url)
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && visible.value) close()
  if ((e.ctrlKey || e.metaKey) && e.key === 'a' && visible.value) {
    e.preventDefault()
    if (textContentRef.value) {
      const range = document.createRange()
      range.selectNode(textContentRef.value)
      window.getSelection()?.removeAllRanges()
      window.getSelection()?.addRange(range)
    }
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'c' && visible.value) {
    copyContent()
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})

watch(visible, val => {
  document.body.style.overflow = val ? 'hidden' : ''
})

watch(
  () => props.url,
  () => {
    content.value = ''
  }
)
</script>

<style lang="scss" scoped>
@use './transitions.scss' as *;
$primary-color: var(--hx-primary-color);
$bg: var(--hx-bg-color);
$bg-page: var(--hx-bg-color-page);
$bg-hover: var(--hx-bg-color-hover);
$border-color: var(--hx-border-color-base);
$text-primary: var(--hx-text-color-primary);
$text-regular: var(--hx-text-color-regular);
$text-secondary: var(--hx-text-color-secondary);
$shadow: var(--hx-shadow-color);

.hx-text-viewer {
  width: 100%;
  height: 100%;

  &__thumb {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: $bg-page;
    border: 1px solid $border-color;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 8px;
    box-sizing: border-box;

    &:hover {
      background: $bg-hover;
      border-color: $primary-color;
      /* transform: translateY(-2px); */
      box-shadow: 0 2px 8px $shadow;
    }
  }

  &__icon {
    color: $primary-color;
    margin-bottom: 4px;
    flex-shrink: 0;
  }

  &__label {
    font-size: 11px;
    color: $text-secondary;
    font-weight: 500;
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
      font-size: 18px;
      font-weight: 600;
      color: #fff;
    }

    &-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  &__action-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 6px;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.3);
    }
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

    &:hover {
      background: rgba(255, 77, 77, 0.2);
      border-color: rgba(255, 77, 77, 0.4);
      transform: rotate(90deg);
    }
  }

  &__body {
    flex: 1;
    overflow: auto;
    padding: 80px 24px 24px;
    background: $bg-page;
  }

  &__text-content {
    margin: 0;
    padding: 16px;
    background: $bg;
    border: 1px solid $border-color;
    border-radius: 6px;
    font-family: 'Courier New', 'Consolas', 'Monaco', monospace;
    font-size: 14px;
    line-height: 1.6;
    color: $text-primary;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-x: auto;
    max-width: 100%;
    user-select: text;
    tab-size: 2;
  }
}
</style>