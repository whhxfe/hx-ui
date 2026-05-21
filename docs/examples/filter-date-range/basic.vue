<template>
  <div class="demo-section">
    <p class="demo-title">默认快捷日期（7/30/90天）</p>
    <HxFilterDateRange
      v-model="range1"
      label="日期"
      @change="onChange1"
    />
    <p class="demo-value">当前值：{{ displayValue(range1) }}</p>

    <p class="demo-title" style="margin-top: 28px">自定义快捷日期</p>
    <HxFilterDateRange
      v-model="range2"
      label="周期"
      :shortcuts="customShortcuts"
      @change="onChange2"
    />
    <p class="demo-value">当前值：{{ displayValue(range2) }}</p>

    <p class="demo-title" style="margin-top: 28px">自定义格式</p>
    <HxFilterDateRange
      v-model="range3"
      label="日期"
      format="YYYY/MM/DD"
      @change="onChange3"
    />
    <p class="demo-value">当前值：{{ displayValue(range3) }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { HxFilterDateRange } from '@hx/ui'
import type { FilterDateRangeShortcut } from '@hx/ui'

const range1 = ref('')
const range2 = ref('')
const range3 = ref('')

const customShortcuts: FilterDateRangeShortcut[] = [
  { label: '最近3天', days: 3 },
  { label: '最近7天', days: 7 },
  { label: '最近15天', days: 15 },
  { label: '最近60天', days: 60 },
]

function displayValue(val: unknown): string {
  if (!val || val === '') return '（未选择）'
  if (Array.isArray(val) && val.length === 2) {
    return `${val[0]} ～ ${val[1]}`
  }
  return String(val)
}

function onChange1(val: unknown) { console.log('日期变化1:', val) }
function onChange2(val: unknown) { console.log('日期变化2:', val) }
function onChange3(val: unknown) { console.log('日期变化3:', val) }
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
.demo-value {
  margin: 8px 0 0;
  font-size: 13px;
  color: var(--el-text-color-regular);
}
</style>