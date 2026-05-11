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
  avatar: [],
  attachments: [],
})

const fields: FormField[] = [
  { prop: "name", label: "姓名", type: "input", placeholder: "请输入姓名" },
  {
    prop: "avatar",
    label: "头像",
    type: "upload",
    accept: ".jpg,.png,.gif",
    limit: 1,
    listType: "picture-card",
    action: "/api/upload",
    headers: { Authorization: "Bearer token-xxx" },
    data: { category: "avatar" },
    name: "avatar",
    responseMapper: (res: any) => res["data"]["id"],
    previewUrl: "/api/upload/preview",
    placeholder: "上传头像",
  },
  {
    prop: "attachments",
    label: "附件",
    type: "upload",
    accept: ".jpg,.png,.pdf,.doc,.docx",
    limit: 5,
    multiple: true,
    action: "/api/upload",
    headers: { Authorization: "Bearer token-xxx" },
    data: { category: "attachment" },
    responseMapper: (res: any) => res["data"]["id"],
    previewUrl: "/api/upload/preview",
    placeholder: "上传附件",
  },
]
</script>
