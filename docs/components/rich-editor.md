# RichEditor 富文本编辑器

基于 [WangEditor v5](https://www.wangeditor.com/) 封装的富文本编辑器组件，支持图文混排、图片/视频上传（可配 MinIO 或任意 HTTP 接口）、只读预览等场景。

## 基础用法

:::demo 基础富文本编辑器
rich-editor/basic
:::

## 只读预览

通过 `read-only` 属性切换为只读模式，适合文章预览、公告展示等只读场景。

:::demo 只读预览模式
rich-editor/readonly
:::

## 上传配置

通过 `upload-url` 或 `upload-image` / `upload-video` 分别配置图片和视频的上传接口。所有文件都会通过统一封装的 `request` 方法上传到后端接口，不再进行客户端 Base64 转换。

支持两种上传方式：

- **HTTP 接口**：传入上传地址，组件使用 `request.post` 自动 `POST FormData`，并通过 `responseAdapter` 从响应体解析资源 URL
- **MinIO 直传**：传入 MinIO 配置，组件直接在浏览器端签名上传到 MinIO，无需后端介入

:::demo 上传图片 / 视频
rich-editor/upload
:::

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 绑定值（HTML 字符串） | `string` | `''` |
| read-only | 是否只读 | `boolean` | `false` |
| upload-url | 图片/视频统一上传接口地址 | `string` | `''` |
| upload-image | 图片上传配置（优先级高于 upload-url） | `UploadOptions` | `{}` |
| upload-video | 视频上传配置 | `UploadOptions` | `{}` |
| response-adapter | 从上传响应体解析资源 URL | `(res: any) => string` | 取 `res.url / res.data / res.data.url / res.path` |

### UploadOptions

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| url | 上传接口地址 | `string` | - |
| headers | 请求头 | `Record<string, string>` | - |
| field-name | FormData 字段名 | `string` | `'file'` |
| extra-data | 额外表单字段 | `Record<string, string \| Blob>` | - |
| minio | MinIO 直传配置 | `MinioConfig` | - |

### MinioConfig

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| endpoint | MinIO 服务地址 | `string` |
| bucket | 存储桶名称 | `string` |
| access-key | Access Key | `string` |
| secret-key | Secret Key | `string` |

### Emits

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| update:modelValue | 内容变化时触发 | `(html: string)` |
| upload-success | 文件上传成功后触发 | `(url: string)` |
