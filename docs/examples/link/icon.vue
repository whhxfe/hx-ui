<template>
  <div class="demo-section">
    <p class="demo-title">带图标的链接</p>
    <div class="link-demo-row">
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