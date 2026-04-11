<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import { HxConfigProvider } from "@hx/ui";

/** 与 play 一致：文档站内的图片图标资源（构建时被打包） */
const imageIconModules = import.meta.glob<{ default: string }>(
  "../../../play/src/assets/icons/**/*",
  { eager: true },
);
const iconConfig = {
  imageIconModules: [imageIconModules],
  cdnBaseUrl: "http://localhost:4300/icons",
  source: "local" as const,
};
</script>

<template>
  <HxConfigProvider :icon="iconConfig">
    <DefaultTheme.Layout />
  </HxConfigProvider>
</template>
