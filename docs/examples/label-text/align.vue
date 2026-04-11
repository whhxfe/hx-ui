<template>
  <div class="space-y-4">
    <hx-label-text label="居中对齐" text="内容居中显示" align="center" />
    <hx-label-text label="左对齐" text="内容左对齐显示" align="start" />
    <hx-label-text label="右对齐" text="内容右对齐显示" align="end" />
    <hx-label-text label="标签右对齐" text="标签文字右对齐" :label-width="100" label-align="right" />
  </div>
</template>

<script setup lang="ts">
import { HxLabelText as LabelText } from "@hx/ui"
</script>