<template>
  <div class="demo-section">
    <p class="demo-title">本地图片图标</p>
    <p class="demo-desc">通过 import.meta.glob 加载本地图片资源，存放在 @/assets/icons/{group}/ 目录下</p>
    <div class="demo-row">
      <image-icon name="qq" group="app" :size="32" />
      <image-icon name="wechat" group="app" :size="32" />
    </div>

    <p class="demo-title">不同尺寸</p>
    <div class="demo-row">
      <image-icon name="qq" group="app" :size="20" />
      <image-icon name="qq" group="app" :size="32" />
      <image-icon name="qq" group="app" :size="48" />
      <image-icon name="qq" group="app" :size="64" />
    </div>

    <p class="demo-title">不同格式</p>
    <p class="demo-desc">支持 png、webp、gif 等多种图片格式</p>
    <div class="demo-row">
      <image-icon name="qq" group="app" :size="32" />
      <image-icon name="wechat" group="app" :size="32" />
      <image-icon name="qq" group="app" :size="32" ext="png" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ImageIcon } from '@whhx/ui'
</script>

<style scoped>
.demo-section {
  padding: 4px 0;
}
.demo-title {
  margin: 0 0 8px;
  font-size: 13px;
  color: var(--el-text-color-primary);
  font-weight: 500;
}
.demo-desc {
  margin: 0 0 12px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  margin-bottom: 20px;
}
</style>
