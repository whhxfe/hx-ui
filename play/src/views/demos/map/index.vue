<script setup lang="ts">
import { PageLayout, DemoBlock } from '@/components'
</script>

<template>
  <PageLayout>
    <h1 class="page-title">Map 地图</h1>
    <p class="page-desc">基于 OpenLayers 的地图组件，支持多种底图、点标注、聚合、分组等功能。</p>

    <DemoBlock path="demos/map/demo/basic.vue" />
    <DemoBlock path="demos/map/demo/controls.vue" />
    <DemoBlock path="demos/map/demo/markers-basic.vue" />
    <DemoBlock path="demos/map/demo/markers-cluster.vue" />
    <DemoBlock path="demos/map/demo/markers-group.vue" />
    <DemoBlock path="demos/map/demo/markers-custom.vue" />
    <DemoBlock path="demos/map/demo/markers-icon-url.vue" />
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
