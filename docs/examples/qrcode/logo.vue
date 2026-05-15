<template>
  <div class="qrcode-logo-demo">
    <hx-qr-code
      :value="qrValue"
      :size="200"
      :logo="{
        url: 'https://vitejs.cn/logo.svg',
        width: 40,
        height: 40,
      }"
      error-correction-level="M"
    />
  </div>
</template>

<script setup lang="ts">
import { HxQrCode } from "@hx/ui"

const qrValue = 'https://hxui.example.com'
</script>

<style scoped>
.qrcode-logo-demo {
  display: flex;
  justify-content: center;
}
</style>
