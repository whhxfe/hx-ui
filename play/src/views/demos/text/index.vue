<script setup lang="ts">
import { PageLayout, DemoBlock } from '@/components'
</script>

<template>
  <PageLayout>
    <h1 class="page-title">Text 文本</h1>
    <p class="page-desc">基于 Element Plus el-text 的二次封装，支持类型、尺寸、截断、自定义标签和点击事件。</p>

    <DemoBlock path="demos/text/demo/basic.vue" />
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