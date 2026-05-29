<template>
  <div class="demo-wrapper">
    <p class="demo-desc">
      通过 <code>itemWidth</code> 和 <code>itemHeight</code> 控制卡片尺寸，
      支持数字（自动添加 px 后缀）或带单位字符串。固定尺寸的卡片宽度不会因文件名长度而变化。
    </p>

    <div class="demo-section">
      <h4 class="demo-title">固定尺寸卡片（数字）</h4>
      <hx-upload-file-preview-list
        v-model="fileIds"
        preview-url="/api/file/preview"
        :show-download="true"
        :removable="true"
        :item-width="220"
        :item-height="100"
        @remove="handleRemove"
      />
    </div>

    <div class="demo-section">
      <h4 class="demo-title">固定尺寸卡片（字符串）</h4>
      <hx-upload-file-preview-list
        v-model="fileIds"
        preview-url="/api/file/preview"
        :show-download="true"
        :removable="true"
        item-width="220px"
        item-height="100px"
        @remove="handleRemove"
      />
    </div>

    <div class="demo-section">
      <h4 class="demo-title">自适应尺寸（默认）</h4>
      <hx-upload-file-preview-list
        v-model="fileIds"
        preview-url="/api/file/preview"
        :show-download="true"
        :removable="true"
      />
    </div>

    <p class="demo-value">
      当前绑定的文件 ID: {{ JSON.stringify(fileIds) }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { HxUploadFilePreviewList } from '@hx/ui'

const fileIds = ref(['file-001', 'file-002', 'file-003'])

function handleRemove(fileId: string) {
  console.log('删除文件:', fileId)
}
</script>

<style scoped>
.demo-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.demo-desc {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.demo-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.demo-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.demo-value {
  font-size: 12px;
  color: #909399;
}
</style>
