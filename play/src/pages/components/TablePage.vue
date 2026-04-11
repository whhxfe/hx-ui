<script setup lang="ts">
import { ref } from 'vue'
import type { TableColumn } from '@hx/ui'

const tableData = ref([
  { id: 1, name: 'Alice', dept: 'R&D', status: 'active', score: 92 },
  { id: 2, name: 'Bob', dept: 'Design', status: 'inactive', score: 78 },
  { id: 3, name: 'Carol', dept: 'R&D', status: 'active', score: 85 },
  { id: 4, name: 'David', dept: 'Marketing', status: 'active', score: 67 },
  { id: 5, name: 'Eve', dept: 'Finance', status: 'inactive', score: 91 },
])

const basicColumns: TableColumn[] = [
  { type: 'index', width: 60, label: '#' },
  { prop: 'name', label: '姓名', minWidth: 120 },
  { prop: 'dept', label: '部门', minWidth: 140 },
  { prop: 'status', label: '状态', minWidth: 100, slot: 'status' },
  { prop: 'score', label: '评分', minWidth: 80 },
]

function handleAction(row: any, type: string) {
  console.log(`${type} row:`, row)
}
</script>

<template>
  <div class="page-container">
    <h1 class="page-title">Table 表格</h1>
    <p class="page-desc">用于展示多条结构相似的数据，支持排序、筛选、分页等操作。</p>

    <!-- 基础用法 -->
    <section class="demo-section">
      <h3 class="section-title">基础用法</h3>
      <p class="section-desc">传入 <code>data</code> 数据和 <code>columns</code> 列配置即可渲染表格。</p>
      <div class="demo-block">
        <hx-table :data="tableData" :columns="basicColumns" border stripe>
          <template #status="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'" size="small">
              {{ row.status === 'active' ? '在职' : '离职' }}
            </el-tag>
          </template>
        </hx-table>
      </div>
    </section>

    <!-- 带操作按钮 -->
    <section class="demo-section">
      <h3 class="section-title">带操作列</h3>
      <p class="section-desc">通过 <code>#action</code> 插槽自定义操作列内容。</p>
      <div class="demo-block">
        <hx-table :data="tableData" :columns="basicColumns" border>
          <template #status="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'" size="small">
              {{ row.status === 'active' ? '在职' : '离职' }}
            </el-tag>
          </template>
          <template #action="{ row }">
            <div class="action-btns">
              <el-button type="primary" link size="small" @click="handleAction(row, 'edit')">
                <hx-icon type="iconify" name="ep:edit" size="12px" />
                编辑
              </el-button>
              <el-button type="danger" link size="small" @click="handleAction(row, 'delete')">
                <hx-icon type="iconify" name="ep:delete" size="12px" />
                删除
              </el-button>
            </div>
          </template>
        </hx-table>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-container {
  max-width: 900px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.page-desc {
  color: #666;
  margin-bottom: 32px;
  line-height: 1.6;
}

.demo-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.section-desc {
  color: #666;
  font-size: 14px;
  margin-bottom: 16px;
}

.section-desc code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
  color: #c7254e;
}

.demo-block {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
}

.action-btns {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
