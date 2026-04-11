<script setup lang="ts">
const imageUrl = 'http://localhost:2999/static/images/1.jpg'
const videoUrl = 'http://localhost:2999/static/videos/1.mp4'
const audioUrl = 'http://localhost:2999/static/audios/1.mp3'
const pdfUrl = 'http://localhost:2999/static/pdfs/1.pdf'
const markdownUrl = 'http://localhost:2999/static/markdown/1.md'
const textUrl = 'http://localhost:2999/static/text/1.txt'
</script>

<template>
  <div class="page-container">
    <h1 class="page-title">FilePreview 文件预览</h1>
    <p class="page-desc">根据文件类型自动渲染对应的预览组件，支持图片、视频、音频、PDF、Markdown、文本等多种文件格式。</p>

    <!-- 图片预览 -->
    <section class="demo-section">
      <h3 class="section-title">图片预览</h3>
      <p class="section-desc">自动识别 jpg、png、gif、webp、svg 等图片格式并渲染缩略图。</p>
      <div class="demo-block">
        <div class="demo-row">
          <hx-file-preview
            :url="imageUrl"
          />
        </div>
      </div>
    </section>

    <!-- 视频预览 -->
    <section class="demo-section">
      <h3 class="section-title">视频预览</h3>
      <p class="section-desc">自动识别 mp4、flv、m3u8、webm、mov 等视频格式并渲染视频播放器。</p>
      <div class="demo-block">
        <div class="demo-row">
          <hx-file-preview
            :url="videoUrl"
          />
        </div>
      </div>
    </section>

    <!-- 音频预览 -->
    <section class="demo-section">
      <h3 class="section-title">音频预览</h3>
      <p class="section-desc">自动识别 mp3、wav、ogg、aac、flac 等音频格式并渲染音频播放器。</p>
      <div class="demo-block">
        <div class="demo-row">
          <hx-file-preview
            :url="audioUrl"
            preview-width="300px"
            preview-height="80px"
          />
        </div>
      </div>
    </section>

    <!-- PDF预览 -->
    <section class="demo-section">
      <h3 class="section-title">PDF预览</h3>
      <p class="section-desc">自动识别 pdf 格式并渲染 PDF 预览组件。</p>
      <div class="demo-block">
        <div class="demo-row">
          <hx-file-preview
            :url="pdfUrl"

          />
        </div>
      </div>
    </section>

    <!-- Markdown预览 -->
    <section class="demo-section">
      <h3 class="section-title">Markdown预览</h3>
      <p class="section-desc">自动识别 md、markdown 等格式并渲染 Markdown 预览组件。</p>
      <div class="demo-block">
        <div class="demo-row">
          <hx-file-preview
            :url="markdownUrl"

          />
        </div>
      </div>
    </section>

    <!-- 文本预览 -->
    <section class="demo-section">
      <h3 class="section-title">文本预览</h3>
      <p class="section-desc">自动识别 txt、json、xml、yaml、csv 等文本格式并渲染文本预览组件。</p>
      <div class="demo-block">
        <div class="demo-row">
          <hx-file-preview
            :url="textUrl"

          />
        </div>
      </div>
    </section>

    <!-- 自定义尺寸 -->
    <section class="demo-section">
      <h3 class="section-title">自定义尺寸</h3>
      <p class="section-desc">通过 <code>previewWidth</code> 和 <code>previewHeight</code> 自定义预览区域尺寸。</p>
      <div class="demo-block">
        <div class="demo-row">
          <hx-file-preview
            :url="imageUrl"
            preview-width="200px"
            preview-height="150px"
          />
        </div>
      </div>
    </section>

    <!-- 支持的文件类型 -->
    <section class="demo-section">
      <h3 class="section-title">支持的文件类型</h3>
      <p class="section-desc">自动识别以下文件类型并渲染对应预览组件。</p>
      <div class="demo-block">
        <table class="demo-table">
          <thead>
            <tr>
              <th>类型</th>
              <th>扩展名</th>
              <th>组件</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>图片</td>
              <td>png, jpg, jpeg, gif, webp, svg, bmp, ico</td>
              <td>ImgViewer</td>
            </tr>
            <tr>
              <td>视频</td>
              <td>mp4, flv, m3u8, webm, ogg, mov, avi, wmv</td>
              <td>VideoViewer</td>
            </tr>
            <tr>
              <td>音频</td>
              <td>mp3, wav, ogg, aac, flac, m4a</td>
              <td>AudioViewer</td>
            </tr>
            <tr>
              <td>PDF</td>
              <td>pdf</td>
              <td>PdfViewer</td>
            </tr>
            <tr>
              <td>邮件</td>
              <td>eml</td>
              <td>EmlViewer</td>
            </tr>
            <tr>
              <td>Markdown</td>
              <td>md, markdown, mdown, mkdn</td>
              <td>MarkdownViewer</td>
            </tr>
            <tr>
              <td>文本</td>
              <td>txt, text, log, conf, ini, cfg, config, yaml, yml, json, xml, csv</td>
              <td>TextViewer</td>
            </tr>
            <tr>
              <td>其他</td>
              <td>-</td>
              <td>DefaultViewer</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

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
}

.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
}

.demo-row:last-child {
  margin-bottom: 0;
}

.demo-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.demo-table th,
.demo-table td {
  border: 1px solid #e0e0e0;
  padding: 12px;
  text-align: left;
}

.demo-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #495057;
}

.demo-table td {
  color: #212529;
}
</style>