<template>
  <div class="demo-grid">
    <div class="demo-item">
      <p class="demo-label">基础 options</p>
      <HxRadio
        v-model="value1"
        :options="staticOptions"
      />
      <p class="demo-value">值: {{ value1 }}</p>
    </div>

    <div class="demo-item">
      <p class="demo-label">按钮样式</p>
      <HxRadio
        v-model="value2"
        :options="staticOptions"
        variant="radio-btn"
      />
      <p class="demo-value">值: {{ value2 }}</p>
    </div>

    <div class="demo-item">
      <p class="demo-label">禁用状态</p>
      <HxRadio
        v-model="value3"
        :options="staticOptions"
        disabled
      />
      <p class="demo-value">值: {{ value3 }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { HxRadio } from "@hx/ui"
import type { OptionItem } from "@hx/ui"

const value1 = ref("1")
const value2 = ref("1")
const value3 = ref("2")

const staticOptions: OptionItem[] = [
  { label: "选项一", value: "1" },
  { label: "选项二", value: "2", disabled: true },
  { label: "选项三", value: "3" },
]
</script>
