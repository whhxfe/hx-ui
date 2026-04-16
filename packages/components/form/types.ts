import type { VNode } from "vue"

/** 下拉 / 单选 / 多选等选项 */
export interface OptionItem {
	label: string
	value: string | number
	disabled?: boolean
	children?: OptionItem[]
}

/** select 分组选项 */
export interface GroupOptionItem {
	label: string
	disabled?: boolean
	options: OptionItem[]
}

/** 远程数据获取配置 */
export interface RemoteConfig {
	/** 远程请求 URL */
	url: string
	/** 请求方法 */
	method?: "get" | "post"
	/** URL query 参数（GET 请求自动拼接在 ? 后） */
	params?: Record<string, any>
	/** 请求体参数（POST/PUT 请求序列化为 JSON 放入 body） */
	body?: Record<string, any>
	/** 请求体格式（默认 "json"） */
	bodyType?: "json" | "form-data"
	/** 响应数据中 label 字段名（默认 "label"） */
	labelKey?: string
	/** 响应数据中 value 字段名（默认 "value"） */
	valueKey?: string
	/** 响应数据中 children 字段名（默认 "children"，用于级联和分组） */
	childrenKey?: string
	/** 联动：依赖的父级 prop 名称，父值变化时自动用父值重新请求 */
	dependsOn?: string
	/** 联动：父值作为哪个参数名传递，默认 "value" */
	dependsOnParamKey?: string
	/** 联动：父值注入在 query 参数还是 body 中，默认跟随 method（method=get 时为 query，method=post 时为 body） */
	dependsOnIn?: 'query' | 'body'
}

interface UploadOptions {
	url?: string
	headers?: Record<string, string>
	fieldName?: string
	extraData?: Record<string, string | Blob>
}

export interface RichEditorParams {
	readOnly?: boolean
	uploadUrl?: string
	uploadImage?: UploadOptions
	uploadVideo?: UploadOptions
	responseAdapter?: (res: any) => string
}

/** 支持的表单字段类型 */
export type FieldType =
	| "input"
	| "textarea"
	| "number"
	| "select"
	| "radio"
	| "radio-btn"
	| "checkbox"
	| "switch"
	| "cascader"
	| "datetime"
	| "datetimerange"
	| "date"
	| "daterange"
	| "time"
	| "timerange"
	| "upload"
	| "richeditor"
	| "slot"
	| "render"

/** 选项类组件通用 props */
export interface SelectProps {
	/** 静态选项数据 */
	options?: OptionItem[] | GroupOptionItem[]
	/** 远程数据获取配置 */
	remote?: RemoteConfig
}

/** 表单字段列配置（columns 中的每一项） */
export interface FormColumn {
	/** 字段 key，对应 formData 中的属性名 */
	prop: string
	/** 表单项标签 */
	label: string
	/** 表单组件类型 */
	type: FieldType
	/** 默认值 */
	defaultValue?: any
	/** 占据的栅格列数（基于 grid 布局，默认 1） */
	colSpan?: number
	/** placeholder */
	placeholder?: string
	/** 是否可清空 */
	clearable?: boolean
	/** 是否禁用 */
	disabled?: boolean
	/** 是否隐藏该字段 */
	hidden?: boolean
	/** 是否必填（自动生成校验规则） */
	required?: boolean

	// ========== 选项类 ==========
	/**
	 * 静态选项数据（select / radio / checkbox / cascader）
	 * - select：支持 OptionItem[] 或 GroupOptionItem[]（自动识别是否分组）
	 * - 其他类型：使用 OptionItem[]
	 */
	options?: OptionItem[] | GroupOptionItem[]
	/** 远程数据获取配置 */
	remote?: RemoteConfig
	/** 多选（select / checkbox） */
	multiple?: boolean
	/** 可搜索（select / cascader） */
	filterable?: boolean

	// ========== 数字输入 ==========
	min?: number
	max?: number
	step?: number
	precision?: number

	// ========== 文本输入 ==========
	maxlength?: number
	showWordLimit?: boolean
	rows?: number

	// ========== 日期时间 ==========
	/** 值格式化 */
	valueFormat?: string
	/** 显示格式化 */
	format?: string
	/** 禁用未来时间 */
	disableFutureTime?: boolean
	/** 日期范围限制（天数） */
	dateRangeLimit?: number

	// ========== 上传 ==========
	/** 上传地址（type: 'upload' 时必填，或用 componentProps.httpRequest 自定义） */
	action?: string
	/** 接受的文件类型，如 '.jpg,.png' 或 'image/*' */
	accept?: string
	/** 最大上传数量 */
	limit?: number
	/** 列表展示类型：text / picture / picture-card / file-preview（文件预览模式，点击弹窗预览） */
	listType?: "text" | "picture" | "picture-card" | "file-preview"
	/**
	 * 上传文件值映射：从 el-upload 的 file 对象中提取需要保存到表单的值
	 *
	 * 不设置时，formData[prop] = el-upload 原始 fileList
	 * 设置后，formData[prop] = fileList.filter(已上传成功).map(uploadValueMapper)
	 *
	 * @param file el-upload 的文件对象（含 response、name、url 等属性）
	 * @returns 需要保存的值（如 URL 字符串、ID、或自定义对象）
	 *
	 * @example 只存 URL
	 * uploadValueMapper: file => file.response?.data?.url
	 *
	 * @example 存 id + name 对象
	 * uploadValueMapper: file => ({ id: file.response?.data?.id, name: file.name })
	 */
	uploadValueMapper?: (file: any) => any
	/**
	 * 上传响应值映射：从服务端响应中提取需要存储的值（如 fileId）
	 *
	 * 优先级高于 uploadValueMapper
	 * 上传成功后，formData[prop] = uploadResponseMapper(response, file)
	 *
	 * @param response 服务端返回的完整响应对象
	 * @param file el-upload 的文件对象
	 * @returns 需要保存的值（如 fileId）
	 *
	 * @example 返回文件 ID
	 * uploadResponseMapper: (res) => res.data.id
	 */
	uploadResponseMapper?: (response: any, file: any) => any
	/**
	 * 自定义上传文件列表项渲染函数
	 *
	 * @param file el-upload 的文件对象
	 * @param actions 操作方法：{ remove: 删除该文件 }
	 * @returns VNode
	 */
	uploadFileRender?: (file: any, actions: { remove: () => void }) => VNode
	/**
	 * 自定义上传文件预览渲染（与 uploadFileRender 互斥，优先级低于 uploadFileRender）
	 *
	 * @param file el-upload 的文件对象
	 * @param actions 操作方法：{ remove: 删除该文件 }
	 * @returns VNode
	 */
	uploadFilePreviewRender?: (file: any, actions: { remove: () => void }) => VNode
	/**
	 * 文件预览接口地址（listType=file-preview 时使用）
	 *
	 * 点击文件后，组件会调用 GET `${previewUrl}/${fileId}` 获取文件信息，
	 * 再将返回的 url 传给 HxFilePreview 进行弹窗预览。
	 *
	 * @example previewUrl: '/api/upload' → GET /api/upload/{fileId}
	 */
	previewUrl?: string

	// ========== 透传给 Element Plus 组件的原生属性 ==========
	/** 直接透传给底层 el-xxx 组件的 props */
	componentProps?: Record<string, any>
	/** 透传给 el-form-item 的 props */
	formItemProps?: Record<string, any>

	// ========== 自定义渲染 ==========
	/**
	 * 自定义渲染函数
	 * @param formData 当前表单数据
	 * @param column 当前列配置
	 * @returns VNode
	 */
	render?: (formData: Record<string, any>, column: FormColumn) => VNode

	// ========== 事件 ==========
	/** change 事件回调 */
	onChange?: (value: any, formData: Record<string, any>) => void

	/** 自定义校验规则（会与 required 自动生成的规则合并） */
	rules?: any[]
	richEditorParams?: RichEditorParams
}

/** Form 暴露的方法 */
export interface FormExpose {
	/** 校验表单 */
	validate: (callback?: (data: Record<string, any>) => void) => Promise<boolean>
	/** 重置表单 */
	reset: () => void
	/** 获取表单数据 */
	getFormData: () => Record<string, any>
	/** 外部设置表单数据（用于接口数据回填等场景） */
	setFormData: (data: Record<string, any>) => void
	/** 获取 el-form 实例 */
	getElFormRef: () => any
}

/** HxForm Props */
export interface FormProps {
	/** 表单数据对象（v-model） */
	modelValue?: Record<string, unknown>
	/** 字段列配置 */
	columns: FormColumn[]
	/** 栅格列数 */
	cols?: number
	/** 是否显示底部的查询/重置操作区 */
	showAction?: boolean
}

/** HxForm Emits */
export interface FormEmits {
	(e: 'update:modelValue', value: Record<string, unknown>): void
	(e: 'search', value: Record<string, unknown>): void
	(e: 'reset'): void
}

/** HxFormField Props */
export interface FormFieldProps {
	modelValue: any
	column: FormColumn
	formData: Record<string, any>
}

/** HxFormField Emits */
export interface FormFieldEmits {
	(e: 'update:modelValue', value: any): void
}
