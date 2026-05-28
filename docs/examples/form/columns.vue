<template>
  <hx-form
    ref="formRef"
    v-model="formData"
    :fields="fields"
    label-width="90px"
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
import { HxForm , HxJsonView } from "@hx/ui"
import type { FormField, FormExpose } from "@hx/ui"
import { ElMessage } from "element-plus"

const formRef = ref<FormExpose>()

const formData = ref({
  name: "",
  username: "",
  age: undefined,
  email: "",
  bio: "",
  gender: "",
  hobbies: [],
  role: "",
  status: false,
  city: "",
  workMode: "",
  skills: [],
  cityArea: "",
  address: [],
  birthday: "",
  workPeriod: [],
  checkInTime: "",
  checkOutTime: "",
  workTimeRange: [],
  workTime: "",
  department: [],
  avatar: [],
  richContent: "",
})

const fields: FormField[] = [
  // ——— 基础信息 ———
  {
    prop: "name",
    label: "姓名",
    type: "input",
    placeholder: "请输入姓名",
    colSpan: 1,
    required: true,
  },
  {
    prop: "username",
    label: "用户名",
    type: "input",
    placeholder: "请输入用户名",
    colSpan: 1,
    required: true,
  },
  {
    prop: "age",
    label: "年龄",
    type: "number",
    placeholder: "请输入年龄",
    min: 18,
    max: 65,
    colSpan: 1,
  },
  {
    prop: "email",
    label: "邮箱",
    type: "input",
    placeholder: "请输入邮箱",
    colSpan: 1,
    required: true,
  },
  {
    prop: "bio",
    label: "个人简介",
    type: "textarea",
    placeholder: "请输入个人简介",
    rows: 2,
    maxlength: 200,
    showWordLimit: true,
    colSpan: 2,
  },

  // ——— 选择类组件 ———
  {
    prop: "gender",
    label: "性别",
    type: "radio",
    options: [
      { label: "男", value: "male" },
      { label: "女", value: "female" },
    ],
    colSpan: 1,
  },
  {
    prop: "hobbies",
    label: "爱好",
    type: "checkbox",
    options: [
      { label: "阅读", value: "reading" },
      { label: "旅行", value: "travel" },
      { label: "运动", value: "sports" },
      { label: "音乐", value: "music" },
    ],
    colSpan: 1,
  },
  {
    prop: "role",
    label: "角色",
    type: "select",
    placeholder: "请选择角色",
    options: [
      { label: "管理员", value: "admin" },
      { label: "编辑", value: "editor" },
      { label: "普通用户", value: "user" },
    ],
    colSpan: 1,
  },
  {
    prop: "status",
    label: "状态",
    type: "switch",
    colSpan: 1,
  },
  {
    prop: "city",
    label: "城市",
    type: "select",
    placeholder: "请选择城市",
    filterable: true,
    options: [
      { label: "北京", value: "beijing" },
      { label: "上海", value: "shanghai" },
      { label: "广州", value: "guangzhou" },
      { label: "深圳", value: "shenzhen" },
      { label: "杭州", value: "hangzhou" },
      { label: "成都", value: "chengdu" },
    ],
    colSpan: 2,
  },
  {
    prop: "workMode",
    label: "工作模式",
    type: "radio-btn",
    options: [
      { label: "全职", value: "fulltime" },
      { label: "兼职", value: "parttime" },
      { label: "外包", value: "outsourced" },
    ],
    colSpan: 1,
  },
  {
    prop: "skills",
    label: "技能标签",
    type: "checkbox-btn",
    options: [
      { label: "Vue", value: "vue" },
      { label: "React", value: "react" },
      { label: "TypeScript", value: "ts" },
      { label: "Node.js", value: "node" },
    ],
    colSpan: 2,
  },

  // ——— 级联选择 ———
  {
    prop: "cityArea",
    label: "省市区",
    type: "cascader",
    placeholder: "请选择省市区",
    filterable: true,
    options: [
      {
        label: "北京",
        value: "beijing",
        children: [
          { label: "朝阳区", value: "chaoyang" },
          { label: "海淀区", value: "haidian" },
        ],
      },
      {
        label: "上海",
        value: "shanghai",
        children: [
          { label: "浦东新区", value: "pudong" },
          { label: "徐汇区", value: "xuhui" },
        ],
      },
      {
        label: "广东",
        value: "guangdong",
        children: [
          { label: "广州", value: "guangzhou_city" },
          { label: "深圳", value: "shenzhen_city" },
        ],
      },
    ],
    colSpan: 2,
  },

  // ——— 日期时间 ———
  {
    prop: "birthday",
    label: "出生日期",
    type: "date",
    placeholder: "请选择出生日期",
    valueFormat: "YYYY-MM-DD",
    colSpan: 1,
  },
  {
    prop: "workPeriod",
    label: "在职时间段",
    type: "daterange",
    placeholder: "请选择在职时间段",
    valueFormat: "YYYY-MM-DD",
    colSpan: 1,
  },
  {
    prop: "checkInTime",
    label: "上班打卡",
    type: "datetime",
    placeholder: "请选择上班打卡时间",
    valueFormat: "YYYY-MM-DD HH:mm:ss",
    colSpan: 1,
  },
  {
    prop: "checkOutTime",
    label: "下班打卡",
    type: "datetime",
    placeholder: "请选择下班打卡时间",
    valueFormat: "YYYY-MM-DD HH:mm:ss",
    colSpan: 1,
  },
  {
    prop: "workTime",
    label: "上班时间",
    type: "time",
    placeholder: "请选择上班时间",
    valueFormat: "HH:mm:ss",
    colSpan: 1,
  },
  {
    prop: "workTimeRange",
    label: "上班时间范围",
    type: "timerange",
    placeholder: "请选择上班时间范围",
    valueFormat: "HH:mm:ss",
    colSpan: 2,
  },

  // ——— 穿梭框 ———
  {
    prop: "department",
    label: "所属部门",
    type: "transfer",
    placeholder: "请选择部门",
    options: [
      { label: "技术部", value: "tech" },
      { label: "产品部", value: "product" },
      { label: "设计部", value: "design" },
      { label: "市场部", value: "marketing" },
      { label: "运营部", value: "operations" },
      { label: "人力资源部", value: "hr" },
    ],
    colSpan: 2,
  },

  // ——— 上传 ———
  {
    prop: "avatar",
    label: "头像上传",
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
    colSpan: 2,
  },
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
