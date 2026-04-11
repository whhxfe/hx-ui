<!--
  HxQuickDateButton - 快捷日期按钮 + 自定义日期范围选择器
  支持预设快捷选项、点击切换、同步 emit [startTime, endTime]
-->
<template>
	<div class="hx-quick-date-button">
		<label v-if="label" class="hx-quick-date-button__label">{{ label }}:</label>
		<div class="hx-quick-date-button__options">
			<div
				v-for="(option, index) in innerOptions"
				:key="index"
				class="hx-quick-date-button__option"
				:class="{ active: datetype === getValue(option) }"
				@click="handleClick(option)"
			>
				{{ getLabel(option) }}
			</div>
			<template v-if="custom">
				<div
					class="hx-quick-date-button__option"
					:class="{ active: datetype === 'custom' }"
					@click="handleCustomClick()"
				>
					自定义
				</div>
				<el-date-picker
					v-if="datetype === 'custom'"
					v-model="customDatetime"
					type="daterange"
					placeholder="选择日期范围"
					:shortcuts="shortcuts"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
				/>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue"
import dayjs from "dayjs"
import { generateShortcuts, defaultShortcuts } from "./utils"
import type { QuickDateButtonExpose } from "./types"

const props = withDefaults(defineProps<{
	modelValue?: string
	label?: string
	options?: {
		text: string
		days: number
		[key: string]: string | number | (() => Date[])
	}[]
	format?: string
	custom?: boolean
	textKey?: string
	daysKey?: string
}>(), {
	modelValue: "",
	label: "",
	options: () => defaultShortcuts,
	format: "YYYY-MM-DD",
	custom: true,
	textKey: "text",
	daysKey: "days",
})

const emit = defineEmits<{
	(e: "update:modelValue", value: string): void
	(e: "change", value: string[]): void
}>()

type ShortcutOption = {
	text: string
	days: number
	[key: string]: string | number | (() => Date[])
}

const getLabel = (option: ShortcutOption): string => String(option[props.textKey] || "")
const getDays = (option: ShortcutOption): number => Number(option[props.daysKey]) || 0

const innerOptions = ref<ShortcutOption[]>(props.options)

const shortcuts = generateShortcuts(props.options, props.format)

const datetype = ref(props.modelValue)

const customDatetime = ref<Date[]>([])

const handleClick = (option: ShortcutOption) => {
	datetype.value = datetype.value !== getValue(option) ? getValue(option) : ""
}

const getValue = (option: ShortcutOption): string => getDays(option).toString()

const handleCustomClick = () => {
	datetype.value = "custom"
}

const handleDatetypeChange = async () => {
	if (datetype.value === "") {
		await resetCustomTime()
		emit("update:modelValue", "")
		emit("change", [])
	} else if (datetype.value === "custom") {
		// 等待 el-date-picker 用户操作，watch customDatetime 处理
	} else {
		await resetCustomTime()
		const days = Number(datetype.value)
		const endTime = dayjs().format(props.format)
		const startTime = dayjs().subtract(days, "day").format(props.format)
		emit("update:modelValue", datetype.value)
		emit("change", [startTime, endTime])
	}
}

const resetCustomTime = async () => {
	customDatetime.value = []
	await nextTick()
}

const reset = () => {
	datetype.value = ""
	customDatetime.value = []
	emit("update:modelValue", "")
	emit("change", [])
	return null
}

watch(
	() => datetype.value,
	() => handleDatetypeChange()
)

watch(
	() => customDatetime.value,
	(val) => {
		if (val && val.length === 2) {
			emit("update:modelValue", "custom")
			emit(
				"change",
				val.map((item) => dayjs(item).format(props.format))
			)
		}
	}
)

watch(
	() => props.modelValue,
	(val) => {
		if (val !== datetype.value) {
			datetype.value = val
		}
	}
)

defineExpose<QuickDateButtonExpose>({ reset })
</script>

<style lang="scss" scoped>
.hx-quick-date-button {
	display: flex;
	align-items: center;

	&__label {
		margin-right: 0.5em;
		flex: 0 0 auto;
		min-width: 70px;
		line-height: 32px;
		font-size: 14px;
		color: var(--el-text-color-regular);
	}

	&__options {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 8px;
	}

	&__option {
		height: 32px;
		line-height: 32px;
		text-align: center;
		font-size: 14px;
		color: var(--el-text-color-regular);
		border: 1px solid var(--el-border-color);
		border-radius: var(--el-border-radius-base);
		padding: 0 10px;
		cursor: pointer;
		user-select: none;
		transition: all 0.2s;

		&.active,
		&:hover {
			color: var(--el-color-primary);
			border-color: var(--el-color-primary);
		}
	}
}
</style>
