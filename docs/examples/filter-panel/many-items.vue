<template>
  <div class="filter-panel-demo">
    <HxFilterPanel
      v-model="filterState"
      title="筛选条件"
      :filters="filters"
      height="280px"
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

// 生成大量选项用于测试折叠动画和高度限制
const generateOptions = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    label: `选项${i + 1}`,
    value: `option-${i + 1}`,
  }))
}

const filters: FilterConfig[] = [
  {
    type: 'filter-item',
    prop: 'category',
    label: '商品分类',
    multiple: true,
    options: [
      { label: '全部', value: 'all' },
      { label: '电子产品', value: 'electronics' },
      { label: '家居用品', value: 'home' },
      { label: '图书音像', value: 'books' },
      { label: '服装鞋帽', value: 'clothing' },
      { label: '食品饮料', value: 'food' },
      { label: '运动户外', value: 'sports' },
      { label: '美妆护肤', value: 'beauty' },
      { label: '母婴用品', value: 'baby' },
      { label: '汽车用品', value: 'auto' },
    ],
  },
  {
    type: 'filter-item',
    prop: 'brand',
    label: '品牌',
    multiple: true,
    options: generateOptions(20),
  },
  {
    type: 'filter-item',
    prop: 'color',
    label: '颜色',
    multiple: false,
    options: [
      { label: '全部', value: 'all' },
      { label: '红色', value: 'red' },
      { label: '蓝色', value: 'blue' },
      { label: '绿色', value: 'green' },
      { label: '黑色', value: 'black' },
      { label: '白色', value: 'white' },
      { label: '灰色', value: 'gray' },
      { label: '黄色', value: 'yellow' },
      { label: '紫色', value: 'purple' },
      { label: '粉色', value: 'pink' },
      { label: '橙色', value: 'orange' },
    ],
  },
  {
    type: 'filter-item',
    prop: 'size',
    label: '尺码',
    multiple: true,
    options: [
      { label: 'XS', value: 'xs' },
      { label: 'S', value: 's' },
      { label: 'M', value: 'm' },
      { label: 'L', value: 'l' },
      { label: 'XL', value: 'xl' },
      { label: 'XXL', value: 'xxl' },
    ],
  },
  {
    type: 'filter-item',
    prop: 'priceRange',
    label: '价格区间',
    multiple: false,
    options: [
      { label: '不限', value: 'all' },
      { label: '0-100元', value: '0-100' },
      { label: '100-500元', value: '100-500' },
      { label: '500-1000元', value: '500-1000' },
      { label: '1000-2000元', value: '1000-2000' },
      { label: '2000元以上', value: '2000+' },
    ],
  },
  {
    type: 'filter-item',
    prop: 'feature',
    label: '特性',
    multiple: true,
    options: generateOptions(15),
  },
  {
    type: 'filter-item',
    prop: 'rating',
    label: '评分',
    multiple: false,
    options: [
      { label: '全部', value: 'all' },
      { label: '5星', value: '5' },
      { label: '4星及以上', value: '4' },
      { label: '3星及以上', value: '3' },
    ],
  },
  {
    type: 'date-range',
    prop: 'dateRange',
    label: '上市时间',
  },
]

const filterState = ref<FilterState>({
  category: ['electronics', 'home'],
  brand: [],
  color: 'all',
  size: [],
  priceRange: 'all',
  feature: [],
  rating: 'all',
  dateRange: [],
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
	background: var(--el-fill-color-lightest);
	border-radius: 8px;
}

.filter-panel-demo__output-title {
	margin: 0 0 8px;
	font-size: 13px;
	color: var(--el-text-color-regular);
}

.filter-panel-demo__pre {
	margin: 0;
	font-size: 12px;
	line-height: 1.5;
	color: var(--el-text-color-primary);
	white-space: pre-wrap;
	word-break: break-all;
}
</style>
