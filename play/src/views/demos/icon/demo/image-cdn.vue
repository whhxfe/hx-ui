<template>
  <div class="demo-section">
    <p class="demo-title">CDN 模式</p>
    <p class="demo-desc">通过 cdnBaseUrl 配置 CDN 地址，组件按 {cdnBaseUrl}/{group}/{name}.{ext} 规则拼接 URL</p>
    <div class="demo-row">
      <image-icon
        name="alipay"
        group="app"
        source="cdn"
        cdn-base-url="/icons"
        :size="32"
      />
      <image-icon
        name="wechat"
        group="app"
        source="cdn"
        cdn-base-url="/icons"
        :size="32"
      />
      <image-icon
        name="qq"
        group="app"
        ext="webp"
        source="cdn"
        cdn-base-url="icons"
        :size="32"
      />
    </div>

    <p class="demo-title">source 属性说明</p>
    <div class="demo-row">
      <image-icon
        name="qq"
        group="app"
        source="auto"
        :size="24"
      />
      <image-icon
        name="qq"
        group="app"
        source="local"
        :size="24"
      />
      <image-icon
        name="qq"
        group="app"
        source="cdn"
        cdn-base-url="https://cdn.example.com/icons"
        :size="24"
      />
    </div>
    <div class="demo-labels">
      <span class="label">auto</span>
      <span class="label">local</span>
      <span class="label">cdn</span>
    </div>

    <p class="demo-title">加载失败兜底</p>
    <p class="demo-desc">图片加载失败时显示内置的错误兜底图标</p>
    <div class="demo-row">
      <image-icon
        name="not-exist"
        group="app"
        :size="32"
      />
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
  color: #1a1a1a;
  font-weight: 500;
}
.demo-desc {
  margin: 0 0 12px;
  font-size: 12px;
  color: #8a92a6;
}
.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  margin-bottom: 8px;
}
.demo-labels {
  display: flex;
  gap: 40px;
  margin-bottom: 20px;
}
.label {
  font-size: 12px;
  color: #8a92a6;
  min-width: 40px;
  text-align: center;
}
</style>
