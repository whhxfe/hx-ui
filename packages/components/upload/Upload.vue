<!--
  HxUpload - 上传组件
  基于 el-upload，封装常用逻辑
-->
<template>
	<!-- file-preview 模式：自定义文件列表，数据源完全来自 v-model -->
	<div v-if="listType === 'file-preview'" class="hx-upload-file-preview-mode">
		<!-- 上传触发按钮（仅触发上传，与列表渲染完全解耦） -->
		<div class="hx-upload-file-preview-actions">
			<el-upload
				ref="uploadRef"
				:action="action"
				:accept="accept"
				:limit="limit"
				:multiple="multiple"
				:disabled="disabled"
				:auto-upload="autoUpload"
				:show-file-list="false"
				:http-request="handleHttpRequest"
				:on-success="handleSuccess"
				:on-exceed="handleExceed"
				v-bind="componentProps"
			>
				<el-button type="primary" :disabled="disabled">
					{{ placeholder || '上传文件' }}
				</el-button>
			</el-upload>

			<!-- 提示 -->
			<span v-if="accept || limit" class="hx-upload-file-preview-tip">
				<span v-if="accept">支持 {{ accept }} 格式</span>
				<span v-if="accept && limit">，</span>
				<span v-if="limit">最多 {{ limit }} 个文件</span>
			</span>
		</div>

		<!-- 文件预览列表：v-model 是唯一数据源 -->
		<div v-if="previewList.length" class="hx-upload-file-preview-list">
			<div
				v-for="item in previewList"
				:key="item.fileId"
				class="hx-upload-file-preview-item"
				:class="{ 'is-disabled': disabled }"
			>
				<HxFilePreview
					:url="item.url"
					preview-width="100px"
					preview-height="80px"
					class="hx-upload-file-preview-thumb"
				/>
				<div class="hx-upload-file-preview-info">
					<span class="hx-upload-file-preview-name" :title="item.name">
						{{ item.name }}
					</span>
					<span class="hx-upload-file-preview-size">
						{{ formatFileSize(item.size) }}
					</span>
				</div>
				<div class="hx-upload-file-preview-item-actions">
					<hx-icon
						v-if="showDownload && !disabled"
						type="iconify"
						name="ep:download"
						class="hx-upload-file-preview-action-btn"
						@click.stop="handleDownload(item)"
					/>
					<hx-icon
						v-if="!disabled"
						type="iconify"
						name="ep:close"
						class="hx-upload-file-preview-action-btn hx-upload-file-preview-remove"
						@click.stop="handleRemove(item)"
					/>
				</div>
			</div>
		</div>
	</div>

	<!-- 其他模式：使用 el-upload 原生列表 -->
	<el-upload
		v-else
		ref="uploadRef"
		v-model="innerFileList"
		:action="action"
		:accept="accept"
		:limit="limit"
		:multiple="multiple"
		:disabled="disabled"
		:list-type="effectiveListType"
		:auto-upload="autoUpload"
		:http-request="handleHttpRequest"
		:on-change="handleChange"
		:on-remove="handleRemove"
		:on-success="handleSuccess"
		:on-exceed="handleExceed"
		v-bind="componentProps"
	>
		<!-- 自定义文件列表项 -->
		<template #file="{ file }">
			<slot
				v-if="$slots.file"
				:file="(file as any)"
				:remove="() => uploadRef?.handleRemove(file)"
			/>
			<component
				v-else-if="fileRender"
				:is="() => fileRender?.((file as any), { remove: () => uploadRef?.handleRemove(file) })"
			/>
		</template>

		<!-- 触发器 -->
		<hx-icon v-if="effectiveListType === 'picture-card'" type="iconify" name="mdi:plus" />
		<el-button v-else type="primary" :disabled="disabled">
			{{ placeholder || '点击上传' }}
		</el-button>

		<!-- 提示 -->
		<template v-if="accept || limit" #tip>
			<div class="el-upload__tip">
				<span v-if="accept">支持 {{ accept }} 格式</span>
				<span v-if="accept && limit">，</span>
				<span v-if="limit">最多 {{ limit }} 个文件</span>
			</div>
		</template>
	</el-upload>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import HxFilePreview from '../file-preview/FilePreview.vue'
import type { UploadProps } from './types'
import { request, getRequest } from '../../utils/request'

function formatFileSize(size?: number): string {
	if (!size) return ''
	if (size < 1024) return `${size} B`
	if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
	if (size < 1024 * 1024 * 1024) return `${(size / 1024 / 1024 / 1024).toFixed(1)} GB`
	return `${(size / 1024 / 1024 / 1024).toFixed(1)} GB`
}

const MODEL_VALUE_SEPARATOR = ','

const props = withDefaults(defineProps<UploadProps>(), {
	placeholder: '点击上传',
	listType: 'file-preview',
	autoUpload: true,
	showDownload: true,
	modelValueType: 'array',
	name: 'file',
})

const emit = defineEmits<{
	(e: 'update:modelValue', value: string | string[]): void
	(e: 'success', response: any, file: any, fileList: any[]): void
}>()

// ——————————————————————————————————
// modelValue 类型处理（参考 Transfer 组件）
// ——————————————————————————————————

/** 解析 v-model 绑定的值为内部统一数组格式 */
const parseModelValue = (value: string | string[] | undefined): string[] => {
	if (!value) return []
	if (Array.isArray(value)) return value.map(v => String(v)).filter(Boolean)
	if (typeof value === 'string') {
		return value.split(MODEL_VALUE_SEPARATOR).map(s => s.trim()).filter(Boolean)
	}
	return []
}

/**
 * 将内部数组格式化为符合 modelValueType 的输出值。
 * - modelValueType="array" → 返回字符串数组
 * - modelValueType="string" → 返回逗号拼接字符串
 */
const formatModelValue = (values: string[]): string | string[] => {
	if (props.modelValueType === 'string') {
		return values.join(MODEL_VALUE_SEPARATOR)
	}
	return values
}

/** 触发 emit，统一使用 formatModelValue */
const emitValue = (values: string[]) => {
	emit('update:modelValue', formatModelValue(values))
}

const uploadRef = ref()

/* ============================================================
   file-preview 模式：v-model (modelValue) 是唯一数据源
   ============================================================ */

interface PreviewItem {
	fileId: string
	name: string
	size?: number
	url: string
	loading: boolean
}

const previewMap = reactive<Map<string, PreviewItem>>(new Map())
const pendingFetches = new Set<string>()

// previewList：computed 保证每次访问都从 previewMap 取最新值
const previewList = computed<PreviewItem[]>(() => {
	return parseModelValue(props.modelValue)
		.map((id) => previewMap.get(id))
		.filter((item): item is PreviewItem => !!item)
})

/** 同步 modelValue → previewMap（新增取 GET，移除触发 DELETE） */
function syncPreviewMap(nextIdsRaw: string | string[] | undefined) {
	const nextIds = parseModelValue(nextIdsRaw)
	const nextSet = new Set(nextIds)

	// 移除：id 不再出现在 modelValue 中
	for (const [id] of previewMap) {
		if (!nextSet.has(id)) {
			if (props.deleteUrl) {
				console.log('delete file by id', `${props.deleteUrl}/${id}`)
				request.delete(`${props.deleteUrl}/${id}`).catch((e: any) => {
					console.error('[HxUpload] DELETE failed:', e)
				})
			}
			previewMap.delete(id)
			pendingFetches.delete(id)
		}
	}

	// 新增：id 首次出现，构建预览项并触发 URL 拉取
	for (const id of nextIds) {
		if (!previewMap.has(id)) {
			const item: PreviewItem = reactive({
				fileId: id,
				name: `文件 ${id}`,
				size: undefined,
				url: '',
				loading: true,
			})
			previewMap.set(id, item)
			fetchPreviewUrl(id)
		}
	}
}

// 初始化时同步一次
onMounted(() => syncPreviewMap(props.modelValue))

// 后续 modelValue 变化时同步
watch(
	() => props.modelValue,
	(next) => syncPreviewMap(next),
)

async function fetchPreviewUrl(fileId: string) {
	if (pendingFetches.has(fileId)) return
	pendingFetches.add(fileId)
	// console.log('fetch file info by id', fileId)

	try {
		const res = await request.get<{ code?: number; data?: { url?: string; name?: string; size?: number } }>(
			`${props.previewUrl}/${fileId}`,
		)

		if (res.data) {
			const data = res.data;
			const item = previewMap.get(fileId)
			if (item) {
				item.url = data.url ?? ''
				item.name = data.name ?? item.name
				item.size = data.size
				item.loading = false
			}
		}
	} catch {
		const item = previewMap.get(fileId)
		if (item) item.loading = false
	} finally {
		pendingFetches.delete(fileId)
	}
}

async function handleRemove(item: PreviewItem) {
	const newIds = parseModelValue(props.modelValue).filter((id) => id !== item.fileId)
	emitValue(newIds)
}

function handleDownload(item: PreviewItem) {
	if (!item.url) return
	const a = document.createElement('a')
	a.href = item.url
	a.download = item.name
	a.click()
}

// 上传成功：提取 fileId，追加到 modelValue
function handleSuccess(response: any, file: any, fileList: any[]) {
	if(!response) return 
	const fileId = props.responseMapper ? props.responseMapper(response, file) : response?.data?.id
	if (!fileId) return
	// console.log('handleSuccess', response, file, fileList)

	const currentIds = parseModelValue(props.modelValue)
	if (!currentIds.includes(fileId)) {
		emitValue([...currentIds, fileId])
	}

	// 若接口直接返回 url，也同步更新到 previewMap
	const directUrl = response?.data?.url
	if (directUrl && previewMap.has(fileId)) {
		const item = previewMap.get(fileId)!
		item.url = directUrl
		item.name = file.name
		item.size = file.size
		item.loading = false
	}

	emit('success', response, file, fileList)
}

function handleExceed() {
	if (props.limit) {
		console.warn(`[HxUpload] 最多上传 ${props.limit} 个文件`)
	}
}

async function handleHttpRequest(options: any) {
	const { file, onProgress, onSuccess, onError } = options

	const formData = new FormData()
	formData.append(props.name || 'file', file)

	if (props.data) {
		for (const key in props.data) {
			formData.append(key, props.data[key])
		}
	}

	try {
		const instance = getRequest()
		const res = await instance.post(props.action!, formData, {
			headers: {
				...(props.headers ?? {}),
				'Content-Type': 'multipart/form-data',
			},
			withCredentials: props.withCredentials,
			onUploadProgress: (progressEvent: any) => {
				if (progressEvent.total) {
					onProgress({ percent: Math.round((progressEvent.loaded / progressEvent.total) * 100) })
				}
			},
		})
		onSuccess(res, file, [])
	} catch (err) {
		onError(err)
	}
}

/* ============================================================
   其他 listType：el-upload 原生模式
   ============================================================ */

const innerFileList = ref<any[]>([])

const effectiveListType = computed(() => {
	if (props.listType === 'file-preview') return 'picture-card'
	return props.listType
})

const mappedValues = computed(() => {
	const list = innerFileList.value.filter((f) => f.status === 'success')
	if (props.responseMapper) {
		return list.map((f) => props.responseMapper!(f.response, f))
	}
	if (props.valueMapper) {
		return list.map((f) => props.valueMapper!(f, f.response))
	}
	return list
})

const innerValue = computed({
	get: () => {
		if (props.responseMapper || props.valueMapper) {
			return mappedValues.value
		}
		return innerFileList.value
	},
	set: () => {},
})

function handleChange(file: any, fileList: any[]) {
	innerFileList.value = fileList
}

defineExpose({
	handleRemove: (file: any) => uploadRef.value?.handleRemove(file),
})
</script>

<style scoped lang="scss">
// file-preview 模式样式
.hx-upload-file-preview-mode {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.hx-upload-file-preview-actions {
	display: flex;
	align-items: center;
	gap: 12px;
}

.hx-upload-file-preview-list {
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
}

.hx-upload-file-preview-item {
	position: relative;
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 8px 12px;
	background: #f5f7fa;
	border: 1px solid #ebeef5;
	border-radius: 6px;
	transition: all 0.2s;

	&:hover:not(.is-disabled) {
		border-color: #409eff;

		.hx-upload-file-preview-item-actions {
			opacity: 1;
		}
	}

	&.is-disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
}

.hx-upload-file-preview-thumb {
	flex-shrink: 0;
	border-radius: 4px;
	overflow: hidden;
}

.hx-upload-file-preview-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 2px;
	min-width: 0;
}

.hx-upload-file-preview-item-actions {
	position: absolute;
	top: 4px;
	right: 4px;
	display: flex;
	align-items: center;
	gap: 2px;
	opacity: 0;
	transition: opacity 0.2s;
}

.hx-upload-file-preview-name {
	font-size: 14px;
	color: #303133;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.hx-upload-file-preview-size {
	font-size: 12px;
	color: #909399;
}

.hx-upload-file-preview-action-btn {
	width: 18px;
	height: 18px;
	background: rgba(0, 0, 0, 0.5);
	border-radius: 50%;
	color: #fff;
	font-size: 12px;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: background 0.2s;

	&:hover {
		background: rgba(0, 0, 0, 0.7);
	}
}

.hx-upload-file-preview-remove {
	&:hover {
		background: #f56c6c;
	}
}

.hx-upload-file-preview-tip {
	font-size: 12px;
	color: #909399;
}
</style>
