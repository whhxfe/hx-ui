<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import { HxConfigProvider } from "@hx/ui";
import type { IconifyCollectionName } from "@hx/ui";

/** 本地 glob 资源 */
const imageIconModules = import.meta.glob<{ default: string }>(
  "../../../play/src/assets/icons/**/*",
  { eager: true },
)

const iconConfig = {
  svg: {},
  image: {
    source: "local" as const,
    imageIconModules: [imageIconModules],
  },
  iconify: {
    // ===== Offline 模式 =====
    source: "offline" as const,
    collections: ['ep', 'mdi', 'logos', 'twemoji'] as IconifyCollectionName[],

    // ===== CDN 模式 =====
    // source: "cdn" as const,
    // cdnUrl: "https://api.iconify.design",
  },
};

/** Request 全局配置，所有请求都会带上这些 headers */
const requestConfig = {
  headers: {
    lang: 'zh-CN',
    'xxx-xxx': 'xxxx',
  },
};
</script>

<template>
  <HxConfigProvider :icon="iconConfig" :request="requestConfig">
    <DefaultTheme.Layout />
  </HxConfigProvider>
</template>