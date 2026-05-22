# Form 动态表单

基于 Element Plus `el-form` 的列配置驱动表单，通过 `fields` 数组声明式定义表单字段，支持自动生成校验规则、栅格布局、远程数据等功能。

## 基础用法

使用 `fields` 配置声明表单字段，`v-model` 双向绑定表单数据。

:::demo 基础的 3 列栅格布局
form/basic
:::

## fields 完整示例

展示 `fields` 配置驱动表单的能力，覆盖所有常用字段类型：`input`、`textarea`、`number`、`select`、`radio`、`checkbox`、`checkbox-btn`、`switch`、`cascader`、`date`、`daterange`、`datetime`、`datetimerange`、`time`、`timerange`、`transfer`、`upload`，并演示 `colSpan` 栅格跨度控制。

:::demo fields 完整示例 — 涵盖所有字段类型
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

## 全局配置

可通过 `HxConfigProvider` 在应用顶层统一配置 Form 组件的默认值：

```vue
<HxConfigProvider :form="{ cols: 4, gap: 12 }">
  <!-- 全局生效 -->
</HxConfigProvider>
```

配置优先级：**Props > ConfigProvider > 默认值**，即 Props 传入的值会覆盖全局配置。

:::demo 通过 ConfigProvider 全局配置 Form 布局
form/config-provider
:::

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model / modelValue | 表单数据对象 | `Record<string, any>` | `{}` |
| fields | 表单字段配置数组 | `FormField[]` | - |
| cols | 栅格列数 | `number` | `3` |
| gap | 栅格间距（px） | `number` | `16` |
| minColWidth | 栅格最小列宽（px） | `number` | `0` |
| showAction | 是否显示操作按钮区域 | `boolean` | `true` |
| labelWidth | 表单级别 label 宽度 | `string \| number` | - |
| labelPosition | 表单级别 label 位置 | `'left' \| 'right' \| 'top'` | `'right'` |

### FormField 类型

#### 通用属性

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
| labelWidth | 字段级别 label 宽度（优先级高于表单级别） | `string \| number` |
| labelPosition | 字段级别 label 位置 | `'left' \| 'right' \| 'top'` |

#### 文本输入类（input / textarea）

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| maxlength | 最大输入长度 | `number` |
| showWordLimit | 是否显示字数统计 | `boolean` |
| rows | 文本域行数（textarea） | `number` |
| prefixIcon | 输入框前缀图标类名 | `string` |
| suffixIcon | 输入框后缀图标类名 | `string` |
| autocomplete | 自动补全 | `string` |

#### 数字输入类（number）

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| min | 最小值 | `number` |
| max | 最大值 | `number` |
| step | 步进值 | `number` |
| precision | 精度（小数位数） | `number` |
| stepStrictly | 是否强制输入值为 step 的倍数 | `boolean` |

#### 选择类组件（select）

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| options | 选项数据 | `OptionItem[] \| GroupOptionItem[]` |
| remote | 远程数据配置 | `RemoteConfig` |
| multiple | 是否多选 | `boolean` |
| filterable | 是否可搜索 | `boolean` |
| collapseTags | 多选时是否折叠 Tag | `boolean` |
| collapseTagsTooltip | 多选时是否展示 Tag 的 tooltip | `boolean` |
| modelValueType | 值类型：`'string'` 逗号拼接，`'array'` 数组 | `'string' \| 'array'` |

#### 单选/多选类（radio / checkbox）

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| options | 选项数据 | `OptionItem[]` |
| remote | 远程数据配置 | `RemoteConfig` |
| variant | 按钮形态：`radio-btn` / `checkbox-btn` | `'radio' \| 'radio-btn'` / `'checkbox' \| 'checkbox-btn'` |
| modelValueType | 值类型 | `'string' \| 'array'` |

#### 日期时间类（date / daterange / datetime / datetimerange / time / timerange）

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| valueFormat | 值格式化字符串 | `string` |
| format | 显示格式化字符串 | `string` |
| disableFutureTime | 是否禁用未来时间（datetime） | `boolean` |
| disabledDate | 禁用日期函数 | `(date: Date) => boolean` |
| disabledTime | 禁用时间函数（time / timerange） | `() => { hours?: number[]; minutes?: number[]; seconds?: number[] }` |

#### 上传类（upload）

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| action | 上传地址 | `string` |
| accept | 接受的文件类型 | `string` |
| limit | 最大上传数量 | `number` |
| headers | 请求头 | `Record<string, string>` |
| data | 附带的表单数据 | `Record<string, string \| Blob>` |
| name | 上传的文件字段名 | `string` |
| withCredentials | 携带 cookie | `boolean` |
| listType | 列表展示类型 | `'text' \| 'picture' \| 'picture-card' \| 'file-preview'` |
| autoUpload | 是否自动上传 | `boolean` |
| valueMapper | 上传文件值映射函数 | `(file: any) => any` |
| responseMapper | 上传响应值映射函数 | `(response: any, file: any) => any` |
| previewUrl | 文件预览接口地址 | `string` |
| deleteUrl | 文件删除接口地址 | `string` |
| showDownload | 是否显示下载按钮 | `boolean` |
| fileRender | 自定义上传文件列表项渲染 | `(file: any, actions: { remove }) => VNode` |
| filePreviewRender | 自定义上传文件预览渲染 | `(file: any, actions: { remove }) => VNode` |

#### 其他属性

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| cascaderProps | 级联选择面板配置（cascader） | `CascaderPanelProps` |
| rules | 自定义校验规则 | `any[]` |
| componentProps | 透传给底层组件的属性 | `Record<string, any>` |
| formItemProps | 透传给 el-form-item 的属性 | `Record<string, any>` |
| onChange | 值变更回调 | `(value: any, formData: Record<string, any>) => void` |
| richEditorParams | 富文本编辑器配置（richeditor） | `RichEditorParams` |
| render | 自定义渲染函数（type='render'） | `(formData, field) => VNode` |

### FieldType 可选值

```
input | textarea | number | select | radio | radio-btn | checkbox |
checkbox-btn | switch | cascader | datetime | datetimerange | date |
daterange | time | timerange | upload | richeditor | slot | render
```

### FormExpose

通过 `ref` 获取的方法：

| 方法 | 说明 | 返回值 |
| --- | --- | --- |
| validate | 校验表单，可传入回调函数 | `Promise<boolean>` |
| reset | 重置表单 | `void` |
| getFormData | 获取表单数据 | `Record<string, any>` |
| setFormData | 设置表单数据（用于回填） | `(data: Partial<Record<string, any>>) => void` |
| getElFormRef | 获取 el-form 实例 | `any` |

### Slots

| 插槽名 | 说明 | 作用域变量 |
| --- | --- | --- |
| default | 默认插槽，渲染自定义表单项 | - |
| [prop] | 渲染指定字段的表单项 | `{ formData, field }` |
| action-buttons | 操作按钮区域（showAction=false 时不显示） | `{ formData, validate, reset }` |
| search | 查询按钮区域（位于操作按钮左侧） | `{ formData, validate, reset }` |
