<template>
  <div class="demo-section">
    <p class="demo-title">单色模式（mono）</p>
    <p class="demo-desc">使用 currentColor 填充，可通过 color 属性设置颜色</p>
    <div class="demo-row">
      <svg-icon icon="home" />
      <svg-icon icon="user" />
      <svg-icon icon="settings" />
    </div>
    <div class="demo-row">
      <svg-icon icon="home" color="#1890ff" />
      <svg-icon icon="user" color="#52c41a" />
      <svg-icon icon="settings" color="#faad14" />
    </div>

    <p class="demo-title">多色模式（multi）</p>
    <p class="demo-desc">保留 SVG 原始填充色，color 属性失效</p>
    <div class="demo-row">
      <svg-icon icon="home" mode="multi" />
      <svg-icon icon="user" mode="multi" />
      <svg-icon icon="settings" mode="multi" />
    </div>

    <p class="demo-title">尺寸与颜色</p>
    <div class="demo-row">
      <svg-icon icon="home" :size="16" color="#1890ff" />
      <svg-icon icon="user" :size="24" color="#52c41a" />
      <svg-icon icon="settings" :size="32" color="#faad14" />
      <svg-icon icon="home" size="48px" color="#f5222d" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SvgIcon } from '@hx/ui'
</script>

<style scoped>
.demo-section {
  padding: 4px 0;
}
.demo-title {
  margin: 0 0 8px;
  font-size: 13px;
  color: #1a1a1a;
  font-weight: 500;
}
.demo-desc {
  margin: 0 0 12px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  margin-bottom: 20px;
}
</style>
