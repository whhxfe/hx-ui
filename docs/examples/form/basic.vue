<template>
  <hx-form
    v-model="formData"
    :fields="fields"
    :cols="3"
  />
  <hx-content-text :data="formData" :json-default-expanded="true" />
</template>

<script setup lang="ts">
import { ref } from "vue"
import { HxForm as Form, HxContentText } from "@hx/ui"
import type { FormField } from "@hx/ui"

const formData = ref({
  name: "",
  phone: "",
  region: "",
})

const fields: FormField[] = [
  { prop: "name", label: "姓名", type: "input", placeholder: "请输入姓名" },
  { prop: "phone", label: "手机号", type: "input", placeholder: "请输入手机号" },
  { prop: "region", label: "所在地区", type: "select", placeholder: "请选择地区", options: [
    { label: "北京", value: "beijing" },
    { label: "上海", value: "shanghai" },
    { label: "广州", value: "guangzhou" },
  ]},
]
</script>
