<template>
  <div class="hx-table">
    <el-table ref="tableRef" v-bind="tableAttrs" :data="displayData">
      <template v-for="(col, idx) in visibleColumns" :key="col.prop || col.type || idx">
        <TableColumnItem :column="col" :col-index="idx" />
      </template>

      <el-table-column
        v-if="$slots.action"
        align="center"
        label="操作"
        v-bind="resolvedActionColumnProps"
      >
        <template #default="{ row, $index }">
          <slot name="action" :row="row" :index="$index" />
        </template>
      </el-table-column>

      <template v-if="$slots.append" #append>
        <slot name="append" />
      </template>
      <template v-if="$slots.empty" #empty>
        <slot name="empty" />
      </template>
    </el-table>

    <div v-if="showPagination" class="hx-table__pagination">
      <el-pagination
        :current-page="externalCurrentPage"
        :page-size="externalPageSize"
        :page-sizes="pageSizes"
        :total="paginationTotal"
        :layout="paginationLayout"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, provide, ref, useAttrs, useSlots, watch } from 'vue'
import TableColumnItem from './ColumnItem.vue'
import { TABLE_SLOTS_KEY } from '../../constants'
import { useFrontPagination } from '../../hooks/useFrontPagination'
import type { TableColumn } from './types'

defineOptions({
  name: 'HxTable',
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    columns?: TableColumn[]
    data?: any[]
    actionColumnProps?: Record<string, any>
    showPagination?: boolean
    currentPage?: number
    pageSize?: number
    pageSizes?: number[]
    total?: number
    paginationLayout?: string
    frontPagination?: boolean
  }>(),
  {
    columns: () => [],
    data: () => [],
    actionColumnProps: () => ({ width: 180, fixed: 'right' as const }),
    showPagination: false,
    currentPage: 1,
    pageSize: 10,
    pageSizes: () => [10, 20, 50, 100],
    total: 0,
    paginationLayout: 'total, sizes, prev, pager, next, jumper',
    frontPagination: false,
  }
)

const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void
  (e: 'update:pageSize', size: number): void
  (e: 'size-change', size: number): void
  (e: 'current-change', page: number): void
}>()

const tableRef = ref()

provide(TABLE_SLOTS_KEY, useSlots())

// 将 data 从 attrs 中排除，避免与 prop 冲突
const tableAttrs = computed(() => {
  const { data: _, ...rest } = useAttrs() as Record<string, any>
  return rest
})

const visibleColumns = computed(() => props.columns.filter((col) => !col.hidden))

const resolvedActionColumnProps = computed(() => ({
  ...props.actionColumnProps,
}))

// 当 props 从外部控制时（非前端分页模式），使用 props 中的值
const externalCurrentPage = computed(() =>
  props.frontPagination ? frontPaginationState.currentPage.value : props.currentPage
)
const externalPageSize = computed(() =>
  props.frontPagination ? frontPaginationState.pageSize.value : props.pageSize
)

// 前端分页
const frontPaginationState = useFrontPagination(
  computed(() => props.data),
  { pageSize: props.pageSize, pageSizes: props.pageSizes, paginationLayout: props.paginationLayout },
)

// 同步前端分页变化到外部 emit
watch(frontPaginationState.currentPage, (val) => {
  if (props.frontPagination) {
    emit('update:currentPage', val)
    emit('current-change', val)
  }
})
watch(frontPaginationState.pageSize, (val) => {
  if (props.frontPagination) {
    emit('update:pageSize', val)
    emit('size-change', val)
  }
})

const displayData = computed(() => {
  if (!props.frontPagination) return props.data
  return frontPaginationState.pageData.value
})

const paginationTotal = computed(() => {
  if (props.frontPagination) return frontPaginationState.total.value
  return props.total
})

function handleSizeChange(val: number) {
  if (props.frontPagination) {
    frontPaginationState.onSizeChange(val)
  } else {
    emit('update:pageSize', val)
    emit('size-change', val)
  }
}

function handleCurrentChange(val: number) {
  if (props.frontPagination) {
    frontPaginationState.onCurrentChange(val)
  } else {
    emit('update:currentPage', val)
    emit('current-change', val)
  }
}

/** 代理 el-table 常用方法 */
function clearSelection() {
  tableRef.value?.clearSelection()
}
function toggleRowSelection(row: any, selected?: boolean) {
  tableRef.value?.toggleRowSelection(row, selected)
}
function toggleAllSelection() {
  tableRef.value?.toggleAllSelection()
}
function setCurrentRow(row: any) {
  tableRef.value?.setCurrentRow(row)
}
function clearSort() {
  tableRef.value?.clearSort()
}
function clearFilter(columnKey?: string[]) {
  tableRef.value?.clearFilter(columnKey)
}
function getTableRef() {
  return tableRef.value
}

defineExpose({
  clearSelection,
  toggleRowSelection,
  toggleAllSelection,
  setCurrentRow,
  clearSort,
  clearFilter,
  getTableRef,
})
</script>

<style scoped>
.hx-table {
  width: 100%;
  min-width: 0;
}

.hx-table__pagination {
  display: flex;
  justify-content: flex-end;
  padding: 12px 0;
}
</style>