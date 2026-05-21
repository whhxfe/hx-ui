<template>
  <div class="demo-section">
    <p class="demo-title">普通文本 + 复制（hover 查看）</p>
    <HxContentText :content="plainText" :copyable="true" />

    <p class="demo-title" style="margin-top: 28px">空内容占位</p>
    <HxContentText :content="emptyText" :copyable="true" placeholder="暂无数据" />
  </div>
</template>

<script setup lang="ts">
import { HxContentText } from '@hx/ui'

const plainText = '可通过 Ctrl+C 或点击复制按钮复制本段内容。'

const emptyText = ''
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
</style>