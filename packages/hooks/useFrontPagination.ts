import { computed, ref, toRef, type MaybeRef, type Ref, type ComputedRef } from 'vue'

export interface UseFrontPaginationOptions {
  /**
   * 默认每页数量，默认值 10
   */
  pageSize?: number
  /**
   * 可选每页条数列表，默认值 [10, 20, 50, 100]
   */
  pageSizes?: number[]
  /**
   * 分页组件布局，默认值 'total, sizes, prev, pager, next, jumper'
   */
  paginationLayout?: string
}

export interface UseFrontPaginationReturn<T> {
  /** 当前页码 */
  currentPage: Ref<number>
  /** 每页数量 */
  pageSize: Ref<number>
  /** 可选每页条数列表 */
  pageSizes: Ref<number[]>
  /** 分页组件布局 */
  paginationLayout: Ref<string>
  /** 根据当前分页计算的总条数 */
  total: ComputedRef<number>
  /** 当前页切片后的数据 */
  pageData: ComputedRef<T[]>
  /** 可供 el-pagination 直接绑定的 props（currentPage/pageSize/pageSizes/total/layout） */
  paginationProps: ComputedRef<{
    currentPage: number
    pageSize: number
    pageSizes: number[]
    total: number
    layout: string
  }>
  /** 每页数量变化回调 */
  onSizeChange: (val: number) => void
  /** 当前页变化回调 */
  onCurrentChange: (val: number) => void
}

/**
 * 前端分页 composable
 *
 * 对传入的数组按 currentPage / pageSize 做切片，并维护分页状态。
 * 不控制"是否启用前端分页"的开关，由消费组件自行决定是否使用 pageData。
 *
 * @example
 * ```ts
 * const data = ref([...])
 * const { pageData, total, paginationProps, onSizeChange, onCurrentChange } = useFrontPagination(data)
 * ```
 */
export function useFrontPagination<T>(
  data: MaybeRef<T[]>,
  options?: UseFrontPaginationOptions,
): UseFrontPaginationReturn<T> {
  const dataRef = toRef(data)

  const currentPage = ref(1)
  const pageSize = ref(options?.pageSize ?? 10)
  const pageSizes = ref(options?.pageSizes ?? [10, 20, 50, 100])
  const paginationLayout = ref(options?.paginationLayout ?? 'total, sizes, prev, pager, next, jumper')

  const total = computed(() => dataRef.value.length)

  const pageData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return (dataRef.value as T[]).slice(start, start + pageSize.value)
  })

  const paginationProps = computed(() => ({
    currentPage: currentPage.value,
    pageSize: pageSize.value,
    pageSizes: pageSizes.value,
    total: total.value,
    layout: paginationLayout.value,
  }))

  function onSizeChange(val: number) {
    pageSize.value = val
  }

  function onCurrentChange(val: number) {
    currentPage.value = val
  }

  return {
    currentPage,
    pageSize,
    pageSizes,
    paginationLayout,
    total,
    pageData,
    paginationProps,
    onSizeChange,
    onCurrentChange,
  }
}