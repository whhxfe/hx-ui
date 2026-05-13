<template>
  <div class="demo-row">
    <hx-button disabled>Disabled</hx-button>
    <hx-button :loading="loading" @click="loading = true">Loading</hx-button>
  </div>
  <div class="demo-row">
    <hx-button size="large">Large</hx-button>
    <hx-button>Default</hx-button>
    <hx-button size="small">Small</hx-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)
</script>

<style scoped>
.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
}

.demo-row:last-child {
  margin-bottom: 0;
}
</style>
