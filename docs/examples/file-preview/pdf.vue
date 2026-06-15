<template>
  <div class="demo-row">
    pdf:
    <hx-file-preview
      url="/files/pdf/1.pdf"
      preview-width="120px"
      preview-height="80px"
    />
  </div>
</template>

<script setup lang="ts">
import { HxFilePreview as FilePreview } from "@whhx/ui"
</script>
