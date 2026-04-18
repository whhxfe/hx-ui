<!--
  HxCascader - 级联选择组件
  支持静态 options 和远程 remote 两种数据源
-->
<template>
	<el-cascader
		v-model="innerValue"
		:options="effectiveOptions"
		:props="panelProps"
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
import { useRemoteOptions } from "../../hooks/useRemoteOptions"

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<CascaderProps>(), {
	clearable: true,
})

const attrs = useAttrs()

const emit = defineEmits<{
	(e: "update:modelValue", value: any): void
}>()

const { remoteOptions } = useRemoteOptions(props.remote)

const effectiveOptions = computed(() =>
	props.remote ? remoteOptions.value : (props.options || [])
)

const panelProps = computed(() => ({
	...(props.props ?? {}),
}))

const innerValue = computed({
	get: () => props.modelValue,
	set: (val) => emit("update:modelValue", val),
})

defineExpose({})
</script>
