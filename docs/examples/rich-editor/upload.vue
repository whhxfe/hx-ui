<template>
  <div class="demo-wrapper">
    <div class="demo-item">
      <p class="demo-label">配置上传地址（图片 / 视频）</p>
      <HxRichEditor
        v-model="content3"
        :upload-url="uploadUrl"
        :upload-image="{ url: uploadUrl }"
        :upload-video="{ url: uploadUrl }"
      />
      <p class="demo-value">HTML 内容长度: {{ content3.length }} 字符</p>
      <p class="demo-hint">图片上传前会自动压缩（最大宽度 1600px，JPEG 质量 80%）。请替换 <code>uploadUrl</code> 为实际接口地址。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { HxRichEditor } from "@hx/ui"

const content3 = ref("<p>支持<em>图片</em>和<em>视频</em>上传，可通过 <code>uploadUrl</code> 或 <code>uploadImage</code> / <code>uploadVideo</code> 分别配置。</p>")

/** 上传接口地址，请替换为实际接口 */
const uploadUrl = "/api/upload"
</script>

<style scoped>
.demo-hint {
	margin-top: 6px;
	font-size: 12px;
	color: var(--el-text-color-placeholder);
	line-height: 1.5;
}
.demo-hint code {
	padding: 0 4px;
	background: var(--el-fill-color-light);
	border-radius: 3px;
	font-size: 12px;
}
</style>
