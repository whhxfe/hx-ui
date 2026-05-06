<template>
  <div class="hx-pdf-viewer" :style="{ width, height }">
    <div class="hx-pdf-viewer__thumb" @click="open">
      <canvas v-show="!loadError && !isLoading && !!props.url" ref="thumbCanvas" />
      <div v-if="loadError" class="hx-pdf-viewer__error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <div v-else-if="isLoading" class="hx-pdf-viewer__loading-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      </div>
      <div v-else class="hx-pdf-viewer__placeholder-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      </div>
      <div class="hx-pdf-viewer__mask">
        <span>PDF</span>
      </div>
    </div>

    <teleport to="body">
      <Transition name="fade">
        <div v-if="visible" class="hx-pdf-viewer__modal" @click.self="close">
          <div class="hx-pdf-viewer__toolbar">
            <div class="hx-pdf-viewer__toolbar-group">
              <button class="hx-pdf-viewer__toolbar-btn" @click="prevPage" :disabled="page <= 1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <span>上一页</span>
              </button>
              <span class="hx-pdf-viewer__info">{{ page }} / {{ total }}</span>
              <button class="hx-pdf-viewer__toolbar-btn" @click="nextPage" :disabled="page >= total">
                <span>下一页</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
            <div class="hx-pdf-viewer__divider" />
            <div class="hx-pdf-viewer__toolbar-group">
              <button class="hx-pdf-viewer__toolbar-btn" @click="zoomOut" :disabled="scale <= 0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </button>
              <span class="hx-pdf-viewer__info">{{ Math.round(scale * 100) }}%</span>
              <button class="hx-pdf-viewer__toolbar-btn" @click="zoomIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </button>
            </div>
            <div class="hx-pdf-viewer__divider" />
            <div class="hx-pdf-viewer__toolbar-group">
              <button class="hx-pdf-viewer__toolbar-btn" @click="download">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>下载</span>
              </button>
            </div>
            <div class="hx-pdf-viewer__toolbar-actions">
              <button class="hx-pdf-viewer__close-btn" @click="close">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
          <div class="hx-pdf-viewer__viewer" @scroll="handleScroll">
            <canvas ref="viewerCanvas" />
          </div>
        </div>
      </Transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, markRaw, nextTick, onMounted, onUnmounted } from 'vue'
import type { PdfViewerProps } from './types'

const props = withDefaults(defineProps<PdfViewerProps>(), {
  width: '120px',
  height: '80px',
})

const thumbCanvas = ref<HTMLCanvasElement | null>(null)
const viewerCanvas = ref<HTMLCanvasElement | null>(null)

let pdfjs: any = null
let pdfDoc: any = null
let pdfBlob: Blob | null = null
let loadPdfPromise: Promise<void> | null = null
let loadGeneration = 0

const page = ref(1)
const total = ref(0)
const scale = ref(1.0)
const visible = ref(false)
const loadError = ref(false)
const isLoading = ref(false)

// 动态加载 pdfjs，避免顶层导入导致消费者项目打包报错
async function ensurePdfjs() {
  if (pdfjs) return true
  try {
    const module = await import('pdfjs-dist')
    pdfjs = module
    const workerUrl = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).href
    pdfjs.GlobalWorkerOptions.workerSrc = workerUrl
    return true
  } catch (e) {
    console.error('[PdfViewer] 加载 pdfjs-dist 失败:', e)
    loadError.value = true
    return false
  }
}

async function loadPdf() {
  if (!props.url) {
    loadError.value = false
    isLoading.value = false
    return
  }
  if (pdfDoc) {
    loadError.value = false
    if (visible.value) nextTick(() => renderPage())
    return
  }
  if (loadPdfPromise) return loadPdfPromise

  const gen = loadGeneration
  loadPdfPromise = (async () => {
    isLoading.value = true
    loadError.value = false
    try {
      // 确保 pdfjs 已加载
      if (!(await ensurePdfjs())) return
    } catch (e) {
      loadError.value = true
      console.warn('[PdfViewer] 加载 PDF 失败:', e)
      return
    } finally {
      isLoading.value = false
    }

    try {
      if (typeof props.url === 'string') {
        const res = await fetch(props.url)
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        pdfBlob = await res.blob()
      } else if (props.url instanceof Blob) {
        pdfBlob = props.url
      }
    } catch (e) {
      loadError.value = true
      console.warn('[PdfViewer] 加载 PDF 失败:', e)
      return
    }

    if (gen !== loadGeneration) return
    if (!pdfBlob) return
    const buffer = await pdfBlob.arrayBuffer()
    if (gen !== loadGeneration) return
    const loadingTask = pdfjs.getDocument({ data: buffer })
    pdfDoc = markRaw(await loadingTask.promise)
    if (gen !== loadGeneration) return
    total.value = pdfDoc.numPages
    loadError.value = false
    await renderThumb()

    if (visible.value) {
      nextTick(() => renderPage())
    }
  })().finally(() => {
    loadPdfPromise = null
  })

  return loadPdfPromise
}

async function renderThumb() {
  if (!pdfDoc || !thumbCanvas.value) return

  const page1 = await pdfDoc.getPage(1)
  const containerWidth = parseFloat(props.width?.replace('px', '') || '120')
  const containerHeight = parseFloat(props.height?.replace('px', '') || '80')
  const pageViewport = page1.getViewport({ scale: 1.0 })

  const scaleX = containerWidth / pageViewport.width
  const scaleY = containerHeight / pageViewport.height
  const scaleVal = Math.min(scaleX, scaleY) * 0.95

  const viewport = page1.getViewport({ scale: scaleVal })

  const canvas = thumbCanvas.value
  const ctx = canvas.getContext('2d')!
  const dpr = window.devicePixelRatio || 1
  canvas.width = viewport.width * dpr
  canvas.height = viewport.height * dpr
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  canvas.style.width = `${viewport.width}px`
  canvas.style.height = `${viewport.height}px`

  await page1.render({ canvasContext: ctx, viewport }).promise
}

async function renderPage() {
  if (!pdfDoc || !viewerCanvas.value || !visible.value) return

  const pdfPage = await pdfDoc.getPage(page.value)
  const viewport = pdfPage.getViewport({ scale: scale.value })

  const canvas = viewerCanvas.value
  canvas.width = viewport.width
  canvas.height = viewport.height

  const ctx = canvas.getContext('2d')!
  // 清除画布，确保尺寸与上次相同时也能重绘
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  await pdfPage.render({ canvasContext: ctx, viewport }).promise
}

function open() {
  visible.value = true
  page.value = 1
  scale.value = 1.0
  // 始终调用：pdf 已缓存时 loadPdf 内会 nextTick(renderPage)，否则开始拉取
  loadPdf()
}

function close() {
  visible.value = false
}

function handleScroll() {}

function handleKeydown(e: KeyboardEvent) {
  if (!visible.value) return
  switch (e.key) {
    case 'Escape': close(); break
    case 'ArrowLeft': e.preventDefault(); prevPage(); break
    case 'ArrowRight': e.preventDefault(); nextPage(); break
    case '+':
    case '=': e.preventDefault(); zoomIn(); break
    case '-': e.preventDefault(); zoomOut(); break
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  loadPdf()
})
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

function prevPage() {
  if (page.value <= 1) return
  page.value--
  renderPage()
}

function nextPage() {
  if (page.value >= total.value) return
  page.value++
  renderPage()
}

function zoomIn() {
  scale.value += 0.1
  renderPage()
}

function zoomOut() {
  scale.value = Math.max(0.5, scale.value - 0.1)
  renderPage()
}

function download() {
  if (!pdfBlob) return
  const url = URL.createObjectURL(pdfBlob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'document.pdf'
  a.click()
  URL.revokeObjectURL(url)
}

watch(
  () => props.url,
  () => {
    loadGeneration++
    pdfDoc = null
    pdfBlob = null
    total.value = 0
    page.value = 1
    loadError.value = false
    if (props.url) loadPdf()
  }
)
</script>

<style lang="scss" scoped>
@use './transitions.scss' as *;
.hx-pdf-viewer {
  &__thumb {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    overflow: hidden;
    border-radius: 6px;
    background: #f5f5f5;
    border: 1px solid #e0e0e0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;

    canvas {
      display: block;
      max-width: 100%;
      max-height: 100%;
      width: auto;
      height: auto;
      object-fit: contain;
      flex-shrink: 0;
    }

    &:hover .hx-pdf-viewer__mask {
      opacity: 1;
    }
  }

  &__mask {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: 0.2s;
  }

  &__error-icon,
  &__loading-icon,
  &__placeholder-icon {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #bdbdbd;
  }

  &__error-icon {
    color: #e57373;
  }

  &__loading-icon {
    color: #90a4ae;
  }

  &__placeholder-icon {
    color: #bdbdbd;
  }

  &__modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(8px);
    display: flex;
    flex-direction: column;
    z-index: 9999;
    overflow: hidden;
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
    gap: 12px;
    padding: 0 20px;
    z-index: 10000;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

    &-group {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    &-actions {
      margin-left: auto;
      display: flex;
      align-items: center;
    }
  }

  &__toolbar-btn {
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
    white-space: nowrap;

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.3);
      transform: translateY(-1px);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    svg {
      flex-shrink: 0;
    }
  }

  &__info {
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    min-width: 60px;
    text-align: center;
    padding: 0 8px;
  }

  &__divider {
    width: 1px;
    height: 24px;
    background: rgba(255, 255, 255, 0.2);
    margin: 0 4px;
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

  &__viewer {
    flex: 1;
    overflow: auto;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 80px 20px 40px;
    margin-top: 56px;

    canvas {
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      border-radius: 4px;
      background: #fff;
      max-width: 100%;
      height: auto;
    }

    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 4px;

      &:hover {
        background: rgba(255, 255, 255, 0.3);
      }
    }
  }
}
</style>