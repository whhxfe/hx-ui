<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import { HxConfigProvider } from "@hx/ui";

/** 本地 glob 资源 */
const imageIconModules = import.meta.glob<{ default: string }>(
  "../../../play/src/assets/icons/**/*",
  { eager: true },
)

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
</script>

<template>
  <HxConfigProvider
    :icon="iconConfig"
    :request="requestConfig"
    iconify-source="offline"
    :iconify-collections="['ep', 'mdi', 'logos', 'twemoji']"
  >
    <DefaultTheme.Layout />
  </HxConfigProvider>
</template>