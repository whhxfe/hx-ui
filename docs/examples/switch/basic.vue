<template>
	<div class="demo-section">
		<p class="demo-title">基础开关</p>
		<HxSwitch v-model="switchValue1" />

		<p class="demo-title" style="margin-top: 28px">带文字提示</p>
		<HxSwitch
			v-model="switchValue2"
			active-text="开"
			inactive-text="关"
			inline-prompt
		/>

		<p class="demo-title" style="margin-top: 28px">禁用状态</p>
		<HxSwitch v-model="switchValue3" disabled />

		<p class="demo-title" style="margin-top: 28px">自定义颜色</p>
		<HxSwitch
			v-model="switchValue4"
			active-color="#67c23a"
			inactive-color="#909399"
		/>

		<p class="demo-title" style="margin-top: 28px">自定义值</p>
		<HxSwitch
			v-model="switchValue5"
			:active-value="1"
			:inactive-value="0"
			active-text="在线"
			inactive-text="离线"
		/>

		<p class="demo-title" style="margin-top: 28px">当前值：{{ switchValue5 }}</p>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { HxSwitch } from "@hx/ui"

const switchValue1 = ref(false)
const switchValue2 = ref(true)
const switchValue3 = ref(true)
const switchValue4 = ref(true)
const switchValue5 = ref(1)
</script>

<style scoped>
.demo-section {
	padding: 4px 0;
}
.demo-title {
	margin: 0 0 10px;
	font-size: 13px;
  color: var(--el-text-color-secondary);
	font-weight: 500;
}
</style>
