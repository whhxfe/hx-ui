<template>
  <el-table-column v-if="column.type" :type="column.type" v-bind="columnBindings" />

  <el-table-column v-else-if="column.children?.length" v-bind="columnBindings">
    <template v-for="(child, idx) in visibleChildren" :key="child.prop || idx">
      <TableColumnItem :column="child" :col-index="idx" />
    </template>
  </el-table-column>

  <el-table-column v-else v-bind="columnBindings">
    <template #header="{ column: col, $index }">
      <component :is="() => column.headerRender!(column, $index)" v-if="column.headerRender" />
      <component
        v-else-if="column.headerSlot && tableSlots[column.headerSlot]"
        :is="tableSlots[column.headerSlot!]"
        :column="col"
        :index="$index"
      />
    </template>
    <template #default="{ row, $index }">
      <component :is="() => column.render!(row, $index)" v-if="column.render" />
      <component v-else-if="column.slot && tableSlots[column.slot]" :is="tableSlots[column.slot!]" :row="row" :index="$index" />
    </template>
  </el-table-column>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import type { Slots } from 'vue'
import { TABLE_SLOTS_KEY } from '../../constants'
import { COLUMN_DIRECT_PROPS } from './types'
import type { TableColumn, ColumnDirectProp } from './types'

defineOptions({ name: 'TableColumnItem' })

const props = defineProps<{
  column: TableColumn
  colIndex: number
}>()

const tableSlots = inject<Slots>(TABLE_SLOTS_KEY, {})

const columnBindings = computed(() => {
  const col = props.column
  const bindings: Record<string, any> = {}

  for (const key of COLUMN_DIRECT_PROPS) {
    if (col[key] !== undefined) {
      bindings[key] = col[key]
    }
  }

  if (col.columnProps) {
    Object.assign(bindings, col.columnProps)
  }

  return bindings
})

const visibleChildren = computed(() => props.column.children?.filter((c) => !c.hidden) || [])
</script>
