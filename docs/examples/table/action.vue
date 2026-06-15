<template>
  <hx-table :data="data" :columns="columns" border>
    <template #action="{ row }">
      <el-button link type="primary">编辑 {{ row.name }}</el-button>
    </template>
  </hx-table>
</template>

<script setup lang="ts">
import { HxTable as Table } from "@whhx/ui"

const data = [
  { id: 1, name: 'Alice', dept: 'R&D' },
  { id: 2, name: 'Bob', dept: 'Design' },
]

const columns = [
  { prop: 'name', label: '姓名', minWidth: 120 },
  { prop: 'dept', label: '部门', minWidth: 140 },
  { label: '操作', width: 120, fixed: 'right', slot: 'action' },
]
</script>
