<template>
  <div>
    <div class="demo-tips">
      <p><strong>说明：</strong></p>
      <ul>
        <li>武汉、北京、上海：使用点位自带的 iconUrl 和 iconSize</li>
        <li>其他城市：使用默认圆形样式</li>
      </ul>
    </div>

    <hx-map :center="{ lon: 116.4, lat: 39.9 }" :zoom="4" :height="400">
      <hx-map-markers :markers="markers">
        <hx-map-popup :render="renderPopup" />
      </hx-map-markers>
    </hx-map>
  </div>
</template>

<script setup lang="ts">
import { h } from "vue"
import { HxMap, HxMapMarkers, HxMapPopup } from "@hx/ui"
import type { MapMarkerItem } from "@hx/ui"

// 武汉、北京、上海使用点位自带的 iconUrl
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

const renderPopup = (item: MapMarkerItem) => {
  const content: any[] = [
    h('div', { class: 'marker-popup__header' }, [
      h('span', { class: 'marker-popup__type' }, item.type),
    ]),
    h('div', { class: 'marker-popup__title' }, item.name),
    h('div', { class: 'marker-popup__desc' }, item.address),
  ]

  if (item.extra) {
    content.push(
      h('div', { class: 'marker-popup__extra' }, [
        h('div', { class: 'marker-popup__row' }, [
          h('span', { class: 'marker-popup__label' }, '人口'),
          h('span', { class: 'marker-popup__value' }, item.extra.population),
        ]),
        h('div', { class: 'marker-popup__row' }, [
          h('span', { class: 'marker-popup__label' }, 'GDP'),
          h('span', { class: 'marker-popup__value' }, item.extra.GDP),
        ]),
        h('div', { class: 'marker-popup__row' }, [
          h('span', { class: 'marker-popup__label' }, '面积'),
          h('span', { class: 'marker-popup__value' }, item.extra.area),
        ]),
      ])
    )
  }

  return h('div', { class: 'marker-popup' }, content)
}
</script>

<style scoped>
.demo-tips {
  margin-bottom: 12px;
  padding: 12px;
  background: var(--el-fill-color-lightest);
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
  background: var(--el-color-primary);
  color: var(--el-bg-color);
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
  color: var(--el-text-color-regular);
  margin-bottom: 8px;
}

.marker-popup__extra {
  border-top: 1px solid var(--el-border-color);
  padding-top: 8px;
}

.marker-popup__row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  line-height: 1.6;
}

.marker-popup__label {
  color: var(--el-text-color-secondary);
}

.marker-popup__value {
  color: var(--el-text-color-primary);
}
</style>
