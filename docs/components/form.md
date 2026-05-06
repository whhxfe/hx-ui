# Form 动态表单

基于 Element Plus `el-form` 的列配置驱动表单，通过 `columns` 数组声明式定义表单字段，支持自动生成校验规则、栅格布局、远程数据等功能。

## 基础用法

使用 `columns` 配置声明表单字段，`v-model` 双向绑定表单数据。

:::demo 基础的 3 列栅格布局
form/basic
:::

## columns 完整示例

展示 `columns` 配置驱动表单的能力，覆盖所有常用字段类型：`input`、`textarea`、`number`、`select`、`radio`、`checkbox`、`checkbox-btn`、`switch`、`cascader`、`date`、`daterange`、`datetime`、`datetimerange`、`time`、`timerange`、`transfer`、`upload`，并演示 `colSpan` 栅格跨度控制。

:::demo columns 完整示例 — 涵盖所有字段类型
form/columns
:::

## 提交与重置

通过 `ref` 获取表单实例，调用 `validate` 校验和 `reset` 重置方法。默认操作区可通过 `actions` 插槽自定义。

:::demo 自定义操作按钮
form/submit-reset
:::

## 输入类型

支持 `input`、`textarea`、`number` 等文本输入类型。

:::demo 文本输入 / 文本域 / 数字输入
form/input-types
:::

## 选择类组件

支持 `select`、`radio`、`radio-btn`、`checkbox`、`switch` 等选择类组件。

:::demo 单选下拉 / 多选下拉 / 单选框 / 多选框 / 开关
form/select-options
:::

## 日期时间

支持 `date`、`daterange`、`datetime`、`datetimerange`、`time`、`timerange` 等日期时间类型。

:::demo 日期 / 日期范围 / 日期时间 / 时间 / 时间范围
form/date-time
:::

## 级联选择

`cascader` 类型支持多级联动，可通过 `filterable` 开启搜索功能。

:::demo 级联选择器
form/cascader
:::

## 远程数据

通过 `remote` 配置异步加载选项数据，支持 GET/POST 请求及响应字段映射；`dependsOn` 可实现省市区多级联动。

:::demo 远程数据 / 民族 / 性别 / 省市联动
form/remote-options
:::

## 自动校验

通过 `required: true` 自动生成必填校验规则，`rules` 可添加自定义校验规则，两者自动合并。

:::demo required 自动校验 + rules 自定义校验
form/validation
:::

## 上传组件

`type: 'upload'` 支持 `headers`、`data`、`name`、`withCredentials` 等 el-upload 原生参数透传，通过 `responseMapper` 提取上传后的文件 ID，通过 `previewUrl` 配置文件预览接口。

:::demo 表单中使用 upload 组件
form/upload
:::

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 表单数据对象 | `Record<string, any>` | `{}` |
| columns | 表单字段配置数组 | `FormColumn[]` | - |
| cols | 栅格列数 | `number` | `3` |
| showAction | 是否显示操作按钮区域 | `boolean` | `true` |

### FormColumn 类型

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| prop | 字段名 | `string` |
| label | 标签文本 | `string` |
| type | 字段类型 | `FieldType` |
| defaultValue | 默认值 | `any` |
| colSpan | 栅格列跨度 | `number` |
| placeholder | 占位文本 | `string` |
| clearable | 是否可清空 | `boolean` |
| disabled | 是否禁用 | `boolean` |
| hidden | 是否隐藏 | `boolean` |
| required | 是否必填（自动生成校验） | `boolean` |
| options | 选项数据（select/radio/checkbox/cascader） | `OptionItem[] \| GroupOptionItem[]` |
| multiple | 是否多选（select/checkbox） | `boolean` |
| filterable | 是否可搜索（select/cascader） | `boolean` |
| min / max / step | 数字输入范围 | `number` |
| maxlength | 最大长度 | `number` |
| showWordLimit | 是否显示字数统计 | `boolean` |
| rows | 文本域行数 | `number` |
| valueFormat | 值格式化字符串 | `string` |
| action | 上传地址（upload） | `string` |
| accept | 接受的文件类型（upload） | `string` |
| limit | 最大上传数量（upload） | `number` |
| headers | 请求头（upload） | `Record<string, string>` |
| data | 附带的表单数据（upload） | `Record<string, string \| Blob>` |
| name | 上传的文件字段名（upload） | `string` |
| withCredentials | 携带 cookie（upload） | `boolean` |
| listType | 列表展示类型（upload） | `'text' \| 'picture' \| 'picture-card' \| 'file-preview'` |
| valueMapper | 上传文件值映射函数 | `(file: any) => any` |
| responseMapper | 上传响应值映射函数 | `(response: any, file: any) => any` |
| fileRender | 自定义上传文件列表项渲染 | `(file: any, actions: { remove }) => VNode` |
| filePreviewRender | 自定义上传文件预览渲染 | `(file: any, actions: { remove }) => VNode` |
| previewUrl | 文件预览接口地址（upload） | `string` |
| deleteFetchUrl | 文件删除接口地址（upload） | `string` |
| cascaderProps | 级联选择面板配置（cascader） | `CascaderPanelProps` |
| variant | 按钮形态（radio / checkbox） | `'radio' \| 'radio-btn'` / `'checkbox' \| 'checkbox-btn'` |
| rules | 自定义校验规则 | `any[]` |
| componentProps | 透传给底层组件的属性 | `Record<string, any>` |
| formItemProps | 透传给 el-form-item 的属性 | `Record<string, any>` |
| onChange | 值变更回调 | `(value: any, formData: Record<string, any>) => void` |
| richEditorParams | 富文本编辑器配置（richeditor） | `RichEditorParams` |

### FieldType 可选值

```
input | textarea | number | select | radio | radio-btn | checkbox |
switch | cascader | datetime | datetimerange | date | daterange |
time | timerange | upload | slot | render
```

### FormExpose

通过 `ref` 获取的方法：

| 方法 | 说明 | 返回值 |
| --- | --- | --- |
| validate | 校验表单 | `Promise<boolean>` |
| reset | 重置表单 | `void` |
| getFormData | 获取表单数据 | `Record<string, any>` |
| setFormData | 设置表单数据 | `void` |
| getElFormRef | 获取 el-form 实例 | `any` |

### Slots

| 插槽名 | 说明 | 作用域变量 |
| --- | --- | --- |
| default | 默认插槽，渲染自定义表单项 | - |
| [prop] | 渲染指定字段的表单项 | `{ formData }` |
| actions | 操作按钮区域 | `{ formData, validate, reset }` |
