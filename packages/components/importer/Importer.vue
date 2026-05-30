<!--
  Importer - 表格导入组件
  默认渲染 Button，点击打开弹窗进行文件上传
-->
<template>
	<el-button v-bind="$attrs" @click="handleOpen">
		{{ buttonText }}
	</el-button>

	<el-dialog
		v-model="visible"
		:title="dialogTitle"
		width="520px"
		append-to-body
		:close-on-click-modal="false"
		@close="handleClose"
	>
		<!-- 模板下载 -->
		<div v-if="resolvedTemplateUrl" class="importer-template">
			<span class="importer-template-label">导入模板：</span>
			<el-link type="primary" :href="resolvedTemplateUrl" :download="templateFileName" target="_blank">
				<el-icon class="el-icon--left"><Download /></el-icon>
				{{ templateFileName || '下载模板' }}
			</el-link>
		</div>

		<!-- 上传区域 -->
		<el-upload
			ref="uploadRef"
			class="importer-upload-area"
			drag
			:action="uploadAction"
			:accept="props.accept"
			:limit="limit"
			:multiple="multiple"
			:auto-upload="false"
			:with-credentials="true"
			:name="props.name"
			:data="props.data"
			:on-change="handleChange"
			:on-exceed="handleExceed"
			:on-remove="handleRemove"
		>
			<el-icon class="el-icon--large"><UploadFilled /></el-icon>
			<div class="el-upload__text">
				将文件拖到此处，或<em>点击上传</em>
			</div>
			<template #tip>
				<div class="el-upload__tip">
					<span>支持 {{ props.accept }} 格式</span>
					<span v-if="maxSize">，单个文件不超过 {{ maxSize }}MB</span>
				</div>
			</template>
		</el-upload>

		<!-- 上传进度 -->
		<div v-if="uploading" class="importer-progress">
			<div class="importer-progress-text">
				{{ getUploadProgressText() }}
			</div>
			<el-progress :percentage="uploadProgress" :stroke-width="10" />
		</div>

		<template #footer>
			<el-button @click="handleClose">关闭</el-button>
			<el-button
				type="primary"
				:loading="uploading"
				:disabled="fileList.length === 0"
				@click="handleUpload"
			>
				{{ uploading ? `上传中（${uploadedCount}/${fileList.length}）` : '上传' }}
			</el-button>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Download, UploadFilled } from '@element-plus/icons-vue'
import type { UploadInstance, UploadFile } from 'element-plus'
import { getRequest, getRequestOptions } from '../../utils/request'
import type { ImporterProps } from './types'

defineOptions({
	name: 'HxImporter',
	inheritAttrs: false,
})

const props = withDefaults(defineProps<ImporterProps>(), {
	templateUrl: '',
	templateFileName: '',
	accept: '.xlsx,.xls',
	maxSize: 10,
	method: 'post',
	buttonText: '导入',
	dialogTitle: '导入数据',
	multiple: false,
	limit:1,
	autoCloseAfterUpload: true,
	name: 'file',
	data: () => ({}),
})

const emit = defineEmits<{
	(e: 'success', response: any): void
	(e: 'error', error: any): void
}>()

const visible = ref(false)
const uploadRef = ref<UploadInstance>()
const uploading = ref(false)
const uploadedCount = ref(0)
const uploadProgress = ref(0)

const fileList = ref<UploadFile[]>([])

/** 处理模板 URL：相对路径需要拼接 baseUrl 和 prefix，完整路径直接返回 */
const resolvedTemplateUrl = computed(() => {
	const url = props.templateUrl
	if (!url) return ''

	// 完整 URL（包含协议）直接返回
	if (/^https?:\/\//i.test(url)) {
		return url
	}

	// 相对路径：拼接 baseUrl 和 prefix
	const options = getRequestOptions()
	const baseUrl = options.baseUrl || ''
	const prefix = options.prefix || ''

	let fullUrl = baseUrl

	// 处理 prefix
	if (prefix) {
		const normalizedPrefix = prefix.endsWith('/') ? prefix.slice(0, -1) : prefix
		const normalizedUrl = url.startsWith('/') ? url : '/' + url
		fullUrl += normalizedPrefix + normalizedUrl
	} else {
		fullUrl += url.startsWith('/') ? url : '/' + url
	}

	return fullUrl
})

function getUploadProgressText(): string {
	if (fileList.value.length === 0) return ''
	return `正在上传第 ${uploadedCount.value + 1} / ${fileList.value.length} 个文件`
}

function handleOpen() {
	visible.value = true
}

function handleChange(file: UploadFile) {
	// el-upload 在删除文件时也会触发 on-change，此时 status 为 'removed'
	// 这种情况不需要处理，因为 handleRemove 已经处理了
	if ((file.status as string) === 'removed') return

	// 验证单个文件大小
	const rawFile = file.raw as File | undefined
	if (rawFile) {
		const fileSizeMB = rawFile.size / 1024 / 1024
		if (fileSizeMB > props.maxSize) {
			ElMessage.warning(`文件"${file.name}"大小不能超过 ${props.maxSize}MB`)
			uploadRef.value?.handleRemove(file)
			return
		}
	}

	// 检查是否已存在同名文件
	const exists = fileList.value.some((f: UploadFile) => f.uid !== file.uid && f.name === file.name)
	if (exists) {
		ElMessage.warning(`文件"${file.name}"已添加`)
		uploadRef.value?.handleRemove(file)
		return
	}

	// 如果是新增文件，添加到 fileList
	if (!fileList.value.some((f) => f.uid === file.uid)) {
		fileList.value.push(file)
	}

	uploadProgress.value = 0
}

function handleRemove(uploadFile: UploadFile) {
	const index = fileList.value.findIndex((f) => f.uid === uploadFile.uid)
	if (index > -1) {
		fileList.value.splice(index, 1)
	}
}

function handleExceed() {
	ElMessage.warning(`最多只能上传 ${props.limit} 个文件`)
}

async function handleUpload() {
	if (fileList.value.length === 0) {
		ElMessage.warning('请先选择文件')
		return
	}

	if (!props.uploadAction) {
		ElMessage.warning('上传接口地址未配置')
		return
	}

	uploading.value = true
	uploadedCount.value = 0
	uploadProgress.value = 0

	const instance = getRequest()
	const method = props.method || 'post'

	const results: any[] = []
	let hasError = false

	for (let i = 0; i < fileList.value.length; i++) {
		const file = fileList.value[i]
		if (!file.raw) continue

		const currentIndex = i
		uploadedCount.value = currentIndex

		try {
			const formData = new FormData()
			formData.append(props.name || 'file', file.raw)

			const extraData = props.data
			if (extraData) {
				for (const key in extraData) {
					formData.append(key, extraData[key])
				}
			}

			const config: Record<string, any> = {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				withCredentials: true,
				onUploadProgress: (progressEvent: any) => {
					if (progressEvent.total) {
						const currentProgress = progressEvent.loaded / progressEvent.total
						uploadProgress.value = Math.round(
							((currentIndex + currentProgress) / fileList.value.length) * 100
						)
					}
				},
			}
			if (props.headers) {
				config.headers = { ...config.headers, ...props.headers }
			}
			if (props.timeout) config.timeout = props.timeout

			const res = await (instance as any)[method](props.uploadAction, formData, config)

			ElMessage.success(`文件"${file.name}"上传成功`)
			results.push(res)
		} catch (err: any) {
			hasError = true
			ElMessage.error(`文件"${file.name}"上传失败：${err?.message || '未知错误'}`)
			emit('error', err)
			props.onError?.(err)
		}
	}

	if (!hasError) {
		emit('success', results)
		props.onSuccess?.(results)
	}

	uploadedCount.value = fileList.value.length
	uploadProgress.value = 100

	if (!hasError) {
		resetState()

		if (props.multiple) {
			ElMessage.success('所有文件上传完成')
		}

		if (props.autoCloseAfterUpload) {
			visible.value = false
		}
	}

	uploading.value = false
}

function resetState() {
	uploadProgress.value = 0
	uploadedCount.value = 0
	fileList.value = []
	uploadRef.value?.clearFiles()
}

function handleClose() {
	resetState()
	visible.value = false
}

defineExpose({
	open: handleOpen,
	close: handleClose,
})
</script>

<style scoped lang="scss">
.importer-template {
	display: flex;
	align-items: center;
	margin-bottom: 20px;
	padding: 12px 16px;
	background: var(--el-fill-color-light);
	border-radius: 4px;

	.importer-template-label {
		color: var(--el-text-color-regular);
		font-size: 14px;
	}
}

.importer-upload-area {
	width: 100%;

	:deep(.el-upload) {
		width: 100%;

		.el-upload-dragger {
			padding: 40px 20px;
			width: 100%;
			background-color: var(--el-fill-color-lighter);
			border-color: var(--el-border-color);

			&:hover {
				border-color: var(--el-color-primary);
			}
		}
	}
}

.importer-progress {
	margin-top: 16px;

	.importer-progress-text {
		margin-bottom: 8px;
		color: var(--el-text-color-regular);
		font-size: 13px;
		text-align: center;
	}
}
</style>
