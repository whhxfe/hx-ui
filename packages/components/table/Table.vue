<template>
  <div class="hx-table">
    <el-table ref="tableRef" v-bind="tableAttrs" :data="displayData">
      <template v-for="(col, idx) in visibleColumns" :key="col.prop || col.type || idx">
        <TableColumnItem :column="col" :col-index="idx" />
      </template>

      <el-table-column
        v-if="$slots.action"
        fixed="right"
        align="center"
        label="操作"
        v-bind="actionColumnProps"
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

    <div v-if="showPagination && paginationTotal > 0" class="hx-table__pagination">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        :total="paginationTotal"
        :layout="paginationLayout"
        background
        @size-change="(val: number) => emit('size-change', val)"
        @current-change="(val: number) => emit('current-change', val)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, provide, ref, useAttrs, useSlots } from 'vue'
import TableColumnItem from './ColumnItem.vue'
import { TABLE_SLOTS_KEY } from '../../constants'
import type { TableColumn } from './types'

defineOptions({
  name: 'HxTable',
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    columns?: TableColumn[]
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
    actionColumnProps: () => ({ width: 180 }),
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
  (e: 'size-change', size: number): void
  (e: 'current-change', page: number): void
}>()

const attrs = useAttrs()
const slots = useSlots()
const tableRef = ref()

provide(TABLE_SLOTS_KEY, slots)

const tableAttrs = computed(() => {
  const { data, ...rest } = attrs as Record<string, any>
  return rest
})

const rawData = computed<any[]>(() => (attrs.data as any[]) || [])

const displayData = computed(() => {
  if (!props.frontPagination) return rawData.value
  const start = (props.currentPage - 1) * props.pageSize
  return rawData.value.slice(start, start + props.pageSize)
})

const paginationTotal = computed(() => (props.frontPagination ? rawData.value.length : props.total))

const visibleColumns = computed(() => props.columns.filter((col) => !col.hidden))

defineExpose({
  getTableRef: () => tableRef.value,
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
