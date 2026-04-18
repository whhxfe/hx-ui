<!--
  HxTransfer - 人员/标签穿梭框组件
  支持静态 options 和远程 remote，可单选/多选，支持分组折叠
-->
<template>
	<div class="hx-transfer" :style="{ height }">
		<!-- 左侧面板 -->
		<div class="hx-transfer__panel hx-transfer__panel--left" :style="{ width: leftWidth }">
			<div class="hx-transfer__header">
				<span class="hx-transfer__header-title">{{ title || `${configText}列表` }}</span>
				<div class="hx-transfer__operations">
					<span v-if="isGroupFormat" class="hx-transfer__operation-link" @click="collapsedKeys = isAllCollapsed ? new Set() : allGroupKeys">
						{{ isAllCollapsed ? "展开分组" : "折叠分组" }}
					</span>
					<span v-if="multiple" class="hx-transfer__operation-link" @click="toggleSelectAll">全选</span>
				</div>
			</div>

			<div class="hx-transfer__search">
				<input v-model="searchKeyword" type="text" :placeholder="placeholder || `请选择${configText}`" class="hx-transfer__search-input" />
				<span v-if="searchKeyword" class="hx-transfer__search-clear" @click="searchKeyword = ''">×</span>
			</div>

			<div class="hx-transfer__list" ref="leftListRef">
				<template v-for="node in flatItems" :key="getNodeKey(node)">
					<!-- 分组头 -->
					<div v-if="isGroupNode(node)" class="hx-transfer__group">
						<div class="hx-transfer__group-header" @click="toggleGroup(node.groupKey)">
							<span class="hx-transfer__group-arrow" :class="{ 'hx-transfer__group-arrow--collapsed': isCollapsed(node.groupKey) }">▶</span>
							<span class="hx-transfer__group-name">{{ node.groupName }}</span>
							<span class="hx-transfer__group-count">({{ node.options.length }})</span>
						</div>
					</div>
					<!-- 单层选项 / 分组内选项 -->
					<div v-else class="hx-transfer__item" :class="{ 'hx-transfer__item--selected': isSelected(node.value) }" @click="handleClick(node.item)">
						<span>{{ node.label }}</span>
						<span v-if="isSelected(node.value)" class="hx-transfer__item-check">✓</span>
					</div>
				</template>
			</div>
		</div>

		<!-- 右侧已选区域 -->
		<div class="hx-transfer__panel hx-transfer__panel--right">
			<div class="hx-transfer__header">
				<span class="hx-transfer__header-title">已选中{{ configText }}</span>
				<div class="hx-transfer__operations">
					<span v-if="selectedValues.length > 0" class="hx-transfer__operation-link" @click="clearAll">清空</span>
				</div>
			</div>
			<div class="hx-transfer__tags">
				<div v-for="(value, index) in selectedValues" :key="`${value}-${index}`" class="hx-transfer__tag">
					<span class="hx-transfer__tag-label">{{ getLabelByValue(value) }}</span>
					<span v-if="multiple" class="hx-transfer__tag-remove" @click="removeTag(value)">×</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, computed, nextTick, watch } from "vue"
import type { TransferOption, TransferGroup, TransferProps, TransferExpose } from "./types"
import { useRemoteOptions } from "../../hooks/useRemoteOptions"

interface GroupNode {
	type: "group"
	groupKey: string
	groupName: string
	options: TransferOption[]
}

interface ItemNode {
	type: "item"
	item: TransferOption
	value: string | number   // 与 TransferOption.value 同名，防止 ts-plugin 合成 Record<"value", unknown>
	label: string
	groupName?: string
	groupKey?: string
}

type FlatNode = GroupNode | ItemNode

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<TransferProps>(), {
	modelValue: "",
	leftWidth: "300px",
	configText: "人员",
	placeholder: "",
	multiple: false,
	modelValueType: "string",
	height: "400px",
})

const emit = defineEmits<{
	(e: "update:modelValue", value: string | string[]): void
}>()

const MODEL_VALUE_SEPARATOR = ","

// ——————————————————————————————————
const { remoteOptions, loading } = useRemoteOptions(props.remote)
const searchKeyword = ref("")
const leftListRef = ref<HTMLElement | null>(null)
const collapsedKeys = ref<Set<string>>(new Set())

const effectiveLabelKey = computed(() => props.labelKey ?? props.remote?.labelKey ?? "label")
const effectiveValueKey = computed(() => props.valueKey ?? props.remote?.valueKey ?? "value")

/** 标准化后的完整数据源 */
const normalizedDataSource = computed<TransferOption[] | TransferGroup[]>(() => {
	const raw: any[] = props.options?.length ? props.options : remoteOptions.value as any[]
	if (!Array.isArray(raw) || raw.length === 0) return []
	return Array.isArray(raw[0].options)
		? raw.map((item, idx) => ({
				groupKey: `group_${idx}_${item.label}`,
				groupName: item.label,
				label: item.label,
				options: item.options,
			}))
		: raw.map(item => ({ label: item[effectiveLabelKey.value] ?? item.label, value: item[effectiveValueKey.value] ?? item.value }))
})

/** 是否为分组格式 */
const isGroupFormat = computed(() => {
	const data = normalizedDataSource.value
	return !!(Array.isArray(data) && data.length && "groupKey" in data[0])
})

/** 扁平化渲染树
 * 分组数据：[groupHeader, item(item.groupName=...), item(...), groupHeader, ...]
 * 单层数据：[item, item, ...]
 */
const flatItems = computed<FlatNode[]>(() => {
	const data = normalizedDataSource.value
	if (!Array.isArray(data) || data.length === 0) return []
	const kw = searchKeyword.value.toLowerCase().trim()
	if (isGroupFormat.value) {
		return (data as TransferGroup[]).flatMap(group => {
			const groupKey = group.groupKey!
			const collapsed = collapsedKeys.value.has(groupKey)
			const filtered = group.options.filter(o => o.label.toLowerCase().includes(kw))
			if (!filtered.length) return []
			return [
				{ type: "group", groupKey, groupName: group.groupName ?? "", options: filtered } as GroupNode,
				// 折叠状态下不输出选项
				...(collapsed
					? []
					: filtered.map(item => ({ type: "item", item, value: item.value, label: item.label, groupName: group.groupName ?? "", groupKey } as ItemNode))),
			]
		})
	}
	return (data as TransferOption[])
		.filter(item => item.label.toLowerCase().includes(kw))
		.map(item => ({ type: "item", item, value: item.value, label: item.label } as ItemNode))
})

/** 当前选中值数组 */
const selectedValues = computed<string[]>(() => {
	const v = props.modelValue
	if (!v) return []
	if (Array.isArray(v)) return v.map(String).filter(Boolean)
	return props.multiple ? v.split(MODEL_VALUE_SEPARATOR).map(s => s.trim()).filter(Boolean) : [v]
})

const selectedSet = computed(() => new Set(selectedValues.value))

const emitValue = (values: string[]) => {
	const out = props.multiple
		? (props.modelValueType === "array" ? values : values.join(MODEL_VALUE_SEPARATOR))
		: values[0] ?? ""
	emit("update:modelValue", out)
}

const isSelected = (value: string | number) => selectedSet.value.has(String(value))

const handleClick = (item: TransferOption) => {
	const val = String(item.value)
	const cur = selectedValues.value
	if (cur.includes(val)) {
		emitValue(cur.filter(v => v !== val)) // 取消选中（从已有选中中移除当前项）
	} else if (props.multiple) {
		emitValue([...cur, val]) // 多选：追加
	} else {
		emitValue([val]) // 单选：直接替换
	}
}

const toggleSelectAll = () => {
	const data = normalizedDataSource.value
	// 从原始数据源取值（而非 flatItems），避免被折叠分组遗漏
	const allVals = isGroupFormat.value
		? (data as TransferGroup[]).flatMap(g => g.options.map(o => String(o.value)))
		: (data as TransferOption[]).map(o => String(o.value))
	const isAll = allVals.every(v => isSelected(v))
	emitValue(isAll ? selectedValues.value.filter(v => !allVals.includes(v)) : [...new Set([...selectedValues.value, ...allVals])])
}

const removeTag = (value: string) => emitValue(selectedValues.value.filter(v => v !== value))
const clearAll = () => emitValue([])

const isCollapsed = (key: string) => collapsedKeys.value.has(key)
const toggleGroup = (key: string) => {
	const next = new Set(collapsedKeys.value)
	next.has(key) ? next.delete(key) : next.add(key)
	collapsedKeys.value = next
}

const isGroupNode = (node: FlatNode): node is GroupNode => node.type === "group"

const getNodeKey = (node: FlatNode) =>
	node.type === "group" ? node.groupKey : node.item.value

/** 当前可见分组的所有 groupKey */
const allGroupKeys = computed(() => {
	const data = normalizedDataSource.value
	return new Set(isGroupFormat.value ? (data as TransferGroup[]).map(g => g.groupKey!) : [])
})

/** 所有可见分组是否都已折叠 */
const isAllCollapsed = computed(() => {
	const keys = allGroupKeys.value
	return keys.size > 0 && [...keys].every(k => collapsedKeys.value.has(k))
})

/** 通过 value 查找 label（从原始数据构建映射） */
const getLabelByValue = (value: string): string => {
	const data = normalizedDataSource.value
	if (!Array.isArray(data)) return ""
	for (const node of data) {
		if ("options" in node) {
			const found = (node as TransferGroup).options.find(o => String(o.value) === value)
			if (found) return found.label
		} else {
			if (String((node as TransferOption).value) === value) return (node as TransferOption).label
		}
	}
	return ""
}

watch(isGroupFormat, v => { if (!v) collapsedKeys.value = new Set() })

watch(searchKeyword, () => nextTick(() => leftListRef.value && (leftListRef.value.scrollTop = 0)))

defineExpose({ loading: loading.value } satisfies TransferExpose)
</script>

<!-- 库构建时样式进入 dist/ui.css；不使用 scoped，避免业务项目未与打包产物 scopeId 对齐时布局类名不生效 -->
<style lang="scss">
@use "./index.scss" as *;
</style>
