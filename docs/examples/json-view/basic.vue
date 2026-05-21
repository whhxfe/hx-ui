<template>
  <div class="demo-section">
    <p class="demo-title">简单对象</p>
    <HxJsonView :data="simpleObj" />

    <p class="demo-title" style="margin-top: 28px">嵌套结构（默认折叠）</p>
    <HxJsonView :data="nestedObj" />

    <p class="demo-title" style="margin-top: 28px">大型 JSON（默认展开）</p>
    <HxJsonView :data="largeArr" :default-expanded="true" />
  </div>
</template>

<script setup lang="ts">
import { HxJsonView } from '@hx/ui'

const simpleObj = {
  name: '张三',
  age: 28,
  active: true,
  email: 'zhangsan@example.com',
  score: null,
}

const nestedObj = {
  code: 0,
  message: 'success',
  data: {
    id: 10001,
    username: 'admin',
    roles: ['super_admin', 'editor'],
    profile: {
      department: '技术部',
      position: '前端工程师',
      joinedAt: '2022-03-15',
    },
    settings: {
      theme: 'dark',
      language: 'zh-CN',
    },
  },
}

const largeArr = [
  { id: 1, name: '张三', city: '广州', tags: ['前端', 'Vue'] },
  { id: 2, name: '李四', city: '深圳', tags: ['后端', 'Node'] },
  { id: 3, name: '王五', city: '北京', tags: ['全栈', 'React'] },
]
</script>

<style scoped>
.demo-section {
  padding: 4px 0;
}
.demo-title {
  margin: 0 0 10px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
  font-weight: 500;
}
</style>