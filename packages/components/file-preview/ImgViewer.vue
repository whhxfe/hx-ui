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
.hx-img-viewer {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  border-radius: 6px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  transition: all 0.2s ease;

  &:hover {
    background: #eeeeee;
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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