<template>
  <div class="hx-markdown-viewer" :style="{ width, height }">
    <div class="hx-markdown-viewer__thumb" @click="open">
      <div class="hx-markdown-viewer__icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      </div>
      <div class="hx-markdown-viewer__label">Markdown</div>
    </div>

    <teleport to="body">
      <Transition name="fade">
        <div v-if="visible" class="hx-markdown-viewer__modal" @click.self="close">
          <div class="hx-markdown-viewer__content">
            <div class="hx-markdown-viewer__toolbar">
              <div class="hx-markdown-viewer__toolbar-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <span>Markdown 预览</span>
              </div>
              <div class="hx-markdown-viewer__toolbar-actions">
                <button class="hx-markdown-viewer__action-btn" @click="download">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>下载</span>
                </button>
                <button class="hx-markdown-viewer__close-btn" @click="close">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="hx-markdown-viewer__body">
              <div class="hx-markdown-viewer__md-content" v-html="renderedContent" />
            </div>
          </div>
        </div>
      </Transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import type { MarkdownViewerProps } from './types'

const props = withDefaults(defineProps<MarkdownViewerProps>(), {
  width: '120px',
  height: '80px',
})

const visible = ref(false)
const content = ref('')
const renderedContent = ref('')

function parseMarkdownSimple(md: string): string {
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>')
  html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>')
  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>')
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')

  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
  html = html.replace(/__(.*?)__/gim, '<strong>$1</strong>')
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>')
  html = html.replace(/_(.*?)_/gim, '<em>$1</em>')

  html = html.replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
  html = html.replace(/`([^`]+)`/gim, '<code>$1</code>')

  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" />')

  html = html.replace(/^\* (.*$)/gim, '<li>$1</li>')
  html = html.replace(/^- (.*$)/gim, '<li>$1</li>')
  html = html.replace(/^\+ (.*$)/gim, '<li>$1</li>')
  html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>')

  html = html.replace(/\n\n/gim, '</p><p>')
  html = '<p>' + html + '</p>'
  html = html.replace(/\n/gim, '<br />')

  return html
}

async function loadContent() {
  if (!props.url) return
  try {
    const res = await fetch(props.url)
    const text = await res.text()
    content.value = text
    renderedContent.value = parseMarkdownSimple(text)
  } catch {
    renderedContent.value = '<p style="color: #f44336;">加载失败</p>'
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

function download() {
  const blob = new Blob([content.value], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'document.md'
  a.click()
  URL.revokeObjectURL(url)
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && visible.value) close()
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
    renderedContent.value = ''
  }
)
</script>

<style lang="scss" scoped>
@use './transitions.scss' as *;
$primary-color: #667eea;

.hx-markdown-viewer {
  width: 100%;
  height: 100%;

  &__thumb {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 8px;
    box-sizing: border-box;

    &:hover {
      background: #eeeeee;
      border-color: $primary-color;
      transform: translateY(-2px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }

  &__icon {
    color: $primary-color;
    margin-bottom: 4px;
    flex-shrink: 0;
  }

  &__label {
    font-size: 11px;
    color: #616161;
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
    background: #fff;
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
    overflow-y: auto;
    padding: 80px 24px 24px;
    background: #fff;
  }

  &__md-content {
    max-width: 100%;
    line-height: 1.6;
    color: #212529;

    :deep(h1),
    :deep(h2),
    :deep(h3),
    :deep(h4),
    :deep(h5),
    :deep(h6) {
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: 600;
      line-height: 1.25;
    }

    :deep(h1) {
      font-size: 2em;
      border-bottom: 1px solid #eaecef;
      padding-bottom: 0.3em;
    }

    :deep(h2) {
      font-size: 1.5em;
      border-bottom: 1px solid #eaecef;
      padding-bottom: 0.3em;
    }

    :deep(h3) {
      font-size: 1.25em;
    }

    :deep(p) {
      margin-bottom: 16px;
    }

    :deep(ul),
    :deep(ol) {
      margin-bottom: 16px;
      padding-left: 2em;
    }

    :deep(li) {
      margin-bottom: 4px;
    }

    :deep(code) {
      background: #f6f8fa;
      border-radius: 3px;
      padding: 2px 6px;
      font-family: 'Courier New', monospace;
      font-size: 0.9em;
      color: #e83e8c;
    }

    :deep(pre) {
      background: #f6f8fa;
      border-radius: 6px;
      padding: 16px;
      overflow-x: auto;
      margin-bottom: 16px;
      line-height: 1.45;

      code {
        background: transparent;
        padding: 0;
        color: #24292e;
      }
    }

    :deep(a) {
      color: #0366d6;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    :deep(img) {
      max-width: 100%;
      height: auto;
      border-radius: 6px;
      margin: 16px 0;
    }

    :deep(blockquote) {
      border-left: 4px solid #dfe2e5;
      padding-left: 16px;
      color: #6a737d;
      margin: 16px 0;
    }

    :deep(table) {
      border-collapse: collapse;
      width: 100%;
      margin: 16px 0;
    }

    :deep(th),
    :deep(td) {
      border: 1px solid #dfe2e5;
      padding: 8px 12px;
      text-align: left;
    }

    :deep(th) {
      background: #f6f8fa;
      font-weight: 600;
    }
  }
}
</style>