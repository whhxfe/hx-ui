<template>
  <hx-form
    v-model="formData"
    :fields="fields"
    :cols="3"
  >
    <template #actions="{ formData, validate }">
      <div class="form-actions">
        <el-button type="primary" @click="handleSearch(formData, validate)">搜索</el-button>
        <el-button>重置</el-button>
      </div>
    </template>
  </hx-form>
  <hx-content-text :data="formData" :json-default-expanded="true" />
</template>

<script setup lang="ts">
import { ref } from "vue"
import { HxForm as Form, HxContentText } from "@hx/ui"
import type { FormField } from "@hx/ui"
import { ElMessage } from "element-plus"

const formData = ref({
  title: "",
  type: "",
  status: "",
})

const fields: FormField[] = [
  { prop: "title", label: "标题", type: "input", placeholder: "请输入标题", required: true },
  { prop: "type", label: "类型", type: "select", placeholder: "请选择类型", required: true, options: [
    { label: "文章", value: "article" },
    { label: "视频", value: "video" },
    { label: "图片", value: "image" },
  ]},
  { prop: "status", label: "状态", type: "radio", options: [
    { label: "启用", value: "enabled" },
    { label: "禁用", value: "disabled" },
  ]},
]

function handleSearch(data: Record<string, any>, validate: any) {
  validate(valid => {
    if (valid) {
      ElMessage.success("搜索参数: " + JSON.stringify(data))
    }
  })
}
</script>

<style scoped>
.form-actions {
  display: flex;
  gap: 8px;
}
</style>
