<!--
  HxCascader - 级联选择组件
  支持静态 options 和远程 remote 两种数据源
-->
<template>
	<el-cascader
		v-model="innerValue"
		:options="effectiveOptions"
		:props="effectivePanelProps"
		:placeholder="placeholder || '请选择'"
		:clearable="clearable ?? true"
		:disabled="disabled"
		:filterable="filterable"
		v-bind="attrs"
	/>
</template>

<script lang="ts" setup>
import { computed, useAttrs } from "vue"
import type { CascaderProps } from "./types"
import { useCascaderRemoteOptions } from "../../hooks/useCascaderRemoteOptions"

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<CascaderProps>(), {
	clearable: true,
})

const attrs = useAttrs()

const emit = defineEmits<{
	(e: "update:modelValue", value: any): void
}>()

const { remoteOptions, loading } = useCascaderRemoteOptions(props.remote)

const effectiveOptions = computed(() =>
	props.remote ? remoteOptions.value : (props.options || [])
)

const effectivePanelProps = computed(() => {
	const labelKey = props.remote?.labelKey || "label"
	const valueKey = props.remote?.valueKey || "value"
	const childrenKey = props.remote?.childrenKey || "children"
	return {
		label: labelKey,
		value: valueKey,
		children: childrenKey,
		...(props.cascaderProps ?? {}),
	}
})

const innerValue = computed({
	get: () => props.modelValue,
	set: (val) => emit("update:modelValue", val),
})

defineExpose({
	loading,
})
</script>
