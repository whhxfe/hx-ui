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
    source: "auto" as const,
    imageIconModules: [imageIconModules],
    cdnBaseUrl: '/icons',
  },
  /**
   * iconify 图标集配置
   *
   * Offline 模式（预加载）：
   * - 传入图标集名称数组，内部自动从 @iconify/json/json/* 加载并注册
   * - 图标集会在构建时打包，适合常用图标，响应快
   *
   * CDN 模式（按需加载）：
   * - 设置 source: "cdn" 并配置 cdnUrl
   * - 图标按需从 CDN 获取，适合图标数量多、不想增加包体积的场景
   */
  iconify: {
    // ===== Offline 模式 =====
    source: "offline" as const,
    collections: ['ep', 'mdi', 'logos', 'twemoji'] as IconifyCollectionName[],

    // ===== CDN 模式 =====
    // source: "cdn" as const,
    // cdnUrl: "https://api.iconify.design",
  },
};
</script>

<template>
  <HxConfigProvider :icon="iconConfig">
    <DefaultTheme.Layout />
  </HxConfigProvider>
</template>