<template>
  <div class="hx-img-viewer" :style="{ width: props.width, height: props.height }">
    <el-image
      class="hx-img-viewer__content"
      fit="contain"
      :src="url"
      :preview-src-list="[url]"
      preview-teleported
      hide-on-click-modal
      loading="lazy"
    />
  </div>
</template>

<script setup lang="ts">
import type { ImgViewerProps } from './types'

const props = withDefaults(defineProps<ImgViewerProps>(), {
  width: '100%',
  height: '100%',
})
</script>

<style lang="scss" scoped>
$primary-color: var(--hx-primary-color);
$bg: var(--hx-bg-color);
$border-color: var(--hx-border-color-base);
$hover-bg: var(--hx-bg-color-hover);
$shadow: var(--hx-shadow-color);

.hx-img-viewer {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  border-radius: 6px;
  background: $bg;
  border: 1px solid $border-color;
  transition: all 0.2s ease;

  &:hover {
    background: $hover-bg;
    border-color: $primary-color;
    // transform: translateY(-2px);
    box-shadow: 0 2px 8px $shadow;
  }

  &__content {
    width: 100%;
    height: 100%;
    display: block;

    :deep(.el-image__inner) {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    :deep(.el-image__placeholder) {
      background: transparent;
    }
  }
}
</style>