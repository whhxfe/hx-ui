<script setup lang="ts">
import { PageLayout, DemoBlock } from '@/components'
</script>

<template>
  <PageLayout>
    <h1 class="page-title">Link 链接</h1>
    <p class="page-desc">基于 Element Plus el-link 的二次封装，支持自动跳转和点击事件。</p>

    <DemoBlock path="demos/link/demo/basic.vue" />
    <DemoBlock path="demos/link/demo/underline.vue" />
    <DemoBlock path="demos/link/demo/disabled.vue" />
    <DemoBlock path="demos/link/demo/icon.vue" />
    <DemoBlock path="demos/link/demo/auto-jump.vue" />
  </PageLayout>
</template>

<style scoped>
.page-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--hx-text-color-primary, #1a1a1a);
  margin-bottom: 8px;
}

.page-desc {
  color: var(--hx-text-color-regular, #666);
  margin-bottom: 32px;
  line-height: 1.6;
  font-size: 14px;
}
</style>