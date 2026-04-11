<template>
  <div class="filter-panel-demo">
    <HxFilterPanel
      v-model="filterState"
      title="筛选条件"
      :filters="filters"
      @filter-change="onFilterChange"
      @reset="onReset"
    />
    <div class="filter-panel-demo__output">
      <p class="filter-panel-demo__output-title">当前 v-model</p>
      <pre class="filter-panel-demo__pre">{{ JSON.stringify(filterState, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { HxFilterPanel } from '@hx/ui'
import type { FilterConfig, FilterState } from '@hx/ui'

/**
 * =============================================================
 * filter-panel 远程联动示例 — 省 → 市 → 区三级级联
 * =============================================================
 *
 * 【接口约定 /api/options/linked】
 *   POST body { parent: <value> }   → 接口支持
 *   GET  ?parent=<value>            → 接口也支持
 *   返回 { code: 0, data: [{ label, value }] }
 *
 *   parent 传值规则：
 *     parent 为空 / 'all'   → 该层级全部选项
 *     parent = <省 value>   → 返回该省下的市列表
 *     parent = <市 value>   → 返回该市下的区列表
 *     parent = 'province'   → 返回省列表
 *
 * 【联动配置】
 *   remote.dependsOn         : 依赖的父级 prop 名称
 *   remote.dependsOnParamKey : 父值作为哪个参数名传递，默认 "value"
 *   remote.dependsOnIn       : 显式指定 'query' | 'body'，默认跟随 method
 *   remote.url / method / labelKey / valueKey : 与普通远程请求一致
 * =============================================================
 */
const BASE_URL = 'http://localhost:4300/api/options/linked'

const filters: FilterConfig[] = [
  // ── 第1级：省份（远程，请求时 parent='province'）─────────────────
  {
    type: 'filter-item',
    prop: 'province',
    label: '省份',
    multiple: false,
    remote: {
      method: 'post',
      url: BASE_URL,
      body: { parent: 'province' },
      labelKey: 'label',
      valueKey: 'value',
    },
  },

  // ── 第2级：城市（联动 — 依赖省份，父值注入 body）────────────────
  // 未选省份时返回所有市，选中后返回该省下的市
  {
    type: 'filter-item',
    prop: 'city',
    label: '城市',
    multiple: false,
    remote: {
      method: 'post',
      url: BASE_URL,
      dependsOn: 'province',
      dependsOnParamKey: 'parent',
      dependsOnIn: 'body',
      labelKey: 'label',
      valueKey: 'value',
    },
  },

  // ── 第3级：区县（联动 — 依赖城市，父值注入 query）────────────
  // 未选城市时返回所有区，选中后返回该市下的区
  {
    type: 'filter-item',
    prop: 'district',
    label: '区县',
    multiple: true,
    remote: {
      method: 'post',
      url: BASE_URL,
      dependsOn: 'city',
      dependsOnParamKey: 'parent',
      dependsOnIn: 'body',
      labelKey: 'label',
      valueKey: 'value',
    },
  },

  {
    type: 'date-range',
    prop: 'dateRange',
    label: '时间范围',
    options: [],
  },
]

const filterState = ref<FilterState>({
  province: '',
  city: '',
  district: '',
  dateRange: '',
})

const onFilterChange = (prop: string, value: unknown) => {
  console.log('[filter-change]', prop, value)
}

const onReset = () => {
  console.log('[reset]')
}
</script>

<style scoped>
.filter-panel-demo {
  width: 100%;
}

.filter-panel-demo__output {
  margin-top: 16px;
  padding: 12px 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.filter-panel-demo__output-title {
  margin: 0 0 8px;
  font-size: 13px;
  color: #606266;
}

.filter-panel-demo__pre {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  color: #303133;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
