<template>
  <div>
    <h4>单色 mono（默认）</h4>
    <p class="desc">默认 mono 模式，color 属性生效，图标使用 currentColor 着色。</p>
    <div class="icon-list">
      <hx-icon name="home" size="24px" color="#ff0000" />
      <hx-icon name="user" size="24px" color="#00ff00" />
      <hx-icon name="settings" size="24px" color="#0000ff" />
    </div>

    <h4>翻转 flip</h4>
    <p class="desc">使用 flip 属性对 SVG 图标进行水平、垂直或双向翻转。</p>
    <div class="icon-list">
      <hx-icon type="svg" name="right" size="24px" />
      <hx-icon type="svg" name="right" size="24px" flip="horizontal" />
      <hx-icon type="svg" name="right" size="24px" flip="vertical" />
      <hx-icon type="svg" name="right" size="24px" flip="both" />
    </div>

    <h4>旋转 rotate</h4>
    <p class="desc">使用 rotate 属性旋转 SVG 图标，支持 0~360 度。</p>
    <div class="icon-list">
      <hx-icon type="svg" name="right" size="24px" />
      <hx-icon type="svg" name="right" size="24px" :rotate="45" />
      <hx-icon type="svg" name="right" size="24px" :rotate="90" />
      <hx-icon type="svg" name="right" size="24px" :rotate="180" />
      <hx-icon type="svg" name="right" size="24px" :rotate="270" />
    </div>

    <h4>多色 multi</h4>
    <p class="desc">设置 mode="multi"，保留 SVG 原始填充色，color 属性失效。</p>
    <div class="icon-list">
      <hx-icon type="svg" mode="multi" name="beef" size="32px" />
      <hx-icon type="svg" mode="multi" name="coffee" size="32px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { HxIcon as Icon } from "@hx/ui"
</script>

<style scoped>
h4 {
  margin: 16px 0 8px;
  font-size: 14px;
  color: #333;
}

.desc {
  margin: 0 0 12px;
  font-size: 12px;
  color: #666;
}

.icon-list {
  display: flex;
  gap: 16px;
  align-items: center;
}
</style>