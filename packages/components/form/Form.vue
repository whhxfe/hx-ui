<!--
  HxForm - 基于 el-form 的列配置驱动表单

  设计原则：
  - el-form 所有原生属性、事件通过 $attrs 完全透传，不做拦截
  - 仅新增 columns 配置来声明式定义表单字段
  - 自动从 columns 生成校验规则，与用户传入的 :rules 合并

  用法：
    <hx-form
      v-model="formData"
      :columns="columns"
      :cols="3"
      inline label-width="80px"
    >
      <template #avatar="{ formData }">自定义插槽</template>
      <template #action-buttons="{ formData, validate, reset }">自定义操作区</template>
    </hx-form>
-->
<template>
	<div class="hx-form" :style="{
		'--cols': mergedCols,
		'--gap': mergedGap + 'px',
		'--min-col-width': mergedMinColWidth + 'px'
	}">
		<el-form ref="formRef" :model="formData" :rules="mergedRules" :inline="inline" v-bind="formAttrs">
			<template v-for="field in visibleFields" :key="field.prop">
				<FormField
					:field="field"
					:form-data="formData"
					:model-value="formData[field.prop]"
					@update:model-value="(val) => handleFieldUpdate(field.prop, val)"
				/>
			</template>

			<slot name="search" :form-data="formData" :validate="validateField" :reset="handleReset" />

			<el-form-item v-if="showAction" class="actions">
				<div class="hx-form__actions">
					<slot name="action-buttons" :form-data="formData" :validate="validateField" :reset="handleReset">
						<el-button type="primary" @click="handleSearch">查询</el-button>
						<el-button @click="handleReset">重置</el-button>
					</slot>
				</div>
			</el-form-item>
		</el-form>
	</div>
</template>

<script lang="ts" setup>
import { computed, nextTick, provide, ref, useAttrs, useSlots, watch } from "vue"
import FormField from "./FormField.vue"
import { FORM_SLOTS_KEY } from "../../constants"
import { useConfig } from "../../hooks/useConfig"
import { isEqual } from "../../utils"
import type { FieldType, FormField as FormFieldType, FormExpose, FormProps } from "./types"

defineOptions({
	name: "HxForm",
	inheritAttrs: false,
})

const props = withDefaults(defineProps<FormProps>(), {
	modelValue: () => ({}),
	fields: () => [],
	cols: 3,
	gap: 16,
	showAction: true,
	inline: true,
})

const emit = defineEmits<{
	"update:modelValue": [value: Record<string, unknown>]
	"search": [value: Record<string, unknown>]
	"reset": []
}>()

const attrs = useAttrs()
const slots = useSlots()
const formRef = ref()
provide(FORM_SLOTS_KEY, slots)

// 全局配置注入
const globalConfig = useConfig()

// 配置合并：Props > ConfigProvider > 默认值
const mergedCols = computed(() => props.cols ?? globalConfig.form?.cols ?? 3)
const mergedGap = computed(() => props.gap ?? globalConfig.form?.gap ?? 16)
const mergedMinColWidth = computed(() => props.minColWidth ?? globalConfig.form?.minColWidth ?? 0)

/**
 * 透传给 el-form 的属性（rules 需合并，不透传）
 */
const formAttrs = computed(() => {
	const { rules, ...rest } = attrs
	return {
		labelWidth: props.labelWidth,
		labelPosition: props.labelPosition,
		...rest,
	}
})

/**
 * 内部表单数据
 */
const formData = ref<Record<string, unknown>>({})

/**
 * 安全获取 fields 列表，防御性地处理 null/undefined 导致的报错
 */
const safeFields = computed(() => props.fields ?? [])

/**
 * 可见字段
 */
const visibleFields = computed(() => safeFields.value.filter(field => !field.hidden))

/**
 * 校验规则合并
 */
const SELECT_TYPES = new Set(["select", "radio", "radio-btn", "checkbox", "cascader", "date", "datetime", "switch"])
const UPLOAD_TYPES = new Set(["upload"])
const RANGE_TYPES = new Set(["datetimerange", "daterange", "timerange"])
const CHECKBOX_TYPES = new Set(["checkbox"])

const mergedRules = computed(() => {
	const autoRules: Record<string, unknown[]> = {}

	for (const field of safeFields.value) {
		const fieldRules: unknown[] = []

		if (field.required) {
			const isSelect = SELECT_TYPES.has(field.type)
			const isUpload = UPLOAD_TYPES.has(field.type)
			fieldRules.push({
				required: true,
				message: isUpload
					? `请上传${field.label}`
					: `${isSelect ? "请选择" : "请输入"}${field.label}`,
				trigger: "change",
				...(isUpload ? { type: "array", min: 1 } : {}),
			})
		}

		if (field.rules?.length) {
			fieldRules.push(...field.rules)
		}

		if (fieldRules.length) {
			autoRules[field.prop] = fieldRules
		}
	}

	return { ...autoRules, ...(attrs.rules ?? {}) }
})

/**
 * 数据同步
 */
let lastEmittedRef: Record<string, unknown> | null = null

function emitUpdate() {
	const snapshot = { ...formData.value }
	lastEmittedRef = snapshot
	emit("update:modelValue", snapshot)
}

let emitScheduled = false

function scheduleEmit() {
	if (emitScheduled) return
	emitScheduled = true
	nextTick(() => {
		emitUpdate()
		emitScheduled = false
	})
}

function handleFieldUpdate(prop: string, val: unknown) {
	formData.value[prop] = val
	const field = safeFields.value.find(f => f.prop === prop)
	field?.onChange?.(val, formData.value as Record<string, unknown>)
	scheduleEmit()
}

/**
 * 初始化
 */
let isInitialized = false

function getDefaultValue(field: FormFieldType): unknown {
	if (field.defaultValue !== undefined) return structuredClone(field.defaultValue)
	if (SELECT_TYPES.has(field.type as FieldType)) {
		return CHECKBOX_TYPES.has(field.type as FieldType) ? [] : (field.multiple ? [] : "")
	}
	if (RANGE_TYPES.has(field.type as FieldType)) return []
	return ""
}

function initFormData() {
	const data: Record<string, unknown> = {}
	const initial = props.modelValue ?? {}

	for (const field of safeFields.value) {
		if (field.prop in initial) {
			data[field.prop] = initial[field.prop]
		} else if (field.prop in formData.value) {
			data[field.prop] = formData.value[field.prop]
		} else {
			data[field.prop] = getDefaultValue(field)
		}
	}

	formData.value = data
	emitUpdate()
	isInitialized = true
}

/**
 * 校验表单
 */
async function validateField(callback?: (data: Record<string, unknown>) => void): Promise<boolean> {
	try {
		const valid = await formRef.value?.validate()
		if (valid && callback) callback({ ...formData.value })
		return !!valid
	} catch {
		return false
	}
}

/**
 * 重置表单
 */
function resetField() {
	const resetData: Record<string, unknown> = {}
	for (const field of safeFields.value) {
		resetData[field.prop] = getDefaultValue(field)
	}
	formData.value = resetData
	formRef.value?.clearValidate()
	emitUpdate()
}

function getFormData(): Record<string, unknown> {
	return { ...formData.value }
}

/**
 * 外部设置表单数据（用于接口数据回填等场景）
 */
function setFormData(data: Record<string, unknown>) {
	for (const key in data) {
		if (key in formData.value) {
			formData.value[key] = data[key]
		}
	}
	scheduleEmit()
}

function scrollToField(prop: string) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const el = (formRef.value as any)?.$el?.querySelector(`[data-prop="${prop}"]`)
	el?.scrollIntoView?.({ behavior: "smooth", block: "center" })
}

function getElFormRef() {
	return formRef.value
}

function handleSearch() {
	emit("search", { ...formData.value })
}

function handleReset() {
	resetField()
	emit("reset")
}

watch(
	() => props.fields,
	() => { if (safeFields.value.length) initFormData() },
	{ immediate: true }
)

watch(
	() => props.modelValue,
	(newVal) => {
		if (!newVal || newVal === lastEmittedRef || !isInitialized) return
		let changed = false
		for (const key in newVal) {
			if (key in formData.value && !isEqual(formData.value[key], newVal[key])) {
				formData.value[key] = newVal[key]
				changed = true
			}
		}
		if (changed) scheduleEmit()
	},
	{ deep: false }
)

defineExpose<FormExpose>({
	validate: validateField,
	reset: resetField,
	getFormData,
	setFormData,
	getElFormRef,
})
</script>

<style lang="scss" scoped>
.hx-form {
	width: 100%;

	:deep(.el-form--inline) {
		display: grid;
		grid-template-columns: repeat(
			var(--cols, 3),
			minmax(var(--min-col-width, 0), 1fr)
		);
		gap: var(--gap, 16px);

		.el-form-item {
			grid-column: span var(--col-span, 1);
			margin-right: 0;
			margin-bottom: 0;
			&.actions {
				grid-column: -2 / -1;
				justify-content: flex-end;
			}
		}
		.el-input,
		.el-date-editor,
		.el-time-editor {
			width: 100% ;
		}
	}
}

.hx-form__actions {
	display: flex;
	gap: 8px;
	justify-content: flex-end;
}
</style>