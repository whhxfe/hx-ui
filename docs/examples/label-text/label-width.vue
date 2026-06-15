<template>
  <div class="space-y-4">
    <hx-label-text label="固定100px" text="固定100像素宽度" :label-width="100" />
    <hx-label-text label="固定120px文字" text="固定120像素宽度示例" :label-width="120" label-align="center" />
    <hx-label-text label="百分比" text="使用50%宽度" label-width="50%" />
  </div>
</template>

<script setup lang="ts">
import { HxLabelText as LabelText } from "@whhx/ui"
</script>