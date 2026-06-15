<template>
  <div class="space-y-4 w-64">
    <hx-label-text label="不限行数" text="这是一段较长的文本，不限制行数，可以完整显示所有内容" />
    <hx-label-text label="限制1行" text="这是一段较长的文本，超过1行会被截断显示省略号" :text-line="1" />
    <hx-label-text label="限制2行" text="这是一段较长的文本，超过2行会被截断显示省略号，这是一段较长的文本" :text-line="2" />
    <hx-label-text label="限制3行" text="这是一段较长的文本，超过3行会被截断显示省略号，这是一段较长的文本，超过3行会被截断显示省略号，这是一段较长的文本" :text-line="3" align="start" />
  </div>
</template>

<script setup lang="ts">
import { HxLabelText as LabelText } from "@whhx/ui"
</script>
