<template>
  <div class="demo-row">
    <HxLink underline="always">始终显示</HxLink>
    <HxLink underline="hover">悬停显示</HxLink>
    <HxLink underline="never">从不显示</HxLink>
  </div>
</template>

<script setup lang="ts">
import { HxLink } from '@hx/ui'
</script>

<style scoped>
.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}
</style>