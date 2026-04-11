<template>
  <div class="demo-row">
    jpg:
    <hx-file-preview
      url="http://localhost:4300/files/images/1.jpg"
      preview-width="120px"
      preview-height="80px"
    />
    webp:
    <hx-file-preview
      url="http://localhost:4300/files/images/1.webp"
      preview-width="120px"
      preview-height="80px"
    />
    
  </div>
</template>

<script setup lang="ts">
import { HxFilePreview as FilePreview } from "@hx/ui"
</script>
