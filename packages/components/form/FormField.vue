<template>
	<el-form-item
		:label="field.label"
		:prop="field.prop"
		:required="field.required"
		:label-width="field.labelWidth"
		:label-position="field.labelPosition"
		v-bind="field.formItemProps"
		v-show="!field.hidden"
		:style="{ '--col-span': field.colSpan ?? 1 }"
		:data-prop="field.prop"
	>
		<!-- input -->
		<template v-if="isFieldType('input')">
			<el-input
				:modelValue="modelValue"
				@update:modelValue="$emit('update:modelValue', $event)"
				:placeholder="field.placeholder || `请输入${field.label}`"
				:clearable="field.clearable ?? true"
				:disabled="field.disabled"
				:maxlength="field.maxlength"
				:showWordLimit="field.showWordLimit"
				:prefix-icon="field.prefixIcon"
				:suffix-icon="field.suffixIcon"
				:autocomplete="field.autocomplete"
				v-bind="field?.componentProps"
			/>
		</template>

		<template v-else-if="isFieldType('textarea')">
			<el-input
				type="textarea"
				:modelValue="modelValue"
				@update:modelValue="$emit('update:modelValue', $event)"
				:placeholder="field.placeholder || `请输入${field.label}`"
				:disabled="field.disabled"
				:maxlength="field.maxlength"
				:showWordLimit="field.showWordLimit"
				:rows="field.rows || 3"
				:autocomplete="field.autocomplete"
				v-bind="field?.componentProps"
			/>
		</template>

		<template v-else-if="isFieldType('number')">
			<el-input-number
				:modelValue="modelValue"
				@update:modelValue="$emit('update:modelValue', $event)"
				:min="field.min"
				:max="field.max"
				:step="field.step ?? 1"
				:precision="field.precision"
				:step-strictly="field.stepStrictly"
				:placeholder="field.placeholder || `请输入${field.label}`"
				:disabled="field.disabled"
				v-bind="field?.componentProps"
			/>
		</template>

		<template v-else-if="isFieldType('select')">
			<HxSelect
				:modelValue="modelValue"
				@update:modelValue="$emit('update:modelValue', $event)"
				:options="field.options"
				:remote="field.remote"
				:multiple="field.multiple"
				:clearable="field.clearable ?? true"
				:disabled="field.disabled"
				:filterable="field.filterable ?? true"
				:placeholder="field.placeholder || `请选择${field.label}`"
				:modelValueType="field.modelValueType"
				:collapse-tags="field.collapseTags"
				:collapse-tags-tooltip="field.collapseTagsTooltip"
				@change="field.onChange?.($event, formData)"
				v-bind="field?.componentProps"
			/>
		</template>

		<template v-else-if="isFieldType('radio')">
			<HxRadio
				:modelValue="modelValue"
				@update:modelValue="$emit('update:modelValue', $event)"
				:options="field.options as any"
				:remote="field.remote"
				:disabled="field.disabled"
				@change="field.onChange?.($event, formData)"
				v-bind="field?.componentProps"
			/>
		</template>

		<template v-else-if="isFieldType('radio-btn')">
			<HxRadio
				:modelValue="modelValue"
				@update:modelValue="$emit('update:modelValue', $event)"
				:options="field.options as any"
				:remote="field.remote"
				:disabled="field.disabled"
				variant="radio-btn"
				@change="field.onChange?.($event, formData)"
				v-bind="field?.componentProps"
			/>
		</template>

		<template v-else-if="isFieldType('checkbox')">
			<HxCheckbox
				:modelValue="modelValue"
				@update:modelValue="$emit('update:modelValue', $event)"
				:options="field.options as any"
				:remote="field.remote"
				:disabled="field.disabled"
				:modelValueType="field.modelValueType"
				@change="field.onChange?.($event, formData)"
				v-bind="field?.componentProps"
			/>
		</template>

		<template v-else-if="isFieldType('checkbox-btn')">
			<HxCheckbox
				:modelValue="modelValue"
				@update:modelValue="$emit('update:modelValue', $event)"
				:options="field.options as any"
				:remote="field.remote"
				:disabled="field.disabled"
				variant="checkbox-btn"
				:modelValueType="field.modelValueType"
				@change="field.onChange?.($event, formData)"
				v-bind="field?.componentProps"
			/>
		</template>

		<template v-else-if="isFieldType('switch')">
			<HxSwitch
				:modelValue="modelValue"
				@update:modelValue="$emit('update:modelValue', $event)"
				:disabled="field.disabled"
				v-bind="field?.componentProps"
			/>
		</template>

		<template v-else-if="isFieldType('cascader')">
			<HxCascader
				:modelValue="modelValue"
				@update:modelValue="$emit('update:modelValue', $event)"
				:options="field.options as any"
				:remote="field.remote"
				:placeholder="field.placeholder || `请选择${field.label}`"
				:clearable="field.clearable ?? true"
				:disabled="field.disabled"
				:filterable="field.filterable ?? true"
				v-bind="mergedCascaderProps"
			/>
		</template>

		<template v-else-if="isFieldType('transfer')">
			<el-form-item style="width: 100%;">
				<HxTransfer
					:modelValue="modelValue"
					@update:modelValue="$emit('update:modelValue', $event)"
					:options="field.options as any"
					:remote="field.remote"
					:labelKey="field.labelKey"
					:valueKey="field.valueKey"
					:title="field.title"
					:transferLeftWidth="field.transferLeftWidth"
					:transferConfigText="field.transferConfigText"
					:placeholder="field.placeholder"
					:multiple="field.multiple"
					:transferHeight="field.transferHeight"
					:modelValueType="field.modelValueType"
					v-bind="field?.componentProps"
				/>
			</el-form-item>
		</template>

		<!-- datetimerange / datetime -->
		<template v-else-if="isFieldType('datetime') || isFieldType('datetimerange')">
			<HxDateTimePicker
				:modelValue="modelValue"
				@update:modelValue="$emit('update:modelValue', $event)"
				:mode="(field.type as any)"
				:placeholder="field.placeholder || `请选择${field.label}`"
				:startPlaceholder="field.startPlaceholder"
				:endPlaceholder="field.endPlaceholder"
				:valueFormat="field.valueFormat"
				:format="field.format"
				:disabled="field.disabled"
				:clearable="field.clearable ?? true"
				:disabledDate="field.disabledDate"
				:shortcuts="field.shortcuts"
				v-bind="field?.componentProps"
			/>
		</template>

		<!-- date / daterange / month / monthrange / year / week -->
		<template v-else-if="['date', 'daterange', 'month', 'monthrange', 'year', 'week'].includes(field.type)">
			<HxDatePicker
				:modelValue="modelValue"
				@update:modelValue="$emit('update:modelValue', $event)"
				:type="field.type"
				:placeholder="field.placeholder || `请选择${field.label}`"
				:startPlaceholder="field.startPlaceholder"
				:endPlaceholder="field.endPlaceholder"
				:valueFormat="field.valueFormat"
				:format="field.format"
				:disabled="field.disabled"
				:clearable="field.clearable ?? true"
				:disabledDate="field.disabledDate"
				:disableFutureTime="field.disableFutureTime"
				:shortcuts="field.shortcuts"
				v-bind="field?.componentProps"
			/>
		</template>

		<template v-else-if="isFieldType('time')">
			<el-time-picker
				:modelValue="modelValue"
				@update:modelValue="$emit('update:modelValue', $event)"
				:placeholder="field.placeholder || `请选择${field.label}`"
				:valueFormat="field.valueFormat ?? 'HH:mm:ss'"
				:format="field.format ?? 'HH:mm:ss'"
				:disabled="field.disabled"
				:clearable="field.clearable ?? true"
				:disabledHours="field.disabledTime"
				:disabledMinutes="field.disabledTime"
				:disabledSeconds="field.disabledTime"
				v-bind="field?.componentProps"
			/>
		</template>

		<template v-else-if="isFieldType('timerange')">
			<el-time-picker
				type="timerange"
				:modelValue="modelValue"
				@update:modelValue="$emit('update:modelValue', $event)"
				:placeholder="field.placeholder || `请选择${field.label}`"
				:valueFormat="field.valueFormat ?? 'HH:mm:ss'"
				:format="field.format ?? 'HH:mm:ss'"
				:disabled="field.disabled"
				:clearable="field.clearable ?? true"
				:disabledHours="field.disabledTime"
				:disabledMinutes="field.disabledTime"
				:disabledSeconds="field.disabledTime"
				v-bind="field?.componentProps"
			/>
		</template>

		<template v-else-if="isFieldType('upload')">
			<HxUpload
				:modelValue="modelValue"
				@update:modelValue="$emit('update:modelValue', $event)"
				:action="field.action"
				:accept="field.accept"
				:limit="field.limit"
				:headers="field.headers"
				:data="field.data"
				:name="field.name"
				:withCredentials="field.withCredentials"
				:listType="field.listType"
				:autoUpload="field.autoUpload"
				:placeholder="field.placeholder"
				:responseMapper="field.responseMapper"
				:valueMapper="field.valueMapper"
				:previewUrl="field.previewUrl"
				:deleteUrl="field.deleteUrl"
				:showDownload="field.showDownload"
				:fileRender="field.fileRender"
				:filePreviewRender="field.filePreviewRender"
				v-bind="field?.componentProps"
			/>
		</template>

		<template v-else-if="isFieldType('richeditor')">
			<HxRichEditor
				:modelValue="modelValue"
				@update:modelValue="$emit('update:modelValue', $event)"
				v-bind="mergedRichEditorProps"
			/>
		</template>

		<template v-else-if="isFieldType('slot')">
			<slot :name="field.prop" :formData="formData" :field="field" />
		</template>

		<template v-else-if="isFieldType('render') && field.render">
			<component :is="field.render(formData, field)" />
		</template>
	</el-form-item>
</template>

<script setup lang="ts">
import { computed, inject } from "vue"
import { HxSelect } from "../select"
import { HxRadio } from "../radio"
import { HxCheckbox } from "../checkbox"
import { HxSwitch } from "../switch"
import { HxCascader } from "../cascader"
import { HxTransfer } from "../transfer"
import { HxUpload } from "../upload"
import { HxRichEditor } from "../rich-editor"
import { HxConfigKey } from "../config-provider/injection"
import { HxDatePicker } from "../date-picker"
import { HxDateTimePicker } from "../date-time-picker"
import type { HxConfig } from "../../types/config"
import type { FormField, FormFieldProps, FormFieldEmits } from "./types"

const props = defineProps<FormFieldProps>()
const emit = defineEmits<FormFieldEmits>()

const config = inject<HxConfig>(HxConfigKey)

/** 类型守卫，帮助 ts-plugin 正确理解 v-if/v-else-if 链中的类型收窄 */
const isFieldType = (knownType: string) => props.field.type === knownType
const mergedCascaderProps = computed(() => ({ ...props.field?.cascaderProps, ...props.field?.componentProps }))
const mergedRichEditorProps = computed(() => ({ ...props.field?.richEditorParams, ...props.field?.componentProps }))

defineOptions({ name: "HxFormField" })
</script>
