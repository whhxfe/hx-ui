<!--
  HxUploadFilePreviewList - 文件预览列表组件（纯展示版）
  根据文件 ID 列表，通过 previewUrl 获取文件信息并渲染预览。
  不包含上传逻辑，仅负责展示。
-->
<template>
	<div class="hx-upload-file-preview-list">
		<div
			v-for="item in previewList"
			:key="item.fileId"
			class="hx-upload-file-preview-list-item"
			:class="{ 'is-disabled': disabled }"
			:style="{
				width: normalizedWidth,
				height: normalizedHeight,
			}"
		>
			<HxFilePreview
				:url="item.url"
				preview-width="100px"
				preview-height="80px"
				class="hx-upload-file-preview-list-thumb"
			/>
			<div class="hx-upload-file-preview-list-info">
				<span class="hx-upload-file-preview-list-name" :title="item.name">
					{{ item.name }}
				</span>
				<span class="hx-upload-file-preview-list-size">
					{{ formatFileSize(item.size) }}
				</span>
			</div>
			<div class="hx-upload-file-preview-list-item-actions">
				<hx-icon
					v-if="showDownload"
					type="iconify"
					name="ep:download"
					class="hx-upload-file-preview-list-action-btn"
					@click.stop="handleDownload(item)"
				/>
				<hx-icon
					v-if="removable"
					type="iconify"
					name="ep:close"
					class="hx-upload-file-preview-list-action-btn hx-upload-file-preview-list-remove"
					@click.stop="handleRemove(item)"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, watch } from 'vue'
import { ElMessageBox } from 'element-plus'
import HxFilePreview from '../file-preview/FilePreview.vue'
import { request } from '../../utils/request'
import type { UploadFilePreviewListProps } from './types'

function formatFileSize(size?: number): string {
	if (!size) return ''
	if (size < 1024) return `${size} B`
	if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
	if (size < 1024 * 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`
	return `${(size / 1024 / 1024 / 1024).toFixed(1)} GB`
}

function normalizeSize(value?: string | number): string | undefined {
	if (value === undefined || value === null) return undefined
	return typeof value === 'number' ? `${value}px` : value
}

const MODEL_VALUE_SEPARATOR = ','

const props = withDefaults(defineProps<UploadFilePreviewListProps>(), {
	showDownload: true,
	removable: true,
	disabled: false,
	modelValueType: 'array',
	removeConfirmTitle: '确认删除',
	removeConfirmMessage: '确定要删除文件「{name}」吗？',
	itemWidth: undefined,
	itemHeight: undefined,
})

const normalizedWidth = computed(() => normalizeSize(props.itemWidth))
const normalizedHeight = computed(() => normalizeSize(props.itemHeight))

const emit = defineEmits<{
	(e: 'update:modelValue', value: string | string[]): void
	(e: 'remove', fileId: string): void
}>()

interface PreviewItem {
	fileId: string
	name: string
	size?: number
	url: string
	loading: boolean
}

const previewMap = reactive<Map<string, PreviewItem>>(new Map())
const pendingFetches = reactive<Set<string>>(new Set())

// 用于存储请求的 AbortController，以支持取消请求
const pendingControllers = new Map<string, AbortController>()

const previewList = computed<PreviewItem[]>(() => {
	return parseModelValue(props.modelValue)
		.map((id) => previewMap.get(id))
		.filter((item): item is PreviewItem => !!item)
})

const parseModelValue = (value: string | string[] | undefined): string[] => {
	if (!value) return []
	if (Array.isArray(value)) return value.map(v => String(v)).filter(Boolean)
	if (typeof value === 'string') {
		return value.split(MODEL_VALUE_SEPARATOR).map(s => s.trim()).filter(Boolean)
	}
	return []
}

const formatModelValue = (values: string[]): string | string[] => {
	if (props.modelValueType === 'string') {
		return values.join(MODEL_VALUE_SEPARATOR)
	}
	return values
}

const emitValue = (values: string[]) => {
	emit('update:modelValue', formatModelValue(values))
}

function syncPreviewMap(nextIdsRaw: string | string[] | undefined) {
	const nextIds = parseModelValue(nextIdsRaw)
	const nextSet = new Set(nextIds)

	// 取消并清理不再需要的请求
	for (const [id] of previewMap) {
		if (!nextSet.has(id)) {
			previewMap.delete(id)
			// 取消仍在进行中的请求
			const controller = pendingControllers.get(id)
			if (controller) {
				controller.abort()
				pendingControllers.delete(id)
				pendingFetches.delete(id)
			}
		}
	}

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

onMounted(() => syncPreviewMap(props.modelValue))

watch(
	() => props.modelValue,
	(next) => syncPreviewMap(next),
)

async function fetchPreviewUrl(fileId: string) {
	if (pendingFetches.has(fileId)) return
	pendingFetches.add(fileId)

	const controller = new AbortController()
	pendingControllers.set(fileId, controller)

	try {
		const res = await request.get<{ code?: number; data?: { url?: string; name?: string; size?: number } }>(
			`${props.previewUrl}/${fileId}`,
			{ signal: controller.signal },
		)

		// 检查请求是否已被取消
		if (controller.signal.aborted) return

		if (res.data) {
			const data = res.data
			const item = previewMap.get(fileId)
			if (item) {
				item.url = data.url ?? ''
				item.name = data.name ?? item.name
				item.size = data.size
				item.loading = false
			}
		}
	} catch (err: any) {
		// 忽略 abort 错误
		if (err?.name === 'AbortError' || err?.name === 'CanceledError') return
		const item = previewMap.get(fileId)
		if (item) item.loading = false
	} finally {
		if (!controller.signal.aborted) {
			pendingFetches.delete(fileId)
			pendingControllers.delete(fileId)
		}
	}
}

async function handleRemove(item: PreviewItem) {
	if (props.disabled) return
	const defaultMessage = '确定要删除该文件吗？'
	const message = props.removeConfirmMessage?.replace('{name}', item.name) ?? defaultMessage
	try {
		await ElMessageBox.confirm(message, props.removeConfirmTitle, {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		})
		console.log('props.deleteUrl',props.deleteUrl);
		// 调用 deleteUrl 删除后端文件
		if (props.deleteUrl) {
			try {
				await request.delete(`${props.deleteUrl}/${item.fileId}`)
			} catch (e) {
				console.error('[HxUploadFilePreviewList] 删除文件失败:', e)
			}
		}
		const newIds = parseModelValue(props.modelValue).filter((id) => id !== item.fileId)
		emitValue(newIds)
		emit('remove', item.fileId)
	} catch {
		// 用户取消操作
	}
}

function handleDownload(item: PreviewItem) {
	if (!item.url) return
	const a = document.createElement('a')
	a.href = item.url
	a.download = item.name
	a.click()
}
</script>

<style scoped lang="scss">
.hx-upload-file-preview-list {
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
}

.hx-upload-file-preview-list-item {
	position: relative;
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 8px 12px;
	min-width: 0;
	background: #f5f7fa;
	border: 1px solid #ebeef5;
	border-radius: 6px;
	transition: all 0.2s;

	&:hover:not(.is-disabled) {
		border-color: #409eff;

		.hx-upload-file-preview-list-item-actions {
			opacity: 1;
		}
	}

	&.is-disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
}

.hx-upload-file-preview-list-thumb {
	flex-shrink: 0;
	border-radius: 4px;
	overflow: hidden;
}

.hx-upload-file-preview-list-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 2px;
	min-width: 0;
}

.hx-upload-file-preview-list-item-actions {
	position: absolute;
	top: 4px;
	right: 4px;
	display: flex;
	align-items: center;
	gap: 2px;
	opacity: 0;
	transition: opacity 0.2s;
}

.hx-upload-file-preview-list-name {
	font-size: 14px;
	color: #303133;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.hx-upload-file-preview-list-size {
	font-size: 12px;
	color: #909399;
}

.hx-upload-file-preview-list-action-btn {
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

.hx-upload-file-preview-list-remove {
	&:hover {
		background: #f56c6c;
	}
}
</style>
