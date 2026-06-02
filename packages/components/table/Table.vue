<template>
  <div class="hx-table">
    <el-table ref="tableRef" v-bind="tableAttrs" :data="displayData" :height="elTableHeight" :max-height="elTableMaxHeight">
      <template v-for="(col, idx) in visibleColumns" :key="col.prop || col.type || idx">
        <TableColumnItem :column="col" :col-index="idx" />
      </template>

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
import type { TableColumn, TableProps } from './types'

defineOptions({
  name: 'HxTable',
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<TableProps>(),
  {
    columns: () => [],
    data: () => [],
    showPagination: false,
    currentPage: 1,
    pageSize: 10,
    pageSizes: () => [10, 20, 50, 100],
    total: 0,
    paginationLayout: 'total, sizes, prev, pager, next, jumper',
    frontPagination: false,
    height: undefined,
    maxHeight: undefined,
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

// 分页区域高度常量：上下 padding 12px * 2 + 分页内容约 32px
const PAGINATION_HEIGHT = 56

// 计算传递给 el-table 的实际高度
// 优先使用 props.height，否则使用 attrs 中的 height
const elTableHeight = computed(() => {
  const height = props.height ?? (tableAttrs.value.height as number | string | undefined)

  if (height === undefined) return undefined

  const numHeight = typeof height === 'number' ? height : parseFloat(String(height))

  // 如果设置了分页，减去分页区域高度
  if (props.showPagination && !isNaN(numHeight)) {
    return numHeight - PAGINATION_HEIGHT
  }

  return numHeight
})

// 计算传递给 el-table 的实际 maxHeight
const elTableMaxHeight = computed(() => {
  return props.maxHeight ?? (tableAttrs.value.maxHeight as number | string | undefined)
})

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
  display: flex;
  flex-direction: column;
}

.hx-table__pagination {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  padding: 12px 0;
}
</style>