<template>
  <div class="filter-panel-demo">
    <HxFilterPanel
      v-model="filterState"
      title="筛选条件"
      :filters="filters"
      @filter-change="onFilterChange"
      @reset="onReset"
    />
    <div class="filter-panel-demo__output">
      <p class="filter-panel-demo__output-title">当前 v-model</p>
      <pre class="filter-panel-demo__pre">{{ JSON.stringify(filterState, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { HxFilterPanel } from '@hx/ui'
import type { FilterConfig, FilterState } from '@hx/ui'

const filters: FilterConfig[] = [
  {
    type: 'filter-item',
    prop: 'category',
    label: '分类',
    multiple: true,
    options: [
      { label: '全部', value: 'all' },
      { label: '电子', value: 'electronics' },
      { label: '家居', value: 'home' },
      { label: '图书', value: 'book', disabled: true },
    ],
  },
  {
    type: 'filter-item',
    prop: 'status',
    label: '状态',
    multiple: false,
    options: [
      { label: '待处理', value: 'pending' },
      { label: '进行中', value: 'doing' },
      { label: '已完成', value: 'done' },
    ],
  },
  {
    type: 'filter-item',
    prop: 'region',
    label: '城市（远程）',
    multiple: true,
    remote: {
      url: 'http://localhost:4300/api/options/select',
      labelKey: 'label',
      valueKey: 'value',
    },
  },
  {
    type: 'date-range',
    prop: 'dateRange',
    label: '时间范围',
    options: [],
  },
]

const filterState = ref<FilterState>({
  category: [],
  status: '',
  dateRange: '',
})

const onFilterChange = (prop: string, value: unknown) => {
  console.log('[filter-change]', prop, value)
}

const onReset = () => {
  console.log('[reset]')
}
</script>

<style scoped>
.filter-panel-demo {
  width: 100%;
}

.filter-panel-demo__output {
  margin-top: 16px;
  padding: 12px 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.filter-panel-demo__output-title {
  margin: 0 0 8px;
  font-size: 13px;
  color: #606266;
}

.filter-panel-demo__pre {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  color: #303133;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
