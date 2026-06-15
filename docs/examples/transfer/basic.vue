<template>
  <div class="demo-grid">
    <div class="demo-item">
      <p class="demo-label">单选</p>
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
      <p class="demo-label">多选</p>
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
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { HxTransfer } from "@whhx/ui"
import type { TransferOption } from "@whhx/ui"

const value1 = ref("")
const value2 = ref("")

const staticOptions: TransferOption[] = [
  { label: "张三", value: "1" },
  { label: "李四", value: "2" },
  { label: "王五", value: "3" },
  { label: "赵六", value: "4", disabled: true },
  { label: "钱七", value: "5" },
  { label: "孙八", value: "6" },
]
</script>
