# Upload 上传

基于 Element Plus `el-upload` 的二次封装，支持多种列表展示模式、文件预览、懒加载预览、删除回调等业务场景。

## 懒加载预览

上传接口只返回 `id`，通过 `previewFetchUrl` 按需获取预览 URL，删除时调用 `deleteFetchUrl` 删除服务端文件。

:::demo
upload/lazy-preview
:::

## modelValueType - 值类型切换

通过 `modelValueType` 控制 v-model emit 的值类型：`array` 发送数组（默认），`string` 发送逗号分隔字符串。

:::demo
upload/model-value-type
:::

## API

### Props

| 参数名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 上传文件后绑定到表单的值 | `string \| string[]` | - |
| modelValueType | v-model emit 的值类型：`array` 发送数组，`string` 发送逗号分隔字符串 | `'string' \| 'array'` | `'array'` |
| action | 上传地址 | `string` | - |
| accept | 接受的文件类型 | `string` | - |
| limit | 最大上传数量 | `number` | - |
| multiple | 是否支持多文件 | `boolean` | - |
| disabled | 是否禁用 | `boolean` | - |
| listType | 列表展示类型：`text` / `picture` / `picture-card` / `file-preview` | `string` | `'text'` |
| autoUpload | 是否自动上传（无 action 时关闭） | `boolean` | `true` |
| placeholder | 上传按钮占位文本 | `string` | - |
| responseMapper | 从服务端响应中提取要存储的值（如 fileId） | `(response, file) => any` | - |
| valueMapper | 从 file 对象提取值的映射函数 | `(file, response?) => any` | - |
| previewFetchUrl | 根据 fileId 获取文件预览信息的接口（listType=file-preview 时使用） | `string` | - |
| deleteFetchUrl | 根据 fileId 删除文件的接口 | `string` | - |
| showDownload | 是否显示下载按钮（file-preview 模式） | `boolean` | - |
| fileRender | 自定义文件列表项渲染 | `(file, actions) => VNode` | - |
| filePreviewRender | 自定义文件预览渲染 | `(file, actions) => VNode` | - |
| componentProps | 额外的 el-upload props | `Record<string, any>` | - |

### Slots

| 插槽名 | 说明 | 作用域变量 |
| --- | --- | --- |
| default | 默认插槽，渲染上传触发器 | - |
| file | 自定义文件列表项（listType 非 file-preview 时生效） | `{ file, remove }` |
| tip | 提示信息区域 | - |

### 事件

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| change | 文件列表变化 | `(fileList: any[]) => void` |
| exceed | 超出限制时触发 | `(files, fileList) => void` |
