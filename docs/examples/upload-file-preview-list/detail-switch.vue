<template>
  <div class="demo-wrapper">
    <p class="demo-desc">
      模拟表格详情页场景：切换不同数据时，组件会加载对应的文件预览列表。
      <br>
      <strong>测试方法</strong>：打开浏览器开发者工具 Network 面板，切换详情时观察请求状态。
      <br>
      修复后行为：切换详情时，旧请求会被取消（cancelled），不会有重复请求。
    </p>

    <div class="detail-switcher">
      <hx-button
        v-for="item in detailList"
        :key="item.id"
        :type="currentId === item.id ? 'primary' : 'default'"
        size="small"
        @click="switchDetail(item.id)"
      >
        详情 {{ item.id }}
      </hx-button>
    </div>

    <div class="detail-content">
      <p class="detail-title">当前详情 ID: {{ currentId }}</p>
      <hx-upload-file-preview-list
        :key="currentId"
        v-model="currentDetail.fileIds"
        :preview-url="previewUrl"
        :removable="false"
      />
    </div>

    <div class="tips">
      <p><strong>测试步骤：</strong></p>
      <ol>
        <li>打开 Network 面板，清空现有记录</li>
        <li>点击任意「详情」按钮（如「详情 1」）</li>
        <li>立即点击另一个「详情」按钮（如「详情 2」）</li>
        <li>观察 Network 中的请求：详情 1 的请求应显示 cancelled/aborted 状态</li>
        <li>等待详情 2 的请求完成</li>
        <li>再次切换回详情 1，验证不会有重复请求</li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { HxButton, HxUploadFilePreviewList } from '@hx/ui'

// 模拟的详情数据（使用 picsum 图片 ID 作为文件 ID）
const detailList = [
  { id: 1, fileIds: ['10', '20', '30'] },
  { id: 2, fileIds: ['40', '50'] },
  { id: 3, fileIds: ['60', '70', '80', '90'] },
]

const currentId = ref(1)
const currentDetail = computed(() => detailList.find(d => d.id === currentId.value)!)

function switchDetail(id: number) {
  currentId.value = id
}

// 使用 picsum.photos 作为模拟的文件预览服务
// 真实场景中，这里应该配置实际的文件预览接口
const previewUrl = 'https://picsum.photos/id'
</script>

<style scoped>
.demo-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.demo-desc {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
}

.detail-switcher {
  display: flex;
  gap: 8px;
}

.detail-content {
  padding: 16px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
}

.detail-title {
  font-weight: 600;
  margin-bottom: 12px;
  color: #303133;
}

.tips {
  font-size: 13px;
  color: #606266;
  line-height: 1.8;
  padding: 12px;
  background: #fff8e6;
  border-radius: 4px;
  border-left: 3px solid #e6a23c;
}

.tips ol {
  margin: 8px 0 0;
  padding-left: 20px;
}

.tips li {
  margin-bottom: 4px;
}
</style>
