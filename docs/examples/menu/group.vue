<template>
  <div class="demo-section">
    <p class="demo-title">分组菜单（group）+ 图标</p>
    <div class="menu-demo-col">
      <HxMenu :menu="groupMenu" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { HxMenu } from '@whhx/ui'
import type { MenuItem } from '@whhx/ui'

const groupMenu: MenuItem[] = [
  {
    type: 'group',
    title: '系统管理',
    children: [
      { title: '用户管理', path: '/user', icon: { name: 'mdi:account', type: 'iconify' } },
      { title: '角色管理', path: '/role', icon: { name: 'mdi:shield-account', type: 'iconify' } },
      { title: '菜单管理', path: '/menu', icon: { name: 'mdi:format-list-bulleted', type: 'iconify' } },
    ],
  },
  {
    type: 'group',
    title: '日志审计',
    children: [
      { title: '操作日志', path: '/log/operation', icon: { name: 'mdi:history', type: 'iconify' } },
      { title: '登录日志', path: '/log/login', icon: { name: 'mdi:login', type: 'iconify' } },
    ],
  },
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
