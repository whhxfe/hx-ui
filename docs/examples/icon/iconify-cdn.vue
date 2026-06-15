<template>
  <div class="demo-section">
    <p class="demo-title">Iconify CDN 模式</p>
    <p class="demo-desc">通过 CDN API 获取图标数据，格式为 {prefix}:{name}，如 ep:edit、mdi:home</p>
    <div class="demo-row">
      <iconify-icon icon="ep:edit" />
      <iconify-icon icon="ep:delete" />
      <iconify-icon icon="ep:search" />
      <iconify-icon icon="mdi:home" />
      <iconify-icon icon="mdi:account" />
      <iconify-icon icon="mdi:heart" />
    </div>

    <p class="demo-title">Lucide 图标集</p>
    <div class="demo-row">
      <iconify-icon icon="lucide:home" />
      <iconify-icon icon="lucide:user" />
      <iconify-icon icon="lucide:settings" />
      <iconify-icon icon="lucide:mail" />
      <iconify-icon icon="lucide:phone" />
      <iconify-icon icon="lucide:github" />
    </div>

    <p class="demo-title">Carbon 图标集</p>
    <div class="demo-row">
      <iconify-icon icon="carbon:home" />
      <iconify-icon icon="carbon:user" />
      <iconify-icon icon="carbon:settings" />
      <iconify-icon icon="carbon:calendar" />
      <iconify-icon icon="carbon:document" />
      <iconify-icon icon="carbon:search" />
    </div>

    <p class="demo-title">Logos 图标集</p>
    <div class="demo-row">
      <iconify-icon icon="logos:vue" />
      <iconify-icon icon="logos:react" />
      <iconify-icon icon="logos:typescript-icon" />
      <iconify-icon icon="logos:javascript" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconifyIcon } from '@whhx/ui'
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
