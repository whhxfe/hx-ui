<template>
  <div class="date-picker-demo">
    <!-- 独立使用 -->
    <section class="demo-section">
      <h2 class="section-title">独立使用</h2>
      <div class="demo-row">
        <div class="demo-item">
          <span class="demo-label">日期 date</span>
          <HxDatePicker v-model="date1" type="date" placeholder="请选择日期" />
        </div>
        <div class="demo-item">
          <span class="demo-label">日期范围 daterange</span>
          <HxDatePicker v-model="dateRange1" type="daterange" />
        </div>
        <div class="demo-item">
          <span class="demo-label">日期时间 datetime</span>
          <HxDatePicker v-model="date2" type="datetime" placeholder="请选择日期时间" />
        </div>
        <div class="demo-item">
          <span class="demo-label">日期时间范围 datetimerange</span>
          <HxDatePicker v-model="dateRange2" type="datetimerange" />
        </div>
        <div class="demo-item">
          <span class="demo-label">月份 month</span>
          <HxDatePicker v-model="date3" type="month" placeholder="请选择月份" />
        </div>
        <div class="demo-item">
          <span class="demo-label">月份范围 monthrange</span>
          <HxDatePicker v-model="dateRange3" type="monthrange" />
        </div>
        <div class="demo-item">
          <span class="demo-label">年份 year</span>
          <HxDatePicker v-model="date4" type="year" placeholder="请选择年份" />
        </div>
      </div>
    </section>

    <!-- 范围类型 shortcuts -->
    <section class="demo-section">
      <h2 class="section-title">范围类型快捷选项（dateRangeShortcuts）</h2>
      <p class="section-tip">范围类型（daterange / datetimerange）的 shortcuts 返回 Date[]。</p>
      <div class="demo-row">
        <div class="demo-item">
          <span class="demo-label">daterange + shortcuts</span>
          <HxDatePicker
            v-model="dateRange4"
            type="daterange"
            :shortcuts="dateRangeDemoShortcuts"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </div>
        <div class="demo-item">
          <span class="demo-label">datetimerange + shortcuts</span>
          <HxDatePicker
            v-model="dateRange5"
            type="datetimerange"
            :shortcuts="dateTimeRangeShortcuts"
          />
        </div>
      </div>
    </section>

    <!-- 单个日期 shortcuts -->
    <section class="demo-section">
      <h2 class="section-title">单个日期快捷选项（dateShortcuts）</h2>
      <p class="section-tip">单个类型（date / datetime）的 shortcuts 返回 Date。</p>
      <div class="demo-row">
        <div class="demo-item">
          <span class="demo-label">date + shortcuts</span>
          <HxDatePicker
            v-model="date5"
            type="date"
            placeholder="请选择日期"
            :shortcuts="dateShortcutsDemo"
          />
        </div>
        <div class="demo-item">
          <span class="demo-label">datetime + shortcuts</span>
          <HxDatePicker
            v-model="date6"
            type="datetime"
            placeholder="请选择日期时间"
            :shortcuts="dateShortcutsDemo"
          />
        </div>
      </div>
    </section>

    <!-- 禁用日期 -->
    <section class="demo-section">
      <h2 class="section-title">禁用日期</h2>
      <div class="demo-row">
        <div class="demo-item">
          <span class="demo-label">禁用未来日期</span>
          <HxDatePicker
            v-model="date7"
            type="date"
            placeholder="请选择日期（禁用未来）"
            :disabledDate="disableFutureDate"
          />
        </div>
        <div class="demo-item">
          <span class="demo-label">禁用过去日期</span>
          <HxDatePicker
            v-model="date8"
            type="date"
            placeholder="请选择日期（禁用过去）"
            :disabledDate="disablePastDate"
          />
        </div>
      </div>
    </section>

    <!-- HxDateTimePicker 快捷封装 -->
    <section class="demo-section">
      <h2 class="section-title">HxDateTimePicker（datetimerange 快捷封装）</h2>
      <div class="demo-row">
        <div class="demo-item">
          <span class="demo-label">日期时间范围</span>
          <HxDateTimePicker
            v-model="dateRange6"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </div>
      </div>
    </section>

    <!-- 全局 shortcuts -->
    <section class="demo-section">
      <h2 class="section-title">全局 shortcuts（HxConfigProvider 配置）</h2>
      <p class="section-tip">
        已在 App.vue 的 HxConfigProvider 中配置 datePickerDefaults，以下组件<strong>不传 shortcuts prop</strong> 时自动应用对应的全局配置。
      </p>
      <div class="demo-row">
        <div class="demo-item">
          <span class="demo-label">daterange（自动应用 dateRangeShortcuts）</span>
          <HxDatePicker v-model="date11" type="daterange" />
        </div>
        <div class="demo-item">
          <span class="demo-label">datetimerange（自动应用 dateTimeRangeShortcuts）</span>
          <HxDatePicker v-model="date12" type="datetimerange" />
        </div>
        <div class="demo-item">
          <span class="demo-label">date（自动应用 dateShortcuts）</span>
          <HxDatePicker v-model="date13" type="date" placeholder="请选择日期" />
        </div>
        <div class="demo-item">
          <span class="demo-label">datetime（自动应用 dateTimeShortcuts）</span>
          <HxDatePicker v-model="date14" type="datetime" placeholder="请选择日期时间" />
        </div>
      </div>
    </section>

    <!-- 数据展示 -->
    <section class="demo-section">
      <h2 class="section-title">v-model 值</h2>
      <pre class="data-output">{{ JSON.stringify({
        单个: { date1, date2, date3, date4, date5, date6, date7, date8, date9, date10, date13, date14 },
        范围: { dateRange1, dateRange2, dateRange3, dateRange4, dateRange5, dateRange6, date11, date12 }
      }, null, 2) }}</pre>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { HxDatePicker, HxDateTimePicker } from "@hx/ui"
import { dateTimeRangeShortcuts } from "@/utils"
import dayjs from "dayjs"

const date1 = ref<string>("")
const date2 = ref<string>("")
const date3 = ref<string>("")
const date4 = ref<string>("")
const date5 = ref<string>("")
const date6 = ref<string>("")
const date7 = ref<string>("")
const date8 = ref<string>("")
const date9 = ref<string>("")
const date10 = ref<string>("")
const date11 = ref<[string, string]>(["", ""])
const date12 = ref<[string, string]>(["", ""])
const date13 = ref<string>("")
const date14 = ref<string>("")

const dateRange1 = ref<[string, string]>(["", ""])
const dateRange2 = ref<[string, string]>(["", ""])
const dateRange3 = ref<[string, string]>(["", ""])
const dateRange4 = ref<[string, string]>(["", ""])
const dateRange5 = ref<[string, string]>(["", ""])
const dateRange6 = ref<[string, string]>(["", ""])

/** 范围类型 shortcuts（value 返回 Date[]，daterange 专用） */
const dateRangeDemoShortcuts = [
  {
    text: "今天",
    value: () => [dayjs().startOf("day").toDate(), dayjs().endOf("day").toDate()],
  },
  {
    text: "近三天",
    value: () => [dayjs().subtract(3, "day").startOf("day").toDate(), dayjs().endOf("day").toDate()],
  },
  {
    text: "近一周",
    value: () => [dayjs().subtract(7, "day").startOf("day").toDate(), dayjs().endOf("day").toDate()],
  },
  {
    text: "近一月",
    value: () => [dayjs().subtract(30, "day").startOf("day").toDate(), dayjs().endOf("day").toDate()],
  },
  {
    text: "近一年",
    value: () => [dayjs().subtract(365, "day").startOf("day").toDate(), dayjs().endOf("day").toDate()],
  },
]

/** 单个日期 shortcuts（value 返回 Date） */
const dateShortcutsDemo = [
  { text: "今天", value: () => dayjs().startOf("day").toDate() },
  { text: "昨天", value: () => dayjs().subtract(1, "day").startOf("day").toDate() },
  { text: "明天", value: () => dayjs().add(1, "day").startOf("day").toDate() },
]

const disableFutureDate = (date: Date) => date.getTime() > Date.now()

const disablePastDate = (date: Date) => date.getTime() < Date.now()
</script>

<style scoped>
.date-picker-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.demo-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--hx-text-color-primary, #1a1a1a);
  margin: 0;
}

.section-tip {
  font-size: 13px;
  color: var(--hx-text-color-secondary, #909399);
  margin: 0;
}

.section-tip code {
  background: var(--hx-fill-color-light, #f5f7fa);
  padding: 1px 4px;
  border-radius: 3px;
  font-size: 12px;
}

.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-start;
}

.demo-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 220px;
}

.demo-label {
  font-size: 13px;
  color: var(--hx-text-color-regular, #666);
}

.data-output {
  background: var(--hx-fill-color-light, #f5f7fa);
  border: 1px solid var(--hx-border-color, #dcdfe6);
  border-radius: 4px;
  padding: 12px;
  font-size: 12px;
  overflow: auto;
  max-height: 200px;
}
</style>
