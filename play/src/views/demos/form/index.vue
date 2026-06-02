<script setup lang="ts">
import { PageLayout, DemoBlock } from '@/components'
</script>

<template>
  <PageLayout>
    <h1 class="page-title">Form 表单</h1>
    <p class="page-desc">基于 el-form 的列配置驱动表单组件。</p>

    <DemoBlock path="demos/form/demo/columns.vue" title="多列表单（完整字段类型）" />
    <DemoBlock path="demos/form/demo/date-picker.vue" title="日期选择器（支持全局 shortcuts）" />
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