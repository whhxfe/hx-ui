<template>
  <div>
    <div class="demo-toolbar">
      <span>点位自带图标演示（混合模式）：</span>
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

    <hx-map :center="{ lon: 116.4, lat: 39.9 }" :zoom="4" :height="400">
      <hx-map-markers
        ref="markersRef"
        :markers="markers"
        :group-config="groupConfig"
        :marker-content="renderPopup"
        @group-ready="onGroupReady"
      />
    </hx-map>

    <div class="demo-tips">
      <p><strong>说明：</strong></p>
      <ul>
        <li>武汉、北京、上海：使用点位自带的 iconUrl，仅需指定 iconSize 渲染尺寸即可</li>
        <li>武汉的 iconSize 为 [24, 24]，北京、上海的 iconSize 为 [32, 32]</li>
        <li>其他城市：使用 rules 中的圆形样式作为兜底</li>
        <li>无需配置 iconOriginalSize，OpenLayers 直接按 iconSize 显示</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { ref } from "vue"
import { ElButton, ElButtonGroup } from "element-plus"
import { HxMap, HxMapMarkers } from "@whhx/ui"
import type { MapMarkerItem, MarkerGroupConfig } from "@whhx/ui"

const markersRef = ref<InstanceType<typeof HxMapMarkers> | null>(null)

// 响应式分组可见性状态
const groupVisibility = ref<Record<string, boolean>>({})

// 武汉、北京、上海使用点位自带的 iconUrl
// 其他城市没有 iconUrl，使用 rules 兜底
const markers: MapMarkerItem[] = [
  {
    id: 1,
    lon: 114.31,
    lat: 30.52,
    name: '武汉',
    address: '湖北省武汉市',
    type: '省会',
    iconUrl: 'http://localhost:4003/files/images/1.gif',
    iconSize: [48, 48],
    extra: {
      population: '1232.65万',
      GDP: '1.89万亿元',
      area: '8569.15平方公里',
    },
  },
  {
    id: 2,
    lon: 116.4,
    lat: 39.9,
    name: '北京',
    address: '北京市',
    type: '首都',
    iconUrl: '/files/images/1.svg',
    iconSize: [48, 48],
    extra: {
      population: '2189.31万',
      GDP: '4.16万亿元',
      area: '16410.54平方公里',
    },
  },
  {
    id: 3,
    lon: 121.47,
    lat: 31.23,
    name: '上海',
    address: '上海市',
    type: '直辖市',
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/2907/2907137.png',
    iconSize: [32, 32],
    extra: {
      population: '2475.89万',
      GDP: '4.32万亿元',
      area: '6340.5平方公里',
    },
  },
  { id: 4, lon: 113.26, lat: 23.13, name: '广州', address: '广东省广州市', type: '省会' },
  { id: 5, lon: 120.16, lat: 30.28, name: '杭州', address: '浙江省杭州市', type: '省会' },
  { id: 6, lon: 104.06, lat: 30.67, name: '成都', address: '四川省成都市', type: '省会' },
  { id: 7, lon: 108.94, lat: 34.34, name: '西安', address: '陕西省西安市', type: '省会' },
]

const groupConfig: MarkerGroupConfig = {
  groupKey: 'type',
  rules: [
    {
      value: '省会',
      style: { type: 'circle', color: '#409eff', radius: 8 },
    },
    {
      value: '首都',
      style: { type: 'circle', color: '#f56c6c', radius: 10 },
    },
    {
      value: '直辖市',
      style: { type: 'circle', color: '#67c23a', radius: 9 },
    },
  ],
  defaultStyle: { type: 'circle', color: '#909399', radius: 6 },
}

// 分组初始化完成回调
const onGroupReady = (api: any) => {
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
  return (
    <div class="marker-popup">
      <div class="marker-popup__header">
        <span class="marker-popup__type">{item.type}</span>
      </div>
      <div class="marker-popup__title">{item.name}</div>
      <div class="marker-popup__desc">{item.address}</div>
      {item.extra && (
        <div class="marker-popup__extra">
          <div class="marker-popup__row">
            <span class="marker-popup__label">人口</span>
            <span class="marker-popup__value">{item.extra.population}</span>
          </div>
          <div class="marker-popup__row">
            <span class="marker-popup__label">GDP</span>
            <span class="marker-popup__value">{item.extra.GDP}</span>
          </div>
          <div class="marker-popup__row">
            <span class="marker-popup__label">面积</span>
            <span class="marker-popup__value">{item.extra.area}</span>
          </div>
        </div>
      )}
    </div>
  )
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

.demo-tips {
  margin-top: 12px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
  font-size: 13px;
}

.demo-tips ul {
  margin: 8px 0 0 0;
  padding-left: 20px;
}

.demo-tips li {
  margin-bottom: 4px;
}

.marker-popup {
  min-width: 160px;
  padding: 8px 0;
}

.marker-popup__header {
  margin-bottom: 4px;
}

.marker-popup__type {
  display: inline-block;
  padding: 2px 8px;
  background: #409eff;
  color: #fff;
  border-radius: 10px;
  font-size: 11px;
}

.marker-popup__title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 2px;
}

.marker-popup__desc {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.marker-popup__extra {
  border-top: 1px solid #eee;
  padding-top: 8px;
}

.marker-popup__row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  line-height: 1.6;
}

.marker-popup__label {
  color: #999;
}

.marker-popup__value {
  color: #333;
}
</style>
