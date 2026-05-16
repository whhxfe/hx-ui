<template>
  <div>
    <div class="control-switches">
      <label v-for="(config, key) in controlOptions" :key="key">
        <input type="checkbox" v-model="controlOptions[key].enabled" />
        {{ config.label }}
      </label>
    </div>

    <hx-map
      :center="{ lon: 116.4, lat: 39.9 }"
      :zoom="10"
      height="500px"
      :controls="currentControls"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { HxMap } from "@hx/ui"

const controlOptions = reactive({
  zoom: { label: '缩放按钮', enabled: true },
  attribution: { label: '版权信息', enabled: true },
  scaleLine: { label: '比例尺', enabled: true },
  mousePosition: { label: '鼠标坐标', enabled: false },
  zoomSlider: { label: '滑块缩放', enabled: false },
  zoomToExtent: { label: '缩放到范围', enabled: false },
  rotate: { label: '重置旋转', enabled: false },
  overviewMap: { label: '鹰眼图', enabled: false },
  fullScreen: { label: '全屏', enabled: false },
})

const currentControls = computed(() => {
  const controls: Record<string, any> = {}
  for (const [key, opt] of Object.entries(controlOptions)) {
    if (opt.enabled) {
      controls[key] = true
    }
  }
  return controls
})
</script>

<style scoped>
.control-switches {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
}
.control-switches label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  cursor: pointer;
}
.control-switches input[type="checkbox"] {
  cursor: pointer;
}
</style>
