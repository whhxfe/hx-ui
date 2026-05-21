<template>
  <div class="demo-section">
    <p class="demo-title">竖向模式（默认）</p>
    <div class="menu-demo-col">
      <HxMenu :menu="menu" :active="'/home'" />
    </div>

    <p class="demo-title menu-demo-title-next">横向模式</p>
    <div class="menu-demo-row">
      <HxMenu :menu="menu" mode="horizontal" :active="'/home'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { HxMenu } from '@hx/ui'
import type { MenuItem } from '@hx/ui'

/** 全部使用 iconify 图标，示例展示两种常用图标集 */
const menu: MenuItem[] = [
  { title: '首页', path: '/home', icon: { name: 'mdi:home', type: 'iconify' } },
  { title: '用户管理', path: '/user', icon: { name: 'mdi:account-group', type: 'iconify' } },
  { title: '订单管理', path: '/order', icon: { name: 'mdi:clipboard-list', type: 'iconify' } },
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
.menu-demo-title-next {
  margin-top: 28px;
}
/* 固定侧栏宽度，避免 el-menu 在预览区被拉满导致右侧大片留白 */
.menu-demo-col {
  width: 240px;
  max-width: 100%;
}
.menu-demo-row {
  width: 100%;
  min-width: 0;
}
</style>
