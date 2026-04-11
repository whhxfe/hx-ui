<template>
  <div class="demo-grid">
    <!-- 多选 - 默认 emit 逗号拼接字符串 -->
    <div class="demo-item">
      <p class="demo-label">多选（modelValueType="string"，默认）</p>
      <hx-transfer
        v-model="value1"
        :options="staticOptions"
        config-text="人员"
        title="选择人员"
        multiple
        height="320px"
      />
      <p class="demo-value">
        typeof: {{ typeof value1 }}，JSON: {{ JSON.stringify(value1) }}
      </p>
      <p class="demo-hint">直接 <code v-pre>{{ value }}</code> 与数组的 toString 相同，易混淆；用 JSON 可看出是字符串。</p>
    </div>

    <!-- 多选 - emit 数组 -->
    <div class="demo-item">
      <p class="demo-label">多选（modelValueType="array"）</p>
      <hx-transfer
        v-model="value2"
        :options="staticOptions"
        config-text="人员"
        title="选择人员"
        multiple
        model-value-type="array"
        height="320px"
      />
      <p class="demo-value">
        Array.isArray: {{ Array.isArray(value2) }}，JSON: {{ JSON.stringify(value2) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { HxTransfer } from "@hx/ui"
import type { TransferOption } from "@hx/ui"

const value1 = ref("")
const value2 = ref<string[]>([])

const staticOptions: TransferOption[] = [
  { label: "张三", value: "1" },
  { label: "李四", value: "2" },
  { label: "王五", value: "3" },
  { label: "赵六", value: "4" },
]
</script>

<style scoped>
.demo-hint {
  margin-top: 6px;
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
}
.demo-hint code {
  padding: 0 4px;
  background: #f4f4f5;
  border-radius: 3px;
  font-size: 12px;
}
</style>
