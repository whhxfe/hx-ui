<template>
  <div class="demo-grid">
    <div class="demo-item">
      <p class="demo-label">基础 options</p>
      <HxSelect
        v-model="value1"
        :options="staticOptions"
        placeholder="请选择"
      />
      <p class="demo-value">值: {{ value1 }}</p>
    </div>

    <div class="demo-item">
      <p class="demo-label">可搜索</p>
      <HxSelect
        v-model="value2"
        :options="staticOptions"
        placeholder="请选择"
        filterable
      />
      <p class="demo-value">值: {{ value2 }}</p>
    </div>

    <div class="demo-item">
      <p class="demo-label">多选</p>
      <HxSelect
        v-model="value3"
        :options="staticOptions"
        placeholder="请选择"
        multiple
      />
      <p class="demo-value">值: {{ JSON.stringify(value3) }}</p>
    </div>

    <div class="demo-item">
      <p class="demo-label">分组 options</p>
      <HxSelect
        v-model="value4"
        :options="groupOptions"
        placeholder="请选择"
        filterable
      />
      <p class="demo-value">值: {{ value4 }}</p>
    </div>

    <div class="demo-item">
      <p class="demo-label">禁用</p>
      <HxSelect
        v-model="value1"
        :options="staticOptions"
        disabled
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { HxSelect } from "@whhx/ui"
import type { OptionItem, GroupOptionItem } from "@whhx/ui"

const value1 = ref("")
const value2 = ref("")
const value3 = ref<string[]>([])
const value4 = ref("")

const staticOptions: OptionItem[] = [
  { label: "选项一", value: "1" },
  { label: "选项二", value: "2", disabled: true },
  { label: "选项三", value: "3" },
]

const groupOptions: GroupOptionItem[] = [
  {
    label: "分组 A",
    options: [
      { label: "苹果", value: "apple" },
      { label: "香蕉", value: "banana" },
    ],
  },
  {
    label: "分组 B",
    disabled: true,
    options: [
      { label: "葡萄", value: "grape" },
      { label: "橘子", value: "orange" },
    ],
  },
]
</script>
