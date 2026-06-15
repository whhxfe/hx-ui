<template>
  <div class="demo-section">
    <p class="demo-title">单选（multiple=false）</p>
    <HxFilterItem
      v-model="singleValue"
      label="状态"
      :options="statusOptions"
      :multiple="false"
      @change="onSingleChange"
    />
    <pre class="demo-pre">{{ JSON.stringify(singleValue) }}</pre>

    <p class="demo-title" style="margin-top: 28px">多选（multiple=true）</p>
    <HxFilterItem
      v-model="multiValue"
      label="分类"
      :options="categoryOptions"
      :multiple="true"
      @change="onMultiChange"
    />
    <pre class="demo-pre">{{ JSON.stringify(multiValue) }}</pre>

    <p class="demo-title" style="margin-top: 28px">多选 modelValueType 对比</p>
    <div style="display: flex; gap: 24px;">
      <div style="flex: 1;">
        <p class="demo-title">modelValueType="array"（默认）</p>
        <HxFilterItem
          v-model="multiArrayValue"
          label="分类"
          :options="categoryOptions"
          :multiple="true"
          model-value-type="array"
        />
        <pre class="demo-pre">{{ JSON.stringify(multiArrayValue, null, 2) }}</pre>
      </div>
      <div style="flex: 1;">
        <p class="demo-title">modelValueType="string"</p>
        <HxFilterItem
          v-model="multiStringValue"
          label="分类"
          :options="categoryOptions"
          :multiple="true"
          model-value-type="string"
        />
        <pre class="demo-pre">{{ JSON.stringify(multiStringValue) }}</pre>
      </div>
    </div>

    <p class="demo-title" style="margin-top: 28px">自定义 labelKey / valueKey</p>
    <HxFilterItem
      v-model="customValue"
      label="标签"
      :options="customOptions"
      label-key="name"
      value-key="id"
      :multiple="false"
    />
    <pre class="demo-pre">{{ JSON.stringify(customValue) }}</pre>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { HxFilterItem } from '@whhx/ui'

const singleValue = ref('')
const multiValue = ref<string[]>([])
const multiArrayValue = ref<string[]>([])
const multiStringValue = ref('')
const customValue = ref('')

const statusOptions = [
  { label: '待审核', value: 'pending' },
  { label: '已通过', value: 'approved' },
  { label: '已驳回', value: 'rejected' },
  { label: '已撤销', value: 'withdrawn', disabled: true },
]

const categoryOptions = [
  { label: '技术', value: 'tech' },
  { label: '产品', value: 'product' },
  { label: '设计', value: 'design' },
  { label: '运营', value: 'operations' },
]

const customOptions = [
  { name: '重要', id: 'important' },
  { name: '紧急', id: 'urgent' },
  { name: '普通', id: 'normal' },
  { name: '归档', id: 'archived', disabled: true },
]

function onSingleChange(val: any) {
  console.log('单选变化:', val)
}

function onMultiChange(val: any) {
  console.log('多选变化:', val)
}
</script>

<style scoped>
.demo-section {
	padding: 4px 0;
}
.demo-title {
	margin: 0 0 10px;
	font-size: 13px;
	color: var(--el-text-color-secondary);
	font-weight: 500;
}
.demo-pre {
	margin: 8px 0 0;
	padding: 8px 12px;
	font-size: 13px;
	line-height: 1.5;
	background: var(--el-fill-color-lightest);
	border-radius: 4px;
	color: var(--el-text-color-primary);
	font-family: 'Menlo', 'Monaco', monospace;
}
</style>