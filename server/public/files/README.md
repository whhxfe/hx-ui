# 图片预览测试文件

本目录存放 `hx-ui` 组件库中 **file-preview** 组件所需的测试文件。

## 文件说明

| 文件夹 | 用途 | 支持的扩展名 |
|--------|------|-------------|
| `images/` | 图片预览 | `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.svg`, `.bmp`, `.ico` |
| `videos/` | 视频预览 | `.mp4`, `.flv`, `.webm`, `.m3u8`, `.ogg`, `.mov` |
| `audio/` | 音频预览 | `.mp3`, `.wav`, `.ogg`, `.aac`, `.flac` |
| `pdf/` | PDF 预览 | `.pdf` |
| `markdown/` | Markdown 预览 | `.md` |
| `text/` | 文本预览 | `.txt`, `.json`, `.xml`, `.csv`, `.yaml`, `.log` |
| `eml/` | 邮件预览 | `.eml` |

## 使用方式

将测试文件放入对应文件夹后，通过以下方式访问：

```
http://localhost:3000/files/images/demo.png
http://localhost:3000/files/pdf/sample.pdf
...
```

## 添加测试文件

建议使用真实业务文件作为测试数据，或从以下来源获取：

- 图片：[Unsplash](https://unsplash.com/)
- PDF：[PDFTestFiles](https://www.pdfiles.com/)
- 视频：自行录制或下载示例视频

## 当前已有文件

- `text/sample.txt` - 纯文本示例
- `markdown/sample.md` - Markdown 示例
- `json/sample.json` - JSON 数据示例
