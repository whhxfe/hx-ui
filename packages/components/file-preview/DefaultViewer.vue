<template>
  <div class="hx-default-viewer" :style="{ width, height }" :title="filename">
    <div class="hx-default-viewer__icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <polyline points="13 2 13 9 20 9" />
      </svg>
    </div>
    <div v-if="extension" class="hx-default-viewer__extension">{{ extension.toUpperCase() }}</div>
    <div class="hx-default-viewer__name">{{ displayName }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { extractFileInfo } from './utils'
import type { DefaultViewerProps } from './types'

const props = withDefaults(defineProps<DefaultViewerProps>(), {
  width: '120px',
  height: '80px',
})

const fileInfo = computed(() => {
  if (props.filename && props.extension) {
    return { filename: props.filename, extension: props.extension }
  }
  return extractFileInfo(props.url)
})

const filename = computed(() => fileInfo.value.filename)
const extension = computed(() => fileInfo.value.extension)
const displayName = computed(() => {
  const name = filename.value
  return name.length > 15 ? name.slice(0, 12) + '...' : name
})
</script>

<style lang="scss" scoped>
$primary-color: #667eea;

.hx-default-viewer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: default;
  transition: all 0.2s ease;
  padding: 8px;
  box-sizing: border-box;

  &:hover {
    background: #eeeeee;
    border-color: $primary-color;
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .hx-default-viewer__icon {
      color: $primary-color;
    }
  }

  &__icon {
    color: #9e9e9e;
    margin-bottom: 4px;
    flex-shrink: 0;
    transition: color 0.2s ease;
  }

  &__extension {
    font-size: 10px;
    font-weight: 600;
    color: #757575;
    margin-bottom: 2px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &__name {
    font-size: 11px;
    color: #616161;
    text-align: center;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    max-width: 100%;
    line-height: 1.2;
  }
}
</style>