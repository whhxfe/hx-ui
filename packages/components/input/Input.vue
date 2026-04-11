<!--
  HxInput - 文本输入组件（input / textarea）
  可独立使用，也可通过 HxForm 的 columns 配置自动渲染
-->
<template>
	<el-input
		v-model="innerValue"
		:type="inputType"
		:placeholder="defaultPlaceholder"
		:clearable="clearable"
		:disabled="disabled"
		:maxlength="maxlength"
		:show-word-limit="showWordLimit"
		:rows="textareaRows"
		v-bind="attrs"
	/>
</template>

<script lang="ts" setup>
import { computed, useAttrs } from "vue"
import type { InputProps } from "./types"

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<InputProps>(), {
	type: "input",
	clearable: true,
	rows: 3,
})

const emit = defineEmits<{
	(e: "update:modelValue", value: string | number): void
}>()

const attrs = useAttrs()

const inputType = computed(() => (props.type === "textarea" ? "textarea" : undefined))
const textareaRows = computed(() => (props.type === "textarea" ? props.rows : undefined))

/** 默认 placeholder：优先用 props.placeholder，否则根据 label 自动生成 */
const defaultPlaceholder = computed(() => {
	if (props.placeholder) return props.placeholder
	const prefix = props.type === "textarea" ? "请输入" : "请输入"
	return props.label ? `${prefix}${props.label}` : prefix
})

const innerValue = computed({
	get: () => props.modelValue ?? "",
	set: (val) => emit("update:modelValue", val ?? ""),
})

defineExpose({})
</script>
