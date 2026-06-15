<template>
  <div class="demo-row">
    <HxLink disabled>禁用状态</HxLink>
    <HxLink @click="handleClick">点击触发事件</HxLink>
  </div>
  <p class="demo-log" v-if="eventLog">{{ eventLog }}</p>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { HxLink } from '@whhx/ui'

const eventLog = ref('')

const handleClick = (e: MouseEvent) => {
  eventLog.value = `click 事件触发于 (${e.clientX}, ${e.clientY})`
  setTimeout(() => { eventLog.value = '' }, 3000)
}
</script>

<style scoped>
.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}
.demo-log {
  margin: 8px 0 0;
  font-size: 12px;
  color: #409eff;
}
</style>