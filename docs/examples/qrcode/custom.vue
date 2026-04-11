<template>
  <div>
    <hx-qr-code
      value="https://hxui.example.com"
      renderMode="canvas"
      :size="200"
      :show-download="true"
      download-file-name="custom-qrcode"
    />
  </div>
</template>

<script setup lang="ts">
import { HxQrCode } from "@hx/ui"
</script>
