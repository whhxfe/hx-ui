<template>
  <span
    class="image-icon"
    :class="[{ 'image-icon--error': hasError }, `image-icon--${normalizedGroup}`]"
    :style="containerStyle"
  >
    <img
      v-if="!hasError"
      :key="iconSrc"
      :src="iconSrc"
      :alt="alt || `${normalizedGroup}-${normalizedName}`"
      class="image-icon__img"
      :style="imgStyle"
      loading="lazy"
      decoding="async"
      @error="hasError = true"
    />
    <svg
      v-else
      class="image-icon__fallback"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  </span>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { CSSProperties } from 'vue'
import type { ImageIconProps } from '../types'
import { useConfig } from '../../../config/composable'

defineOptions({
  name: 'HxImageIcon',
  inheritAttrs: false,
})

const config = useConfig()

const props = withDefaults(defineProps<ImageIconProps>(), {
  name: 'default',
  size: 20,
  group: undefined,
  alt: '',
  className: '',
  src: '',
  cdnBaseUrl: '',
  baseUrl: '',
  ext: 'png',
})

const normalizedGroup = computed(() =>
  (props.group ?? config.imageIcon.defaultGroup).toLowerCase()
)

const normalizedName = computed(() => (props.name || '').toLowerCase())

const hasError = ref(false)

const normalizeUrl = (url: string) => url.replace(/\/+$/, '')

const iconSrc = computed(() => {
  if (props.src?.trim()) return props.src.trim()

  // 外部传入的 cdnBaseUrl（优先级高于 config）
  const externalBase = props.baseUrl?.trim() || props.cdnBaseUrl?.trim()
  // 当前生效的 source，props > config > 默认为 'auto'
  const source = (props.source ?? config.imageIcon.source ?? 'auto') as 'auto' | 'local' | 'cdn'
  const configCdnBase = config.imageIcon.cdnBaseUrl?.trim()

  // ---- 明确使用 CDN ----
  if (source === 'cdn') {
    const base = externalBase || configCdnBase
    if (!base) return ''
    return `${normalizeUrl(base)}/${normalizedGroup.value}/${normalizedName.value}.${props.ext}`
  }

  // ---- 明确使用本地资源 ----
  if (source === 'local') {
    const hit = config.imageIcon.sourceMap[normalizedGroup.value]?.[normalizedName.value]
    if (hit?.url) return hit.url
    const groupBucket = config.imageIcon.sourceMap[normalizedGroup.value]
    const defaultKey = Object.keys(groupBucket ?? {}).find(n => n.startsWith('default'))
    if (defaultKey && groupBucket?.[defaultKey]) return groupBucket[defaultKey].url
    return ''
  }

  // ---- auto 模式：优先外部传入的 CDN，其次 config CDN，最后本地 fallback ----
  if (externalBase || configCdnBase) {
    return `${normalizeUrl(externalBase || configCdnBase)}/${normalizedGroup.value}/${normalizedName.value}.${props.ext}`
  }

  const hit = config.imageIcon.sourceMap[normalizedGroup.value]?.[normalizedName.value]
  if (hit?.url) return hit.url
  const groupBucket = config.imageIcon.sourceMap[normalizedGroup.value]
  const defaultKey = Object.keys(groupBucket ?? {}).find(n => n.startsWith('default'))
  if (defaultKey && groupBucket?.[defaultKey]) return groupBucket[defaultKey].url
  return ''
})

watch(iconSrc, () => {
  hasError.value = false
})

const containerStyle = computed<CSSProperties>(() => {
  const sizeValue = typeof props.size === 'number' ? `${props.size}px` : props.size
  return {
    fontSize: sizeValue,
    width: sizeValue,
    height: sizeValue,
    display: 'inline-block',
  }
})

const imgStyle = computed<CSSProperties>(() => ({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
}))

defineExpose({ groups: computed(() => config.imageIcon.groups) })
</script>

<style scoped>
.image-icon {
  vertical-align: middle;
  line-height: 1;
  position: relative;
  overflow: hidden;
}

.image-icon__img {
  border: none;
  outline: none;
  transition: opacity 0.3s;
}

.image-icon__fallback {
  width: 70%;
  height: 70%;
  display: block;
  margin: auto;
}
</style>
