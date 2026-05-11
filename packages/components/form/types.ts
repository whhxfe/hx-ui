import type { VNode } from "vue"

import type { OptionItem, GroupOptionItem, RemoteConfig } from "../../types"
import type { UploadProps } from "../upload/types"
import type { SelectProps } from "../select/types"
import type { CascaderProps, CascaderPanelProps } from "../cascader/types"
import type { RadioProps } from "../radio/types"
import type { CheckboxProps } from "../checkbox/types"
import type { TransferProps } from "../transfer/types"

// Re-export 公共类型，保持向后兼容（外部仍从 form/types 导入）
export type { OptionItem, GroupOptionItem, RemoteConfig } from "../../types"

// ============================================================
// RichEditor
// ============================================================

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

// ============================================================
// FieldType
// ============================================================

/** 支持的表单字段类型 */
export type FieldType =
	| "input"
	| "textarea"
	| "number"
	| "select"
	| "radio"
	| "radio-btn"
	| "checkbox"
	| "checkbox-btn"
	| "switch"
	| "cascader"
	| "transfer"
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

// ============================================================
// FormField — 核心结构
//
// FormField = FormFieldBase（通用字段）
//            & FormField_Options（选项类共用字段）
//            & FormField_Upload（从 UploadProps Pick）
//            & FormField_Select（从 SelectProps Pick）
//            & FormField_Cascader（从 CascaderProps Pick）
//            & FormField_Radio（从 RadioProps Pick）
//            & FormField_Checkbox（从 CheckboxProps Pick）
//            & FormField_Transfer（从 TransferProps Pick）
//            & FormField_RichEditor
//            & FormField_DateTime
//            & FormField_TextInput
//            & FormField_NumberInput
//
// 由于所有字段均为可选，交叉类型天然可叠加，无需 discriminated union。
// 开发者配置时，IDE 自动补全会根据 type 推断可用字段（需配合组件文档理解）。
// ============================================================

/** 表单字段基础字段（所有 type 通用） */
export interface FormFieldBase {
	/** 字段 key，对应 formData 中的属性名 */
	prop: string
	/** 表单项标签 */
	label: string
	/** 表单组件类型 */
	type: FieldType
	/** 默认值 */
	defaultValue?: unknown
	/** 占据的栅格列数（基于 grid 布局，默认 1） */
	colSpan?: number
	/** 是否隐藏该字段 */
	hidden?: boolean
	/** 是否必填（自动生成校验规则） */
	required?: boolean

	/** placeholder（各组件均有，支持统一设置） */
	placeholder?: string
	/** 是否可清空（select / cascader / date / time） */
	clearable?: boolean
	/** 是否禁用（所有输入类组件） */
	disabled?: boolean

	/** 是否多选（select / checkbox / upload / transfer） */
	multiple?: boolean

	/** v-model emit 的值类型：`"string"` 发送逗号拼接字符串，`"array"` 发送数组（select / checkbox / upload / transfer） */
	modelValueType?: "string" | "array"

	// ——— 透传 & 自定义 ———
	/** 直接透传给底层 el-xxx 组件的 props */
	componentProps?: Record<string, any>
	/** 透传给 el-form-item 的 props */
	formItemProps?: Record<string, any>
	/** 自定义渲染函数（type='render' 时使用） */
	render?: (formData: Record<string, any>, field: any) => VNode
	/** change 事件回调 */
	onChange?: (value: unknown, formData: Record<string, unknown>) => void
	/** 自定义校验规则（会与 required 自动生成的规则合并） */
	rules?: Record<string, unknown>[]
}

/** 选项类组件共用字段（select / radio / checkbox / cascader / transfer） */
export interface FormField_Options {
	/**
	 * 静态选项数据
	 * - select：支持 OptionItem[] 或 GroupOptionItem[]（自动识别是否分组）
	 * - radio / checkbox / cascader / transfer：使用 OptionItem[]
	 */
	options?: OptionItem[] | GroupOptionItem[]
	/** 远程数据获取配置 */
	remote?: RemoteConfig
}

// ——— Upload：从 UploadProps Pick（排除 modelValue，由 form 框架管理）—————————

export type FormField_Upload = Pick<
	UploadProps,
	| "action"
	| "accept"
	| "limit"
	| "headers"
	| "data"
	| "name"
	| "withCredentials"
	| "listType"
	| "autoUpload"
	| "placeholder"
	| "responseMapper"
	| "valueMapper"
	| "previewUrl"
	| "deleteUrl"
	| "showDownload"
	| "fileRender"
	| "filePreviewRender"
	| "componentProps"
>

// ——— Select：从 SelectProps Pick（排除 modelValue）————————————————————————

export type FormField_Select = Pick<
	SelectProps,
	"options" | "remote" | "multiple" | "clearable" | "disabled" | "filterable" | "placeholder" | "modelValueType" | "onChange"
>

// ——— Cascader：从 CascaderProps Pick（排除 modelValue）———————————————————

export type FormField_Cascader = Pick<
	CascaderProps,
	"options" | "remote" | "placeholder" | "clearable" | "disabled" | "filterable" | "cascaderProps"
>

// ——— Radio：从 RadioProps Pick（排除 modelValue）————————————————————————

export type FormField_Radio = Pick<RadioProps, "options" | "remote" | "disabled" | "onChange">

// ——— Checkbox：从 CheckboxProps Pick（排除 modelValue）——————————————————

export type FormField_Checkbox = Pick<
	CheckboxProps,
	"options" | "remote" | "disabled" | "variant" | "modelValueType" | "onChange"
>

// ——— Transfer：从 TransferProps Pick（排除 modelValue）————————————————————

export type FormField_Transfer = Pick<
	TransferProps,
	"options" | "remote" | "labelKey" | "valueKey" | "title" | "transferLeftWidth" | "transferConfigText" | "placeholder" | "multiple" | "transferHeight" | "modelValueType"
>

// ——— RichEditor ————————————————————————————————————————————————————————————

export interface FormField_RichEditor {
	/** 富文本编辑器配置（透传给 HxRichEditor） */
	richEditorParams?: RichEditorParams
}

// ——— DateTime ————————————————————————————————————————————————————————————

export interface FormField_DateTime {
	/** 值格式化 */
	valueFormat?: string
	/** 显示格式化 */
	format?: string
	/** 禁用未来时间 */
	disableFutureTime?: boolean
	/** 日期范围限制（天数） */
	dateRangeLimit?: number
}

// ——— TextInput ————————————————————————————————————————————————————————————

export interface FormField_TextInput {
	/** 最大输入长度 */
	maxlength?: number
	/** 是否显示字数统计 */
	showWordLimit?: boolean
	/** 文本域行数（textarea） */
	rows?: number
}

// ——— NumberInput ——————————————————————————————————————————————————————————

export interface FormField_NumberInput {
	/** 最小值 */
	min?: number
	/** 最大值 */
	max?: number
	/** 步进 */
	step?: number
	/** 精度（小数位数） */
	precision?: number
}

/**
 * 表单字段配置（fields 中的每一项）
 *
 * 通过交叉类型组合各组件 interface，保持字段命名与独立组件完全一致。
 * 字段按功能分为：Base（通用）| Options（选项类共用）| Upload | Select | Cascader | Radio | Checkbox | Transfer | RichEditor | DateTime | TextInput | NumberInput
 */
export type FormField = FormFieldBase &
	FormField_Options &
	FormField_Upload &
	FormField_Select &
	FormField_Cascader &
	FormField_Radio &
	FormField_Checkbox &
	FormField_Transfer &
	FormField_RichEditor &
	FormField_DateTime &
	FormField_TextInput &
	FormField_NumberInput

// ============================================================
// FormExpose / FormProps / FormFieldProps
// ============================================================

/** Form 暴露的方法 */
export interface FormExpose {
	/** 校验表单 */
	validate: (callback?: (data: Record<string, unknown>) => void) => Promise<boolean>
	/** 重置表单 */
	reset: () => void
	/** 获取表单数据 */
	getFormData: () => Record<string, unknown>
	/** 外部设置表单数据（用于接口数据回填等场景） */
	setFormData: (data: Partial<Record<string, unknown>>) => void
	/** 获取 el-form 实例 */
	getElFormRef: () => any
}

/** HxForm Props */
export interface FormProps {
	/** 表单数据对象（v-model） */
	modelValue?: Record<string, unknown>
	/** 字段配置 */
	fields: FormField[]
	/** 栅格列数 */
	cols?: number
	/** 是否显示底部的查询/重置操作区 */
	showAction?: boolean
	/** 是否使用行内布局（配合 cols 实现 grid 栅格，默认 true） */
	inline?: boolean
}

/** HxForm Emits */
export interface FormEmits {
	(e: "update:modelValue", value: Record<string, unknown>): void
	(e: "search", value: Record<string, unknown>): void
	(e: "reset"): void
}

/** HxFormField Props */
export interface FormFieldProps {
	modelValue: any
	field: FormField
	formData: Record<string, any>
}

/** HxFormField Emits */
export interface FormFieldEmits {
	(e: "update:modelValue", value: any): void
}