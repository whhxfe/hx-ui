<template>
  <Form
    v-model="formData"
    :columns="columns"
    :cols="2"
  />
</template>

<script setup lang="ts">
import { ref } from "vue"
import { HxForm as Form } from "@hx/ui"
import type { FormColumn } from "@hx/ui"

const formData = ref({
  groupOptions: "",
  flatOptions: "",
})

const columns: FormColumn[] = [
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