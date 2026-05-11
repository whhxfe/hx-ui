<template>
	<el-form-item
		:label="field.label"
		:prop="field.prop"
		:required="field.required"
		v-bind="field.formItemProps"
		v-show="!field.hidden"
	>
		<!-- input -->
		<template v-if="field.type === 'input'">
			<el-input
				:modelValue="modelValue"
				@update:modelValue="$emit('update:modelValue', $event)"
				:placeholder="field.placeholder || `请输入${field.label}`"
				:clearable="field.clearable ?? true"
				:disabled="field.disabled"
				:maxlength="field.maxlength"
				:showWordLimit="field.showWordLimit"
				v-bind="field?.componentProps"
			/>
		</template>

		<!-- textarea -->
		<template v-else-if="field.type === 'textarea'">
			<el-input
				type="textarea"
				:modelValue="modelValue"
				@update:modelValue="$emit('update:modelValue', $event)"
				:placeholder="field.placeholder || `请输入${field.label}`"
				:disabled="field.disabled"
				:maxlength="field.maxlength"
				:showWordLimit="field.showWordLimit"
				:rows="field.rows || 3"
				v-bind="field?.componentProps"
			/>
		</template>

		<!-- number -->
		<template v-else-if="field.type === 'number'">
			<el-input-number
				:modelValue="modelValue"
				@update:modelValue="$emit('update:modelValue', $event)"
				:min="field.min"
				:max="field.max"
				:step="field.step ?? 1"
				:precision="field.precision"
				:placeholder="field.placeholder || `请输入${field.label}`"
				:disabled="field.disabled"
				v-bind="field?.componentProps"
			/>
		</template>

		<!-- select -->
		<template v-else-if="field.type === 'select'">
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
				@change="field.onChange?.($event, formData)"
				v-bind="field?.componentProps"
			/>
		</template>

		<!-- radio -->
		<template v-else-if="field.type === 'radio'">
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

		<!-- radio-btn -->
		<template v-else-if="field.type === 'radio-btn'">
			<HxRadio
				:modelValue="modelValue"
				@update:modelValue="$emit('update:modelValue', $event)"
				:options="field.options as any"
				:remote="field.remote"
				:disabled="field.disabled"
				variant="button"
				@change="field.onChange?.($event, formData)"
				v-bind="field?.componentProps"
			/>
		</template>

		<!-- checkbox -->
		<template v-else-if="field.type === 'checkbox'">
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

		<!-- checkbox-btn -->
		<template v-else-if="field.type === 'checkbox-btn'">
			<HxCheckbox
				:modelValue="modelValue"
				@update:modelValue="$emit('update:modelValue', $event)"
				:options="field.options as any"
				:remote="field.remote"
				:disabled="field.disabled"
				variant="button"
				:modelValueType="field.modelValueType"
				@change="field.onChange?.($event, formData)"
				v-bind="field?.componentProps"
			/>
		</template>

		<!-- switch -->
		<template v-else-if="field.type === 'switch'">
			<HxSwitch
				:modelValue="modelValue"
				@update:modelValue="$emit('update:modelValue', $event)"
				:disabled="field.disabled"
				v-bind="field?.componentProps"
			/>
		</template>

		<!-- cascader -->
		<template v-else-if="field.type === 'cascader'">
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

		<!-- transfer -->
		<template v-else-if="field.type === 'transfer'">
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

		<!-- datetime -->
		<template v-else-if="field.type === 'datetime'">
			<el-date-picker
				type="datetime"
				:modelValue="modelValue"
				@update:modelValue="$emit('update:modelValue', $event)"
				:placeholder="field.placeholder || `请选择${field.label}`"
				:valueFormat="field.valueFormat ?? 'YYYY-MM-DD HH:mm:ss'"
				:format="field.format ?? 'YYYY-MM-DD HH:mm:ss'"
				:disabled="field.disabled"
				:clearable="field.clearable ?? true"
				:disabledDate="field.disableFutureTime ? (time: Date) => time.getTime() > Date.now() : undefined"
				v-bind="field?.componentProps"
			/>
		</template>

		<!-- datetimerange -->
		<template v-else-if="field.type === 'datetimerange'">
			<el-date-picker
				type="datetimerange"
				:modelValue="modelValue"
				@update:modelValue="$emit('update:modelValue', $event)"
				:placeholder="field.placeholder || `请选择${field.label}`"
				:valueFormat="field.valueFormat ?? 'YYYY-MM-DD HH:mm:ss'"
				:format="field.format ?? 'YYYY-MM-DD HH:mm:ss'"
				:disabled="field.disabled"
				:clearable="field.clearable ?? true"
				v-bind="field?.componentProps"
			/>
		</template>

		<!-- date -->
		<template v-else-if="field.type === 'date'">
			<el-date-picker
				type="date"
				:modelValue="modelValue"
				@update:modelValue="$emit('update:modelValue', $event)"
				:placeholder="field.placeholder || `请选择${field.label}`"
				:valueFormat="field.valueFormat ?? 'YYYY-MM-DD'"
				:format="field.format ?? 'YYYY-MM-DD'"
				:disabled="field.disabled"
				:clearable="field.clearable ?? true"
				v-bind="field?.componentProps"
			/>
		</template>

		<!-- daterange -->
		<template v-else-if="field.type === 'daterange'">
			<el-date-picker
				type="daterange"
				:modelValue="modelValue"
				@update:modelValue="$emit('update:modelValue', $event)"
				:placeholder="field.placeholder || `请选择${field.label}`"
				:valueFormat="field.valueFormat ?? 'YYYY-MM-DD'"
				:format="field.format ?? 'YYYY-MM-DD'"
				:disabled="field.disabled"
				:clearable="field.clearable ?? true"
				v-bind="field?.componentProps"
			/>
		</template>

		<!-- time -->
		<template v-else-if="field.type === 'time'">
			<el-time-picker
				:modelValue="modelValue"
				@update:modelValue="$emit('update:modelValue', $event)"
				:placeholder="field.placeholder || `请选择${field.label}`"
				:valueFormat="field.valueFormat ?? 'HH:mm:ss'"
				:format="field.format ?? 'HH:mm:ss'"
				:disabled="field.disabled"
				:clearable="field.clearable ?? true"
				v-bind="field?.componentProps"
			/>
		</template>

		<!-- timerange -->
		<template v-else-if="field.type === 'timerange'">
			<el-time-picker
				type="timerange"
				:modelValue="modelValue"
				@update:modelValue="$emit('update:modelValue', $event)"
				:placeholder="field.placeholder || `请选择${field.label}`"
				:valueFormat="field.valueFormat ?? 'HH:mm:ss'"
				:format="field.format ?? 'HH:mm:ss'"
				:disabled="field.disabled"
				:clearable="field.clearable ?? true"
				v-bind="field?.componentProps"
			/>
		</template>

		<!-- upload -->
		<template v-else-if="field.type === 'upload'">
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

		<!-- richeditor -->
		<template v-else-if="field.type === 'richeditor'">
			<HxRichEditor
				:modelValue="modelValue"
				@update:modelValue="$emit('update:modelValue', $event)"
				v-bind="mergedRichEditorProps"
			/>
		</template>

		<!-- slot -->
		<template v-else-if="field.type === 'slot'">
			<slot :name="field.prop" :formData="formData" :field="field" />
		</template>

		<!-- render -->
		<template v-else-if="field.type === 'render' && field.render">
			<component :is="field.render(formData, field)" />
		</template>
	</el-form-item>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { FormField, FormFieldProps, FormFieldEmits } from "./types"

const props = defineProps<FormFieldProps>()
const emit = defineEmits<FormFieldEmits>()

const field = computed(() => props.field)
const mergedCascaderProps = computed(() => ({ ...field.value?.cascaderProps, ...field.value?.componentProps }))
const mergedRichEditorProps = computed(() => ({ ...field.value?.richEditorParams, ...field.value?.componentProps }))

defineOptions({ name: "HxFormField" })
</script>