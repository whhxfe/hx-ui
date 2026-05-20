<!--
  Exporter - 表格导出组件
  默认渲染 Button，点击打开弹窗选择导出方式并导出
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
		<!-- 导出方式选择 -->
		<div class="exporter-mode">
			<div class="exporter-mode-title">请选择导出方式：</div>
			<el-radio-group v-model="exportType" class="exporter-mode-options">
				<el-radio v-if="visibleOptions.includes('page')" value="page" class="exporter-radio-item">
					<span class="exporter-radio-label">按页导出</span>
					<span class="exporter-mode-hint">
						（第 {{ currentPage || 1 }} 页，共 {{ effectivePageSize }} 条）
					</span>
				</el-radio>
				<el-radio v-if="visibleOptions.includes('all')" value="all" class="exporter-radio-item">
					<span class="exporter-radio-label">全部导出</span>
					<span class="exporter-mode-hint">
						（{{ totalCount || 0 }} / {{ maxExportCount }} 条）
					</span>
				</el-radio>
				<el-radio v-if="visibleOptions.includes('count')" value="count" class="exporter-radio-item">
					<span class="exporter-radio-label">按数量导出</span>
					<el-input-number
						v-model="exportCount"
						:min="1"
						:max="maxExportCount"
						size="small"
						class="exporter-count-input"
						@click.stop
					/>
				</el-radio>
				<el-radio v-if="visibleOptions.includes('selected')" value="selected" class="exporter-radio-item" :disabled="!hasSelectedRows">
					<span class="exporter-radio-label">选中导出</span>
					<span class="exporter-mode-hint">
						（{{ selectedRows?.length || 0 }} 条）
					</span>
				</el-radio>
			</el-radio-group>
		</div>

		<!-- 数量警告 -->
		<el-alert
			v-if="effectiveCount > maxExportCount"
			title="数据量超过限制"
			type="warning"
			:description="`最多支持导出 ${maxExportCount} 条数据，请减少导出范围`"
			show-icon
			:closable="false"
			class="exporter-warning"
		/>

		<!-- 导出进度 -->
		<div v-if="exportStatus !== 'none'" class="exporter-progress">
			<el-progress
				:percentage="progress"
				:status="progressStatus"
				:stroke-width="10"
			/>
			<div class="exporter-progress-text">{{ progressText }}</div>
		</div>

		<template #footer>
			<el-button @click="handleClose">取消</el-button>
			<el-button
				type="primary"
				:disabled="effectiveCount > maxExportCount || effectiveCount <= 0"
				:loading="exportStatus !== 'none'"
				@click="handleExport"
			>
				确认导出
			</el-button>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getRequest } from '../../utils/request'
import type { ExporterProps, ExportType, ExportProgressType, ExportOption } from './types'

defineOptions({
	name: 'HxExporter',
	inheritAttrs: false,
})

const props = withDefaults(defineProps<ExporterProps>(), {
	method: 'post',
	maxExportCount: 10000,
	selectedRows: () => [],
	rowIdField: 'id',
	idsDelimiter: undefined,
	totalCount: 0,
	currentPage: 1,
	pageSize: 10,
	buttonText: '导出',
	dialogTitle: '导出数据',
	extraParams: () => ({}),
	fileNamePrefix: 'export',
	autoCloseAfterExport: true,
	exportOptions: () => ['page', 'all', 'count', 'selected'] as ExportOption[],
})

const emit = defineEmits<{
	(e: 'on-success'): void
	(e: 'on-error', error: any): void
}>()

const visible = ref(false)
const exportType = ref<ExportType>('page')
const exportCount = ref(100)
const exportStatus = ref<ExportProgressType>('none')
const progress = ref(0)

const hasSelectedRows = computed(() => {
	return props.selectedRows && props.selectedRows.length > 0
})

const effectivePageSize = computed(() => {
	return Math.min(props.pageSize, props.totalCount)
})

const effectiveCount = computed(() => {
	switch (exportType.value) {
		case 'page':
			return effectivePageSize.value
		case 'all':
			return props.totalCount
		case 'count':
			return exportCount.value
		case 'selected':
			return props.selectedRows?.length || 0
		default:
			return 0
	}
})

const progressText = computed(() => {
	switch (exportStatus.value) {
		case 'preparing':
			return '正在准备导出数据...'
		case 'downloading':
			return '正在下载文件...'
		case 'complete':
			return '导出完成'
		default:
			return ''
	}
})

const visibleOptions = computed(() => {
	const options = (props.exportOptions as ExportOption[]) ?? ['page', 'all', 'count', 'selected']
	return options
})

const progressStatus = computed(() => {
	if (exportStatus.value === 'complete') return 'success'
	return undefined
})

// 当可见选项变化时，若当前选中项不可见，切换到第一个可见选项
watch(visibleOptions, (options) => {
	if (options.length > 0 && !options.includes(exportType.value)) {
		exportType.value = options[0]
	}
}, { immediate: true })

// 监听导出类型切换，必要时重置数量
watch(exportType, (type) => {
	if (type === 'count') {
		exportCount.value = props.pageSize
	}
})

function resetState() {
	exportType.value = 'page'
	exportCount.value = props.pageSize
	exportStatus.value = 'none'
	progress.value = 0
}

function handleOpen() {
	visible.value = true
}

function handleClose() {
	resetState()
	visible.value = false
}

/**
 * 尝试从后端错误响应（blob）中提取 JSON 错误信息
 */
async function extractErrorFromBlob(error: any): Promise<string> {
	if (error?.response?.data instanceof Blob) {
		try {
			const text = await error.response.data.text()
			const parsed = JSON.parse(text)
			return parsed.message || parsed.msg || text
		} catch {
			// 不是 JSON，忽略
		}
	}
	return error?.message || '导出失败'
}

/**
 * 解析 content-disposition 获取文件名
 */
function parseFileName(contentDisposition: string, prefix: string): string {
	if (!contentDisposition) return `${prefix}_${Date.now()}.xlsx`
	const match = contentDisposition.match(/filename\*?=['"]?(?:UTF-8'')?([^;\n"']+)/i)
	if (match) {
		return decodeURIComponent(match[1])
	}
	return `${prefix}_${Date.now()}.xlsx`
}

/**
 * 发起下载
 */
function triggerDownload(data: Blob, fileName: string) {
	const url = window.URL.createObjectURL(data)
	const link = document.createElement('a')
	link.href = url
	link.download = fileName
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
	window.URL.revokeObjectURL(url)
}

/**
 * 构造请求 URL，处理 exportAction 上已有的 query 参数
 */
function buildRequestUrl(action: string, params: Record<string, any>): string {
	const hasQuery = action.includes('?')
	const queryString = new URLSearchParams(params).toString()
	if (!queryString) return action
	return hasQuery ? `${action}&${queryString}` : `${action}?${queryString}`
}

async function handleExport() {
	if (!props.exportAction) {
		ElMessage.warning('导出接口地址未配置')
		return
	}

	if (effectiveCount.value > props.maxExportCount) {
		ElMessage.warning(`数据量超过限制，最多支持导出 ${props.maxExportCount} 条数据`)
		return
	}

	exportStatus.value = 'preparing'
	progress.value = 10

	try {
		// 构造导出参数
		const params: Record<string, any> = { ...props.extraParams }

		switch (exportType.value) {
			case 'page':
				params.exportType = 'page'
				params.page = props.currentPage
				params.pageSize = props.pageSize
				break
			case 'all':
				params.exportType = 'all'
				break
			case 'count':
				params.exportType = 'count'
				params.exportCount = exportCount.value
				break
			case 'selected':
				params.exportType = 'selected'
				const idArray = props.selectedRows?.map((row) => row[props.rowIdField]) || []
				params.ids = props.idsDelimiter ? idArray.join(props.idsDelimiter) : idArray
				break
		}

		// 获取检索条件
		if (props.getSearchParams) {
			const searchParams = props.getSearchParams()
			Object.assign(params, searchParams)
		}

		// 发起导出请求
		const instance = getRequest()
		const requestConfig: Record<string, any> = {
			responseType: 'blob' as const,
			onDownloadProgress: (progressEvent: any) => {
				if (progressEvent.total) {
					progress.value = Math.round((progressEvent.loaded / progressEvent.total) * 90) + 10
				} else {
					// 没有 total 信息时使用不确定进度
					progress.value = progress.value >= 80 ? 80 : progress.value + 5
				}
			},
		}
		if (props.headers) requestConfig.headers = props.headers
		if (props.timeout) requestConfig.timeout = props.timeout

		exportStatus.value = 'downloading'

		let response
		if (props.method === 'get') {
			const url = buildRequestUrl(props.exportAction, params)
			response = await instance.get(url, requestConfig)
		} else {
			response = await instance.post(props.exportAction, params, requestConfig)
		}

		// 提取文件名
		const contentDisposition =
			response.headers?.['content-disposition'] || response.headers?.['Content-Disposition'] || ''
		const fileName = parseFileName(contentDisposition, props.fileNamePrefix)

		// 创建下载链接
		triggerDownload(response.data, fileName)

		progress.value = 100
		exportStatus.value = 'complete'

		ElMessage.success('导出成功')
		emit('on-success')
		props.onSuccess?.()

		// 自动关闭
		if (props.autoCloseAfterExport) {
			setTimeout(() => {
				handleClose()
			}, 1500)
		}
	} catch (error: any) {
		exportStatus.value = 'none'
		progress.value = 0
		const errMsg = await extractErrorFromBlob(error)
		ElMessage.error(errMsg)
		emit('on-error', error)
		props.onError?.(error)
	}
}

defineExpose({
	open: handleOpen,
	close: handleClose,
})
</script>

<style scoped lang="scss">
.exporter-mode {
	margin-bottom: 20px;

	.exporter-mode-title {
		margin-bottom: 12px;
		color: #303133;
		font-size: 14px;
		font-weight: 500;
	}

	.exporter-mode-options {
		display: flex;
		flex-direction: column;
		gap: 12px;

		:deep(.el-radio) {
			width: 100%;
			min-height: 48px;
			padding: 12px 16px;
			border: 1px solid #dcdfe6;
			border-radius: 4px;
			margin-right: 0;
			transition: all 0.2s;
			display: inline-flex;
			align-items: center;

			.el-radio__input {
				flex-shrink: 0;
			}

			&:hover:not(.is-disabled) {
				border-color: #409eff;
			}

			&.is-checked {
				border-color: #409eff;
				background: #ecf5ff;
			}

			&.is-disabled {
				cursor: not-allowed;
				opacity: 0.6;
			}

			.el-radio__label {
				display: inline-flex;
				flex-wrap: wrap;
				align-items: center;
				gap: 8px;
				line-height: 24px;
				padding-left: 4px;
			}
		}

		.exporter-radio-item {
			width: 100%;
		}

		.exporter-radio-label {
			flex-shrink: 0;
			line-height: 24px;
		}

		.exporter-mode-hint {
			color: #909399;
			font-size: 12px;
			line-height: 24px;
		}

		.exporter-count-input {
			width: 128px;
			line-height: 24px;

			:deep(.el-input__wrapper) {
				padding-left: 8px;
				padding-right: 8px;
			}

			:deep(.el-input-number__decrease),
			:deep(.el-input-number__increase) {
				height: 22px;
			}

			:deep(.el-input__inner) {
				height: 24px;
				line-height: 24px;
			}
		}
	}
}

.exporter-warning {
	margin-bottom: 20px;
}

.exporter-progress {
	margin-top: 20px;

	.exporter-progress-text {
		margin-top: 8px;
		text-align: center;
		color: #606266;
		font-size: 14px;
	}
}
</style>