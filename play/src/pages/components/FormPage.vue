<template>
  <div class="page-container">
    <h1 class="page-title">Form 动态表单</h1>
    <p class="page-desc">基于 el-form 的列配置驱动表单，通过 columns 数组声明式定义表单字段。</p>

    <!-- 基础用法 -->
    <section class="demo-section">
      <h3 class="section-title">基础用法</h3>
      <p class="section-desc">使用 <code>columns</code> 配置声明表单字段，<code>v-model</code> 双向绑定表单数据。</p>
      <div class="demo-block">
        <Form
          v-model="basicFormData"
          :columns="basicColumns"
          :cols="3"
        />
      </div>
      <div class="demo-code">formData: {{ basicFormData }}</div>
    </section>

    <!-- 输入类型 -->
    <section class="demo-section">
      <h3 class="section-title">输入类型</h3>
      <p class="section-desc">支持 input、textarea、number 等文本输入类型。</p>
      <div class="demo-block">
        <Form
          v-model="inputFormData"
          :columns="inputColumns"
          :cols="2"
        />
      </div>
      <div class="demo-code">formData: {{ inputFormData }}</div>
    </section>

    <!-- 选择类组件 -->
    <section class="demo-section">
      <h3 class="section-title">选择类组件</h3>
      <p class="section-desc">支持 select、radio、checkbox、switch 等选择类组件。</p>
      <div class="demo-block">
        <Form
          v-model="selectFormData"
          :columns="selectColumns"
          :cols="2"
        />
      </div>
      <div class="demo-code">formData: {{ selectFormData }}</div>
    </section>

    <!-- 日期时间 -->
    <section class="demo-section">
      <h3 class="section-title">日期时间</h3>
      <p class="section-desc">支持 date、daterange、datetime、time 等日期时间类型。</p>
      <div class="demo-block">
        <Form
          v-model="dateFormData"
          :columns="dateColumns"
          :cols="2"
        />
      </div>
      <div class="demo-code">formData: {{ dateFormData }}</div>
    </section>

    <!-- 级联选择 -->
    <section class="demo-section">
      <h3 class="section-title">级联选择</h3>
      <p class="section-desc">cascader 类型支持多级联动，可通过 filterable 开启搜索功能。</p>
      <div class="demo-block">
        <Form
          v-model="cascaderFormData"
          :columns="cascaderColumns"
          :cols="2"
        />
      </div>
      <div class="demo-code">formData: {{ cascaderFormData }}</div>
    </section>

    <!-- 远程数据 -->
    <section class="demo-section">
      <h3 class="section-title">远程数据</h3>
      <p class="section-desc">通过 <code>remote</code> 配置异步加载选项数据，支持 GET/POST 请求及响应字段映射。</p>
      <div class="demo-block">
        <Form
          v-model="remoteFormData"
          :columns="remoteColumns"
          :cols="2"
        />
      </div>
      <div class="demo-code">formData: {{ remoteFormData }}</div>
    </section>

    <!-- 远程接口示例：民族 / 性别 / 省市二级联动 -->
    <section class="demo-section">
      <h3 class="section-title">远程接口示例</h3>
      <p class="section-desc">展示 <code>remote</code> 配置与接口的使用：性别（radio）、民族（select 搜索）、湖北省市区二级联动（市随省变化，区随市变化）。</p>
      <div class="demo-block">
        <Form
          v-model="remoteDemoFormData"
          :columns="remoteDemoColumns"
          :cols="2"
        />
      </div>
      <div class="demo-code">formData: {{ remoteDemoFormData }}</div>
    </section>

    <!-- 自动校验 -->
    <section class="demo-section">
      <h3 class="section-title">自动校验</h3>
      <p class="section-desc">通过 <code>required: true</code> 自动生成必填校验规则，<code>rules</code> 可添加自定义校验规则。</p>
      <div class="demo-block">
        <Form
          ref="validateFormRef"
          v-model="validationFormData"
          :columns="validationColumns"
          :cols="2"
        >
          <template #actions="{ formData, validate }">
            <div class="form-actions">
              <el-button type="primary" @click="handleSubmit(formData, validate)">提交</el-button>
              <el-button @click="handleReset">重置</el-button>
            </div>
          </template>
        </Form>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { HxForm as Form } from "@hx/ui"
import type { FormColumn, FormExpose } from "@hx/ui"
import { ElMessage } from "element-plus"

// ========== 基础用法 ==========
const basicFormData = ref({
  name: "",
  phone: "",
  region: "",
})

const basicColumns: FormColumn[] = [
  { prop: "name", label: "姓名", type: "input", placeholder: "请输入姓名" },
  { prop: "phone", label: "手机号", type: "input", placeholder: "请输入手机号" },
  { prop: "region", label: "所在地区", type: "select", placeholder: "请选择地区", options: [
    { label: "北京", value: "beijing" },
    { label: "上海", value: "shanghai" },
    { label: "广州", value: "guangzhou" },
  ]},
]

// ========== 输入类型 ==========
const inputFormData = ref({
  input: "",
  textarea: "",
  number: undefined,
})

const inputColumns: FormColumn[] = [
  { prop: "input", label: "文本输入", type: "input", placeholder: "请输入", maxlength: 50, showWordLimit: true },
  { prop: "textarea", label: "文本域", type: "textarea", placeholder: "请输入多行文本", rows: 3, maxlength: 200, showWordLimit: true },
  { prop: "number", label: "数字输入", type: "number", placeholder: "请输入数字", min: 0, max: 100, step: 1 },
]

// ========== 选择类组件 ==========
const selectFormData = ref({
  singleSelect: "",
  multiSelect: [],
  radio: "",
  checkbox: [],
  switch: false,
})

const selectColumns: FormColumn[] = [
  { prop: "singleSelect", label: "单选下拉", type: "select", placeholder: "请选择", options: [
    { label: "选项一", value: "1" },
    { label: "选项二", value: "2" },
    { label: "选项三", value: "3" },
  ]},
  { prop: "multiSelect", label: "多选下拉", type: "select", multiple: true, placeholder: "请选择", options: [
    { label: "选项一", value: "1" },
    { label: "选项二", value: "2" },
    { label: "选项三", value: "3" },
  ]},
  { prop: "radio", label: "单选框", type: "radio", options: [
    { label: "是", value: "yes" },
    { label: "否", value: "no" },
  ]},
  { prop: "checkbox", label: "多选框", type: "checkbox", options: [
    { label: "唱歌", value: "sing" },
    { label: "跳舞", value: "dance" },
    { label: "编程", value: "code" },
  ]},
  { prop: "switch", label: "开关", type: "switch" },
]

// ========== 日期时间 ==========
const dateFormData = ref({
  date: "",
  dateRange: [],
  datetime: "",
  datetimerange: [],
  time: "",
  timeRange: [],
})

const dateColumns: FormColumn[] = [
  { prop: "date", label: "日期", type: "date", placeholder: "请选择日期" },
  { prop: "dateRange", label: "日期范围", type: "daterange", placeholder: "请选择日期范围" },
  { prop: "datetime", label: "日期时间", type: "datetime", placeholder: "请选择日期时间" },
  { prop: "datetimerange", label: "日期时间范围", type: "datetimerange", placeholder: "请选择范围" },
  { prop: "time", label: "时间", type: "time", placeholder: "请选择时间" },
  { prop: "timeRange", label: "时间范围", type: "timerange", placeholder: "请选择时间范围" },
]

// ========== 级联选择 ==========
const cascaderFormData = ref({
  cascader: "",
})

const cascaderColumns: FormColumn[] = [
  { prop: "cascader", label: "级联选择", type: "cascader", placeholder: "请选择", filterable: true, options: [
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

// ========== 远程数据 ==========
const remoteFormData = ref({
  groupOptions: "",
  flatOptions: "",
})

const remoteColumns: FormColumn[] = [
  {
    prop: "groupOptions",
    label: "分组下拉",
    type: "select",
    placeholder: "请选择",
    filterable: true,
    remote: {
      url: "http://localhost:4300/api/options/select-group",
      labelKey: "label",
      valueKey: "value",
    },
  },
  {
    prop: "flatOptions",
    label: "普通下拉",
    type: "select",
    placeholder: "请选择",
    filterable: true,
    remote: {
      url: "http://localhost:4300/api/options/select",
      labelKey: "label",
      valueKey: "value",
    },
  },
]

// ========== 校验 ==========
const validateFormRef = ref<FormExpose>()

const validationFormData = ref({
  name: "",
  age: undefined,
  email: "",
})

const validationColumns: FormColumn[] = [
  {
    prop: "name",
    label: "姓名",
    type: "input",
    placeholder: "请输入姓名",
    required: true,
    rules: [
      { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
    ]
  },
  {
    prop: "age",
    label: "年龄",
    type: "number",
    placeholder: "请输入年龄",
    required: true,
  },
  { prop: "email", label: "邮箱", type: "input", placeholder: "请输入邮箱", required: true },
]

function handleSubmit(data: Record<string, any>, validate: any) {
  validate((valid: boolean) => {
    if (valid) {
      ElMessage.success("提交成功: " + JSON.stringify(data))
    }
  })
}

function handleReset() {
  validateFormRef.value?.reset()
}

// ========== 远程接口示例 ==========
const remoteDemoFormData = ref({
  gender: "",
  ethnicity: "",
  address: "",
})

const remoteDemoColumns: FormColumn[] = [
  {
    prop: "gender",
    label: "性别",
    type: "radio",
    remote: {
      url: "http://localhost:4300/api/options/gender",
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
      url: "http://localhost:4300/api/options/ethnicity",
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
      url: "http://localhost:4300/api/options/cascader",
      labelKey: "label",
      valueKey: "value",
      childrenKey: "children",
    },
  },
]
</script>

<style scoped>
.page-container {
  max-width: 900px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.page-desc {
  color: #666;
  margin-bottom: 32px;
  line-height: 1.6;
}

.demo-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.section-desc {
  color: #666;
  font-size: 14px;
  margin-bottom: 16px;
}

.section-desc code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
  color: #c7254e;
}

.demo-block {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 12px;
}

.demo-code {
  background: #f7f8fa;
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 13px;
  color: #666;
  word-break: break-all;
}

.form-actions {
  display: flex;
  gap: 8px;
}
</style>
