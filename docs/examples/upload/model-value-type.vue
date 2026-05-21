<template>
  <div class="hx-upload-model-value-type-demo">
    <!-- array 模式（默认） -->
    <div class="demo-block">
      <h4 class="demo-sub-title">modelValueType="array"（默认）</h4>
      <p class="demo-desc">v-model 绑定为数组，响应式更新</p>
      <HxUpload
        v-model="fileIds"
        action="/api/upload"
        :accept="accept"
        :limit="5"
        :multiple="true"
        :response-mapper="(res) => res.data.id"
        :preview-url="'/api/upload/preview'"
        :delete-url="'/api/upload'"
        list-type="file-preview"
        placeholder="上传附件"
      />
      <div class="demo-code">v-model (fileIds): {{ fileIds }}</div>
    </div>

    <!-- string 模式 -->
    <div class="demo-block">
      <h4 class="demo-sub-title">modelValueType="string"</h4>
      <p class="demo-desc">v-model 绑定为逗号分隔字符串，适用于后端接口直接接收字符串场景</p>
      <HxUpload
        v-model="fileIdsStr"
        action="/api/upload"
        :accept="accept"
        :limit="5"
        :multiple="true"
        :response-mapper="(res) => res.data.id"
        :preview-url="'/api/upload/preview'"
        :delete-url="'/api/upload'"
        model-value-type="string"
        list-type="file-preview"
        placeholder="上传附件"
      />
      <div class="demo-code">v-model (fileIdsStr): {{ fileIdsStr }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { HxUpload } from '@hx/ui'

const fileIds = ref<string[]>([])
const fileIdsStr = ref<string>('')
const accept = '.jpg,.png,.gif,.pdf,.doc,.docx,.mp4'
</script>

<style scoped>
.demo-block {
	background: var(--el-bg-color);
	border: 1px solid var(--el-border-color);
	border-radius: 8px;
	padding: 20px;
	margin-bottom: 16px;
}

.demo-sub-title {
	font-size: 15px;
	font-weight: 600;
	color: var(--el-text-color-primary);
	margin: 0 0 8px;
}

.demo-desc {
	font-size: 13px;
	color: var(--el-text-color-regular);
	margin: 0 0 12px;
}

.demo-code {
	background: var(--el-fill-color-lightest);
	padding: 12px 16px;
	border-radius: 6px;
	font-size: 13px;
	color: var(--el-text-color-regular);
	word-break: break-all;
	margin-top: 12px;
}
</style>
