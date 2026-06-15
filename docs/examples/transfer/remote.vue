<template>
  <div class="demo-grid">
    <div class="demo-item">
      <p class="demo-label">静态数据（单选）</p>
      <hx-transfer
        v-model="value1"
        :options="staticOptions"
        config-text="人员"
        title="选择人员"
        height="320px"
      />
      <p class="demo-value">值: {{ value1 }}</p>
    </div>

    <div class="demo-item">
      <p class="demo-label">静态数据（多选）</p>
      <hx-transfer
        v-model="value2"
        :options="staticOptions"
        config-text="人员"
        title="选择人员"
        multiple
        height="320px"
      />
      <p class="demo-value">值: {{ value2 }}</p>
    </div>

    <div class="demo-item">
      <p class="demo-label">remote（单选）</p>
      <hx-transfer
        v-model="value3"
        :remote="remoteConfig"
        config-text="人员"
        title="选择人员"
        height="320px"
      />
      <p class="demo-value">值: {{ value3 }}</p>
    </div>

    <div class="demo-item">
      <p class="demo-label">remote 分组（多选）</p>
      <hx-transfer
        v-model="value4"
        :remote="groupRemoteConfig"
        config-text="人员"
        title="选择人员"
        multiple
        height="320px"
      />
      <p class="demo-value">值: {{ value4 }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { HxTransfer } from "@whhx/ui"
import type { TransferOption, TransferRemoteConfig } from "@whhx/ui"

const value1 = ref("")
const value2 = ref("")
const value3 = ref("")
const value4 = ref("")

const staticOptions: TransferOption[] = [
  { label: "张三", value: "1" },
  { label: "李四", value: "2" },
  { label: "王五", value: "3" },
]

const remoteConfig: TransferRemoteConfig = {
  url: "/api/options/select",
}

const groupRemoteConfig: TransferRemoteConfig = {
  url: "/api/options/select-group",
}
</script>
