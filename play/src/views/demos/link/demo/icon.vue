<template>
  <div>
    <p class="demo-label">图标组合</p>
    <div class="demo-row">
      <HxLink underline="hover">
        <IconifyIcon icon="ep:edit" />
        编辑
      </HxLink>
      <HxLink underline="never">
        <IconifyIcon icon="ep:view" />
        查看
      </HxLink>
      <HxLink underline="never">
        <IconifyIcon icon="ep:delete" />
        删除
      </HxLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HxLink, IconifyIcon } from '@hx/ui'
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
</style>