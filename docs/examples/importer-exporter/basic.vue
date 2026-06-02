<template>
  <div class="demo-importer-exporter">
    <!-- 工具栏 -->
        
        <!-- :template-url="'/api/import/template'" -->
    <div class="demo-toolbar">
      <hx-importer
        ref="importerRef"
        :upload-action="'/api/import/upload'"
        :template-url="'/api/import/template'"
        :accept="'.xlsx,.xls'"
        button-text="导入"
        :max-size="10"
        @on-success="handleImportSuccess"t
      />
      <hx-exporter
        ref="exporterRef"
        :export-action="'/api/export'"
        :get-search-params="getSearchParams"
        :total-count="totalCount"
        :current-page="pagination.page"
        :page-size="pagination.pageSize"
        :selected-rows="selectedRows"
        :max-export-count="100"
				:exportOptions="['page','all','selected','count']"
        button-text="导出"
        @on-success="handleExportSuccess"
      />
    </div>

    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="tableData"
      border
      stripe
      style="width: 100%; margin-top: 16px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" width="60" label="#" />
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="姓名" min-width="120" />
      <el-table-column prop="age" label="年龄" width="100" />
      <el-table-column prop="department" label="部门" min-width="120" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'info'">
            {{ row.status === "active" ? "在职" : "离职" }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="pagination.page"
      v-model:page-size="pagination.pageSize"
      :total="totalCount"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      style="margin-top: 16px"
      @size-change="handlePageChange"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import type { TableInstance } from "element-plus";

interface TableRow {
  id: number;
  name: string;
  age: number;
  department: string;
  status: string;
}

// 模拟全部数据
const allData: TableRow[] = [
  { id: 1, name: "张三", age: 28, department: "研发部", status: "active" },
  { id: 2, name: "李四", age: 32, department: "产品部", status: "active" },
  { id: 3, name: "王五", age: 25, department: "设计部", status: "inactive" },
  { id: 4, name: "赵六", age: 30, department: "市场部", status: "active" },
  { id: 5, name: "钱七", age: 27, department: "运营部", status: "active" },
  { id: 6, name: "孙八", age: 35, department: "人事部", status: "inactive" },
  { id: 7, name: "周九", age: 29, department: "财务部", status: "active" },
  { id: 8, name: "吴十", age: 31, department: "研发部", status: "active" },
  { id: 9, name: "郑一", age: 26, department: "产品部", status: "inactive" },
  { id: 10, name: "王二", age: 33, department: "设计部", status: "active" },
  { id: 11, name: "冯三", age: 24, department: "市场部", status: "active" },
  { id: 12, name: "陈四", age: 28, department: "运营部", status: "inactive" },
  { id: 13, name: "褚五", age: 36, department: "人事部", status: "active" },
  { id: 14, name: "卫六", age: 30, department: "财务部", status: "active" },
  { id: 15, name: "蒋七", age: 27, department: "研发部", status: "inactive" },
  { id: 16, name: "沈八", age: 32, department: "产品部", status: "active" },
  { id: 17, name: "韩九", age: 25, department: "设计部", status: "active" },
  { id: 18, name: "杨十", age: 29, department: "市场部", status: "inactive" },
  { id: 19, name: "朱一", age: 34, department: "运营部", status: "active" },
  { id: 20, name: "秦二", age: 28, department: "人事部", status: "active" },
  { id: 21, name: "许三", age: 31, department: "研发部", status: "active" },
  { id: 22, name: "何四", age: 26, department: "产品部", status: "inactive" },
  { id: 23, name: "吕五", age: 33, department: "设计部", status: "active" },
  { id: 24, name: "施六", age: 29, department: "市场部", status: "active" },
  { id: 25, name: "张七", age: 27, department: "运营部", status: "inactive" },
  { id: 26, name: "孔八", age: 35, department: "人事部", status: "active" },
  { id: 27, name: "曹九", age: 30, department: "财务部", status: "active" },
  { id: 28, name: "严十", age: 25, department: "研发部", status: "active" },
  { id: 29, name: "华一", age: 32, department: "产品部", status: "inactive" },
  { id: 30, name: "金二", age: 28, department: "设计部", status: "active" },
];

const loading = ref(false);
const tableRef = ref<TableInstance>();
const selectedRows = ref<TableRow[]>([]);

const tableData = ref<TableRow[]>([]);
const totalCount = ref(0);
const pagination = reactive({
  page: 1,
  pageSize: 10,
});

// 模拟搜索参数
const searchParams = reactive({
  name: "",
  department: "",
});

function getSearchParams() {
  return { ...searchParams };
}

function handleSelectionChange(selection: TableRow[]) {
  selectedRows.value = selection;
}

function handlePageChange() {
  loadData();
}

async function loadData() {
  loading.value = true;
  try {
    // 模拟分页
    const start = (pagination.page - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    tableData.value = allData.slice(start, end);
    totalCount.value = allData.length;
  } catch (e) {
    ElMessage.error("加载数据失败");
  } finally {
    loading.value = false;
  }
}

function handleImportSuccess(response: any) {
  // ElMessage.success('导入成功')
  console.log("导入结果:", response);
}

function handleExportSuccess() {
  ElMessage.success("导出成功");
}

onMounted(() => {
  loadData();
});
</script>

<style scoped lang="scss">
.demo-importer-exporter {
  .demo-toolbar {
    display: flex;
    gap: 12px;
  }
}
</style>
