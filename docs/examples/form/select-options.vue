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
import { HxForm as Form, HxJsonView } from "@hx/ui"
import type { FormField } from "@hx/ui"

const formData = ref({
  singleSelect: "",
  multiSelect: [],
  radio: "",
  checkbox: [],
  switch: false,
})

const fields: FormField[] = [
  { prop: "singleSelect", label: "单选下拉", type: "select", placeholder: "请选择", options: [
    { label: "选项一", value: "1" },
    { label: "选项二", value: "2" },
    { label: "选项三", value: "3" },
  ]},
  { prop: "multiSelect", label: "多选下拉", type: "select", multiple: true, placeholder: "请选择", options: [
    { label: "选项一", value: "1" },
    { label: "选项二", value: "2" },
    { label: "选项三", value: "3" },
  ]},
  { prop: "radio", label: "单选按钮", type: "radio", options: [
    { label: "是", value: "yes" },
    { label: "否", value: "no" },
  ]},
  { prop: "checkbox", label: "复选框组", type: "checkbox", options: [
    { label: "唱歌", value: "sing" },
    { label: "跳舞", value: "dance" },
    { label: "编程", value: "code" },
  ]},
  { prop: "switch", label: "开关", type: "switch" },
]
</script>
