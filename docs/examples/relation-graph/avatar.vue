<template>
  <div>
    <hx-relation-graph
      :nodes="nodes"
      :edges="edges"
      height="400px"
      :node-size="50"
    />
  </div>
</template>

<script setup lang="ts">
import { HxRelationGraph } from "@hx/ui"

// 带头像和样式的节点数据
const nodes = [
  {
    id: '1',
    name: '李泽宽',
    role: '主对象',
    style: {
      img: '/images/avatars/felix.svg',
      size: 60,
      stroke: '#5B8FF9',
    },
  },
  {
    id: '2',
    name: '张三',
    role: '父亲',
    style: {
      img: '/images/avatars/aneka.svg',
      size: 50,
      stroke: '#5B8FF9',
    },
  },
  {
    id: '3',
    name: '李四',
    role: '母亲',
    style: {
      img: '/images/avatars/mimi.svg',
      size: 50,
      stroke: '#5B8FF9',
    },
  },
  {
    id: '4',
    name: '王五',
    role: '同事',
    style: {
      img: '/images/avatars/leo.svg',
      size: 50,
      stroke: '#5AD8A6',
    },
  },
  {
    id: '5',
    name: '赵六',
    role: '朋友',
    style: {
      img: '/images/avatars/luna.svg',
      size: 50,
      stroke: '#5AD8A6',
    },
  },
  {
    id: '6',
    name: '钱七',
    role: '重点人',
    style: {
      img: '/images/avatars/max.svg',
      size: 50,
      stroke: '#FF6B6B',
    },
  },
]

const edges = [
  { source: '1', target: '2', data: { label: '父子', stroke: '#5B8FF9' } },
  { source: '1', target: '3', data: { label: '母子', stroke: '#5B8FF9' } },
  { source: '1', target: '4', data: { label: '同事关系' } },
  { source: '1', target: '5', data: { label: '朋友关系' } },
  { source: '4', target: '6', data: { label: '重点人', stroke: '#FF6B6B' } },
]
</script>
