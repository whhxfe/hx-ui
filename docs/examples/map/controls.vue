<template>
  <ClientOnly>
  <div>
    <div class="control-switches">
      <label v-for="(config, key) in controlOptions" :key="key">
        <input type="checkbox" v-model="controlOptions[key].enabled" />
        {{ config.label }}
      </label>
      <span v-if="controlOptions.overviewMap.enabled" class="overview-select">
        鹰眼底图：
        <select v-model="overviewUrl">
          <option value="satellite">卫星图</option>
          <option value="street">街道图</option>
        </select>
      </span>
    </div>

    <hx-map
      :center="{ lon: 116.4, lat: 39.9 }"
      :zoom="10"
      height="500px"
      :controls="currentControls"
    />
  </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import { HxMap } from "@whhx/ui"

const OVERVIEW_URLS = {
  satellite: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  street: 'https://server.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
}

const controlOptions = reactive({
  zoom: { label: '缩放按钮', enabled: true },
  attribution: { label: '版权信息', enabled: true },
  scaleLine: { label: '比例尺', enabled: true },
  mousePosition: { label: '鼠标坐标', enabled: false },
  zoomSlider: { label: '滑块缩放', enabled: false },
  zoomToExtent: { label: '缩放到范围', enabled: false },
  rotate: { label: '重置旋转', enabled: false },
  overviewMap: { label: '鹰眼图', enabled: true },
  fullScreen: { label: '全屏', enabled: false },
})

const overviewUrl = ref('street')

const currentControls = computed(() => {
  const controls: Record<string, any> = {}
  for (const [key, opt] of Object.entries(controlOptions)) {
    if (opt.enabled) {
      if (key === 'overviewMap') {
        controls[key] = {
          overviewUrl: OVERVIEW_URLS[overviewUrl.value as keyof typeof OVERVIEW_URLS],
        }
      } else {
        controls[key] = true
      }
    } else {
      controls[key] = false
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
  background: var(--el-fill-color-lightest);
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
.overview-select {
  margin-left: 12px;
  font-size: 14px;
}
.overview-select select {
  margin-left: 4px;
  padding: 2px 6px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}
</style>
