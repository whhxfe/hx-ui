<template>
  <div class="hx-qrcode" :style="rootStyle">
    <!-- 二维码绘制区域 -->
    <div ref="viewportRef" class="hx-qrcode__viewport" :style="viewportStyle">
      <!-- Canvas 渲染模式 -->
      <canvas
        v-if="renderMode === 'canvas'"
        ref="canvasRef"
        class="hx-qrcode__canvas"
        :width="sizeValue"
        :height="sizeValue"
      />
    </div>

    <!-- 下载按钮 -->
    <div v-if="showDownload" class="hx-qrcode__actions">
      <el-button :size="buttonSize" type="primary" @click="handleDownload">
        <component :is="getIcon()" />
        {{ downloadText }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, nextTick } from 'vue'
import QRCode from 'qrcode'
import { Download } from '@element-plus/icons-vue'

import type { QrCodeProps } from './types'

defineOptions({ name: 'HxQrCode' })

const props = withDefaults(defineProps<QrCodeProps>(), {
  renderMode: 'svg',
  size: 120,
  colorDark: '#000000',
  colorLight: '#ffffff',
  errorCorrectionLevel: 'M',
  margin: 2,
  showDownload: true,
  downloadText: '下载二维码',
  downloadFileName: 'qrcode',
})

// refs
const canvasRef = ref<HTMLCanvasElement | null>(null)
const viewportRef = ref<HTMLDivElement | null>(null)

// 解析尺寸数值（px）
const sizeValue = computed(() => {
  const s = props.size
  if (typeof s === 'number') return s
  return parseFloat(s) || 120
})

// 获取 qrcode 生成选项
function getQrOptions(): QRCode.QRCodeToStringOptions {
  return {
    type: 'svg',
    width: sizeValue.value,
    margin: props.margin,
    color: {
      dark: props.colorDark,
      light: props.colorLight,
    },
    errorCorrectionLevel: props.errorCorrectionLevel,
  }
}

function getCanvasOptions(): QRCode.QRCodeToDataURLOptions {
  return {
    width: sizeValue.value,
    margin: props.margin,
    color: {
      dark: props.colorDark,
      light: props.colorLight,
    },
    errorCorrectionLevel: props.errorCorrectionLevel,
  }
}

// SVG 模式下渲染
function renderSvgMode(svgString: string) {
  if (!viewportRef.value) return

  // 清除之前的 SVG
  viewportRef.value.innerHTML = ''

  // 解析 SVG 字符串
  const parser = new DOMParser()
  const doc = parser.parseFromString(svgString, 'image/svg+xml')
  const svgElement = doc.querySelector('svg')

  if (svgElement) {
    svgElement.style.width = '100%'
    svgElement.style.height = '100%'
    svgElement.style.display = 'block'
    viewportRef.value.appendChild(svgElement)
  }
}

// 生成 SVG
async function generateSvg() {
  if (props.renderMode !== 'svg' && !props.showDownload) return

  try {
    const svg = await QRCode.toString(props.value, getQrOptions())
    if (props.renderMode === 'svg') {
      renderSvgMode(svg)
    }
    // 保存原始 SVG 用于下载
    svgRaw.value = svg
  } catch (e) {
    console.error('QRCode SVG 生成失败:', e)
  }
}

// 原始 SVG 字符串（用于下载）
const svgRaw = ref('')

// 生成 Canvas
async function generateCanvas(target?: HTMLCanvasElement) {
  const canvas = target || canvasRef.value
  if (!canvas) return

  try {
    await QRCode.toCanvas(canvas, props.value, getCanvasOptions())
  } catch (e) {
    console.error('QRCode Canvas 生成失败:', e)
  }
}

// 主生成函数
async function generate() {
  if (props.renderMode === 'svg' || props.showDownload) {
    await generateSvg()
  }

  if (props.renderMode === 'canvas') {
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

// 用于 SVG 模式下下载的临时 canvas
const tempCanvasForDownload = ref<HTMLCanvasElement | null>(null)

// 监听 props 变化重新生成
watch(
  () => [props.value, props.renderMode, props.size, props.colorDark, props.colorLight, props.errorCorrectionLevel, props.margin],
  () => {
    generate()
  },
)

// 组件挂载后生成
onMounted(async () => {
  await nextTick()
  await generate()
})

// 下载
async function handleDownload() {
  if (props.renderMode === 'canvas' && canvasRef.value) {
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

// 根节点样式
const rootStyle = computed(() => props.style ?? {})

// 二维码绘制区域尺寸
const viewportStyle = computed(() => ({
  width: `${sizeValue.value}px`,
  height: `${sizeValue.value}px`,
}))

// 按钮尺寸
const buttonSize = computed(() => (sizeValue.value >= 200 ? 'default' : 'small'))

// 获取图标
function getIcon() {
  return Download
}
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
