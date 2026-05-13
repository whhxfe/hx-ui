<template>
  <div class="demo-row">
    <HxLink href="https://github.com" target="_blank">默认</HxLink>
    <HxLink type="primary">主要</HxLink>
    <HxLink type="success">成功</HxLink>
    <HxLink type="warning">警告</HxLink>
    <HxLink type="danger">危险</HxLink>
    <HxLink type="info">信息</HxLink>
  </div>
</template>

<script setup lang="ts">
import { HxLink } from '@hx/ui'
</script>

<style scoped>
.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}
</style>