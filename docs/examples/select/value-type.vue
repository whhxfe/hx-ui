<template>
  <div class="demo-grid">
    <!-- 多选 - 默认 emit 逗号拼接字符串 -->
    <div class="demo-item">
      <p class="demo-label">多选（modelValueType="string"，默认）</p>
      <HxSelect
        v-model="value1"
        :options="staticOptions"
        placeholder="请选择"
        multiple
      />
      <p class="demo-value">
        typeof: {{ typeof value1 }}，JSON: {{ JSON.stringify(value1) }}
      </p>
      <p class="demo-hint">直接 <code v-pre>{{ value }}</code> 与数组的 toString 相同，易混淆；用 JSON 可看出是字符串。</p>
    </div>

    <!-- 多选 - emit 数组 -->
    <div class="demo-item">
      <p class="demo-label">多选（modelValueType="array"）</p>
      <HxSelect
        v-model="value2"
        :options="staticOptions"
        placeholder="请选择"
        multiple
        model-value-type="array"
      />
      <p class="demo-value">
        Array.isArray: {{ Array.isArray(value2) }}，JSON: {{ JSON.stringify(value2) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { HxSelect } from "@whhx/ui"
import type { OptionItem } from "@whhx/ui"

const value1 = ref("")
const value2 = ref<string[]>([])

const staticOptions: OptionItem[] = [
  { label: "选项一", value: "1" },
  { label: "选项二", value: "2" },
  { label: "选项三", value: "3" },
  { label: "选项四", value: "4" },
]
</script>

<style scoped>
.demo-hint {
  margin-top: 6px;
  font-size: 12px;
  color: var(--el-text-color-placeholder);
  line-height: 1.5;
}
.demo-hint code {
  padding: 0 4px;
  background: var(--el-fill-color-light);
  border-radius: 3px;
  font-size: 12px;
}
</style>
