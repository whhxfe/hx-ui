<script setup lang="ts">
import { ref } from "vue"
import { HxTransfer } from "@hx/ui"
import type { TransferOption, TransferGroup, TransferRemoteConfig } from "@hx/ui"

// ———————————— 基础用法 ————————————

const singleValue = ref("")
const multipleValue = ref("1,3")

const personOptions: TransferOption[] = [
  { label: "张三", value: "1" },
  { label: "李四", value: "2" },
  { label: "王五", value: "3" },
  { label: "赵六", value: "4", disabled: true },
  { label: "钱七", value: "5" },
  { label: "孙八", value: "6" },
  { label: "周九", value: "7" },
  { label: "吴十", value: "8" },
  { label: "郑十一", value: "9" },
  { label: "陈十二", value: "10" },
]

// ———————————— 分组数据 ————————————

const groupValue = ref("2,5")

const groupOptions: TransferGroup[] = [
  {
    label: "研发部",
    options: [
      { label: "张三", value: "1" },
      { label: "李四", value: "2" },
      { label: "王五", value: "3" },
      { label: "赵六", value: "4" },
    ],
  },
  {
    label: "产品部",
    options: [
      { label: "钱七", value: "5" },
      { label: "孙八", value: "6" },
    ],
  },
  {
    label: "运营部",
    options: [
      { label: "周九", value: "7" },
      { label: "吴十", value: "8" },
      { label: "郑十一", value: "9" },
    ],
  },
]

// ———————————— 远程数据 ————————————

const remoteSingleValue = ref("")
const remoteMultipleValue = ref("")

const remoteConfig: TransferRemoteConfig = {
  url: "http://localhost:3000/api/mock/transfer-options",
  method: "get",
  params: { type: "transfer" },
  labelKey: "label",
  valueKey: "value",
}

// ———————————— 自定义配置 ————————————

const customValue = ref("")
const tagOptions: TransferOption[] = [
  { label: "重要", value: "important" },
  { label: "紧急", value: "urgent" },
  { label: "待处理", value: "pending" },
  { label: "已完成", value: "done" },
  { label: "已取消", value: "cancelled" },
]
</script>

<template>
  <div class="page-container">
    <h1 class="page-title">Transfer 穿梭框</h1>
    <p class="page-desc">用于在两个面板之间进行数据交互，支持单选/多选、分组折叠、搜索过滤、远程数据源等功能。</p>

    <!-- 基础用法：单选 / 多选 -->
    <section class="demo-section">
      <h3 class="section-title">基础用法</h3>
      <p class="section-desc">通过 <code>options</code> 传入静态选项列表，<code>multiple</code> 控制单选或多选模式。</p>
      <div class="demo-block">
        <div class="demo-col">
          <p class="demo-sub-label">单选模式</p>
          <hx-transfer
            v-model="singleValue"
            :options="personOptions"
            config-text="人员"
            title="选择人员"
            left-width="280px"
            height="320px"
          />
          <p class="demo-value">当前值: {{ singleValue }}</p>
        </div>
        <div class="demo-col">
          <p class="demo-sub-label">多选模式</p>
          <hx-transfer
            v-model="multipleValue"
            :options="personOptions"
            config-text="人员"
            title="选择人员"
            multiple
            height="320px"
          />
          <p class="demo-value">当前值: {{ multipleValue }}</p>
        </div>
      </div>
    </section>

    <!-- 分组数据 -->
    <section class="demo-section">
      <h3 class="section-title">分组数据</h3>
      <p class="section-desc">传入 <code>TransferGroup[]</code> 格式数据时，左侧面板会按分组展示，点击分组头可展开/折叠。</p>
      <div class="demo-block">
        <hx-transfer
          v-model="groupValue"
          :options="groupOptions"
          config-text="人员"
          title="选择人员"
          multiple
          height="360px"
        />
        <p class="demo-value">当前值: {{ groupValue }}</p>
      </div>
    </section>

    <!-- 远程数据 -->
    <section class="demo-section">
      <h3 class="section-title">远程数据</h3>
      <p class="section-desc">传入 <code>remote</code> 配置自动请求远端接口获取 options。</p>
      <div class="demo-block">
        <div class="demo-col">
          <p class="demo-sub-label">远程单选</p>
          <hx-transfer
            v-model="remoteSingleValue"
            :remote="remoteConfig"
            config-text="人员"
            title="选择人员"
            height="320px"
          />
          <p class="demo-value">当前值: {{ remoteSingleValue }}</p>
        </div>
        <div class="demo-col">
          <p class="demo-sub-label">远程多选</p>
          <hx-transfer
            v-model="remoteMultipleValue"
            :remote="remoteConfig"
            config-text="人员"
            title="选择人员"
            multiple
            height="320px"
          />
          <p class="demo-value">当前值: {{ remoteMultipleValue }}</p>
        </div>
      </div>
      <div class="demo-tips">
        <p class="demo-tips-title">Mock 接口格式参考：</p>
        <pre class="demo-code">{
  "state": 2000,
  "data": [
    { "label": "张三", "value": "1" },
    { "label": "李四", "value": "2" }
  ]
}</pre>
      </div>
    </section>

    <!-- 自定义配置 -->
    <section class="demo-section">
      <h3 class="section-title">自定义配置</h3>
      <p class="section-desc">通过 <code>configText</code> 自定义文案，<code>title</code> 自定义面板标题，<code>leftWidth</code> 自定义左侧宽度。</p>
      <div class="demo-block">
        <hx-transfer
          v-model="customValue"
          :options="tagOptions"
          config-text="标签"
          title="选择标签"
          left-width="260px"
          placeholder="请选择标签"
          multiple
          height="280px"
        />
        <p class="demo-value">当前值: {{ customValue }}</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-container {
  max-width: 900px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.page-desc {
  color: #666;
  margin-bottom: 32px;
  line-height: 1.6;
}

.demo-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.section-desc {
  color: #666;
  font-size: 14px;
  margin-bottom: 16px;
}

.section-desc code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
  color: #c7254e;
}

.demo-block {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: flex-start;
}

.demo-col {
  flex: 1;
  min-width: 280px;
}

.demo-sub-label {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
}

.demo-value {
  margin-top: 12px;
  font-size: 13px;
  color: #888;
  background: #f9f9f9;
  padding: 8px 12px;
  border-radius: 4px;
}

.demo-tips {
  margin-top: 16px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 12px 16px;
}

.demo-tips-title {
  font-size: 13px;
  color: #495057;
  font-weight: 600;
  margin-bottom: 8px;
}

.demo-code {
  font-size: 12px;
  color: #495057;
  background: #f1f3f5;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  margin: 0;
  font-family: "Courier New", monospace;
}
</style>