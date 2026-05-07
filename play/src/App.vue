<script setup lang="ts">
import { HxConfigProvider } from '@hx/ui'
import type { IconifyCollectionName } from "@hx/ui";



/** 本地 glob 资源 */
const imageIconModules = import.meta.glob<{ default: string }>(
  '@/assets/icons/**/*',
  { eager: true },
)

const iconifyCollections = ['ep', 'mdi', 'logos', 'twemoji']
// const iconifyCollections:string[] = []

const iconConfig = {
  svg: {},
  image: {
    source: "auto" as const,
    imageIconModules: [imageIconModules],
    cdnBaseUrl: '/icons',
  },
  iconify: {
    // ===== Offline 模式 =====
    source: "offline" as const,
    collections: iconifyCollections  as IconifyCollectionName[],

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
  <HxConfigProvider :icon="iconConfig">
    <router-view />
  </HxConfigProvider>
</template>
