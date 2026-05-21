<template>
  <div class="demo-section">
    <p class="demo-title">自动跳转</p>
    <div class="link-demo-row">
      <HxLink href="https://github.com" :auto-jump="true">跳转到 GitHub</HxLink>
      <HxLink href="https://github.com" :auto-jump="false">点击后不跳转</HxLink>
    </div>
    <p class="demo-desc">
      <code>:auto-jump="false"</code> 时，链接有 href 但不会导航，仅触发 click 事件。
    </p>
  </div>
</template>

<script setup lang="ts">
import { HxLink } from '@hx/ui'
</script>

<style scoped>
.demo-section {
  padding: 4px 0;
}
.demo-title {
  margin: 0 0 10px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
  font-weight: 500;
}
.link-demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}
.demo-desc {
  margin: 12px 0 0;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}
.demo-desc code {
  color: #409eff;
}
</style>