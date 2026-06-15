<template>
  <div class="demo-section">
    <p class="demo-title">禁用与徽章</p>
    <div class="menu-demo-col">
      <HxMenu :menu="menu" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { HxMenu } from '@whhx/ui'
import type { MenuItem } from '@whhx/ui'

const menu: MenuItem[] = [
  { title: '首页', path: '/home', icon: { name: 'mdi:home', type: 'iconify' } },
  { title: '待处理', path: '/pending', icon: { name: 'mdi:clock-outline', type: 'iconify' }, badge: 5 },
  { title: '消息', path: '/messages', icon: { name: 'mdi:message-text', type: 'iconify' }, badge: '99+' },
  { title: '禁用项', path: '/disabled', icon: { name: 'mdi:lock', type: 'iconify' }, disabled: true },
  { title: '新功能', path: '/new', icon: { name: 'mdi:star', type: 'iconify' }, badge: 'New', divider: true },
  { title: '设置', path: '/settings', icon: { name: 'mdi:cog', type: 'iconify' } },
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
.menu-demo-col {
  width: 240px;
  max-width: 100%;
}
</style>
