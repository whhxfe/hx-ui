<template>
  <hx-form
    ref="formRef"
    v-model="formData"
    :fields="fields"
    :cols="2"
  >
    <template #action-buttons="{ validate, reset }">
      <div class="form-actions">
        <el-button type="primary" @click="handleSubmit">提交</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
    </template>
  </hx-form>
  <hx-json-view :data="formData" />
</template>

<script setup lang="ts">
import { ref } from "vue"
import { HxForm as Form, HxJsonView } from "@hx/ui"
import type { FormField, FormExpose } from "@hx/ui"
import { ElMessage } from "element-plus"

const formRef = ref<FormExpose>()

const formData = ref({
  name: "",
  age: undefined,
  email: "",
})

const fields: FormField[] = [
  {
    prop: "name",
    label: "姓名",
    type: "input",
    placeholder: "请输入姓名",
    required: true,
    rules: [
      { min: 2, max: 10, message: "姓名长度在 2 到 10 个字符", trigger: "blur" }
    ]
  },
  {
    prop: "age",
    label: "年龄",
    type: "number",
    placeholder: "请输入年龄",
    required: true,
    rules: [
      { type: "number", min: 1, max: 150, message: "年龄必须在 1 到 150 之间", trigger: "change" }
    ]
  },
  { prop: "email", label: "邮箱", type: "input", placeholder: "请输入邮箱", required: true },
]

function handleSubmit() {
  formRef.value?.validate((valid) => {
    if (valid) {
      ElMessage.success("提交成功")
    }
  })
}

function handleReset() {
  formRef.value?.reset()
}
</script>

<style scoped>
.form-actions {
  display: flex;
  gap: 8px;
}
</style>
