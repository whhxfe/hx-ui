<template>
  <div class="height-demo">
    <p class="demo-info">容器高度 600px，表格 height="500px"（包含分页区域 56px）</p>
    <div class="table-container">
      <hx-table
        :data="data"
        :columns="columns"
        show-pagination
        front-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        border
        height="500px"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { HxTable as Table } from '@hx/ui'

const currentPage = ref(1)
const pageSize = ref(20)

// 生成 100 条测试数据
const data = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `用户-${String(i + 1).padStart(3, '0')}`,
  age: 18 + (i % 50),
  dept: ['研发部', '设计部', '市场部', '运营部', '人事部'][i % 5],
  position: ['工程师', '设计师', '经理', '主管', '专员'][i % 5],
  salary: 5000 + (i * 100),
  status: i % 3 === 0 ? 'active' : 'inactive',
  email: `user${i + 1}@example.com`,
  phone: `138${String(i).padStart(8, '0')}`,
}))

const columns = [
  { type: 'index', width: 60, label: '#' },
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '姓名', minWidth: 100 },
  { prop: 'age', label: '年龄', width: 80 },
  { prop: 'dept', label: '部门', minWidth: 100 },
  { prop: 'position', label: '职位', minWidth: 100 },
  { prop: 'salary', label: '薪资', width: 100 },
  { prop: 'status', label: '状态', width: 100 },
  { prop: 'email', label: '邮箱', minWidth: 180 },
  { prop: 'phone', label: '电话', width: 140 },
]
</script>

<style scoped>
.height-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.demo-info {
  color: var(--hx-text-color-secondary, #999);
  font-size: 13px;
}

.table-container {
  height: 600px;
  border: 1px solid var(--hx-border-color-light, #e4e7ed);
  border-radius: 4px;
  padding: 16px;
  background: var(--hx-bg-color, #fff);
}
</style>
