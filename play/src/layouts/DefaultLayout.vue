<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { componentRoutes } from '@/config/routes'
import { ThemeToggle } from '@hx/ui'

const route = useRoute()
const isCollapse = ref(false)

const menuItems = Object.entries(componentRoutes).map(([name, meta]) => ({
  index: `/components/${name}`,
  title: meta.title,
  icon: meta.icon,
}))

const activeMenu = ref(route.path)
</script>

<template>
  <div class="app-layout">
    <aside class="sidebar" :class="{ collapsed: isCollapse }">
      <div class="logo">
        <span v-if="!isCollapse" class="logo-text">HxUI</span>
        <span v-else class="logo-text">H</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :collapse-transition="false"
        router
        class="sidebar-menu"
      >
        <el-menu-item
          v-for="item in menuItems"
          :key="item.index"
          :index="item.index"
        >
          <hx-icon type="iconify" :name="item.icon" size="18px" />
          <template #title>
            <span>{{ item.title }}</span>
          </template>
        </el-menu-item>
      </el-menu>
    </aside>

    <div class="main-wrapper">
      <header class="topbar">
        <hx-icon
          type="iconify"
          name="ep:fold"
          size="20px"
          class="collapse-btn"
          @click="isCollapse = !isCollapse"
        />
        <span class="page-title">{{ route.meta?.title || '组件示例' }}</span>
        <div class="topbar-actions">
          <ThemeToggle />
        </div>
      </header>

      <main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.sidebar {
  width: 220px;
  background: var(--hx-bg-color);
  border-right: 1px solid var(--hx-border-color-base);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  flex-shrink: 0;
  min-height: 0;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 64px;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--hx-border-color-lighter);
  font-size: 20px;
  font-weight: 700;
  color: var(--hx-primary-color);
  letter-spacing: 2px;
  flex-shrink: 0;
}

.sidebar-menu {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  border-right: none;
}

.sidebar-menu:not(.el-menu--collapse) {
  width: 220px;
}

.main-wrapper {
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--hx-bg-color-page);
}

.topbar {
  height: 60px;
  background: var(--hx-bg-color);
  border-bottom: 1px solid var(--hx-border-color-base);
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 12px;
  flex-shrink: 0;
}

.topbar-actions {
  margin-left: auto;
}

.collapse-btn {
  cursor: pointer;
  color: var(--hx-text-color-regular);
  transition: color 0.2s;
}

.collapse-btn:hover {
  color: var(--hx-primary-color);
}

.page-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--hx-text-color-primary);
}

.main-content {
  flex: 1;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 24px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
