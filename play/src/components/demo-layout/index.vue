<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { componentRoutes } from '@/views/demos/demo-registry'
import { ThemeToggle } from '@whhx/ui'

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
    <!-- 顶栏：全宽，位于最顶部 -->
    <header class="app-header">
      <div class="header-left">
        <div class="logo-area" :class="{ collapsed: isCollapse }">
          <div class="logo">
            <span class="logo-text">HxUI</span>
          </div>
        </div>
        <span class="page-title">{{ route.meta?.title || '组件示例' }}</span>
      </div>
      <div class="header-right">
        <ThemeToggle />
      </div>
    </header>

    <!-- 主体区域：侧边栏 + 内容区 -->
    <div class="app-body">
      <!-- 侧边栏 -->
      <aside class="sidebar" :class="{ collapsed: isCollapse }">
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
        <div class="sidebar-footer">
          <div class="sidebar-collapse-area">
            <hx-icon
              type="iconify"
              :name="isCollapse ? 'ep:expand' : 'ep:fold'"
              size="20px"
              class="collapse-btn"
              @click="isCollapse = !isCollapse"
            />
          </div>
        </div>
      </aside>

      <!-- 内容区 -->
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
/* ===================================
   第一层：整体容器（flex 列布局）
   =================================== */
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

/* ===================================
   第二层：顶栏（全宽，悬浮于内容上方）
   阴影：底部投影 + 底部边框，浮于 body 之上
   =================================== */
.app-header {
  height: 60px;
  background: var(--hx-bg-color);
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 12px;
  flex-shrink: 0;
  position: relative;
  z-index: 20;
  border-bottom: 1px solid var(--hx-border-color-light);
  box-shadow: 0 2px 4px var(--hx-shadow-color),
              0 4px 12px var(--hx-shadow-color-light);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 12px;
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

/* ===================================
   第三层：主体区域（flex 行布局）
   =================================== */
.app-body {
  flex: 1;
  min-height: 0;
  display: flex;
  overflow: hidden;
}

/* ===================================
   第四层：侧边栏
   阴影：右侧投影（复合深+浅），浮于内容区之上
   =================================== */
.sidebar {
  width: 220px;
  background: var(--hx-bg-color);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  flex-shrink: 0;
  min-height: 0;
  overflow: hidden;
  position: relative;
  z-index: 10;
  border-right: 1px solid var(--hx-border-color-light);
  box-shadow: 2px 0 4px var(--hx-shadow-color),
              2px 0 12px var(--hx-shadow-color-light);
}

.sidebar.collapsed {
  width: 64px;
}

.logo-area {
  width: 220px;
  flex-shrink: 0;
  transition: width 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -20px;
}

.logo-area.collapsed {
  width: 64px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  color: var(--hx-primary-color);
  letter-spacing: 2px;
  flex-shrink: 0;
}

.sidebar-footer {
  flex-shrink: 0;
  border-top: 1px solid var(--hx-border-color-light);
}

.sidebar-collapse-area {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
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

/* ===================================
   第五层：内容区
   内凹阴影（复合深+浅），体现嵌入感
   =================================== */
.main-content {
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 24px;
  background: var(--hx-bg-color-page);
  box-shadow: inset 0 1px 3px var(--hx-shadow-color),
              inset 0 4px 12px var(--hx-shadow-color-light);
}

/* ===================================
   过渡动画
   =================================== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
