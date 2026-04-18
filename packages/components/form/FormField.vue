<!--
  HxFormField - 单个表单字段渲染组件
  通过 provide/inject 从 Form 获取用户定义的插槽
-->
<template>
	<el-form-item
		v-if="!column.hidden"
		:label="column.label"
		:prop="column.prop"
		:style="{ '--col-span': column.colSpan ?? 1 }"
		v-bind="column.formItemProps"
	>
		<!-- slot -->
		<component
			v-if="column.type === 'slot' && formSlots[column.prop]"
			:is="formSlots[column.prop]"
			:form-data="formData"
			:column="column"
		/>

		<!-- render 函数 -->
		<component
			v-else-if="column.type === 'render' && column.render"
			:is="() => column.render!(formData, column)"
		/>

		<!-- 富文本编辑器 -->
		<HxRichEditor
			v-else-if="column.type === 'richeditor'"
			v-model="innerValue"
			v-bind="column.richEditorParams"
		/>

		<!-- 上传 -->
		<HxUpload
			v-else-if="column.type === 'upload'"
			v-model="innerValue"
			:action="column.action"
			:accept="column.accept"
			:limit="column.limit"
			:multiple="column.multiple"
			:disabled="column.disabled"
			:list-type="column.listType ?? 'text'"
			:placeholder="column.placeholder"
			:value-mapper="column.uploadValueMapper"
			:response-mapper="column.uploadResponseMapper"
			:file-render="column.uploadFileRender"
			:file-preview-render="column.uploadFilePreviewRender"
			:preview-fetch-url="column.previewUrl"
			:model-value-type="column.modelValueType"
			:component-props="column.componentProps"
		>
			<template
				v-if="formSlots[column.prop + '-file'] || column.uploadFileRender"
				#file="{ file, remove }"
			>
				<component
					v-if="formSlots[column.prop + '-file']"
					:is="formSlots[column.prop + '-file']"
					:file="file"
					:remove="remove"
				/>
			</template>
		</HxUpload>

		<!-- 文本输入类：input / textarea -->
		<HxInput
			v-else-if="fieldGroup === 'input'"
			v-model="innerValue"
			:type="column.type as any"
			:placeholder="column.placeholder"
			:clearable="column.clearable"
			:disabled="column.disabled"
			:maxlength="column.maxlength"
			:show-word-limit="column.showWordLimit"
			:rows="column.rows || 3"
			v-bind="column.componentProps"
		/>

		<!-- 数字输入 -->
		<el-input-number
			v-else-if="column.type === 'number'"
			v-model="innerValue"
			:placeholder="column.placeholder"
			:disabled="column.disabled"
			:min="column.min"
			:max="column.max"
			:step="column.step"
			:precision="column.precision"
			controls-position="right"
			v-bind="column.componentProps"
		/>

		<!-- 日期时间类 -->
		<el-date-picker
			v-else-if="fieldGroup === 'date'"
			v-model="innerValue"
			:type="column.type as any"
			:placeholder="column.placeholder || getPlaceholder()"
			:disabled="column.disabled"
			:clearable="column.clearable ?? true"
			:value-format="column.valueFormat || getDefaultFormat()"
			:format="column.format || getDefaultFormat()"
			:disabled-date="getDisabledDate"
			unlink-panels
			range-separator="~"
			start-placeholder="开始日期"
			end-placeholder="结束日期"
			v-bind="datePickerProps"
		/>

		<!-- 时间选择 -->
		<el-time-picker
			v-else-if="fieldGroup === 'time'"
			v-model="innerValue"
			:placeholder="column.placeholder || getPlaceholder()"
			:disabled="column.disabled"
			:clearable="column.clearable ?? true"
			is-range
			range-separator="~"
			start-placeholder="开始时间"
			end-placeholder="结束时间"
			v-bind="column.componentProps"
		/>

		<!-- 级联选择 -->
		<HxCascader
			v-else-if="column.type === 'cascader'"
			v-model="innerValue"
			:options="column.options as any"
			:remote="column.remote"
			:placeholder="column.placeholder"
			:clearable="column.clearable"
			:disabled="column.disabled"
			:filterable="column.filterable"
			:props="column.cascaderProps"
			v-bind="column.componentProps"
		/>

		<!-- 下拉选择 -->
		<HxSelect
			v-else-if="column.type === 'select'"
			v-model="innerValue"
			:options="(column.options ?? []) as any"
			:remote="column.remote"
			:multiple="column.multiple"
			:clearable="column.clearable"
			:disabled="column.disabled"
			:filterable="column.filterable"
			:placeholder="column.placeholder || getPlaceholder()"
			:model-value-type="column.modelValueType"
			v-bind="column.componentProps"
			@change="(val: any) => column.onChange?.(val, formData)"
		/>

		<!-- 单选组 -->
		<HxRadio
			v-else-if="column.type === 'radio'"
			v-model="innerValue"
			:options="(column.options ?? []) as any"
			:remote="column.remote"
			:disabled="column.disabled"
			:variant="'radio'"
			v-bind="column.componentProps"
			@change="(val: any) => column.onChange?.(val, formData)"
		/>

		<!-- 单选按钮组 -->
		<HxRadio
			v-else-if="column.type === 'radio-btn'"
			v-model="innerValue"
			:options="(column.options ?? []) as any"
			:remote="column.remote"
			:disabled="column.disabled"
			:variant="'radio-btn'"
			v-bind="column.componentProps"
			@change="(val: any) => column.onChange?.(val, formData)"
		/>

		<!-- 多选组 -->
		<HxCheckbox
			v-else-if="column.type === 'checkbox'"
			v-model="innerValue"
			:options="(column.options ?? []) as any"
			:remote="column.remote"
			:disabled="column.disabled"
			:model-value-type="column.modelValueType"
			v-bind="column.componentProps"
			@change="(val: any) => column.onChange?.(val, formData)"
		/>

		<!-- 多选按钮组 -->
		<HxCheckbox
			v-else-if="column.type === 'checkbox-btn'"
			v-model="innerValue"
			:options="(column.options ?? []) as any"
			:remote="column.remote"
			:disabled="column.disabled"
			:model-value-type="column.modelValueType"
			variant="checkbox-btn"
			v-bind="column.componentProps"
			@change="(val: any) => column.onChange?.(val, formData)"
		/>

		<el-switch
			v-else-if="column.type === 'switch'"
			v-model="innerValue"
			:disabled="column.disabled"
			v-bind="column.componentProps"
		/>

		<!-- 穿梭框 -->
		<HxTransfer
			v-else-if="column.type === 'transfer'"
			v-model="innerValue"
			:options="(column.options ?? []) as any"
			:remote="column.remote"
			:multiple="column.multiple ?? false"
			:config-text="column.transferConfigText || '选项'"
			:left-width="column.transferLeftWidth || '300px'"
			:height="column.transferHeight || '400px'"
			:placeholder="column.placeholder"
			:model-value-type="column.modelValueType"
			@change="(val: any) => column.onChange?.(val, formData)"
		/>
	</el-form-item>
</template>

<script lang="ts" setup>
import { computed, inject } from "vue"
import type { Slots } from "vue"
import { FORM_SLOTS_KEY } from "../../constants"
import type { FormColumn, FormFieldProps, FormFieldEmits } from "./types"
import HxSelect from "../select/Select.vue"
import HxRadio from "../radio/Radio.vue"
import HxCheckbox from "../checkbox/Checkbox.vue"
import HxRichEditor from "../rich-editor/RichEditor.vue"
import HxInput from "../input/Input.vue"
import HxCascader from "../cascader/Cascader.vue"
import HxTransfer from "../transfer/Transfer.vue"
import HxUpload from "../upload/Upload.vue"

const props = defineProps<FormFieldProps>()

const emit = defineEmits<FormFieldEmits>()

const formSlots = inject<Slots>(FORM_SLOTS_KEY, {})

/**
 * innerValue
 */
const innerValue = computed({
	get: () => props.modelValue,
	set: (val) => emit("update:modelValue", val),
})

/**
 * 字段分组（用于合并同类组件的模板）
 */
const INPUT_TYPES = new Set(["input", "textarea"])
const DATE_TYPES = new Set(["date", "daterange", "datetime", "datetimerange"])
const TIME_TYPES = new Set(["time", "timerange"])

const fieldGroup = computed(() => {
	const { type } = props.column
	if (INPUT_TYPES.has(type)) return "input"
	if (DATE_TYPES.has(type)) return "date"
	if (TIME_TYPES.has(type)) return "time"
	return null
})

/**
 * 日期时间默认格式
 */
const DATE_PICKER_PROPS: Record<string, string> = {
	date: "YYYY-MM-DD",
	daterange: "YYYY-MM-DD",
	datetime: "YYYY-MM-DD HH:mm:ss",
	datetimerange: "YYYY-MM-DD HH:mm:ss",
}

function getDefaultFormat(): string {
	return DATE_PICKER_PROPS[props.column.type] ?? "YYYY-MM-DD"
}

function getPlaceholder(): string {
	const map: Record<string, string> = {
		input: `请输入${props.column.label}`,
		textarea: `请输入${props.column.label}`,
		date: "选择日期",
		daterange: "选择日期",
		datetime: "选择日期时间",
		datetimerange: "选择日期时间",
		time: "选择时间",
		timerange: "选择时间",
		select: `请选择${props.column.label}`,
		cascader: `请选择${props.column.label}`,
	}
	return map[props.column.type] ?? `请输入${props.column.label}`
}

const datePickerProps = computed(() => {
	const { componentProps } = props.column
	return componentProps ?? {}
})

/**
 * 禁用日期
 */
function getDisabledDate(time: Date): boolean {
	return !!(props.column.disableFutureTime && time.getTime() > Date.now())
}
</script>

<style scoped lang="scss">
.el-form-item {
	margin-right: 0;
	:deep(.el-select),
	:deep(.el-cascader),
	:deep(.el-date-editor) {
		width: 100%;
	}
}
</style>
