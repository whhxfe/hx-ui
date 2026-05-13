<script setup lang="ts">
import { PageLayout, DemoBlock } from '@/components'
</script>

<template>
  <PageLayout>
    <h1 class="page-title">Button 按钮</h1>
    <p class="page-desc">基于 Element Plus el-button 的二次封装。</p>

    <DemoBlock path="demos/button/demo/basic.vue" />
    <DemoBlock path="demos/button/demo/state.vue" />
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
