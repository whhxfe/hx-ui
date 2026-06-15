<template>
  <hx-form
    v-model="formData"
    :fields="fields"
    :cols="2"
  />
  <hx-json-view :data="formData" />
</template>

<script setup lang="ts">
import { ref } from "vue"
import { HxForm as Form, HxJsonView } from "@whhx/ui"
import type { FormField } from "@whhx/ui"

const formData = ref({
  date: "",
  dateRange: [],
  datetime: "",
  datetimerange: [],
  time: "",
  timeRange: [],
})

const fields: FormField[] = [
  { prop: "date", label: "日期", type: "date", placeholder: "请选择日期" },
  { prop: "dateRange", label: "日期范围", type: "daterange", placeholder: "请选择日期范围" },
  { prop: "datetime", label: "日期时间", type: "datetime", placeholder: "请选择日期时间" },
  { prop: "datetimerange", label: "日期时间范围", type: "datetimerange", placeholder: "请选择范围" },
  { prop: "time", label: "时间", type: "time", placeholder: "请选择时间" },
  { prop: "timeRange", label: "时间范围", type: "timerange", placeholder: "请选择时间范围" },
]
</script>
