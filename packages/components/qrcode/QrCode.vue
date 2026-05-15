<template>
  <div class="hx-qrcode" :style="rootStyle">
    <!-- 二维码绘制区域 -->
    <div ref="viewportRef" class="hx-qrcode__viewport" :style="viewportStyle">
      <!-- Canvas 渲染模式 -->
      <canvas
        v-if="effectiveRenderMode === 'canvas'"
        ref="canvasRef"
        class="hx-qrcode__canvas"
        :width="sizeValue"
        :height="sizeValue"
      />
    </div>

    <!-- 下载按钮 -->
    <div v-if="showDownload" class="hx-qrcode__actions">
      <el-button :size="buttonSize" type="primary" @click="handleDownload">
        <component :is="downloadIcon || DownloadIcon" />
        {{ downloadText }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, nextTick } from 'vue'
import QRCode from 'qrcode'
import { Download as DownloadIcon } from '@element-plus/icons-vue'
import type { Component } from 'vue'

import { useConfig } from '../../hooks/useConfig'
import type { QrCodeProps, QrCodeLogo } from './types'

defineOptions({ name: 'HxQrCode' })

const config = useConfig()

const props = withDefaults(defineProps<QrCodeProps>(), {
  renderMode: undefined,
  size: undefined,
  colorDark: undefined,
  colorLight: undefined,
  errorCorrectionLevel: undefined,
  margin: undefined,
  showDownload: true,
  downloadText: '下载二维码',
  downloadFileName: 'qrcode',
  logo: undefined,
  downloadIcon: undefined,
})

// ==================== 计算属性 ====================

// 合并配置：Props > ConfigProvider > 默认值
const effectiveRenderMode = computed(() => props.renderMode ?? config.qrCode?.renderMode ?? 'svg')
const effectiveSize = computed(() => props.size ?? config.qrCode?.size ?? 120)
const effectiveColorDark = computed(() => props.colorDark ?? config.qrCode?.colorDark ?? '#000000')
const effectiveColorLight = computed(() => props.colorLight ?? config.qrCode?.colorLight ?? '#ffffff')
const effectiveErrorCorrectionLevel = computed(() => props.errorCorrectionLevel ?? config.qrCode?.errorCorrectionLevel ?? 'M')
const effectiveMargin = computed(() => props.margin ?? config.qrCode?.margin ?? 2)

// 解析尺寸数值（px）
const sizeValue = computed(() => {
  const s = effectiveSize.value
  if (typeof s === 'number') return s
  return parseFloat(s) || 120
})

// 根节点样式
const rootStyle = computed(() => props.style ?? {})

// 二维码绘制区域尺寸
const viewportStyle = computed(() => ({
  width: `${sizeValue.value}px`,
  height: `${sizeValue.value}px`,
}))

// 按钮尺寸
const buttonSize = computed(() => (sizeValue.value >= 200 ? 'default' : 'small'))

// ==================== refs ====================

const canvasRef = ref<HTMLCanvasElement | null>(null)
const viewportRef = ref<HTMLDivElement | null>(null)
const svgRaw = ref('')
const tempCanvasForDownload = ref<HTMLCanvasElement | null>(null)

// ==================== QRCode 选项 ====================

function getQrOptions(): QRCode.QRCodeToStringOptions {
  return {
    type: 'svg',
    width: sizeValue.value,
    margin: effectiveMargin.value,
    color: {
      dark: effectiveColorDark.value,
      light: effectiveColorLight.value,
    },
    errorCorrectionLevel: effectiveErrorCorrectionLevel.value,
  }
}

function getCanvasOptions(): QRCode.QRCodeToDataURLOptions {
  return {
    width: sizeValue.value,
    margin: effectiveMargin.value,
    color: {
      dark: effectiveColorDark.value,
      light: effectiveColorLight.value,
    },
    errorCorrectionLevel: effectiveErrorCorrectionLevel.value,
  }
}

// ==================== 渲染函数 ====================

// SVG 模式下渲染
function renderSvgMode(svgString: string) {
  if (!viewportRef.value) return

  viewportRef.value.innerHTML = ''

  const parser = new DOMParser()
  const doc = parser.parseFromString(svgString, 'image/svg+xml')
  const svgElement = doc.querySelector('svg')

  if (svgElement) {
    svgElement.style.width = '100%'
    svgElement.style.height = '100%'
    svgElement.style.display = 'block'
    viewportRef.value.appendChild(svgElement)

    // 如果有 Logo，渲染到 SVG 中心
    if (props.logo) {
      renderLogoToSvg(svgElement, props.logo)
    }
  }
}

// 渲染 Logo 到 SVG
function renderLogoToSvg(svgElement: SVGSVGElement, logo: QrCodeLogo) {
  const size = sizeValue.value
  const margin = effectiveMargin.value
  // 二维码图案区域尺寸（不含 margin）
  const qrAreaSize = size - 2 * margin

  const logoWidth = logo.width ?? 40
  const logoHeight = logo.height ?? 40
  const offsetX = logo.offsetX ?? 0
  const offsetY = logo.offsetY ?? 0

  // Logo 居中在二维码图案区域
  const logoX = margin + (qrAreaSize - logoWidth) / 2 + offsetX
  const logoY = margin + (qrAreaSize - logoHeight) / 2 + offsetY

  // 创建白色背景矩形
  const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  bgRect.setAttribute('x', String(logoX - 4))
  bgRect.setAttribute('y', String(logoY - 4))
  bgRect.setAttribute('width', String(logoWidth + 8))
  bgRect.setAttribute('height', String(logoHeight + 8))
  bgRect.setAttribute('fill', effectiveColorLight.value)
  bgRect.setAttribute('rx', '4')
  svgElement.appendChild(bgRect)

  // 创建图片元素
  const img = document.createElementNS('http://www.w3.org/2000/svg', 'image')
  img.setAttribute('x', String(logoX))
  img.setAttribute('y', String(logoY))
  img.setAttribute('width', String(logoWidth))
  img.setAttribute('height', String(logoHeight))
  img.setAttribute('href', logo.url)
  img.setAttribute('preserveAspectRatio', 'xMidYMid meet')
  svgElement.appendChild(img)
}

// 生成 SVG
async function generateSvg() {
  if (effectiveRenderMode.value !== 'svg' && !props.showDownload) return

  try {
    const svg = await QRCode.toString(props.value, getQrOptions())
    if (effectiveRenderMode.value === 'svg') {
      renderSvgMode(svg)
    }
    svgRaw.value = svg
  } catch (e) {
    console.error('QRCode SVG 生成失败:', e)
  }
}

// 生成 Canvas
async function generateCanvas(target?: HTMLCanvasElement) {
  const canvas = target || canvasRef.value
  if (!canvas) return

  try {
    await QRCode.toCanvas(canvas, props.value, getCanvasOptions())

    // 如果有 Logo，渲染到 Canvas 中心
    if (props.logo) {
      renderLogoToCanvas(canvas, props.logo)
    }
  } catch (e) {
    console.error('QRCode Canvas 生成失败:', e)
  }
}

// 渲染 Logo 到 Canvas
function renderLogoToCanvas(canvas: HTMLCanvasElement, logo: QrCodeLogo) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const size = sizeValue.value
  const margin = effectiveMargin.value
  // 二维码图案区域尺寸（不含 margin）
  const qrAreaSize = size - 2 * margin

  const logoWidth = logo.width ?? 40
  const logoHeight = logo.height ?? 40
  const offsetX = logo.offsetX ?? 0
  const offsetY = logo.offsetY ?? 0

  const logoX = margin + (qrAreaSize - logoWidth) / 2 + offsetX
  const logoY = margin + (qrAreaSize - logoHeight) / 2 + offsetY

  const img = new Image()
  img.onload = () => {
    // 绘制白色背景
    ctx.fillStyle = effectiveColorLight.value
    ctx.fillRect(logoX - 4, logoY - 4, logoWidth + 8, logoHeight + 8)

    // 绘制 Logo
    ctx.drawImage(img, logoX, logoY, logoWidth, logoHeight)
  }
  img.src = logo.url
}

// ==================== 主生成函数 ====================

async function generate() {
  if (effectiveRenderMode.value === 'svg' || props.showDownload) {
    await generateSvg()
  }

  if (effectiveRenderMode.value === 'canvas') {
    await generateCanvas()
  } else if (props.showDownload) {
    // SVG 模式下也生成 canvas 用于下载
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = sizeValue.value
    tempCanvas.height = sizeValue.value
    await generateCanvas(tempCanvas)
    tempCanvasForDownload.value = tempCanvas
  }
}

// ==================== 下载功能 ====================

async function handleDownload() {
  if (effectiveRenderMode.value === 'canvas' && canvasRef.value) {
    downloadFromCanvas(canvasRef.value)
  } else if (tempCanvasForDownload.value) {
    downloadFromCanvas(tempCanvasForDownload.value)
  } else {
    // 兜底：重新生成 canvas 再下载
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = sizeValue.value
    tempCanvas.height = sizeValue.value
    await generateCanvas(tempCanvas)
    downloadFromCanvas(tempCanvas)
  }
}

function downloadFromCanvas(canvas: HTMLCanvasElement) {
  const url = canvas.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = url
  a.download = `${props.downloadFileName}.png`
  a.click()
}

// ==================== 生命周期 ====================

// 监听 props 变化重新生成
watch(
  () => [
    props.value,
    effectiveRenderMode,
    effectiveSize,
    effectiveColorDark,
    effectiveColorLight,
    effectiveErrorCorrectionLevel,
    effectiveMargin,
    props.logo,
  ],
  () => {
    generate()
  },
)

// 组件挂载后生成
onMounted(async () => {
  await nextTick()
  await generate()
})

// ==================== 暴露给外部 ====================

defineExpose({
  /** 重新生成二维码 */
  regenerate: generate,
})
</script>

<style scoped>
.hx-qrcode {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.hx-qrcode__viewport {
  line-height: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hx-qrcode__canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.hx-qrcode__actions {
  display: flex;
  justify-content: center;
}
</style>
