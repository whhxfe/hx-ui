<template>
	<div class="demo-section">
		<p class="demo-title">日期时间范围 datetimerange（默认）</p>
		<HxDateTimePicker v-model="value1" />

		<p class="demo-title">日期时间范围 + 快捷选项</p>
		<HxDateTimePicker v-model="value2" :shortcuts="shortcuts" />

		<p class="demo-title">单个日期时间 datetime</p>
		<HxDateTimePicker v-model="value3" mode="datetime" placeholder="请选择日期时间" />

		<p class="demo-title">单个日期时间 + 快捷选项</p>
		<HxDateTimePicker v-model="value4" mode="datetime" placeholder="请选择日期时间" :shortcuts="dateTimeShortcuts" />

		<p class="demo-title">自定义占位文本</p>
		<HxDateTimePicker
			v-model="value5"
			start-placeholder="计划开始时间"
			end-placeholder="计划结束时间"
		/>

		<p class="demo-title">禁用状态</p>
		<HxDateTimePicker v-model="value6" disabled />

		<p class="demo-title">值：{{ JSON.stringify({ value1, value2, value3, value4, value5, value6 }) }}</p>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { HxDateTimePicker } from "@hx/ui"

const value1 = ref<[string, string]>(["", ""])
const value2 = ref<[string, string]>(["", ""])
const value3 = ref<string>("")
const value4 = ref<string>("")
const value5 = ref<[string, string]>(["", ""])
const value6 = ref<[string, string]>(["", ""])

const now = new Date()
const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)

const shortcuts = [
	{ text: "今天", value: () => [todayStart, todayEnd] },
	{ text: "昨天", value: () => {
		const s = new Date(todayStart)
		const e = new Date(todayEnd)
		s.setDate(s.getDate() - 1)
		e.setDate(e.getDate() - 1)
		return [s, e]
	}},
	{ text: "最近一周", value: () => {
		const end = new Date(todayEnd)
		const start = new Date(todayStart)
		start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
		return [start, end]
	}},
	{ text: "最近一个月", value: () => {
		const end = new Date(todayEnd)
		const start = new Date(todayStart)
		start.setMonth(start.getMonth() - 1)
		return [start, end]
	}},
]

const dateTimeShortcuts = [
	{ text: "今天", value: () => todayStart },
	{ text: "明天", value: () => {
		const d = new Date(todayStart)
		d.setDate(d.getDate() + 1)
		return d
	}},
]
</script>

<style scoped>
.demo-section {
	padding: 4px 0;
	display: flex;
	flex-direction: column;
	gap: 12px;
}
.demo-title {
	margin: 0 0 6px;
	font-size: 13px;
	color: var(--el-text-color-secondary);
	font-weight: 500;
}
</style>
