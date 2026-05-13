<script setup lang="ts">
import { HxConfigProvider } from '@hx/ui'

/** 本地 glob 资源 */
const imageIconModules = import.meta.glob<{ default: string }>(
  '@/assets/icons/**/*',
  { eager: true },
)

const iconConfig = {
  svg: {},
  image: {
    source: "local" as const,
    imageIconModules: [imageIconModules],
  },
  iconify: {
    // ===== CDN 模式（推荐）- 开发环境使用 CDN，按需加载图标 ======
    source: "cdn" as const,
    cdnUrl: "https://api.iconify.design",

    // ===== Offline 模式（生产环境使用，需要预加载图标集）======
    // source: "offline" as const,
    // collections: ['ep', 'mdi', 'logos', 'twemoji'],
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
