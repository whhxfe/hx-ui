<template>
  <div class="demo-grid">
    <div class="demo-item">
      <p class="demo-label">静态 options（无 remote）</p>
      <HxCascader
        v-model="value1"
        :options="staticOptions"
        placeholder="请选择"
      />
      <p class="demo-value">值: {{ JSON.stringify(value1) }}</p>
    </div>

    <div class="demo-item">
      <p class="demo-label">remote 请求（可搜索）</p>
      <HxCascader
        v-model="value2"
        :remote="remoteConfig"
        placeholder="请选择"
        filterable
      />
      <p class="demo-value">值: {{ JSON.stringify(value2) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { HxCascader } from "@hx/ui"
import type { RemoteConfig } from "@hx/ui"

const value1 = ref<string[]>([])
const value2 = ref<string[]>([])

const staticOptions = [
  {
    label: "华东",
    value: "east",
    children: [
      { label: "上海", value: "shanghai" },
      { label: "杭州", value: "hangzhou" },
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

const remoteConfig: RemoteConfig = {
  url: "/api/options/cascader",
}
</script>