<template>
  <div>
    <h4>单色 mono（默认）</h4>
    <p class="desc">默认 mono 模式，color 属性生效，图标使用 currentColor 着色。</p>
    <div class="icon-list">
      <hx-icon name="home" size="24px" color="#ff0000" />
      <hx-icon name="user" size="24px" color="#00ff00" />
      <hx-icon name="settings" size="24px" color="#0000ff" />
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