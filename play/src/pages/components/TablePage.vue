<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { TableColumn } from '@hx/ui'

const tableData = ref([
  { id: 1, name: 'Alice', dept: 'R&D', status: 'active', score: 92 },
  { id: 2, name: 'Bob', dept: 'Design', status: 'inactive', score: 78 },
  { id: 3, name: 'Carol', dept: 'R&D', status: 'active', score: 85 },
  { id: 4, name: 'David', dept: 'Marketing', status: 'active', score: 67 },
  { id: 5, name: 'Eve', dept: 'Finance', status: 'inactive', score: 91 },
])

// 大数据量测试数据
const largeData = ref<any[]>([])
const loading = ref(false)

// 选中行
const selectedRows = ref<any[]>([])

function generateLargeData(count: number) {
  loading.value = true
  const depts = ['R&D', 'Design', 'Marketing', 'Finance', 'Sales', 'HR', 'Operations']
  const statuses = ['active', 'inactive']
  const names = ['Alice', 'Bob', 'Carol', 'David', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack']

  const data = Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `${names[i % names.length]}_${i}`,
    dept: depts[i % depts.length],
    status: statuses[i % statuses.length],
    score: Math.floor(Math.random() * 100),
    email: `user${i}@example.com`,
    phone: `138${String(i).padStart(8, '0')}`,
    address: `Address ${i}`,
  }))

  largeData.value = data
  loading.value = false
}

onMounted(() => {
  generateLargeData(100)
})

const basicColumns: TableColumn[] = [
  { type: 'index', width: 60, label: '#' },
  { prop: 'name', label: '姓名', minWidth: 120 },
  { prop: 'dept', label: '部门', minWidth: 140 },
  { prop: 'status', label: '状态', minWidth: 100, slot: 'status' },
  { prop: 'score', label: '评分', minWidth: 80 },
]

// 支持 sortable 排序的列配置
const sortableColumns: TableColumn[] = [
  { type: 'selection', width: 50, selectable: (row: any) => row.score >= 70 },
  { type: 'index', width: 60, label: '#' },
  { prop: 'name', label: '姓名', minWidth: 120, sortable: true },
  { prop: 'dept', label: '部门', minWidth: 140, filters: [
    { text: 'R&D', value: 'R&D' },
    { text: 'Design', value: 'Design' },
    { text: 'Marketing', value: 'Marketing' },
    { text: 'Finance', value: 'Finance' },
  ], filterMethod: (value: string, row: any) => row.dept === value },
  { prop: 'status', label: '状态', minWidth: 100, slot: 'status' },
  { prop: 'score', label: '评分', width: 100, sortable: true, sortMethod: (a: any, b: any) => a.score - b.score },
]

const largeColumns: TableColumn[] = [
  { type: 'index', width: 60, label: '#' },
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '姓名', minWidth: 120 },
  { prop: 'email', label: '邮箱', minWidth: 180 },
  { prop: 'phone', label: '电话', width: 130 },
  { prop: 'dept', label: '部门', minWidth: 120 },
  { prop: 'status', label: '状态', minWidth: 90, slot: 'status' },
  { prop: 'score', label: '评分', width: 80 },
  { prop: 'address', label: '地址', minWidth: 150 },
]

function handleAction(row: any, type: string) {
  console.log(`${type} row:`, row)
}

function handleSelectionChange(selection: any[]) {
  selectedRows.value = selection
  console.log('选中行:', selection)
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

    <!-- 排序与筛选测试 -->
    <section class="demo-section">
      <h3 class="section-title">排序与筛选 (新增属性测试)</h3>
      <p class="section-desc">
        测试新增的 <code>sortable</code>、<code>filters</code>、<code>selectable</code> 属性。
        <br />
        - 评分 &lt; 70 的行禁止选择
        - 支持按姓名、评分排序
        - 部门列支持筛选
      </p>
      <div class="demo-block">
        <div class="selection-info">
          <el-tag type="primary">已选中 {{ selectedRows.length }} 行</el-tag>
          <el-button v-if="selectedRows.length" type="text" size="small" @click="selectedRows = []">
            清空选择
          </el-button>
        </div>
        <hx-table
          :data="tableData"
          :columns="sortableColumns"
          border
          stripe
          @selection-change="handleSelectionChange"
        >
          <template #status="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'" size="small">
              {{ row.status === 'active' ? '在职' : '离职' }}
            </el-tag>
          </template>
        </hx-table>
      </div>
    </section>

    <!-- 大数据量测试 -->
    <section class="demo-section">
      <h3 class="section-title">大数据量测试 (100条)</h3>
      <p class="section-desc">
        测试表格在大量数据下的渲染性能，使用 Element Plus 的虚拟滚动优化。
        <br />
        当前数据量: <strong>{{ largeData.length }}</strong> 条
      </p>
      <div class="demo-block">
        <hx-table
          v-loading="loading"
          :data="largeData"
          :columns="largeColumns"
          border
          stripe
          height="400"
        >
          <template #status="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'" size="small">
              {{ row.status === 'active' ? '在职' : '离职' }}
            </el-tag>
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

.selection-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
</style>
