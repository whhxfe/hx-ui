<template>
  <div class="demo-grid">
    <div class="demo-item">
      <p class="demo-label">自定义快捷选项</p>
      <HxQuickDateButton v-model="value" :options="customOptions" />
      <p class="demo-value">datetype: {{ value || '(未选中)' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { HxQuickDateButton } from "@hx/ui"
import type { ShortcutItem } from "@hx/ui"

const value = ref("")

const customOptions: ShortcutItem[] = [
  { text: "今日", days: 0 },
  { text: "近7天", days: 7 },
  { text: "近30天", days: 30 },
  { text: "近90天", days: 90 },
]
</script>
