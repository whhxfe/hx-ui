<template>
  <div style="width: 100%">
    <hx-card-list :data="cardList" :columns="3" :column-gap="16" :row-gap="16" >
      <template #default="{ item, index }">
        <el-card shadow="hover" :body-style="{ padding: '16px' }">
          <div class="card-content">
            <el-avatar :size="48" :style="{ backgroundColor: item.color }">
              {{ item.name.charAt(0) }}
            </el-avatar>
            <h3 class="card-name">{{ item.name }}</h3>
            <p class="card-desc">{{ item.description }}</p>
            <el-tag :type="item.status === 'active' ? 'success' : 'info'" size="small">
              {{ item.status === 'active' ? '启用' : '停用' }}
            </el-tag>
          </div>
        </el-card>
      </template>
    </hx-card-list>
  </div>
</template>

<script lang="ts" setup>
import { HxCardList } from '@hx/ui'

const cardList = Array.from({ length: 6 }, (_, i) => ({
  name: `项目 ${i + 1}`,
  description: `这是第 ${i + 1} 个项目的简要描述信息，用于展示卡片列表的基本用法。`,
  status: i % 3 === 0 ? 'inactive' : 'active',
  color: ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399', '#b37feb'][i],
}))
</script>

<style scoped>
.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}
.card-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}
.card-desc {
  margin: 0;
  font-size: 13px;
  color: #909399;
  line-height: 1.5;
}
</style>