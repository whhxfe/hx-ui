<template>
  <hx-form
    v-model="formData"
    :fields="fields"
    :cols="4"
  />
  <hx-json-view :data="formData" />
</template>

<script setup lang="ts">
import { ref } from "vue"
import { HxForm as Form, HxJsonView } from "@whhx/ui"
import type { FormField } from "@whhx/ui"

const formData = ref({
  name: "",
  phone: "",
  region: "",
  status: "",
  type: "",
})

const fields: FormField[] = [
  { prop: "name", label: "姓名", type: "input", placeholder: "请输入姓名" },
  { prop: "phone", label: "手机号", type: "input", placeholder: "请输入手机号" },
  { prop: "region", label: "所在地区", type: "select", options: [
    { label: "北京", value: "beijing" },
    { label: "上海", value: "shanghai" },
    { label: "广州", value: "guangzhou" },
  ]},
  { prop: "status", label: "状态", type: "select", options: [
    { label: "启用", value: "1" },
    { label: "禁用", value: "0" },
  ]},
  { prop: "type", label: "类型", type: "input", placeholder: "请输入类型" },
]
</script>
