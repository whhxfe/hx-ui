<template>
  <div class="demo-section">
    <p class="demo-title">分割线</p>
    <div class="menu-demo-col">
      <HxMenu :menu="menu" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { HxMenu } from '@hx/ui'
import type { MenuItem } from '@hx/ui'

const menu: MenuItem[] = [
  {
    type: 'sub',
    title: '仪表盘',
    icon: { name: 'mdi:view-dashboard', type: 'iconify' },
    children: [
      { title: '数据概览', path: '/dashboard/overview' },
      { title: '实时监控', path: '/dashboard/monitor' },
    ],
  },
  { title: '首页', path: '/home', icon: { name: 'mdi:home', type: 'iconify' }, divider: true },
  { title: '用户管理', path: '/user', icon: { name: 'mdi:account-group', type: 'iconify' } },
  { title: '订单管理', path: '/order', icon: { name: 'mdi:clipboard-list', type: 'iconify' }, divider: true },
  { title: '系统设置', path: '/settings', icon: { name: 'mdi:cog', type: 'iconify' } },
]
</script>

<style scoped>
.demo-section {
  padding: 4px 0;
}
.demo-title {
  margin: 0 0 10px;
  font-size: 13px;
  color: #8a92a6;
  font-weight: 500;
}
.menu-demo-col {
  width: 240px;
  max-width: 100%;
}
</style>
