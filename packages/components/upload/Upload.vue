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

		<!-- 文件预览列表：使用 UploadFilePreviewList 组件 -->
		<HxUploadFilePreviewList
			v-if="hasPreviewList"
			:model-value="modelValue"
			:preview-url="previewUrl!"
			:delete-url="deleteUrl"
			:show-download="showDownload"
			:removable="removable"
			:disabled="disabled"
			:model-value-type="modelValueType"
			:item-width="itemWidth"
			:item-height="itemHeight"
			v-bind="confirmProps"
			@update:model-value="$emit('update:modelValue', $event)"
		/>
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
				:is="fileRender?.((file as any), { remove: () => uploadRef?.handleRemove(file) })"
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
import { computed, ref } from 'vue'
import HxUploadFilePreviewList from '../upload-file-preview-list/UploadFilePreviewList.vue'
import type { UploadProps } from './types'
import { getRequest } from '../../utils/request'

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
// modelValue 类型处理
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
   file-preview 模式：使用 HxUploadFilePreviewList 渲染
   ============================================================ */

const hasPreviewList = computed(() => {
	return parseModelValue(props.modelValue).length > 0
})

/** 只在有值时才传递给子组件，避免覆盖默认值 */
const confirmProps = computed(() => {
	const result: Record<string, any> = {}
	if (props.removeConfirmTitle) result.removeConfirmTitle = props.removeConfirmTitle
	if (props.removeConfirmMessage) result.removeConfirmMessage = props.removeConfirmMessage
	return result
})

// 上传成功：提取 fileId，追加到 modelValue
function handleSuccess(response: any, file: any, fileList: any[]) {
	if (!response) return
	const fileId = props.responseMapper ? props.responseMapper(response, file) : response?.data?.id
	if (!fileId) return

	const currentIds = parseModelValue(props.modelValue)
	if (!currentIds.includes(fileId)) {
		emitValue([...currentIds, fileId])
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

function handleRemove(file: any) {
	innerFileList.value = innerFileList.value.filter((f) => f.uid !== file.uid)
}

defineExpose({
	handleRemove: (file: any) => uploadRef.value?.handleRemove(file),
})
</script>

<style scoped lang="scss">
// file-preview 模式样式由 HxUploadFilePreviewList 组件提供

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

.hx-upload-file-preview-tip {
	font-size: 12px;
	color: var(--el-text-color-placeholder);
}
</style>
