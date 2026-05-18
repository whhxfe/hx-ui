export interface UploadFilePreviewListProps {
	/**
	 * 文件 ID 列表，支持字符串（逗号分隔）、字符串数组或 undefined
	 */
	modelValue?: string | string[]
	/**
	 * 获取文件预览信息的接口地址，组件会请求 `${previewUrl}/${fileId}` 获取文件详情
	 * 响应格式：{ data: { url?: string, name?: string, size?: number } }
	 */
	previewUrl: string
	/**
	 * v-model 发送的值类型
	 * - `"array"`: 发送字符串数组
	 * - `"string"`: 发送逗号拼接字符串
	 */
	modelValueType?: 'string' | 'array'
	/** 是否显示下载按钮 */
	showDownload?: boolean
	/** 是否显示删除按钮 */
	removable?: boolean
	/** 是否禁用（禁用时隐藏操作按钮） */
	disabled?: boolean
}
