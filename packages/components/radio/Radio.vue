<!--
  HxRadio - 支持静态 options 和远程 remote 的单选组件
  可独立使用，也可通过 HxForm 的 columns 配置自动渲染
-->
<template>
	<el-radio-group
		v-model="innerValue"
		:disabled="disabled"
		v-bind="$attrs"
	>
		<component
			:is="isButton ? 'el-radio-button' : 'el-radio'"
			v-for="item in options"
			:key="item.value"
			:value="item.value"
			:disabled="item.disabled"
		>
			{{ item.label }}
		</component>
	</el-radio-group>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import type { OptionItem } from "../form/types"
import { useRemoteOptions } from "../../hooks/useRemoteOptions"

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
	modelValue?: any
	options?: OptionItem[]
	remote?: import("../form/types").RemoteConfig
	disabled?: boolean
	variant?: "radio" | "radio-btn"
}>(), {
	variant: 'radio',
})

const emit = defineEmits<{
	(e: "update:modelValue", value: any): void
	(e: "change", value: any): void
}>()

const innerValue = computed({
	get: () => props.modelValue,
	set: (val) => {
		emit("update:modelValue", val)
		emit("change", val)
	},
})

const isButton = computed(() => props.variant === "radio-btn")

const { remoteOptions, loading } = useRemoteOptions(props.remote, props.options, { fieldType: "radio" })

const options = computed<OptionItem[]>(() =>
	(props.remote ? remoteOptions.value : props.options || []) as OptionItem[]
)

defineExpose({ loading })
</script>
