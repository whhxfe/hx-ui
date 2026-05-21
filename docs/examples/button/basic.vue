<template>
  <div class="demo-section">
    <p class="demo-title">类型</p>
    <div class="demo-row">
      <hx-button>Default</hx-button>
      <hx-button type="primary">Primary</hx-button>
      <hx-button type="success">Success</hx-button>
      <hx-button type="warning">Warning</hx-button>
      <hx-button type="danger">Danger</hx-button>
      <hx-button type="info">Info</hx-button>
    </div>

    <p class="demo-title">样式变体</p>
    <div class="demo-row">
      <hx-button plain>Plain</hx-button>
      <hx-button round>Round</hx-button>
      <hx-button dashed>Dashed</hx-button>
      <hx-button circle>+</hx-button>
    </div>

    <p class="demo-title">状态</p>
    <div class="demo-row">
      <hx-button disabled>Disabled</hx-button>
      <hx-button :loading="loading" @click="loading = true">Loading</hx-button>
    </div>

    <p class="demo-title">尺寸</p>
    <div class="demo-row">
      <hx-button size="large">Large</hx-button>
      <hx-button>Default</hx-button>
      <hx-button size="small">Small</hx-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { HxButton } from '@hx/ui'

const loading = ref(false)
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
.demo-title + .demo-title {
  margin-top: 24px;
}
.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
</style>
