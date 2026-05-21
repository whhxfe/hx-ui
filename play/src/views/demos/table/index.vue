<script setup lang="ts">
import { PageLayout, DemoBlock } from '@/components'
</script>

<template>
  <PageLayout>
    <h1 class="page-title">Table 表格</h1>
    <p class="page-desc">基于 Element Plus el-table 的列配置驱动表格，支持插槽列、render 列、多级表头和可选分页。</p>

    <DemoBlock title="基础用法" path="demos/table/demo/basic.vue" />
    <DemoBlock title="带高度和分页" path="demos/table/demo/height.vue" />
    <DemoBlock title="最大高度" path="demos/table/demo/max-height.vue" />
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
