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
  input: "",
  textarea: "",
  number: undefined,
})

const fields: FormField[] = [
  { prop: "input", label: "文本输入", type: "input", placeholder: "请输入", maxlength: 50, showWordLimit: true },
  { prop: "textarea", label: "多行文本", type: "textarea", placeholder: "请输入描述内容", rows: 3, maxlength: 200, showWordLimit: true },
  { prop: "number", label: "数字输入", type: "number", placeholder: "请输入数字", min: 0, max: 100, step: 1 },
]
</script>
