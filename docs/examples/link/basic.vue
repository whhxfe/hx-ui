<template>
  <div class="demo-section">
    <p class="demo-title">基础类型</p>
    <div class="link-demo-row">
      <HxLink href="https://github.com" target="_blank">默认</HxLink>
      <HxLink type="primary">主要</HxLink>
      <HxLink type="success">成功</HxLink>
      <HxLink type="warning">警告</HxLink>
      <HxLink type="danger">危险</HxLink>
      <HxLink type="info">信息</HxLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HxLink } from '@whhx/ui'
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
</style>