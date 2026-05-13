<template>
  <div class="demo-section">
    <p class="demo-title">下划线模式</p>
    <div class="link-demo-row">
      <HxLink href="#" underline="always">始终显示</HxLink>
      <HxLink href="#" underline="hover">悬停显示</HxLink>
      <HxLink href="#" underline="never">从不显示</HxLink>
    </div>
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
  color: #8a92a6;
  font-weight: 500;
}
.link-demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}
</style>