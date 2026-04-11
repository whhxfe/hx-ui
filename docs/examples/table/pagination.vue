<template>
  <hx-table
    :data="data"
    :columns="columns"
    show-pagination
    front-pagination
    :current-page="1"
    :page-size="5"
    border
  />
</template>

<script setup lang="ts">
import { HxTable as Table } from "@hx/ui"

const data = [
  { name: 'User-1', dept: 'A' },
  { name: 'User-2', dept: 'A' },
  { name: 'User-3', dept: 'B' },
  { name: 'User-4', dept: 'B' },
  { name: 'User-5', dept: 'C' },
  { name: 'User-6', dept: 'C' },
]

const columns = [
  { type: 'index', width: 60, label: '#' },
  { prop: 'name', label: '姓名' },
  { prop: 'dept', label: '部门' },
]
</script>
