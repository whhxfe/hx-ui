<template>
  <div>
    <hx-relation-graph
      :nodes="nodes"
      :edges="edges"
      height="450px"
      layout-type="radial"
      :unit-radius="120"
      :link-distance="150"
      :node-size="50"
    />
  </div>
</template>

<script setup lang="ts">
import { HxRelationGraph } from "@hx/ui"

// 径向布局数据 - 中心节点 + 层级关系
const nodes = [
  { id: '0', name: '中心人物', role: '核心', style: { size: 60, stroke: '#5B8FF9' } },
  { id: '1', name: '一级关系', role: '直接关联', style: { size: 45, stroke: '#5B8FF9' } },
  { id: '2', name: '一级关系', role: '直接关联', style: { size: 45, stroke: '#5B8FF9' } },
  { id: '3', name: '一级关系', role: '直接关联', style: { size: 45, stroke: '#5B8FF9' } },
  { id: '4', name: '二级关系', role: '间接关联', style: { size: 35, stroke: '#5AD8A6' } },
  { id: '5', name: '二级关系', role: '间接关联', style: { size: 35, stroke: '#5AD8A6' } },
  { id: '6', name: '二级关系', role: '间接关联', style: { size: 35, stroke: '#5AD8A6' } },
  { id: '7', name: '二级关系', role: '间接关联', style: { size: 35, stroke: '#5AD8A6' } },
  { id: '8', name: '三级关系', role: '远亲', style: { size: 30, stroke: '#b1b1b1' } },
  { id: '9', name: '三级关系', role: '远亲', style: { size: 30, stroke: '#b1b1b1' } },
  { id: '10', name: '三级关系', role: '远亲', style: { size: 30, stroke: '#b1b1b1' } },
  { id: '11', name: '三级关系', role: '远亲', style: { size: 30, stroke: '#b1b1b1' } },
]

const edges = [
  // 中心到一级
  { source: '0', target: '1', data: { label: '直接关系' } },
  { source: '0', target: '2', data: { label: '直接关系' } },
  { source: '0', target: '3', data: { label: '直接关系' } },
  // 一级到二级
  { source: '1', target: '4', data: { label: '关联' } },
  { source: '1', target: '5', data: { label: '关联' } },
  { source: '2', target: '6', data: { label: '关联' } },
  { source: '3', target: '7', data: { label: '关联' } },
  // 二级到三级
  { source: '4', target: '8', data: { label: '弱关系' } },
  { source: '5', target: '9', data: { label: '弱关系' } },
  { source: '6', target: '10', data: { label: '弱关系' } },
  { source: '7', target: '11', data: { label: '弱关系' } },
]
</script>
