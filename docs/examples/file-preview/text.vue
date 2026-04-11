<template>
  <div class="demo-row">
    <hx-file-preview
      url="http://localhost:4300/files/text/sample.txt"
      preview-width="120px"
      preview-height="80px"
    />
  </div>
</template>

<script setup lang="ts">
import { HxFilePreview as FilePreview } from "@hx/ui"
</script>
