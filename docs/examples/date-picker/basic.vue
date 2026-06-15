<template>
	<div class="demo-section">
		<p class="demo-title">日期选择 date</p>
		<HxDatePicker v-model="date1" type="date" placeholder="请选择日期" />

		<p class="demo-title">日期选择 + 快捷选项</p>
		<HxDatePicker v-model="date2" type="date" placeholder="请选择日期" :shortcuts="dateShortcuts" />

		<p class="demo-title">日期范围 daterange</p>
		<HxDatePicker v-model="dateRange1" type="daterange" />

		<p class="demo-title">日期范围 + 快捷选项</p>
		<HxDatePicker v-model="dateRange2" type="daterange" :shortcuts="dateShortcuts" />

		<p class="demo-title">月份 month</p>
		<HxDatePicker v-model="date3" type="month" placeholder="请选择月份" />

		<p class="demo-title">年份 year</p>
		<HxDatePicker v-model="date4" type="year" placeholder="请选择年份" />

		<p class="demo-title">周 week</p>
		<HxDatePicker v-model="date5" type="week" placeholder="请选择周" />

		<p class="demo-title">禁用未来日期</p>
		<HxDatePicker v-model="date6" type="date" placeholder="禁用未来日期" :disabledDate="disableFuture" />

		<p class="demo-title">值：{{ JSON.stringify({ date1, date2, date3, date4, date5, date6, dateRange1, dateRange2 }) }}</p>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { HxDatePicker } from "@whhx/ui"

const date1 = ref<string>("")
const date2 = ref<string>("")
const date3 = ref<string>("")
const date4 = ref<string>("")
const date5 = ref<string>("")
const date6 = ref<string>("")
const dateRange1 = ref<[string, string]>(["", ""])
const dateRange2 = ref<[string, string]>(["", ""])

const dateShortcuts = [
	{ text: "今天", value: () => new Date() },
	{ text: "昨天", value: () => {
		const d = new Date()
		d.setDate(d.getDate() - 1)
		return d
	}},
	{ text: "明天", value: () => {
		const d = new Date()
		d.setDate(d.getDate() + 1)
		return d
	}},
	{ text: "最近一周", value: () => {
		const end = new Date()
		const start = new Date()
		start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
		return [start, end]
	}},
	{ text: "最近一个月", value: () => {
		const end = new Date()
		const start = new Date()
		start.setMonth(start.getMonth() - 1)
		return [start, end]
	}},
	{ text: "最近三个月", value: () => {
		const end = new Date()
		const start = new Date()
		start.setMonth(start.getMonth() - 3)
		return [start, end]
	}},
]

const disableFuture = (date: Date) => date.getTime() > Date.now()
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
