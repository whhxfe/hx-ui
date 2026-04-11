<template>
  <div class="demo-grid">
    <div class="demo-item">
      <p class="demo-label">基础 options</p>
      <HxCascader
        v-model="value1"
        :options="staticOptions"
        placeholder="请选择"
      />
      <p class="demo-value">值: {{ JSON.stringify(value1) }}</p>
    </div>

    <div class="demo-item">
      <p class="demo-label">可搜索</p>
      <HxCascader
        v-model="value2"
        :options="staticOptions"
        :show-all-levels="false"
        :emitPath="false"
        placeholder="请选择"
        filterable
      />
      <p class="demo-value">值: {{ JSON.stringify(value2) }}</p>
    </div>

    <div class="demo-item">
      <p class="demo-label">禁用</p>
      <HxCascader
        v-model="value1"
        :options="staticOptions"
        
        disabled
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { HxCascader } from "@hx/ui"

const value1 = ref<string[]>([])
/** emitPath=false 时仅为叶子 value（string | number） */
const value2 = ref<string | number | string[]>([])

const staticOptions = [
  {
    label: "华东",
    value: "east",
    children: [
      { label: "上海", value: "shanghai" },
      { label: "杭州", value: "hangzhou" },
      {
        label: "南京",
        value: "nanjing",
        children: [
          { label: "玄武区", value: "xuanwu" },
          { label: "鼓楼区", value: "gulou" },
        ],
      },
    ],
  },
  {
    label: "华北",
    value: "north",
    children: [
      { label: "北京", value: "beijing" },
      { label: "天津", value: "tianjin" },
    ],
  },
]
</script>