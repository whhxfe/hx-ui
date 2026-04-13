<template>
  <div class="demo-grid">
    <div class="demo-item">
      <p class="demo-label">静态 options（无 remote）</p>
      <HxSelect
        v-model="value1"
        :options="staticOptions"
        placeholder="请选择"
      />
      <p class="demo-value">值: {{ value1 }}</p>
    </div>

    <div class="demo-item">
      <p class="demo-label">remote 请求（可搜索）</p>
      <HxSelect
        v-model="value2"
        :remote="remoteConfig"
        placeholder="请选择"
        filterable
      />
      <p class="demo-value">值: {{ value2 }}</p>
    </div>

    <div class="demo-item">
      <p class="demo-label">remote 多选</p>
      <HxSelect
        v-model="value3"
        :remote="remoteConfig"
        placeholder="请选择"
        multiple
      />
      <p class="demo-value">值: {{ JSON.stringify(value3) }}</p>
    </div>

    <div class="demo-item">
      <p class="demo-label">remote 分组 多选</p>
      <HxSelect
        v-model="value4"
        :remote="groupRemoteConfig"
        placeholder="请选择"
        multiple
      />
      <p class="demo-value">值: {{ JSON.stringify(value3) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { HxSelect } from "@hx/ui"
import type { OptionItem, RemoteConfig } from "@hx/ui"

const value1 = ref("")
const value2 = ref("")
const value3 = ref<string[]>([])
  const value4 = ref<string[]>([])

const staticOptions: OptionItem[] = [
  { label: "选项一", value: "1" },
  { label: "选项二", value: "2" },
]

const remoteConfig: RemoteConfig = {
  url: "/api/options/select",
}

const groupRemoteConfig: RemoteConfig = {
  url: "/api/options/select-group",
}
</script>
