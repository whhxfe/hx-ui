<!--
  HxDatePicker - 基于 el-date-picker 的日期选择器封装
  支持 date / daterange / datetime / datetimerange / month / monthrange / year / week 类型
  可独立使用，也可通过 HxForm 的 columns 配置自动渲染
-->
<template>
	<el-date-picker
		:modelValue="modelValue"
		@update:modelValue="$emit('update:modelValue', $event)"
		:type="effectiveType"
		:placeholder="isRange ? (props.startPlaceholder || '请选择开始日期') : (props.placeholder || placeholderText)"
		:start-placeholder="props.startPlaceholder || '请选择开始日期'"
		:end-placeholder="props.endPlaceholder || '请选择结束日期'"
		:format="mergedFormat"
		:valueFormat="mergedValueFormat"
		:disabled="props.disabled"
		:clearable="props.clearable ?? true"
		:disabledDate="mergedDisabledDate"
		:shortcuts="mergedShortcuts"
		:default-value="props.defaultValue"
		v-bind="elDatePickerAttrs"
	/>
</template>

<script lang="ts" setup>
import { computed, inject, useAttrs } from "vue"
import type { DatePickerProps } from "./types"
import { HxConfigKey } from "../config-provider/injection"
import type { HxConfig } from "../../types/config"

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<DatePickerProps>(), {
	type: "date",
	clearable: true,
	disabled: false,
})

/** 优先使用 mode，其次 type（与 HxDateTimePicker 命名保持一致） */
const effectiveType = computed(() => props.mode ?? props.type ?? "date")

const attrs = useAttrs()

const emit = defineEmits<{
	(e: "update:modelValue", value: any): void
	(e: "change", value: any): void
}>()

const config = inject<HxConfig>(HxConfigKey)

/** 根据 mode 推断默认 placeholder */
const placeholderText = computed(() => {
	switch (effectiveType.value) {
		case "date":
			return "请选择日期"
		case "datetime":
			return "请选择日期时间"
		case "month":
			return "请选择月份"
		case "monthrange":
			return "请选择月份范围"
		case "year":
			return "请选择年份"
		case "week":
			return "请选择周"
		default:
			return "请选择"
	}
})

/** 根据 mode 推断默认 format */
const defaultFormat = computed(() => {
	switch (effectiveType.value) {
		case "date":
		case "daterange":
			return "YYYY-MM-DD"
		case "datetime":
		case "datetimerange":
			return "YYYY-MM-DD HH:mm:ss"
		case "month":
		case "monthrange":
			return "YYYY-MM"
		case "year":
			return "YYYY"
		case "week":
			return "YYYY 第 WW 周"
		default:
			return undefined
	}
})

/** 根据 mode 推断默认 valueFormat */
const defaultValueFormat = computed(() => {
	switch (effectiveType.value) {
		case "date":
		case "daterange":
			return "YYYY-MM-DD"
		case "datetime":
		case "datetimerange":
			return "YYYY-MM-DD HH:mm:ss"
		case "month":
		case "monthrange":
			return "YYYY-MM"
		case "year":
			return "YYYY"
		default:
			return undefined
	}
})

const mergedFormat = computed(() => props.format ?? config?.form?.datePickerDefaults?.format ?? defaultFormat.value)
const mergedValueFormat = computed(() => props.valueFormat ?? config?.form?.datePickerDefaults?.valueFormat ?? defaultValueFormat.value)

/** 是否为范围类型（范围类型返回 Date[]，单个类型返回 Date） */
const isRange = computed(() =>
	["daterange", "datetimerange", "monthrange"].includes(effectiveType.value)
)

/** 合并 shortcuts：字段级 > 全局配置，根据类型自动选择对应的全局 shortcuts
 * - daterange/datetimerange → dateTimeRangeShortcuts（保留时分秒）
 * - date/datetime → dateShortcuts（精确到日） */
const mergedShortcuts = computed(() => {
	if (props.shortcuts) return props.shortcuts
	if (["daterange", "datetimerange"].includes(effectiveType.value))
		return config?.form?.datePickerDefaults?.dateTimeRangeShortcuts
	return config?.form?.datePickerDefaults?.dateShortcuts
})

/** 合并 disabledDate：disableFutureTime 优先，然后是 props.disabledDate */
const mergedDisabledDate = computed(() => {
	if (props.disableFutureTime) {
		return (date: Date) => date.getTime() > Date.now()
	}
	return props.disabledDate
})

/** 排除已通过 props 传入的属性，避免重复透传给 el-date-picker */
const elDatePickerAttrs = computed(() => {
	const excludes = new Set([
		"modelValue",
		"type",
		"mode",
		"placeholder",
		"startPlaceholder",
		"endPlaceholder",
		"format",
		"valueFormat",
		"disabled",
		"clearable",
		"disabledDate",
		"disableFutureTime",
		"shortcuts",
		"defaultValue",
		"model-value",
		"model-value-type",
		"update:modelValue",
		"onUpdate:modelValue",
	])
	const out: Record<string, unknown> = {}
	for (const [k, v] of Object.entries(attrs)) {
		if (!excludes.has(k) && !excludes.has(k.replace(/([A-Z])/g, "-$1").toLowerCase())) {
			out[k] = v
		}
	}
	return out
})
</script>
