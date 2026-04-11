<template>
  <hx-table :data="data" :columns="columns" :action-column-props="{ width: 160 }" border>
    <template #action="{ row }">
      <el-button link type="primary">编辑 {{ row.name }}</el-button>
    </template>
  </hx-table>
</template>

<script setup lang="ts">
import { HxTable as Table } from "@hx/ui"

const data = [
  { id: 1, name: 'Alice', dept: 'R&D' },
  { id: 2, name: 'Bob', dept: 'Design' },
]

const columns = [
  { prop: 'name', label: '姓名', minWidth: 120 },
  { prop: 'dept', label: '部门', minWidth: 140 },
]
</script>
