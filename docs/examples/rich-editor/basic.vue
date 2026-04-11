<template>
  <div class="demo-wrapper">
    <div class="demo-item">
      <p class="demo-label">基础富文本编辑器</p>
      <HxRichEditor v-model="content1" />
      <p class="demo-value">HTML 内容长度: {{ content1.length }} 字符</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { HxRichEditor } from "@hx/ui"

const content1 = ref("<p>欢迎使用富文本编辑器，支持<strong>加粗</strong>、<em>斜体</em>、链接、图片上传等功能。</p>")
</script>
