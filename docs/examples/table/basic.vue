<template>
  <hx-table :data="data" :columns="columns" border stripe>
    <template #status="{ row }">
      <span :style="{ color: row.status === 'active' ? '#67c23a' : '#f56c6c' }">
        {{ row.status }}
      </span>
    </template>
  </hx-table>
</template>

<script setup lang="ts">
import { HxTable as Table } from "@whhx/ui"

const data = [
  { id: 1, name: 'Alice', dept: 'R&D', status: 'active' },
  { id: 2, name: 'Bob', dept: 'Design', status: 'inactive' },
]

const columns = [
  { type: 'index', width: 60, label: '#' },
  { prop: 'name', label: '姓名', minWidth: 120 },
  { prop: 'dept', label: '部门', minWidth: 140 },
  { prop: 'status', label: '状态', slot: 'status', minWidth: 120 },
]
</script>