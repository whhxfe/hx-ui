<template>
  <Form
    v-model="formData"
    :fields="fields"
    :cols="2"
  />
</template>

<script setup lang="ts">
import { ref } from "vue"
import { HxForm as Form } from "@hx/ui"
import type { FormField } from "@hx/ui"

const formData = ref({
  groupOptions: "",
  flatOptions: "",
})

const fields: FormField[] = [
  {
    prop: "groupOptions",
    label: "分组选择",
    type: "select",
    placeholder: "请选择",
    filterable: true,
    remote: {
      url: "/api/options/select-group",
      labelKey: "label",
      valueKey: "value",
    },
  },
  {
    prop: "flatOptions",
    label: "普通选择",
    type: "select",
    placeholder: "请选择",
    filterable: true,
    remote: {
      url: "/api/options/select",
      labelKey: "label",
      valueKey: "value",
    },
  },
]
</script>