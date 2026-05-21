<template>
  <hx-table :data="data" :columns="columns" border stripe />
</template>

<script setup lang="ts">
import { HxTable as Table } from '@hx/ui'

const data = [
  { id: 1, name: '张三', age: 25, dept: '研发部', status: 'active' },
  { id: 2, name: '李四', age: 30, dept: '设计部', status: 'inactive' },
  { id: 3, name: '王五', age: 28, dept: '市场部', status: 'active' },
]

const columns = [
  { type: 'index', width: 60, label: '#' },
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' },
  { prop: 'dept', label: '部门' },
  {
    prop: 'status',
    label: '状态',
    slot: 'status',
  },
]
</script>
