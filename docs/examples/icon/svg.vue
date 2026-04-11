<template>
  <div>
    <h4>单色 mono图标</h4>
    <p class="desc">设置 group="mono"时，color 属性会被应用，图标使用 currentColor 着色。</p>
    <div class="icon-list">
      <hx-icon name="home" size="24px" color="#ff0000" />
      <hx-icon name="user" size="24px" color="#00ff00" />
      <hx-icon name="settings" size="24px" color="#0000ff" />
    </div>

    <h4>多色 multi</h4>
    <p class="desc">设置 group="multi"时，SVG 图自带颜色，不受 color 属性影响。</p>
    <div class="icon-list">
      <hx-icon type="svg" group="multi" name="beef" size="32px" />
      <hx-icon type="svg" group="multi" name="coffee" size="32px" />
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