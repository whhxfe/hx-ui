<template>
  <component
    :is="currentComponent"
    v-bind="{ ...currentProps, ...$attrs }"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SvgIcon from '../svg-icon/SvgIcon.vue'
import ImageIcon from '../image-icon/ImageIcon.vue'
import IconifyIcon from '../iconify-icon/IconifyIcon.vue'
import type { IconProps, SvgIconMode } from '../types'

defineOptions({
  name: 'HxIcon',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<IconProps>(), {
  type: 'svg',
  name: 'default',
  size: '1em',
  color: 'currentColor',
  group: undefined,
  inline: false,
  rotate: 0,
  flip: undefined,
  className: '',
  alt: '',
  src: '',
  cdnBaseUrl: '',
  baseUrl: '',
  ext: 'png',
})

const currentComponent = computed(() => {
  switch (props.type) {
    case 'svg': return SvgIcon
    case 'image': return ImageIcon
    case 'iconify': return IconifyIcon
    default: return SvgIcon
  }
})

/** SVG：未传 group 时默认 mono（与文档一致） */
const svgMode = computed<SvgIconMode>(() => {
  if (props.type !== 'svg') return 'mono'
  const g = (props.group ?? props.imageType) as string | undefined
  if (g === 'multi') return 'multi'
  return 'mono'
})

const currentProps = computed(() => {
  const { type, name, size, color, group, imageType, inline, rotate, flip, className, alt, src, cdnBaseUrl, baseUrl, ext, source, ...extraAttrs } = props

  switch (type) {
    case 'svg': {
      return {
        icon: name || 'default',
        mode: svgMode.value,
        size,
        color,
        rotate,
        flip,
        ...extraAttrs,
      }
    }

    case 'image': {
      const imgGroup = (group ?? imageType) as string | undefined
      return {
        name: name || 'default',
        group: imgGroup,
        size,
        className,
        alt,
        src,
        cdnBaseUrl,
        baseUrl,
        ext,
        source,
        ...extraAttrs,
      }
    }

    case 'iconify': {
      return {
        icon: name,
        className,
        size,
        color,
        inline,
        ...extraAttrs,
      }
    }

    default:
      return {
        icon: name || 'default',
        size,
        color,
        ...extraAttrs,
      }
  }
})
</script>

<style scoped>
.icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
}
</style>
