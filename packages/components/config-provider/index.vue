<template>
  <slot />
</template>

<script setup lang="ts">
import { computed, provide, watch, watchEffect } from "vue";
import { addAPIProvider } from "@iconify/vue";
import type {
  HxConfig,
  HxConfigProviderProps,
  IconifyIconConfig,
} from "../../types/config";
import { HxConfigKey } from "./injection";
import { buildImageSourceMap } from "../../utils/image-icon";
import { setRequestOptions } from "../../utils/request";

const props = withDefaults(defineProps<HxConfigProviderProps>(), {
  icon: () => ({}),
  request: () => ({}),
});

// ========== 顶层快捷配置工厂函数 ==========

function getDefaultIconifyConfig(): IconifyIconConfig {
  return {
    source: { source: "offline", cdnUrl: undefined },
  };
}

function getDefaultIconConfig() {
  return {
    svg: { symbolPrefix: "icon" },
    iconify: { source: "offline" },
    image: { source: "auto", imageIconModules: [] },
  };
}

// ========== 配置合并工具函数 ==========

/**
 * 构建 iconifyIcon 配置，合并顶层快捷配置与 icon.iconify 嵌套配置
 */
function buildIconifyConfig(props: HxConfigProviderProps): IconifyIconConfig {
  const defaults = getDefaultIconifyConfig();

  // 顶层快捷配置优先级高于 icon.iconify
  const iconifySource = props.icon?.iconify?.source ?? defaults.source.source;
  const iconifyCdnUrl = props.icon?.iconify?.cdnUrl ?? defaults.source.cdnUrl;

  return {
    source: { source: iconifySource, cdnUrl: iconifyCdnUrl },
  };
}

// ========== 响应式配置（使用 computed 确保 props 变化时自动更新）==========

const mergedIconConfig = computed(() => {
  const defaults = getDefaultIconConfig();
  return {
    svg: {
      symbolPrefix:
        
        props.icon?.svg?.symbolPrefix ??
        defaults.svg.symbolPrefix,
    },
    iconify: buildIconifyConfig(props),
    image: {
      cdnBaseUrl: props.icon?.image?.cdnBaseUrl ?? "",
      source: (props.icon?.image?.source ?? defaults.image.source) as
        | "auto"
        | "local"
        | "cdn",
      sourceMap: buildImageSourceMap(props.icon?.image?.imageIconModules ?? []),
      groups: [],
      defaultGroup: "title",
    },
  };
});

// 预处理 imageIcon 的 groups 和 defaultGroup
const imageIconConfig = computed(() => {
  const imageConfig = mergedIconConfig.value.image;
  const groups = Object.keys(imageConfig.sourceMap).sort();
  return {
    ...imageConfig,
    groups,
    defaultGroup: groups[0] ?? "title",
  };
});

const config = computed<HxConfig>(() => ({
  svgIcon: {
    symbolPrefix: mergedIconConfig.value.svg.symbolPrefix,
  },
  imageIcon: imageIconConfig.value,
  iconifyIcon: mergedIconConfig.value.iconify,
  request: props.request,
  componentDefaults: props.componentDefaults,
  qrCode: props.qrCode,
  form: props.form,
}));

// ========== Iconify 初始化 ==========

/**
 * 配置 Iconify CDN provider
 */
function setupIconify() {
  const iconifySource = mergedIconConfig.value.iconify.source.source;
  const iconifyCdnUrl = mergedIconConfig.value.iconify.source.cdnUrl;

  if (iconifySource === "cdn" && iconifyCdnUrl) {
    addAPIProvider("", {
      resources: [iconifyCdnUrl],
    });
  }
}

// 监听配置变化，重新初始化 CDN
watchEffect(() => {
  const source = mergedIconConfig.value.iconify.source.source;
  const cdnUrl = mergedIconConfig.value.iconify.source.cdnUrl;
  setupIconify();
});

// ========== Request 初始化 ==========

function applyRequestOptions() {
  if (props.request) {
    setRequestOptions({
      headers: props.request.headers,
      baseUrl: props.request.baseUrl,
      prefix: props.request.prefix,
    });
  }
}

// 初始设置 + 响应式监听 request 配置变化
applyRequestOptions();
watch(() => props.request, applyRequestOptions, { deep: true });

// ========== Provide 配置 ==========

provide(HxConfigKey, config.value);
</script>
