<!--
  HxTransfer - 人员/标签穿梭框组件
  支持静态 options 和远程 remote，可单选/多选，支持分组折叠
-->
<template>
	<div
		class="hx-transfer"
		:style="{ height: height }"
	>
		<!-- 左侧面板 -->
		<div
			class="hx-transfer__panel hx-transfer__panel--left"
			:style="{ width: leftWidth }"
		>
			<div class="hx-transfer__header">
				<span class="hx-transfer__header-title">
					{{ title || `${configText}列表` }}
				</span>
				<div class="hx-transfer__operations">
					<span
						v-if="isGroupFormat && filteredGroupList.length > 0"
						class="hx-transfer__operation-link"
						@click="toggleCollapseAllGroups"
					>
						{{ areAllGroupsCollapsed ? "展开分组" : "折叠分组" }}
					</span>
					<span
						v-if="multiple"
						class="hx-transfer__operation-link"
						@click="toggleSelectAll"
					>
						全选
					</span>
				</div>
			</div>

			<div class="hx-transfer__search">
				<input
					v-model="searchKeyword"
					type="text"
					:placeholder="placeholder || `请选择${configText}`"
					class="hx-transfer__search-input"
				/>
				<span
					v-if="searchKeyword"
					class="hx-transfer__search-clear"
					@click="searchKeyword = ''"
				>
					×
				</span>
			</div>

			<div class="hx-transfer__list" ref="leftListRef">
				<!-- 分组格式 -->
				<template v-if="isGroupFormat">
					<div
						v-for="group in filteredGroupList"
						:key="group.groupKey"
						class="hx-transfer__group"
					>
						<div
							class="hx-transfer__group-header"
							@click="toggleGroupCollapse(group.groupKey)"
						>
							<span
								class="hx-transfer__group-arrow"
								:class="{
									'hx-transfer__group-arrow--collapsed': isGroupCollapsed(group.groupKey),
								}"
							>
								▶
							</span>
							<span class="hx-transfer__group-name">{{ group.groupName }}</span>
							<span class="hx-transfer__group-count">
								({{ group.options.length }})
							</span>
						</div>

						<div v-if="!isGroupCollapsed(group.groupKey)">
							<div
								v-for="item in group.options"
								:key="item.value"
								class="hx-transfer__item"
								:class="{ 'hx-transfer__item--selected': isSelected(item.value) }"
								@click="handleItemClick(item)"
							>
								<span>{{ item.label }}</span>
								<span
									v-if="isSelected(item.value)"
									class="hx-transfer__item-check"
								>
									✓
								</span>
							</div>
						</div>
					</div>
				</template>

				<!-- 单层格式 -->
				<template v-else>
					<div
						v-for="item in filteredSingleList"
						:key="item.value"
						class="hx-transfer__item"
						:class="{ 'hx-transfer__item--selected': isSelected(item.value) }"
						@click="handleItemClick(item)"
					>
						<span>{{ item.label }}</span>
						<span
							v-if="isSelected(item.value)"
							class="hx-transfer__item-check"
						>
							✓
						</span>
					</div>
				</template>
			</div>
		</div>

		<!-- 右侧已选区域 -->
		<div class="hx-transfer__panel hx-transfer__panel--right">
			<div class="hx-transfer__header">
				<span class="hx-transfer__header-title">
					已选中{{ configText }}
				</span>
				<div class="hx-transfer__operations">
					<span
						v-if="multiple && selectedValues.length > 0"
						class="hx-transfer__operation-link"
						@click="clearAllSelected"
					>
						清空
					</span>
				</div>
			</div>

			<div class="hx-transfer__tags">
				<div
					v-for="(value, index) in selectedValues"
					:key="`${value}-${index}`"
					class="hx-transfer__tag"
				>
					<span class="hx-transfer__tag-label">
						{{ getLabelByValue(value) }}
					</span>
					<span
						v-if="multiple"
						class="hx-transfer__tag-remove"
						@click="removeTagFromSelected(value)"
					>
						×
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from "vue"
import type { TransferOption, TransferGroup } from "./types"
import { useRemoteOptions } from "../../hooks/useRemoteOptions"

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
	modelValue?: string | string[]
	modelValueType?: "string" | "array"
	options?: TransferOption[] | TransferGroup[]
	remote?: {
		url: string
		method?: "get" | "post"
		params?: Record<string, any>
		body?: Record<string, any>
		groupNameKey?: string
		groupOptionsKey?: string
		labelKey?: string
		valueKey?: string
	}
	groupNameKey?: string
	groupOptionsKey?: string
	labelKey?: string
	valueKey?: string
	title?: string
	leftWidth?: string
	configText?: string
	placeholder?: string
	multiple?: boolean
	height?: string
}>(), {
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
// 远程数据（复用 useRemoteOptions）
// ——————————————————————————————————
const { remoteOptions, loading } = useRemoteOptions(
	props.remote,
	undefined,
	{ fieldType: "transfer" }
)

// ——————————————————————————————————
// 响应式数据
// ——————————————————————————————————
const searchKeyword = ref("")
const leftListRef = ref<HTMLElement | null>(null)

// ——————————————————————————————————
// 数据标准化
// ——————————————————————————————————

const deepGet = (obj: any, path: string) =>
	path.split(".").reduce((acc, k) => acc?.[k], obj)

/** 当前生效的字段映射 key（优先级：props 配置 > remote 配置 > 默认值） */
const effectiveGroupNameKey = computed(() =>
	props.groupNameKey ?? props.remote?.groupNameKey ?? "label"
)
const effectiveGroupOptionsKey = computed(() =>
	props.groupOptionsKey ?? props.remote?.groupOptionsKey ?? "options"
)
const effectiveLabelKey = computed(() =>
	props.labelKey ?? props.remote?.labelKey ?? "label"
)
const effectiveValueKey = computed(() =>
	props.valueKey ?? props.remote?.valueKey ?? "value"
)

/** 判断某条原始数据是否为分组格式 */
const isGroupDataRaw = (item: any): boolean => {
	if (!item || typeof item !== "object") return false
	const gNameKey = effectiveGroupNameKey.value
	const gOptsKey = effectiveGroupOptionsKey.value
	return (
		(gNameKey in item || "groupName" in item) &&
		gOptsKey in item &&
		Array.isArray(item[gOptsKey])
	)
}

/**
 * 标准化原始数据 → 内部统一格式：
 * - TransferGroup { groupKey, groupName, options: TransferOption[] }
 * - TransferOption { label, value }
 */
const normalizeItem = (
	item: any,
	idx: number,
	groupName?: string
): TransferGroup | TransferOption => {
	if (groupName !== undefined) {
		// 作为分组内选项处理
		return {
			label: deepGet(item, effectiveLabelKey.value),
			value: deepGet(item, effectiveValueKey.value),
		} as TransferOption
	}
	// 顶层：判断是分组还是单层
	if (isGroupDataRaw(item)) {
		return {
			groupKey: `group_${idx}_${deepGet(item, effectiveGroupNameKey.value)}`,
			groupName: deepGet(item, effectiveGroupNameKey.value),
			options: (item[effectiveGroupOptionsKey.value] as any[]).map((opt, i) =>
				normalizeItem(opt, i) as TransferOption
			),
		} as TransferGroup
	}
	return {
		label: deepGet(item, effectiveLabelKey.value),
		value: deepGet(item, effectiveValueKey.value),
	} as TransferOption
}

/** 标准化后的完整数据源（统一使用内部格式） */
const normalizedDataSource = computed<TransferOption[] | TransferGroup[]>(() => {
	// 优先使用静态 options
	const raw: any[] =
		props.options && props.options.length > 0
			? props.options
			: (remoteOptions.value as any[])

	if (!Array.isArray(raw) || raw.length === 0) return []

	// 判断第一条是分组还是单层，统一 normalize
	const first = raw[0]
	// 如果是分组格式，顶层每个元素映射为一个 TransferGroup
	// 如果是单层格式，顶层每个元素映射为一个 TransferOption
	if (isGroupDataRaw(first)) {
		return raw.map((item, idx) => normalizeItem(item, idx) as TransferGroup)
	}
	return raw.map((item, idx) => normalizeItem(item, idx) as TransferOption)
})

/** 是否为分组格式 */
const isGroupFormat = computed<boolean>(() => {
	const data = normalizedDataSource.value
	if (!Array.isArray(data) || data.length === 0) return false
	const first = data[0]
	return !!(first && "groupKey" in first && "options" in first)
})

const collapsedGroupKeys = ref<Set<string>>(new Set())

// 分组数据变化时同步折叠状态
watch(isGroupFormat, (isGroup) => {
	if (!isGroup) {
		collapsedGroupKeys.value = new Set()
		return
	}
	const groups = normalizedDataSource.value as TransferGroup[]
	const validKeys = new Set(groups.map(g => g.groupKey))
	const next = new Set<string>()
	collapsedGroupKeys.value.forEach(k => { if (validKeys.has(k)) next.add(k) })
	collapsedGroupKeys.value = next
})

// ——————————————————————————————————
// 计算属性
// ——————————————————————————————————

/** 解析 v-model 绑定的值为内部统一数组格式 */
const parseModelValue = (value: string | string[] | undefined): string[] => {
	if (!value) return []
	if (Array.isArray(value)) return value.map(v => String(v)).filter(Boolean)
	if (typeof value === "string") {
		if (!props.multiple) return [value]
		return value.split(MODEL_VALUE_SEPARATOR).map(s => s.trim()).filter(Boolean)
	}
	return []
}

/**
 * 将内部数组格式化为符合 modelValueType 的输出值。
 * - 单选 → 始终返回字符串
 * - 多选 string 模式 → 逗号拼接字符串
 * - 多选 array 模式 → 字符串数组
 */
const formatModelValue = (values: string[]): string | string[] => {
	if (!props.multiple) return values[0] ?? ""
	if (props.modelValueType === "array") return values
	return values.join(MODEL_VALUE_SEPARATOR)
}

/** 触发 emit，统一使用 formatModelValue */
const emitValue = (values: string[]) => {
	emit("update:modelValue", formatModelValue(values))
}

/** 当前选中值数组 */
const selectedValues = computed(() => parseModelValue(props.modelValue))

/** 从原始数据构建 value→label 映射表 */
const allOptionsMap = computed(() => {
	const map = new Map<string, string>()
	const data = normalizedDataSource.value
	if (!Array.isArray(data) || data.length === 0) return map

	if (isGroupFormat.value) {
		;(data as TransferGroup[]).forEach(group => {
			group.options.forEach(item => {
				map.set(String(item.value), item.label)
			})
		})
	} else {
		;(data as TransferOption[]).forEach(item => {
			map.set(String(item.value), item.label)
		})
	}
	return map
})

/** 过滤后的分组列表 */
const filteredGroupList = computed<TransferGroup[]>(() => {
	if (!isGroupFormat.value || !Array.isArray(normalizedDataSource.value)) return []
	const kw = searchKeyword.value.toLowerCase().trim()
	return (normalizedDataSource.value as TransferGroup[])
		.map(group => ({
			...group,
			options: group.options.filter(item =>
				item.label.toLowerCase().includes(kw)
			),
		}))
		.filter(group => group.options.length > 0)
})

/** 过滤后的单层列表 */
const filteredSingleList = computed<TransferOption[]>(() => {
	if (isGroupFormat.value || !Array.isArray(normalizedDataSource.value)) return []
	const kw = searchKeyword.value.toLowerCase().trim()
	return (normalizedDataSource.value as TransferOption[]).filter(item =>
		item.label.toLowerCase().includes(kw)
	)
})

/** 选中值 Set（快速查找） */
const selectedSet = computed(() => new Set(selectedValues.value))

/** 当前可见的 groupKey 列表 */
const visibleGroupKeys = computed(() =>
	filteredGroupList.value.map(g => g.groupKey ?? "")
)

/** 所有可见分组是否都已折叠 */
const areAllGroupsCollapsed = computed(() => {
	if (!isGroupFormat.value || visibleGroupKeys.value.length === 0) return false
	return visibleGroupKeys.value.every(key => collapsedGroupKeys.value.has(key))
})

// ——————————————————————————————————
// 分组折叠
// ——————————————————————————————————

const isGroupCollapsed = (groupKey: string | undefined) =>
	groupKey !== undefined && collapsedGroupKeys.value.has(groupKey)

const toggleGroupCollapse = (groupKey: string | undefined) => {
	if (groupKey === undefined) return
	const next = new Set(collapsedGroupKeys.value)
	next.has(groupKey) ? next.delete(groupKey) : next.add(groupKey)
	collapsedGroupKeys.value = next
}

const toggleCollapseAllGroups = () => {
	const next = new Set(collapsedGroupKeys.value)
	const collapseAll = !areAllGroupsCollapsed.value
	visibleGroupKeys.value.forEach(key => {
		collapseAll ? next.add(key) : next.delete(key)
	})
	collapsedGroupKeys.value = next
}

// ——————————————————————————————————
// 选项操作
// ——————————————————————————————————

/** 判断某 value 是否已选中 */
const isSelected = (value: string | number): boolean =>
	selectedSet.value.has(String(value))

/** 处理选项点击 */
const handleItemClick = (item: TransferOption) => {
	const val = String(item.value)
	if (!props.multiple) {
		emitValue([val])
	} else {
		const cur = [...selectedValues.value]
		const idx = cur.indexOf(val)
		if (idx > -1) {
			cur.splice(idx, 1)
		} else {
			cur.push(val)
		}
		emitValue(cur)
	}
}

/** 全选 / 取消全选 */
const toggleSelectAll = () => {
	if (!props.multiple) return
	const allValues = isGroupFormat.value
		? filteredGroupList.value.flatMap(g => g.options.map(o => String(o.value)))
		: filteredSingleList.value.map(o => String(o.value))
	const isAllSelected = allValues.every(v => isSelected(v))
	if (isAllSelected) {
		const curSet = new Set(allValues)
		emitValue(selectedValues.value.filter(v => !curSet.has(v)))
	} else {
		const newVals = [...selectedValues.value]
		allValues.forEach(v => {
			if (!isSelected(v)) newVals.push(v)
		})
		emitValue(newVals)
	}
}

/** 移除单个已选项 */
const removeTagFromSelected = (value: string) => {
	if (!props.multiple) return
	emitValue(selectedValues.value.filter(v => v !== value))
}

/** 清空所有已选 */
const clearAllSelected = () => {
	emitValue([])
}

/** 通过 value 获取 label */
const getLabelByValue = (value: string): string =>
	allOptionsMap.value.get(value) ?? ""

// ——————————————————————————————————
// 监听搜索关键词变化，滚动到顶部
// ——————————————————————————————————
watch(searchKeyword, () => {
	nextTick(() => {
		if (leftListRef.value) {
			leftListRef.value.scrollTop = 0
		}
	})
})

defineExpose({ loading })
</script>

<!-- 库构建时样式进入 dist/ui.css；不使用 scoped，避免业务项目未与打包产物 scopeId 对齐时布局类名不生效 -->
<style lang="scss">
@use "./index.scss" as *;
</style>
