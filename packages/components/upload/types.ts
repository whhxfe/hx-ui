import type { VNode } from 'vue'

export interface UploadProps {
	/** v-model：上传文件后绑定到表单的值（通常为 fileId 数组） */
	modelValue?: any[]
	/** 上传地址 */
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
	 * - text：文字列表（默认）
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
	 * 组件调用 `GET ${previewFetchUrl}/${fileId}` 获取文件详情，
	 * 从返回的 `{ data: { url, name?, size? } }` 中提取预览所需字段。
	 *
	 * @example previewFetchUrl: '/api/upload' → GET /api/upload/{fileId}
	 */
	previewFetchUrl?: string
	/**
	 * 根据 fileId 删除文件的接口
	 *
	 * 组件调用 `DELETE ${deleteFetchUrl}/${fileId}` 删除文件。
	 * 不传则不在前端发起删除请求。
	 *
	 * @example deleteFetchUrl: '/api/upload' → DELETE /api/upload/{fileId}
	 */
	deleteFetchUrl?: string
	/** 是否显示下载按钮（file-preview 模式） */
	showDownload?: boolean
	/** 自定义文件列表项渲染 */
	fileRender?: (file: any, actions: { remove: () => void }) => VNode
	/**
	 * 自定义文件预览渲染
	 *
	 * 与 fileRender 互斥，优先级：fileRender > filePreviewRender > 默认预览
	 *
	 * @param file el-upload 的文件对象
	 * @param actions 操作方法：{ remove: 删除该文件 }
	 * @returns VNode
	 *
	 * @example 使用 HxFilePreview 预览
	 * import HxFilePreview from '@hx/ui'
	 * filePreviewRender: (file, { remove }) => h(HxFilePreview, { url: file.url, previewWidth: '80px', previewHeight: '80px' })
	 */
	filePreviewRender?: (file: any, actions: { remove: () => void }) => VNode
	/** 额外的 el-upload props */
	componentProps?: Record<string, any>
}
