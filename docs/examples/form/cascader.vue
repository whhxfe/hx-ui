<template>
  <hx-form
    v-model="formData"
    :fields="fields"
    :cols="2"
  />
  <hx-content-text :data="formData" :json-default-expanded="true" />
</template>

<script setup lang="ts">
import { ref } from "vue"
import { HxForm as Form, HxContentText } from "@hx/ui"
import type { FormField } from "@hx/ui"

const formData = ref({
  cascader: "",
})

const fields: FormField[] = [
  { prop: "cascader", label: "城市选择", type: "cascader", placeholder: "请选择", filterable: true, options: [
    {
      label: "北京",
      value: "beijing",
      children: [
        { label: "朝阳区", value: "chaoyang" },
        { label: "海淀区", value: "haidian" },
      ]
    },
    {
      label: "上海",
      value: "shanghai",
      children: [
        { label: "浦东新区", value: "pudong" },
        { label: "徐汇区", value: "xuhui" },
      ]
    },
  ]},
]
</script>
