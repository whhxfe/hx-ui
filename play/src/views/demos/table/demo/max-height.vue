<template>
  <div class="max-height-demo">
    <p class="demo-info">表格 max-height="400px"，内容超出后可滚动查看</p>
    <hx-table
      :data="data"
      :columns="columns"
      show-pagination
      border
      max-height="400px"
    />
  </div>
</template>

<script setup lang="ts">
import { HxTable as Table } from '@whhx/ui'

// 生成 50 条测试数据
const data = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: `文档标题 - 第 ${i + 1} 篇`,
  author: ['张三', '李四', '王五', '赵六'][i % 4],
  dept: ['研发部', '设计部', '市场部', '运营部'][i % 4],
  views: Math.floor(Math.random() * 10000),
  likes: Math.floor(Math.random() * 1000),
  createdAt: new Date(2024, 0, 1 + (i % 30)).toLocaleDateString(),
}))

const columns = [
  { type: 'index', width: 60, label: '#' },
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'title', label: '标题', minWidth: 200 },
  { prop: 'author', label: '作者', width: 100 },
  { prop: 'dept', label: '部门', width: 100 },
  { prop: 'views', label: '浏览量', width: 100 },
  { prop: 'likes', label: '点赞数', width: 100 },
  { prop: 'createdAt', label: '创建日期', width: 120 },
]
</script>

<style scoped>
.max-height-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.demo-info {
  color: var(--hx-text-color-secondary, #999);
  font-size: 13px;
}
</style>
