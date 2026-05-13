<template>
  <div class="hx-page-layout">
    <div class="hx-page-layout__inner">
      <div class="hx-page-layout__content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'PageLayout',
})
</script>

<style scoped>
/*
 * 页面布局 — 三层嵌套阴影结构
 *
 * .hx-page-layout              ┐ 背景层（页面底色 #f5f7fa）
 *   .hx-page-layout__inner     ┤ 外层卡片，复合阴影浮于背景之上
 *     .hx-page-layout__content ┘ 内层内容区，底部边框线形成分隔
 *
 * 亮色主题下：
 *   --hx-bg-color: #fff, --hx-bg-color-page: #f5f7fa
 *   --hx-border-color-light: #e4e7ed (比 lighter 深一级，有可见对比)
 *   --hx-shadow-color: rgba(0,0,0,0.1) (比 shadow-light 深一倍)
 */

.hx-page-layout {
  min-height: 100%;
  background: var(--hx-bg-color-page);
  padding: 24px;
}

.hx-page-layout__inner {
  max-width: 920px;
  margin: 0 auto;
  background: var(--hx-bg-color);
  border-radius: 8px;
  border: 1px solid var(--hx-border-color-light);
  box-shadow: 0 1px 3px var(--hx-shadow-color),
              0 6px 16px var(--hx-shadow-color-light);
  overflow: hidden;
}

.hx-page-layout__content {
  padding: 32px 24px;
  background: var(--hx-bg-color);
  min-height: calc(100vh - 64px - 48px);  /* 减去顶栏高度 + 外层 padding */
  border-radius: 8px;
}
</style>