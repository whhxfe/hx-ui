<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const isCollapse = ref(false)

const menuItems = [
  {
    index: '/components/file-preview',
    title: '文件预览',
    icon: 'ep:folder-opened',
  },
  {
    index: '/components/icon',
    title: '图标 Icon',
    icon: 'ep:grid',
  },
  {
    index: '/components/button',
    title: '按钮 Button',
    icon: 'ep-document',
  },
  {
    index: '/components/table',
    title: '表格 Table',
    icon: 'ep:list',
  },
  {
    index: '/components/label-text',
    title: '标签文本',
    icon: 'ep:document-copy',
  },
  {
    index: '/components/form',
    title: '动态表单 Form',
    icon: 'ep:edit',
  },
]

const activeMenu = ref(route.path)

function handleSelect(index: string) {
  router.push(index)
}
</script>

<template>
  <div class="app-layout">
    <!-- 左侧导航 -->
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

    <!-- 右侧主内容 -->
    <div class="main-wrapper">
      <!-- 顶部栏 -->
      <header class="topbar">
        <hx-icon
          type="iconify"
          name="ep:fold"
          size="20px"
          class="collapse-btn"
          @click="isCollapse = !isCollapse"
        />
        <span class="page-title">{{ route.meta?.title || '组件示例' }}</span>
      </header>

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
.app-layout {
  display: flex;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

/* 侧边栏 */
.sidebar {
  width: 220px;
  background: #fff;
  border-right: 1px solid #e8e8e8;
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
  border-bottom: 1px solid #f0f0f0;
  font-size: 20px;
  font-weight: 700;
  color: #1890ff;
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

/* 主内容区 */
.main-wrapper {
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #f5f7fa;
}

.topbar {
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 12px;
  flex-shrink: 0;
}

.collapse-btn {
  cursor: pointer;
  color: #666;
  transition: color 0.2s;
}

.collapse-btn:hover {
  color: #1890ff;
}

.page-title {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.main-content {
  flex: 1;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 24px;
}

/* 路由切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
