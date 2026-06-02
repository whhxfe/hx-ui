<!--
  HxDateTimePicker - 日期时间选择器封装
  支持单个日期时间(datetime)和日期时间范围(datetimerange)
-->
<template>
	<HxDatePicker
		:modelValue="modelValue"
		@update:modelValue="$emit('update:modelValue', $event)"
		:type="(props.mode ?? 'datetimerange') as any"
		:placeholder="isRange ? undefined : (props.placeholder || '请选择日期时间')"
		:startPlaceholder="isRange ? (props.startPlaceholder || '请选择开始时间') : undefined"
		:endPlaceholder="isRange ? (props.endPlaceholder || '请选择结束时间') : undefined"
		:format="mergedFormat"
		:valueFormat="mergedValueFormat"
		:disabled="props.disabled"
		:clearable="props.clearable ?? true"
		:disabledDate="props.disabledDate"
		:shortcuts="mergedShortcuts"
		:defaultValue="props.defaultValue"
	/>
</template>

<script lang="ts" setup>
import { computed, inject } from "vue"
import type { DateTimePickerProps } from "./types"
import { HxDatePicker } from "../date-picker"
import { HxConfigKey } from "../config-provider/injection"
import type { HxConfig } from "../../types/config"

const props = withDefaults(defineProps<DateTimePickerProps>(), {
	mode: "datetimerange",
	clearable: true,
})

const emit = defineEmits<{
	(e: "update:modelValue", value: any): void
	(e: "change", value: any): void
}>()

const config = inject<HxConfig>(HxConfigKey)

const isRange = computed(() => props.mode === "datetimerange")

const DEFAULT_FORMAT = "YYYY-MM-DD HH:mm:ss"
const mergedFormat = computed(() => props.format ?? config?.form?.datePickerDefaults?.format ?? DEFAULT_FORMAT)
const mergedValueFormat = computed(() => props.valueFormat ?? config?.form?.datePickerDefaults?.valueFormat ?? DEFAULT_FORMAT)
/** 合并 shortcuts：字段级 > 全局配置，范围用 dateTimeRangeShortcuts，单选用 dateShortcuts */
const mergedShortcuts = computed(() => {
	if (props.shortcuts) return props.shortcuts
	if (isRange.value) return config?.form?.datePickerDefaults?.dateTimeRangeShortcuts
	return config?.form?.datePickerDefaults?.dateShortcuts
})
</script>
