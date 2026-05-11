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
  gender: "",
  ethnicity: "",
  address: "",
})

const fields: FormField[] = [
  {
    prop: "gender",
    label: "性别",
    type: "radio",
    remote: {
      url: "/api/options/gender",
      labelKey: "label",
      valueKey: "value",
    },
  },
  {
    prop: "ethnicity",
    label: "民族",
    type: "select",
    placeholder: "请选择民族",
    filterable: true,
    remote: {
      url: "/api/options/ethnicity",
      labelKey: "label",
      valueKey: "value",
    },
  },
  {
    prop: "address",
    label: "湖北省市区",
    type: "cascader",
    placeholder: "请选择省市区",
    filterable: true,
    clearable: true,
    remote: {
      url: "/api/options/cascader",
      labelKey: "label",
      valueKey: "value",
      childrenKey: "children",
    },
  },
]
</script>
