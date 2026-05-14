<template>
  <div class="hx-card-list">
    <div v-if="$slots.header" class="hx-card-list__header">
      <slot name="header" />
    </div>

    <div
      v-if="displayData.length > 0"
      class="hx-card-list__body"
      :style="bodyStyle"
    >
      <div class="hx-card-list__grid" :style="gridStyle">
        <div
          v-for="(item, index) in displayData"
          :key="index"
          class="hx-card-list__item"
        >
          <slot :item="item" :index="index" />
        </div>
      </div>
    </div>

    <div v-else class="hx-card-list__empty">
      <slot name="empty">
        <el-empty :image-size="100" />
      </slot>
    </div>

    <div v-if="showPagination" class="hx-card-list__pagination">
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
import { computed, watch } from 'vue'
import { useFrontPagination } from '../../hooks/useFrontPagination'

defineOptions({
  name: 'HxCardList',
})

const props = withDefaults(
  defineProps<{
    data?: any[]
    columns?: number
    rowGap?: number
    columnGap?: number
    showPagination?: boolean
    frontPagination?: boolean
    currentPage?: number
    pageSize?: number
    pageSizes?: number[]
    total?: number
    paginationLayout?: string
    /** 容器高度，设置后卡片区域将出现滚动条 */
    height?: string
    /** 容器最大高度，设置后卡片区域超出时出现滚动条 */
    maxHeight?: string
  }>(),
  {
    data: () => [],
    columns: 3,
    rowGap: 16,
    columnGap: 16,
    showPagination: false,
    frontPagination: false,
    currentPage: 1,
    pageSize: 8,
    pageSizes: () => [8, 16, 24, 48],
    total: 0,
    paginationLayout: 'total, sizes, prev, pager, next, jumper',
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

const bodyStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.height) {
    style.height = props.height
  }
  if (props.maxHeight) {
    style.maxHeight = props.maxHeight
  }
  return style
})

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
  rowGap: `${props.rowGap}px`,
  columnGap: `${props.columnGap}px`,
}))

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

const externalCurrentPage = computed(() =>
  props.frontPagination ? frontPaginationState.currentPage.value : props.currentPage
)
const externalPageSize = computed(() =>
  props.frontPagination ? frontPaginationState.pageSize.value : props.pageSize
)

const displayData = computed(() => {
  const raw = !props.frontPagination ? props.data : (frontPaginationState.pageData.value as any[])
  return Array.isArray(raw) ? raw : []
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
</script>

<style scoped>
.hx-card-list {
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.hx-card-list__header {
  flex-shrink: 0;
  margin-bottom: 16px;
}

.hx-card-list__body {
  overflow-y: auto;
}

.hx-card-list__grid {
  display: grid;
}

.hx-card-list__item {
  min-width: 0;
}

.hx-card-list__empty {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 48px 0;
}

.hx-card-list__pagination {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  padding: 12px 0;
}
</style>
