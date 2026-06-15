<template>
  <ClientOnly>
  <div class="demo-grid">
    <div class="demo-item">
      <p class="demo-label">静态 options</p>
      <HxCheckbox
        v-model="value1"
        :options="staticOptions"
      />
      <p class="demo-value">值: {{ JSON.stringify(value1) }}</p>
    </div>

    <div class="demo-item">
      <p class="demo-label">remote 请求</p>
      <HxCheckbox
        v-model="value2"
        :remote="remoteConfig"
      />
      <p class="demo-value">值: {{ JSON.stringify(value2) }}</p>
    </div>
  </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { HxCheckbox } from "@whhx/ui"
import type { OptionItem, RemoteConfig } from "@whhx/ui"

const value1 = ref<string[]>(["code"])
const value2 = ref<string[]>([])

const staticOptions: OptionItem[] = [
  { label: "唱歌", value: "sing" },
  { label: "跳舞", value: "dance" },
  { label: "编程", value: "code" },
]

const remoteConfig: RemoteConfig = {
  url: "/api/options/select",
  labelKey: "label",
  valueKey: "value",
}
</script>
