<template>
  <div class="demo-grid">
    <!-- 静态 options（无 remote） -->
    <div class="demo-item">
      <p class="demo-label">静态 options（无 remote）</p>
      <hx-transfer
        v-model="value1"
        :options="staticOptions"
        config-text="人员"
        title="选择人员"
        multiple
        height="320px"
      />
      <p class="demo-value">值: {{ value1 }}</p>
    </div>

    <!-- 远程数据（单选） -->
    <div class="demo-item">
      <p class="demo-label">远程数据（单选）</p>
      <hx-transfer
        v-model="value2"
        :remote="remoteConfig"
        config-text="人员"
        title="选择人员"
        height="320px"
      />
      <p class="demo-value">值: {{ value2 }}</p>
    </div>

    <!-- 远程数据（多选）默认 string -->
    <div class="demo-item">
      <p class="demo-label">远程数据分组（多选 string）</p>
      <hx-transfer
        v-model="value3"
        :remote="groupRemoteConfig"
        config-text="人员"
        title="选择人员"
        multiple
        height="320px"
      />
      <p class="demo-value">值: {{ value3 }}</p>
    </div>

    <!-- 远程数据（多选）array -->
    <div class="demo-item">
      <p class="demo-label">远程数据分组（多选 array）</p>
      <hx-transfer
        v-model="value5"
        :remote="groupRemoteConfig"
        config-text="人员"
        title="选择人员"
        multiple
        model-value-type="array"
        height="320px"
      />
      <p class="demo-value">值: {{ value5 }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { HxTransfer } from "@hx/ui"
import type { TransferOption, TransferRemoteConfig } from "@hx/ui"

const value1 = ref("")
const value2 = ref("")
const value3 = ref("")
const value5 = ref<string[]>([])

const staticOptions: TransferOption[] = [
  { label: "张三", value: "1" },
  { label: "李四", value: "2" },
]

/** 与 group.vue 一致：分组 label + options，子项 label + value（默认字段名即可） */
const remoteConfig: TransferRemoteConfig = {
  url: "/api/options/select",
}

const groupRemoteConfig: TransferRemoteConfig = {
  url: "/api/options/select-group",
}
</script>