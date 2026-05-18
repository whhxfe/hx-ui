<template>
  <div>
    <hx-relation-graph
      :nodes="nodes"
      :edges="edges"
      height="400px"
      :node-size="60"
    />
  </div>
</template>

<script setup lang="ts">
import { HxRelationGraph } from "@hx/ui"

// 基础数据 - 姓名 + 角色
const nodes = [
  { id: '1', name: '张三', role: '技术总监' },
  { id: '2', name: '李四', role: '项目经理' },
  { id: '3', name: '王五', role: '前端开发' },
  { id: '4', name: '赵六', role: '后端开发' },
  { id: '5', name: '钱七', role: 'UI设计师' },
]

const edges = [
  { source: '1', target: '2', label: '管理' },
  { source: '1', target: '5', label: '管理' },
  { source: '2', target: '3', label: '指导' },
  { source: '2', target: '4', label: '指导' },
  { source: '3', target: '4', label: '协作' },
]
</script>
