<template>
  <div class="demo-grid">
    <div class="demo-item">
      <p class="demo-label">默认快捷时间（近 N 天）</p>
      <HxQuickDateButton v-model="value1" />
      <p class="demo-value">datetype: {{ value1 || '(未选中)' }}</p>
    </div>

    <div class="demo-item">
      <p class="demo-label">带左侧标签</p>
      <HxQuickDateButton v-model="value2" label="时间范围" />
      <p class="demo-value">datetype: {{ value2 || '(未选中)' }}</p>
    </div>

    <div class="demo-item">
      <p class="demo-label">隐藏自定义入口</p>
      <HxQuickDateButton v-model="value3" :custom="false" />
      <p class="demo-value">datetype: {{ value3 || '(未选中)' }}</p>
    </div>

    <div class="demo-item">
      <p class="demo-label">监听 change 获取 [startTime, endTime]</p>
      <HxQuickDateButton v-model="value4" @change="onChange" />
      <p class="demo-value">datetype: {{ value4 || '(未选中)' }}</p>
      <p v-if="lastRange.length" class="demo-value">
        选中范围: {{ lastRange[0] }} ~ {{ lastRange[1] }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { HxQuickDateButton } from "@hx/ui"

const value1 = ref("7")
const value2 = ref("")
const value3 = ref("3")
const value4 = ref("")

const lastRange = ref<string[]>([])

function onChange(range: string[]) {
  lastRange.value = range
}
</script>
