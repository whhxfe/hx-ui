<template>
  <div>
    <hx-relation-graph
      :nodes="nodes"
      :edges="edges"
      height="500px"
      :show-minimap="true"
      :node-size="45"
    />
  </div>
</template>

<script setup lang="ts">
import { HxRelationGraph } from "@hx/ui"

// 大规模数据示例 - 展示小地图效果
const nodes = [
  { id: '0', name: '核心人物' },
  // 第一个群组
  { id: '1', name: '同事A' },
  { id: '2', name: '同事B' },
  { id: '3', name: '同事C' },
  { id: '4', name: '同事D' },
  { id: '5', name: '同事E' },
  // 第二个群组
  { id: '6', name: '家人A' },
  { id: '7', name: '家人B' },
  { id: '8', name: '家人C' },
  { id: '9', name: '家人D' },
  // 第三个群组
  { id: '10', name: '朋友A' },
  { id: '11', name: '朋友B' },
  { id: '12', name: '朋友C' },
  { id: '13', name: '朋友D' },
  { id: '14', name: '朋友E' },
  // 第四个群组
  { id: '15', name: '同学A' },
  { id: '16', name: '同学B' },
  { id: '17', name: '同学C' },
  { id: '18', name: '同学D' },
  { id: '19', name: '同学E' },
]

const edges = [
  // 核心连接到各组
  { source: '0', target: '1', data: { label: '同事' } },
  { source: '0', target: '6', data: { label: '家人' } },
  { source: '0', target: '10', data: { label: '朋友' } },
  { source: '0', target: '15', data: { label: '同学' } },
  // 同事组内连接
  { source: '1', target: '2' },
  { source: '1', target: '3' },
  { source: '2', target: '4' },
  { source: '3', target: '5' },
  { source: '4', target: '5' },
  // 家人组内连接
  { source: '6', target: '7' },
  { source: '6', target: '8' },
  { source: '7', target: '9' },
  // 朋友组内连接
  { source: '10', target: '11' },
  { source: '10', target: '12' },
  { source: '11', target: '13' },
  { source: '12', target: '14' },
  { source: '13', target: '14' },
  // 同学组内连接
  { source: '15', target: '16' },
  { source: '15', target: '17' },
  { source: '16', target: '18' },
  { source: '17', target: '19' },
  // 跨组连接
  { source: '1', target: '10' },
  { source: '6', target: '15' },
  { source: '10', target: '16' },
]
</script>
