<!--
  HxCheckbox - 支持静态 options 和远程 remote 的多选组件
  可独立使用，也可通过 HxForm 的 columns 配置自动渲染
-->
<template>
	<el-checkbox-group
		v-model="innerValue"
		:disabled="disabled"
		v-bind="$attrs"
	>
		<component
			:is="isButton ? 'el-checkbox-button' : 'el-checkbox'"
			v-for="item in options"
			:key="item.value"
			:value="item.value"
			:disabled="item.disabled"
		>
			{{ item.label }}
		</component>
	</el-checkbox-group>
</template>

<script lang="ts" setup>
import { computed, useAttrs } from "vue"
import type { OptionItem } from "../../types"
import type { CheckboxProps } from "./types"
import { useRemoteOptions } from "../../hooks/useRemoteOptions"

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<CheckboxProps>(), {
	variant: 'checkbox',
	modelValueType: 'string',
})

const attrs = useAttrs()

const emit = defineEmits<{
	(e: "update:modelValue", value: any): void
	(e: "change", value: any): void
}>()

const MODEL_VALUE_SEPARATOR = ","

const modelValueTypeResolved = computed((): "string" | "array" => {
	const p = props.modelValueType
	if (p === "array" || p === "string") return p
	const raw = attrs["model-value-type"] ?? attrs.modelValueType
	if (typeof raw === "string") {
		const s = raw.trim()
		if (s === "array" || s === "string") return s
	}
	return "string"
})

const innerValue = computed({
	get: () => {
		if (modelValueTypeResolved.value === "array") {
			const v = props.modelValue
			if (Array.isArray(v)) return v
			if (typeof v === "string" && v) return v.split(MODEL_VALUE_SEPARATOR).filter(Boolean)
			return []
		}
		if (typeof props.modelValue === "string") {
			return props.modelValue ? props.modelValue.split(MODEL_VALUE_SEPARATOR).filter(Boolean) : []
		}
		return props.modelValue ?? []
	},
	set: (val) => {
		if (modelValueTypeResolved.value === "array") {
			emit("update:modelValue", val)
			emit("change", val)
			return
		}
		emit("update:modelValue", Array.isArray(val) ? val.join(MODEL_VALUE_SEPARATOR) : "")
		emit("change", Array.isArray(val) ? val.join(MODEL_VALUE_SEPARATOR) : "")
	},
})

const isButton = computed(() => props.variant === "checkbox-btn")

const { remoteOptions, loading } = useRemoteOptions(props.remote)

const options = computed<OptionItem[]>(() =>
	(props.remote ? remoteOptions.value : props.options || []) as OptionItem[]
)

defineExpose({ loading })
</script>
