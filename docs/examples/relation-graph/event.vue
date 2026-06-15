<template>
  <div>
    <div class="relation-graph-event-demo">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="点击节点">
          {{ clickedNode?.name || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="角色">
          {{ clickedNode?.role || '-' }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <hx-relation-graph
      :nodes="nodes"
      :edges="edges"
      height="350px"
      @node-click="handleNodeClick"
      @node-dblclick="handleNodeDblClick"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { ElMessage } from "element-plus"
import { HxRelationGraph } from "@whhx/ui"
import type { RelationNodeClickEvent, RelationNode } from "@whhx/ui"

const clickedNode = ref<RelationNode | null>(null)

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

function handleNodeClick(event: RelationNodeClickEvent) {
  clickedNode.value = event.node
  ElMessage.success(`点击了节点：${event.node.name}`)
}

function handleNodeDblClick(event: RelationNodeClickEvent) {
  ElMessage.info(`查看详情：${event.node.name} - ${event.node.role}`)
}
</script>

<style scoped>
.relation-graph-event-demo {
  margin-bottom: 12px;
}
</style>
