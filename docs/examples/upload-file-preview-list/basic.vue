<template>
  <div class="demo-wrapper">
    <p class="demo-desc">传入文件 ID 列表，组件自动请求后端获取文件详情并渲染预览。</p>

    <hx-upload-file-preview-list
      v-model="fileIds"
      preview-url="/api/file/preview"
      :show-download="true"
      :removable="true"
      @remove="handleRemove"
    />

    <p class="demo-value">
      当前绑定的文件 ID: {{ JSON.stringify(fileIds) }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { HxUploadFilePreviewList } from '@whhx/ui'

const fileIds = ref(['file-001', 'file-002', 'file-003'])

function handleRemove(fileId: string) {
  console.log('删除文件:', fileId)
}
</script>

<style scoped>
.demo-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.demo-desc {
  font-size: 14px;
  color: #606266;
}

.demo-value {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}
</style>
