<template>
  <div class="demo-section">
    <p class="demo-title">Element Plus 图标集（ep）</p>
    <p class="demo-desc">使用离线 @iconify/json 包中的 ep 图标集</p>
    <div class="demo-row">
      <iconify-icon icon="ep:edit" />
      <iconify-icon icon="ep:delete" />
      <iconify-icon icon="ep:search" />
      <iconify-icon icon="ep:share" />
      <iconify-icon icon="ep:upload" />
      <iconify-icon icon="ep:download" />
    </div>

    <p class="demo-title">Tabler 图标集（tabler）</p>
    <div class="demo-row">
      <iconify-icon icon="tabler:home" />
      <iconify-icon icon="tabler:user" />
      <iconify-icon icon="tabler:settings" />
      <iconify-icon icon="tabler:mail" />
      <iconify-icon icon="tabler:phone" />
      <iconify-icon icon="tabler:brand-github" />
    </div>

    <p class="demo-title">MDI 图标集（mdi）</p>
    <div class="demo-row">
      <iconify-icon icon="mdi:account" />
      <iconify-icon icon="mdi:home" />
      <iconify-icon icon="mdi:heart" />
      <iconify-icon icon="mdi:star" />
      <iconify-icon icon="mdi:cog" />
      <iconify-icon icon="mdi:logout" />
    </div>

    <p class="demo-title">尺寸与颜色</p>
    <div class="demo-row">
      <iconify-icon icon="ep:edit" :size="16" color="#1890ff" />
      <iconify-icon icon="ep:delete" :size="20" color="#f5222d" />
      <iconify-icon icon="ep:search" :size="24" color="#52c41a" />
      <iconify-icon icon="ep:share" :size="32" color="#faad14" />
      <iconify-icon icon="ep:upload" size="40px" color="#722ed1" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconifyIcon } from '@hx/ui'
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
