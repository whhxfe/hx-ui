<template>
  <div>
    <div class="demo-toolbar">
      <span>分组控制：</span>
      <el-button-group>
        <el-button
          v-for="rule in groupConfig.rules"
          :key="rule.value"
          size="small"
          :type="groupVisibility[rule.value] ? 'primary' : 'info'"
          @click="toggleGroup(rule.value)"
        >
          {{ rule.value }}
        </el-button>
      </el-button-group>
      <el-button size="small" @click="showAll">显示全部</el-button>
      <el-button size="small" @click="hideAll">隐藏全部</el-button>
    </div>

    <hx-map :center="{ lon: 112.5, lat: 31.0 }" :zoom="7" :height="400">
      <hx-map-markers
        ref="markersRef"
        :markers="markers"
        :group-config="groupConfig"
        :marker-content="renderPopup"
        @group-ready="onGroupReady"
      />
    </hx-map>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from "vue"
import { ElButton, ElButtonGroup } from "element-plus"
import { HxMap, HxMapMarkers } from "@whhx/ui"
import type { MapMarkerItem, MarkerGroupConfig } from "@whhx/ui"

const markersRef = ref<InstanceType<typeof HxMapMarkers> | null>(null)
const groupReady = ref(false)

// 响应式分组可见性状态
const groupVisibility = ref<Record<string, boolean>>({})

const markers: MapMarkerItem[] = [
  { id: 1, lon: 114.31, lat: 30.52, name: '武汉', address: '湖北省武汉市', type: '省会' },
  { id: 2, lon: 115.03, lat: 29.99, name: '黄石', address: '湖北省黄石市', type: '地级市' },
  { id: 3, lon: 111.47, lat: 32.65, name: '十堰', address: '湖北省十堰市', type: '地级市' },
  { id: 4, lon: 111.29, lat: 30.69, name: '宜昌', address: '湖北省宜昌市', type: '地级市' },
  { id: 5, lon: 112.14, lat: 32.01, name: '襄阳', address: '湖北省襄阳市', type: '地级市' },
  { id: 6, lon: 113.09, lat: 31.04, name: '荆州', address: '湖北省荆州市', type: '地级市' },
  { id: 7, lon: 114.89, lat: 30.58, name: '鄂州', address: '湖北省鄂州市', type: '地级市' },
  { id: 8, lon: 112.20, lat: 31.02, name: '荆门', address: '湖北省荆门市', type: '地级市' },
  { id: 9, lon: 113.91, lat: 30.93, name: '孝感', address: '湖北省孝感市', type: '地级市' },
  { id: 10, lon: 115.03, lat: 30.45, name: '黄冈', address: '湖北省黄冈市', type: '地级市' },
  { id: 11, lon: 114.32, lat: 29.85, name: '咸宁', address: '湖北省咸宁市', type: '地级市' },
  { id: 12, lon: 113.37, lat: 31.69, name: '随州', address: '湖北省随州市', type: '地级市' },
  { id: 13, lon: 109.48, lat: 30.27, name: '恩施', address: '湖北省恩施市', type: '地级市' },
]

const groupConfig: MarkerGroupConfig = {
  groupKey: 'type',
  rules: [
    { value: '省会', style: { type: 'circle', color: '#f56c6c', radius: 10 } },
    { value: '地级市', style: { type: 'circle', color: '#409eff', radius: 7 } },
  ],
  defaultStyle: { type: 'circle', color: '#909399', radius: 5 },
}

// 分组初始化完成回调
const onGroupReady = (api: any) => {
  groupReady.value = true
  groupVisibility.value = api.getGroupVisibility()
}

// 切换分组
const toggleGroup = (type: string) => {
  markersRef.value?.toggleGroup(type)
  groupVisibility.value = {
    ...groupVisibility.value,
    [type]: !groupVisibility.value[type],
  }
}

// 显示全部
const showAll = () => {
  markersRef.value?.showAll()
  const visibility = markersRef.value?.getGroupVisibility() ?? {}
  groupVisibility.value = visibility
}

// 隐藏全部
const hideAll = () => {
  markersRef.value?.hideAll()
  const visibility = markersRef.value?.getGroupVisibility() ?? {}
  groupVisibility.value = visibility
}

const renderPopup = (item: MapMarkerItem) => {
  return h('div', { class: 'marker-popup' }, [
    h('div', { class: 'marker-popup__title' }, item.name),
    h('div', { class: 'marker-popup__desc' }, item.address),
  ])
}
</script>

<style scoped>
.demo-toolbar {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.marker-popup {
  min-width: 120px;
}

.marker-popup__title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
}

.marker-popup__desc {
  font-size: 12px;
  color: #666;
}
</style>
