<template>
  <div class="demo-section">
    <p class="demo-title">子菜单（sub）+ 图标</p>
    <div class="menu-demo-col">
      <HxMenu :menu="menu" width="200px" :active="'/dashboard/overview'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { HxMenu } from '@whhx/ui'
import type { MenuItem } from '@whhx/ui'

/**
 * iconify 图标格式：{ name: '集合:图标名', type: 'iconify' }
 * 常用图标集前缀：mdi(Material Design)、lucide、carbon、tabler
 * 详见 https://icon-sets.iconify.design
 */
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
  {
    type: 'sub',
    title: '系统管理',
    icon: { name: 'mdi:cog', type: 'iconify' },
    children: [
      { title: '用户管理', path: '/system/user' },
      { title: '角色管理', path: '/system/role' },
      { title: '菜单管理', path: '/system/menu' },
    ],
  },
  { title: '日志审计', path: '/log', icon: { name: 'mdi:clipboard-text-clock', type: 'iconify' } },
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
  width: 260px;
  max-width: 100%;
}
</style>
