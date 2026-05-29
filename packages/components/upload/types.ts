import type { VNode } from 'vue'
import type { UploadFilePreviewListProps } from '../upload-file-preview-list/types'

/** file-preview 模式需要的 UploadFilePreviewList 属性（排除 deleteUrl，因为 Upload 本身也需要） */
export type FilePreviewListProps = Pick<
	UploadFilePreviewListProps,
	| 'showDownload'
	| 'removable'
	| 'removeConfirmTitle'
	| 'removeConfirmMessage'
	| 'itemWidth'
	| 'itemHeight'
>

export interface UploadProps extends FilePreviewListProps {
	/** v-model：上传文件后绑定到表单的值 */
	modelValue?: string | string[]
	/**
	 * v-model emit 的值类型：
	 * - `"array"` 发送 fileId 数组（默认）
	 * - `"string"` 发送逗号拼接字符串
	 */
	modelValueType?: 'string' | 'array'
	/** 上传地址（autoUpload=true 时必填，用于 http-request 自定义上传） */
	action?: string
	/** 接受的文件类型 */
	accept?: string
	/** 最大上传数量 */
	limit?: number
	/** 是否支持多文件 */
	multiple?: boolean
	/** 是否禁用 */
	disabled?: boolean
	/**
	 * 列表展示类型
	 * - text：文字列表
	 * - picture：图片列表
	 * - picture-card：图片卡片
	 * - file-preview：文件预览列表（基于 HxFilePreview，点击弹窗预览）
	 */
	listType?: 'text' | 'picture' | 'picture-card' | 'file-preview'
	/** 是否自动上传（无 action 时关闭） */
	autoUpload?: boolean
	/** 上传按钮占位文本 */
	placeholder?: string
	/**
	 * 从服务端响应中提取要存储的值（如 fileId）
	 *
	 * @param response 上传接口返回的完整响应体（response.data 为业务数据）
	 * @param file el-upload 的文件对象
	 * @returns 要绑定到 v-model 的值
	 *
	 * @example responseMapper: (res) => res.data.id
	 */
	responseMapper?: (response: any, file: any) => any
	/** 从 file 对象提取值的映射函数，第二个参数为服务端响应 */
	valueMapper?: (file: any, response?: any) => any
	/**
	 * 根据 fileId 获取文件预览信息的接口（listType=file-preview 时使用）
	 *
	 * 组件调用 `GET ${previewUrl}/${fileId}` 获取文件详情，
	 * 从返回的 `{ data: { url, name?, size? } }` 中提取预览所需字段。
	 *
	 * @example previewUrl: '/api/upload' → GET /api/upload/{fileId}
	 */
	previewUrl?: string
	/** 根据 fileId 删除文件的接口 */
	deleteUrl?: string
	/** 自定义文件列表项渲染（非 file-preview 模式） */
	fileRender?: (file: any, actions: { remove: () => void }) => VNode
	/**
	 * 自定义文件预览渲染（非 file-preview 模式）
	 *
	 * 与 fileRender 互斥，优先级：fileRender > filePreviewRender > 默认预览
	 */
	filePreviewRender?: (file: any, actions: { remove: () => void }) => VNode
	/** 额外的 el-upload props */
	componentProps?: Record<string, any>
	/** 请求头 */
	headers?: Record<string, string>
	/** 附带的表单数据 */
	data?: Record<string, string | Blob>
	/** 上传的文件字段名（默认 'file'） */
	name?: string
	/** 携带 cookie */
	withCredentials?: boolean
}
