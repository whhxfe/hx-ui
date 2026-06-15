<template>
  <div>
    <p class="demo-label">自动跳转</p>
    <div class="demo-row">
      <HxLink href="https://github.com" :auto-jump="true">跳转到 GitHub</HxLink>
      <HxLink href="https://github.com" :auto-jump="false">点击后不跳转</HxLink>
    </div>
    <p class="demo-desc">
      <code>:auto-jump="false"</code> 时，链接有 href 但不会导航，仅触发 click 事件。
    </p>
  </div>
</template>

<script setup lang="ts">
import { HxLink } from '@whhx/ui'
</script>

<style scoped>
.demo-label {
  margin: 0 0 8px;
  font-size: 13px;
  color: #8a92a6;
}
.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}
.demo-desc {
  margin: 8px 0 0;
  font-size: 12px;
  color: #8a92a6;
}
.demo-desc code {
  color: #409eff;
}
</style>