<template>
  <div class="demo-wrapper">
    <div class="demo-item">
      <p class="demo-label">只读模式（用于预览）</p>
      <HxRichEditor v-model="content2" read-only />
      <p class="demo-value">HTML 内容长度: {{ content2.length }} 字符</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { HxRichEditor } from "@whhx/ui"

const content2 = ref("<p>这是一段<strong>只读</strong>内容，用户无法编辑，适合用于文章预览、公告展示等场景。</p>")
</script>
