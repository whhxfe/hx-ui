<template>
  <div>
    <hx-relation-graph
      :nodes="nodes"
      :edges="edges"
      height="500px"
      layout-type="radial"
      :unit-radius="100"
      :node-size="40"
      :collapsible="true"
      :show-minimap="true"
    />
  </div>
</template>

<script setup lang="ts">
import { HxRelationGraph } from "@hx/ui"

// 可折叠的关系数据
const nodes = [
  { id: '0', name: '主对象', style: { size: 50, stroke: '#5B8FF9' } },
  { id: '1', name: '家庭成员', style: { size: 35, stroke: '#5B8FF9' } },
  { id: '2', name: '父亲', style: { size: 30, stroke: '#5B8FF9' } },
  { id: '3', name: '母亲', style: { size: 30, stroke: '#5B8FF9' } },
  { id: '4', name: '同事', style: { size: 35, stroke: '#5AD8A6' } },
  { id: '5', name: '张经理', style: { size: 28 } },
  { id: '6', name: '李主管', style: { size: 28 } },
  { id: '7', name: '王同事', style: { size: 28 } },
  { id: '8', name: '朋友', style: { size: 35, stroke: '#5AD8A6' } },
  { id: '9', name: '小李', style: { size: 28 } },
  { id: '10', name: '小王', style: { size: 28 } },
  { id: '11', name: '同学', style: { size: 35, stroke: '#5B8FF9' } },
  { id: '12', name: '大学同学', style: { size: 28 } },
  { id: '13', name: '高中同学', style: { size: 28 } },
]

const edges = [
  // 主对象 -> 类别节点
  { source: '0', target: '1', data: { label: '家庭' } },
  { source: '0', target: '4', data: { label: '同事' } },
  { source: '0', target: '8', data: { label: '朋友' } },
  { source: '0', target: '11', data: { label: '同学' } },
  // 家庭 -> 成员
  { source: '1', target: '2' },
  { source: '1', target: '3' },
  // 同事 -> 具体人
  { source: '4', target: '5' },
  { source: '4', target: '6' },
  { source: '4', target: '7' },
  // 朋友 -> 具体人
  { source: '8', target: '9' },
  { source: '8', target: '10' },
  // 同学 -> 具体人
  { source: '11', target: '12' },
  { source: '11', target: '13' },
]
</script>
