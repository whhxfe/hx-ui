<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import { HxConfigProvider } from "@hx/ui";
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




</script>

<template>
  <HxConfigProvider
    :icon="iconConfig"
    :request="requestConfig"
    :map="mapConfig"
    iconify-source="offline"
    :iconify-collections="['ep', 'mdi', 'logos', 'twemoji']"
  >
    <DefaultTheme.Layout />
  </HxConfigProvider>
</template>
