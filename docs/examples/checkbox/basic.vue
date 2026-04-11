<template>
  <div class="demo-grid">
    <div class="demo-item">
      <p class="demo-label">基础 options</p>
      <HxCheckbox
        v-model="value1"
        :options="staticOptions"
      />
      <p class="demo-value">值: {{ JSON.stringify(value1) }}</p>
    </div>

    <div class="demo-item">
      <p class="demo-label">禁用状态</p>
      <HxCheckbox
        v-model="value2"
        :options="staticOptions"
        disabled
      />
      <p class="demo-value">值: {{ JSON.stringify(value2) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { HxCheckbox } from "@hx/ui"
import type { OptionItem } from "@hx/ui"

const value1 = ref<string[]>(["sing", "code"])
const value2 = ref<string[]>(["sing"])

const staticOptions: OptionItem[] = [
  { label: "唱歌", value: "sing" },
  { label: "跳舞", value: "dance", disabled: true },
  { label: "编程", value: "code" },
  { label: "写作", value: "write" },
]
</script>
