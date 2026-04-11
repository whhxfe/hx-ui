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
	<div class="hx-form" :style="{ '--cols': cols }">
		<el-form ref="formRef" :model="formData" :rules="mergedRules" v-bind="formAttrs">
			<template v-for="col in visibleColumns" :key="col.prop">
				<FormField
					:column="col"
					:form-data="formData"
					:model-value="formData[col.prop]"
					@update:model-value="(val) => handleFieldUpdate(col.prop, val)"
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
import type { FormColumn, FormExpose, FormProps } from "./types"

defineOptions({
	name: "HxForm",
	inheritAttrs: false,
})

const props = withDefaults(defineProps<FormProps>(), {
	modelValue: () => ({}),
	cols: 3,
	showAction: true,
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

// ==========================================================================
// 工具函数
// ==========================================================================
function cloneDeep<T>(value: T): T {
	if (value === null || typeof value !== "object") return value
	if (Array.isArray(value)) return value.map(cloneDeep) as unknown as T
	const result: Record<string, unknown> = {}
	for (const key in value) {
		if (Object.prototype.hasOwnProperty.call(value, key)) {
			result[key] = cloneDeep(value[key])
		}
	}
	return result as T
}

function isEqual(a: unknown, b: unknown): boolean {
	if (a === b) return true
	if (a === null || b === null || typeof a !== "object" || typeof b !== "object") return false
	if (Array.isArray(a) !== Array.isArray(b)) return false
	const keysA = Object.keys(a as object)
	const keysB = Object.keys(b as object)
	if (keysA.length !== keysB.length) return false
	return keysA.every(key => isEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]))
}

// ==========================================================================
// 透传给 el-form 的属性（rules 需合并，不透传）
// ==========================================================================
const formAttrs = computed(() => {
	const { rules, ...rest } = attrs
	return rest
})

// ==========================================================================
// 内部表单数据
// ==========================================================================
const formData = ref<Record<string, unknown>>({})

// ==========================================================================
// 可见列
// ==========================================================================
const visibleColumns = computed(() => props.columns.filter(col => !col.hidden))

// ==========================================================================
// 校验规则合并
// ==========================================================================
const SELECT_TYPES = new Set(["select", "radio", "radio-btn", "checkbox", "cascader", "date", "datetime", "switch"])

const mergedRules = computed(() => {
	const autoRules: Record<string, unknown[]> = {}

	for (const col of props.columns) {
		const colRules: unknown[] = []

		if (col.required) {
			const isSelect = SELECT_TYPES.has(col.type)
			colRules.push({
				required: true,
				message: col.type === "upload"
					? `请上传${col.label}`
					: `${isSelect ? "请选择" : "请输入"}${col.label}`,
				trigger: "change",
				...(col.type === "upload" ? { type: "array", min: 1 } : {}),
			})
		}

		if (col.rules?.length) {
			colRules.push(...col.rules)
		}

		if (colRules.length) {
			autoRules[col.prop] = colRules
		}
	}

	return { ...autoRules, ...(attrs.rules ?? {}) }
})

// ==========================================================================
// 数据同步
// ==========================================================================
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
	const col = props.columns.find(c => c.prop === prop)
	col?.onChange?.(val, formData.value as Record<string, unknown>)
	scheduleEmit()
}

// ==========================================================================
// 初始化
// ==========================================================================
let isInitialized = false

const TYPE_DEFAULT_VALUE: Record<string, unknown> = {
	switch: false,
	checkbox: [],
	number: undefined,
	datetimerange: [],
	daterange: [],
	timerange: [],
	upload: [],
}

function getDefaultValue(col: FormColumn): unknown {
	if (col.defaultValue !== undefined) return cloneDeep(col.defaultValue)
	if (col.type === "select") return col.multiple ? [] : ""
	return TYPE_DEFAULT_VALUE[col.type] ?? ""
}

function initFormData() {
	const data: Record<string, unknown> = {}
	const initial = props.modelValue ?? {}

	for (const col of props.columns) {
		if (col.prop in initial) {
			data[col.prop] = initial[col.prop]
		} else if (col.prop in formData.value) {
			data[col.prop] = formData.value[col.prop]
		} else {
			data[col.prop] = getDefaultValue(col)
		}
	}

	formData.value = data
	emitUpdate()
	isInitialized = true
}

// ==========================================================================
// 操作方法
// ==========================================================================
async function validateField(callback?: (data: Record<string, unknown>) => void): Promise<boolean> {
	try {
		const valid = await formRef.value?.validate()
		if (valid && callback) callback({ ...formData.value })
		return !!valid
	} catch {
		return false
	}
}

function resetField() {
	const resetData: Record<string, unknown> = {}
	for (const col of props.columns) {
		resetData[col.prop] = getDefaultValue(col)
	}
	formData.value = resetData
	formRef.value?.clearValidate()
	emitUpdate()
}

function getFormData(): Record<string, unknown> {
	return { ...formData.value }
}

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

// ==========================================================================
// Watchers
// ==========================================================================
watch(
	() => props.columns,
	() => { if (props.columns?.length) initFormData() },
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

// ==========================================================================
// 暴露方法
// ==========================================================================
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
		grid-template-columns: repeat(var(--cols, 3), 1fr);
		gap: 16px;

		.el-form-item {
			grid-column: span var(--col-span, 1);

			&.actions {
				grid-column: -2 / -1;
				justify-content: flex-end;
			}
		}
	}
}

.hx-form__actions {
	display: flex;
	gap: 8px;
	justify-content: flex-end;
}
</style>
