# FilePreview 文件预览

用于根据文件类型自动渲染对应的预览组件，支持图片、视频、音频、PDF、EML、Markdown、文本等文件类型的预览。

## 动态切换

:::demo 通过下拉选择切换不同类型的文件，演示 url 从 undefined / null 变化时的容错处理。
file-preview/dynamic-url
:::

## 图片预览

:::demo 自动识别 jpg、png、gif、webp、svg 等图片格式并渲染缩略图。
file-preview/image
:::

## 视频预览

:::demo 自动识别 mp4、flv、m3u8、webm、mov 等视频格式并渲染视频播放器。
file-preview/video
:::

## 音频预览

:::demo 自动识别 mp3、wav、ogg、aac、flac 等音频格式并渲染音频播放器。
file-preview/audio
:::

## PDF预览

:::demo 自动识别 pdf 格式并渲染 PDF 预览组件。
file-preview/pdf
:::

## 邮件预览

:::demo 自动识别 eml 格式并渲染邮件预览组件。
file-preview/eml
:::

## Markdown预览

:::demo 自动识别 md、markdown 等格式并渲染 Markdown 预览组件。
file-preview/markdown
:::

## 文本预览

:::demo 自动识别 txt、json、xml、yaml、csv 等文本格式并渲染文本预览组件。
file-preview/text
:::

## API

### Props

| 参数名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| url | 文件 URL，支持 `undefined / null`（组件自动展示空状态） | `string \| undefined \| null` | - |
| previewWidth | 预览区域宽度 | string | '120px' |
| previewHeight | 预览区域高度 | string | '80px' |
| fallbackThumbnail | 备用缩略图（用于视频等） | string | '' |

### 支持的文件类型

| 类型 | 扩展名 | 组件 |
| --- | --- | --- |
| 图片 | png, jpg, jpeg, gif, webp, svg, bmp, ico | ImgViewer |
| 视频 | mp4, flv, m3u8, webm, ogg, mov, avi, wmv | VideoViewer |
| 音频 | mp3, wav, ogg, aac, flac, m4a | AudioViewer |
| PDF | pdf | PdfViewer |
| 邮件 | eml | EmlViewer |
| Markdown | md, markdown, mdown, mkdn | MarkdownViewer |
| 文本 | txt, text, log, conf, ini, cfg, config, yaml, yml, json, xml, csv | TextViewer |
| 其他 | - | DefaultViewer |