<template>
  <hx-form
    v-model="formData"
    :columns="columns"
    :cols="2"
  />
  <hx-content-text :data="formData" :json-default-expanded="true" />
</template>

<script setup lang="ts">
import { ref } from "vue"
import { HxForm as Form, HxContentText } from "@hx/ui"
import type { FormColumn } from "@hx/ui"

const formData = ref({
  input: "",
  textarea: "",
  number: undefined,
})

const columns: FormColumn[] = [
  { prop: "input", label: "文本输入", type: "input", placeholder: "请输入", maxlength: 50, showWordLimit: true },
  { prop: "textarea", label: "多行文本", type: "textarea", placeholder: "请输入描述内容", rows: 3, maxlength: 200, showWordLimit: true },
  { prop: "number", label: "数字输入", type: "number", placeholder: "请输入数字", min: 0, max: 100, step: 1 },
]
</script>
