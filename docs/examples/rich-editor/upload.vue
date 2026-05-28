<template>
  <div class="demo-wrapper">
    <div class="demo-item">
      <p class="demo-label">配置上传地址（图片 / 视频）</p>
      <HxRichEditor
        v-model="content3"
        :upload-url="uploadUrl"
        :upload-image="{ url: uploadUrl,extraData:{ type:'image' } }"
        :upload-video="{ url: uploadUrl,extraData:{ type:'video' }  }"
        :response-adapter="(res)=>res.data.url"
      />
      <p class="demo-value">HTML 内容长度: {{ content3.length }} 字符</p>
      <p class="demo-hint">
        所有图片和视频都会通过统一的 <code>request</code> 方法上传到后端接口，
        不再进行客户端 Base64 转换。默认上传接口为 <code>/api/upload</code>。
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { HxRichEditor } from "@hx/ui"

const content3 = ref("<p>支持<em>图片</em>和<em>视频</em>上传，可通过 <code>uploadUrl</code> 或 <code>uploadImage</code> / <code>uploadVideo</code> 分别配置。</p>")

/** 上传接口地址 */
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
