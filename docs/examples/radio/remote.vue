<template>
  <div class="demo-grid">
    <div class="demo-item">
      <p class="demo-label">静态 options</p>
      <HxRadio
        v-model="value1"
        :options="staticOptions"
      />
      <p class="demo-value">值: {{ value1 }}</p>
    </div>

    <div class="demo-item">
      <p class="demo-label">remote 请求</p>
      <HxRadio
        v-model="value2"
        :remote="remoteConfig"
      />
      <p class="demo-value">值: {{ value2 }}</p>
    </div>

    <div class="demo-item">
      <p class="demo-label">remote 按钮样式</p>
      <HxRadio
        v-model="value3"
        :remote="remoteConfig"
        variant="radio-btn"
      />
      <p class="demo-value">值: {{ value3 }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { HxRadio } from "@hx/ui"
import type { OptionItem, RemoteConfig } from "@hx/ui"

const value1 = ref("1")
const value2 = ref("")
const value3 = ref("")

const staticOptions: OptionItem[] = [
  { label: "选项一", value: "1" },
  { label: "选项二", value: "2" },
  { label: "选项三", value: "3" },
]

const remoteConfig: RemoteConfig = {
  url: "http://localhost:4300/api/options/select",
  labelKey: "label",
  valueKey: "value",
}
</script>
