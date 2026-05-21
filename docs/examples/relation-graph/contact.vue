<template>
  <div class="contact-demo">
    <hx-relation-graph
      :nodes="nodes"
      :edges="edges"
      :width="800"
      :height="600"
      :node-size="60"
      :show-minimap="false"
      :show-search="true"
      :collapsible="true"
      layout-type="radial"
    />
  </div>
</template>

<script setup lang="ts">
import { HxRelationGraph, type RelationNode, type RelationEdge } from '@hx/ui'

// 人物节点及其虚拟账号
const nodes: RelationNode[] = [
  {
    id: '1',
    name: '李泽宽',
    role: '主对象',
    gender: 'male',
    contactAccounts: [
      { type: 'phone', value: '138-0013-8000' },
      { type: 'weixin', value: 'lizk888' },
      { type: 'qq', value: '123456789' },
      { type: 'email', value: 'lizk@example.com' },
    ],
    style: {
      size: 60,
      stroke: '#5B8FF9',
    },
  },
  {
    id: '2',
    name: '张三',
    role: '父亲',
    gender: 'male',
    contactAccounts: [
      { type: 'phone', value: '139-0013-9000' },
      { type: 'weixin', value: 'zhangsan_2024' },
    ],
    style: {
      size: 50,
      stroke: '#5B8FF9',
    },
  },
  {
    id: '3',
    name: '李四',
    role: '母亲',
    gender: 'female',
    contactAccounts: [
      { type: 'phone', value: '137-0013-7000' },
      { type: 'weixin', value: 'lis2024' },
      { type: 'douyin', value: 'lisilisi' },
    ],
    style: {
      size: 50,
      stroke: '#5B8FF9',
    },
  },
  {
    id: '4',
    name: '王五',
    role: '同事',
    gender: 'male',
    contactAccounts: [
      { type: 'phone', value: '136-0013-6000' },
      { type: 'qq', value: '987654321' },
      { type: 'email', value: 'wangwu@company.com' },
    ],
    style: {
      size: 50,
      stroke: '#5AD8A6',
    },
  },
  {
    id: '5',
    name: '赵六',
    role: '朋友',
    gender: 'unknown',
    contactAccounts: [
      { type: 'weixin', value: 'zhaoliu666' },
      { type: 'douyin', value: 'zhaoliu_douyin' },
    ],
    style: {
      size: 50,
      stroke: '#5AD8A6',
    },
  },
  {
    id: '6',
    name: '钱七',
    role: '重点人',
    gender: 'male',
    contactAccounts: [
      { type: 'phone', value: '135-0013-5000' },
    ],
    style: {
      size: 50,
      stroke: '#FF6B6B',
    },
  },
]

// 人物之间的关系边
const edges: RelationEdge[] = [
  { source: '1', target: '2', label: '父子', data: { stroke: '#5B8FF9' } },
  { source: '1', target: '3', label: '母子', data: { stroke: '#5B8FF9' } },
  { source: '1', target: '4', label: '同事', data: { stroke: '#5AD8A6' } },
  { source: '1', target: '5', label: '朋友', data: { stroke: '#5AD8A6' } },
  { source: '1', target: '6', label: '关注', data: { stroke: '#FF6B6B' } },
]
</script>

<style scoped>
.contact-demo {
  width: 100%;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  overflow: hidden;
}
</style>
