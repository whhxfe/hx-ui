<template>
  <div>
    <p class="desc">
      <strong>inline=false（默认）</strong>：图标以 inline-block 渲染，占用完整行高空间
    </p>
    <p style="line-height: 1.5">
      这是一段文本
      <hx-icon type="iconify" name="ep:star" size="24px" />
      图标在行内但高度撑开
    </p>

    <p class="desc" style="margin-top: 20px">
      <strong>inline=true</strong>：图标以内联元素渲染，随文本基线对齐
    </p>
    <p style="line-height: 1.5">
      这是一段文本
      <hx-icon type="iconify" name="ep:star" size="24px" inline />
      图标紧贴文字基线
    </p>
  </div>
</template>

<script setup lang="ts">
import { HxIcon as Icon } from "@whhx/ui"
</script>

<style scoped>
.desc {
  margin: 0 0 8px;
  font-size: 13px;
  color: var(--el-text-color-primary);
}
</style>