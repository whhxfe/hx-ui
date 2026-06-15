<template>
  <div class="demo-section">
    <p class="demo-title">弹出位置 - 下方（默认）</p>
    <HxFilterDateRange
      v-model="range1"
      label="日期"
      dropdown-placement="bottom"
    />
    <p class="demo-value">当前值：{{ displayValue(range1) }}</p>

    <p class="demo-title" style="margin-top: 28px">弹出位置 - 右侧</p>
 
      <HxFilterDateRange
        v-model="range2"
        label="周期"
        dropdown-placement="right"
      />

    <p class="demo-value">当前值：{{ displayValue(range2) }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { HxFilterDateRange } from '@whhx/ui'

const range1 = ref('')
const range2 = ref('')

function displayValue(val: unknown): string {
  if (!val || val === '') return '（未选择）'
  if (Array.isArray(val) && val.length === 2) {
    return `${val[0]} ～ ${val[1]}`
  }
  return String(val)
}
</script>

<style scoped>
.demo-section {
  padding: 4px 0;
  min-height: 200px;
}
.demo-title {
  margin: 0 0 10px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
  font-weight: 500;
}
.demo-value {
  margin: 8px 0 0;
  font-size: 13px;
  color: var(--el-text-color-regular);
}
</style>
