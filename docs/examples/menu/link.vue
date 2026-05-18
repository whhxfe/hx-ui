<template>
  <div class="demo-section">
    <p class="demo-title">外部链接</p>
    <div class="menu-demo-col">
      <HxMenu :menu="menu" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { HxMenu } from '@hx/ui'
import type { MenuItem } from '@hx/ui'

const menu: MenuItem[] = [
  { title: '首页', path: '/home', icon: { name: 'mdi:home', type: 'iconify' } },
  { title: 'Element Plus 文档', url: 'https://element-plus.org', icon: { name: 'mdi:book-open-variant', type: 'iconify' } },
  { title: 'Vue 官网', url: 'https://vuejs.org', icon: { name: 'mdi:vuejs', type: 'iconify' } },
  { title: 'GitHub', url: 'https://github.com', icon: { name: 'mdi:github', type: 'iconify' } },
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
