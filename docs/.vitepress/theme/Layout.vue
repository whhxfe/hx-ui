<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import { HxConfigProvider,registerMapMarkerShapes } from "@whhx/ui";
/** 本地 glob 资源 */
const imageIconModules = import.meta.glob<{ default: string }>(
  "../../../play/src/assets/icons/**/*",
  { eager: true },
);

/** 图标全局配置 - 使用顶层快捷配置 */
const iconConfig = {
  image: {
    source: "local" as const,
    imageIconModules: [imageIconModules],
  },
  iconify: {
    source: "cdn" as const,
    cdnUrl:"http://localhost:3333"
  }
};

/** Request 全局配置，所有请求都会带上这些 headers */
const requestConfig = {
  headers: {
    lang: 'zh-CN',
    'xxx-xxx': 'xxxx',
  },
};

/** 地图全局配置 - 使用 ArcGIS（免费可用） */
const mapConfig = {
  normalUrl: 'https://server.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
  satelliteUrl: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  center: { lon: 116.4, lat: 39.9 },
  zoom: 10,
  maxZoom: 18,
  minZoom: 3,
};

/** 注册默认shape marker */
registerMapMarkerShapes([
  {
    name: 'map-marker',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/></svg>`,
    defaultColor: '#409eff',
  },
  {
    name: 'star',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/></svg>`,
    defaultColor: '#f5a623',
  },
  {
    name: 'home-marker',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor"/></svg>`,
    defaultColor: '#67c23a',
  },
])


</script>

<template>
  <HxConfigProvider
    :icon="iconConfig"
    :request="requestConfig"
    :map="mapConfig"
    :iconify-collections="['ep', 'mdi', 'logos', 'twemoji']"
  >
    <DefaultTheme.Layout />
  </HxConfigProvider>
</template>
