<template>
  <div class="demo-section">
    <p class="demo-title">禁用状态</p>
    <div class="link-demo-row">
      <HxLink disabled>禁用链接</HxLink>
      <HxLink disabled type="primary">禁用主要链接</HxLink>
      <HxLink disabled type="danger">禁用危险链接</HxLink>
    </div>

    <p class="demo-title link-demo-title-next">点击事件（无跳转）</p>
    <div class="link-demo-row">
      <HxLink :auto-jump="false" @click="handleClick('link1')">带点击事件的链接</HxLink>
      <HxLink :auto-jump="false" @click="handleClick('link2')">另一个可点击链接</HxLink>
    </div>
    <div v-if="lastClicked" class="click-result">
      上次点击：{{ lastClicked }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { HxLink } from '@whhx/ui'

const lastClicked = ref('')

const handleClick = (text: string) => {
  lastClicked.value = text
}
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
.link-demo-title-next {
  margin-top: 28px;
}
.link-demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}
.click-result {
  margin-top: 12px;
  font-size: 13px;
  color: #409eff;
}
</style>