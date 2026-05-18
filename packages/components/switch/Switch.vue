<template>
	<el-switch
		:model-value="modelValue"
		:disabled="disabled"
		:active-text="activeText"
		:inactive-text="inactiveText"
		:active-value="activeValue ?? true"
		:inactive-value="inactiveValue ?? false"
		:active-color="activeColor"
		:inactive-color="inactiveColor"
		:width="width"
		:inline-prompt="inlinePrompt"
		@update:model-value="onUpdate"
		@change="onChange"
	/>
</template>

<script setup lang="ts">
import type { SwitchProps } from "./types"

defineOptions({
	name: "HxSwitch",
	inheritAttrs: false,
})

export interface Props extends SwitchProps {
	modelValue?: boolean | string | number
}

const props = withDefaults(defineProps<Props>(), {
	modelValue: false,
	activeValue: true,
	inactiveValue: false,
})

const emit = defineEmits<{
	"update:modelValue": [value: boolean | string | number]
	"change": [value: boolean | string | number]
}>()

function onUpdate(value: boolean | string | number) {
	emit("update:modelValue", value)
}

function onChange(value: boolean | string | number) {
	emit("change", value)
}
</script>
