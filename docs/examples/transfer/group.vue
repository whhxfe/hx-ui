<template>
  <div class="demo-grid">
    <!-- 分组数据 + 可折叠 -->
    <div class="demo-item">
      <p class="demo-label">分组数据（可折叠分组）</p>
      <hx-transfer
        v-model="value"
        :options="groupOptions"
        config-text="人员"
        title="选择人员"
        multiple
        height="360px"
      />
      <p class="demo-value">值: {{ value }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { HxTransfer } from "@hx/ui"
import type { TransferGroup } from "@hx/ui"

const value = ref("1,3")

const groupOptions: TransferGroup[] = [
  {
    label: "研发部",
    options: [
      { label: "张三", value: "1" },
      { label: "李四", value: "2" },
      { label: "王五", value: "3" },
    ],
  },
  {
    label: "产品部",
    options: [
      { label: "赵六", value: "4" },
      { label: "钱七", value: "5" },
    ],
  },
  {
    label: "运营部",
    options: [
      { label: "孙八", value: "6" },
      { label: "周九", value: "7" },
      { label: "吴十", value: "8" },
    ],
  },
]
</script>