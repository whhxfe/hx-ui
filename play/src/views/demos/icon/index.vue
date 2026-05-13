<script setup lang="ts">
import { PageLayout, DemoBlock } from '@/components'
</script>

<template>
  <PageLayout>
    <h1 class="page-title">Icon 图标</h1>
    <p class="page-desc">功能强大、灵活的图标组件，支持 SVG、Image、Iconify 等多种图标类型。</p>

    <DemoBlock path="demos/icon/demo/svg-local.vue" />
    <DemoBlock path="demos/icon/demo/image-local.vue" />
    <DemoBlock path="demos/icon/demo/image-cdn.vue" />
    <DemoBlock path="demos/icon/demo/iconify-local.vue" />
    <DemoBlock path="demos/icon/demo/iconify-cdn.vue" />
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
