<template>
  <div style="height: 500px; display: flex; flex-direction: column;">
    <hx-table
      :data="data"
      :columns="columns"
      show-pagination
      front-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      border
      height="400px"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { HxTable as Table } from "@whhx/ui"

const currentPage = ref(1)
const pageSize = ref(5)

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
