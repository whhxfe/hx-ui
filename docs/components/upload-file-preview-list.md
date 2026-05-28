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

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| update:modelValue | 删除文件时触发 | `(value: string \| string[])` |
| remove | 删除文件时触发 | `(fileId: string)` |
