<!--
  HxSelect - 支持静态 options 和远程 remote 的下拉选择组件
  可独立使用，也可通过 HxForm 的 columns 配置自动渲染
-->
<template>
	<el-select
		v-model="innerValue"
		:placeholder="placeholder || '请选择'"
		:multiple="multiple"
		:collapse-tags="multiple"
		:collapse-tags-tooltip="multiple"
		:clearable="clearable ?? true"
		:disabled="disabled"
		:filterable="filterable"
		v-bind="elSelectAttrs"
	>
		<template v-if="isGroup">
			<el-option-group
				v-for="group in groups"
				:key="group.label"
				:label="group.label"
				:disabled="group.disabled"
			>
				<el-option
					v-for="item in group.options"
					:key="item.value"
					:label="item.label"
					:value="item.value"
					:disabled="item.disabled"
				/>
			</el-option-group>
		</template>
		<template v-else>
			<el-option
				v-for="item in flatOptions"
				:key="item.value"
				:label="item.label"
				:value="item.value"
				:disabled="item.disabled"
			/>
		</template>
	</el-select>
</template>

<script lang="ts" setup>
import { computed, useAttrs } from "vue"
import type { OptionItem, GroupOptionItem } from "../../types"
import type { SelectProps } from "./types"
import { useRemoteOptions } from "../../hooks/useRemoteOptions"

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SelectProps>(), {
	modelValueType: "string",
})

const attrs = useAttrs()

const emit = defineEmits<{
	(e: "update:modelValue", value: any): void
	(e: "change", value: any): void
}>()

const MODEL_VALUE_SEPARATOR = ","

/** 部分构建路径下仅 import 类型的 defineProps 可能未注册 modelValueType，此时会落在 attrs 里 */
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

/** 未注册进 props 时 modelValueType 会留在 attrs，勿透传给 el-select */
const elSelectAttrs = computed(() => {
	const out = { ...attrs } as Record<string, unknown>
	delete out["model-value-type"]
	delete out.modelValueType
	return out
})

const innerValue = computed({
	get: () => {
		const useArray = props.multiple && modelValueTypeResolved.value === "array"
		if (!useArray) {
			if (!props.multiple) return props.modelValue
			// multiple + string: parse comma-separated string to array for el-select
			if (typeof props.modelValue === "string") {
				return props.modelValue ? props.modelValue.split(MODEL_VALUE_SEPARATOR).filter(Boolean) : []
			}
			return props.modelValue ?? []
		}
		// multiple + array: 父级应为 string[]；若为历史逗号字符串则拆成数组，避免 el-select multiple 收到 string
		const v = props.modelValue
		if (Array.isArray(v)) return v
		if (typeof v === "string" && v) return v.split(MODEL_VALUE_SEPARATOR).filter(Boolean)
		return []
	},
	set: (val) => {
		const useArray = props.multiple && modelValueTypeResolved.value === "array"
		if (!useArray) {
			if (!props.multiple) {
				emit("update:modelValue", val)
				emit("change", val)
				return
			}
			// multiple + string: join array to comma-separated string
			emit("update:modelValue", Array.isArray(val) ? val.join(MODEL_VALUE_SEPARATOR) : "")
			emit("change", Array.isArray(val) ? val.join(MODEL_VALUE_SEPARATOR) : "")
			return
		}
		// multiple + array: emit array
		emit("update:modelValue", val)
		emit("change", val)
	},
})

const { remoteOptions, loading } = useRemoteOptions(props.remote)

const effectiveOptions = computed(() =>
	props.remote ? remoteOptions.value : (props.options || [])
)

const isGroup = computed(() =>
	effectiveOptions.value.length > 0
	&& effectiveOptions.value.every(item => Array.isArray((item as any).options))
)

const flatOptions = computed<OptionItem[]>(() =>
	isGroup.value ? [] : effectiveOptions.value as OptionItem[]
)

const groups = computed<GroupOptionItem[]>(() =>
	isGroup.value ? effectiveOptions.value as GroupOptionItem[] : []
)

defineExpose({ loading })
</script>
