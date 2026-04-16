<template>
  <div class="page-container">
    <h1 class="page-title">Upload 上传</h1>

    <section class="demo-section">
      <h3 class="section-title">懒加载预览 + localStorage 持久化</h3>
      <p class="section-desc">
        上传接口只返回 <code>id</code>，通过 <code>previewFetchUrl</code> 按需获取预览 URL，
        删除时调用 <code>deleteFetchUrl</code> 删除服务端文件。
      </p>
      <div class="demo-block">
        <HxUpload
          v-model="fileIds"
          action="/api/upload"
          :accept="accept"
          :limit="10"
          :multiple="true"
          :response-mapper="(res) => res.data.id"
          :preview-fetch-url="'/api/upload/preview'"
          :delete-fetch-url="'/api/upload'"
          :show-download="true"
          placeholder="上传附件"
        />
      </div>
      <div class="demo-actions">
        <button class="btn-clear" @click="fileIds = []">清空</button>
      </div>
      <div class="demo-code">v-model (fileIds): {{ fileIds }}</div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { HxUpload } from '@hx/ui'

const STORAGE_KEY = 'hx-upload-demo-fileIds'

const fileIds = ref<string[]>(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))
const accept = ".jpg,.png,.gif,.pdf,.doc,.docx,.mp4";
watch(fileIds, (val) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
}, { deep: true })
</script>

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
  margin-bottom: 12px;
}

.demo-actions {
  margin-bottom: 12px;
}

.btn-clear {
  padding: 6px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  color: #666;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.btn-clear:hover {
  color: #ff4d4f;
  border-color: #ff4d4f;
}

.demo-code {
  background: #f7f8fa;
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 13px;
  color: #666;
  word-break: break-all;
  margin-bottom: 8px;
}
</style>
