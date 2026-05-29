# UploadFilePreviewList 文件预览列表

用于展示文件 ID 列表对应的文件预览信息（名称、缩略图、大小等），常见于详情页展示已上传的附件列表。

## 基础用法

传入文件 ID 列表，组件自动请求 `previewUrl` 获取文件详情并渲染预览。

:::demo 基础用法
upload-file-preview-list/basic
:::

## 详情页切换场景

模拟表格详情页场景：当切换不同数据时，组件会请求对应的文件列表。通过网络请求日志可验证旧请求是否被正确取消。

:::demo 详情页切换
upload-file-preview-list/detail-switch
:::

## 卡片尺寸控制

通过 `itemWidth` 和 `itemHeight` 控制卡片尺寸，固定尺寸的卡片宽度不会受文件名长度影响。

:::demo 卡片尺寸
upload-file-preview-list/item-size
:::

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 文件 ID 列表，支持字符串（逗号分隔）或数组 | `string \| string[]` | - |
| preview-url | 获取文件预览信息的接口地址，组件请求 `${previewUrl}/${fileId}` | `string` | - |
| model-value-type | v-model 值类型 | `'string' \| 'array'` | `'array'` |
| show-download | 是否显示下载按钮 | `boolean` | `true` |
| removable | 是否显示删除按钮 | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | `false` |
| remove-confirm-title | 删除确认框标题 | `string` | `'确认删除'` |
| remove-confirm-message | 删除确认框内容，支持 `{name}` 占位符 | `string` | `'确定要删除文件「{name}」吗？'` |
| item-width | 卡片宽度，支持数字或带单位字符串 | `string \| number` | `undefined` |
| item-height | 卡片高度，支持数字或带单位字符串 | `string \| number` | `undefined` |
| delete-url | 根据 fileId 删除文件的接口，组件调用 `DELETE ${deleteUrl}/${fileId}` | `string` | `undefined` |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| update:modelValue | 删除文件后触发 | `(value: string \| string[])` |
| remove | 删除文件时触发（确认删除后、调用 deleteUrl 之前） | `(fileId: string)` |
