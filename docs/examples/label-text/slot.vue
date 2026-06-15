<template>
  <div class="space-y-4">
    <hx-label-text label="富文本" text="使用插槽插入自定义内容">
      <span class="text-red-500">红色</span> <span class="text-blue-500">蓝色</span>文本
    </hx-label-text>
    <hx-label-text label="带图标" text="带图标的内容">
      <hx-icon type="iconify" name="ep:check" class="text-green-500 mr-1" />
      操作成功
    </hx-label-text>
    <hx-label-text label="HTML内容" text="支持HTML内容">
      <a href="#" class="text-blue-500 hover:underline">点击链接</a>
    </hx-label-text>
  </div>
</template>

<script setup lang="ts">
import { HxLabelText as LabelText } from "@whhx/ui"
</script>
