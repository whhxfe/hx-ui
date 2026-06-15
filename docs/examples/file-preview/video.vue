<template>
  <div class="demo-row">
    mp4:
    <hx-file-preview
      url="/files/videos/1.mp4"
      preview-width="240px"
      preview-height="160px"
    />
    flv:
    <hx-file-preview
      url="/files/videos/1.flv"
      preview-width="240px"
      preview-height="160px"
    />
  </div>
</template>

<script setup lang="ts">
import { HxFilePreview as FilePreview } from "@whhx/ui"
</script>
