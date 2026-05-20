<script setup lang="ts">
import { ref } from 'vue'

const value = ref()
</script>

<template>
  <div class="demo-row">
    <hx-select
      v-model="value"
      :remote="{
        url: '/options/select',
        labelKey: 'label',
        valueKey: 'value'
      }"
      placeholder="请选择文章（会自动拼接 baseUrl + prefix）"
      filterable
      clearable
      style="width: 400px"
    />
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
}
</style>
