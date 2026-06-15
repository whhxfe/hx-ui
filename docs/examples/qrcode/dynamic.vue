<template>
  <div class="qrcode-dynamic-demo">
    <el-input
      v-model="qrValue"
      placeholder="请输入二维码内容"
      class="qrcode-input"
      clearable
    />
    <div class="qrcode-row">
      <div class="qrcode-item">
        <h4>SVG 模式</h4>
        <hx-qr-code
          :value="debouncedValue"
          renderMode="svg"
          :size="180"
          :show-download="true"
          download-file-name="qrcode-svg"
        />
      </div>
      <div class="qrcode-item">
        <h4>Canvas 模式</h4>
        <hx-qr-code
          :value="debouncedValue"
          renderMode="canvas"
          :size="180"
          :show-download="true"
          download-file-name="qrcode-canvas"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { HxQrCode } from "@whhx/ui"

const qrValue = ref('https://hxui.example.com')
const debouncedValue = ref(qrValue.value)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  return ((...args: any[]) => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => fn(...args), delay)
  }) as T
}

const updateDebouncedValue = debounce((value: string) => {
  debouncedValue.value = value
}, 300)

watch(qrValue, (newValue) => {
  updateDebouncedValue(newValue)
})
</script>

<style scoped>
.qrcode-dynamic-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.qrcode-input {
  max-width: 400px;
}

.qrcode-row {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
}

.qrcode-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.qrcode-item h4 {
  margin: 0;
  font-weight: 500;
  color: var(--el-text-color-primary);
}
</style>
