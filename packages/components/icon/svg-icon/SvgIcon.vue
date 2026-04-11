<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'
import type { SvgIconProps } from '../types'

defineOptions({
  name: 'HxSvgIcon',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<SvgIconProps>(), {
  icon: 'default',
  color: 'currentColor',
  size: '1em',
  rotate: 0,
  flip: undefined,
  mode: 'mono',
})

/** 与 vite-plugin-svg-icons 的 icon-[dir]-[name] 一致：mono → #icon-mono-xxx，multi → #icon-multi-xxx */
const iconName = computed(() => {
  const icon = props.icon || 'default'
  const dir = props.mode === 'multi' ? 'multi' : 'mono'
  return `#icon-${dir}-${icon}`
})

const iconStyle = computed<CSSProperties>(() => {
  const transforms: string[] = []

  if (props.rotate) {
    transforms.push(`rotate(${props.rotate}deg)`)
  }
  if (props.flip) {
    if (props.flip === 'horizontal' || props.flip === 'both') {
      transforms.push('scaleX(-1)')
    }
    if (props.flip === 'vertical' || props.flip === 'both') {
      transforms.push('scaleY(-1)')
    }
  }

  const isMono = props.mode === 'mono'
  return {
    fontSize: typeof props.size === 'number' ? `${props.size}px` : props.size,
    width: '1em',
    height: '1em',
    // mono：内联 color + fill，避免 scoped 样式无法作用到 <use> 克隆的 symbol 内容
    color: isMono ? props.color : undefined,
    fill: isMono ? props.color : undefined,
    transform: transforms.length > 0 ? transforms.join(' ') : undefined,
    flexShrink: '0',
  }
})
</script>

<template>
  <svg
    class="svg-icon"
    :class="[`svg-icon--${mode}`]"
    :style="iconStyle"
    aria-hidden="true"
    v-bind="$attrs"
  >
    <use :href="iconName" />
  </svg>
</template>

<style scoped>
.svg-icon {
  overflow: hidden;
  display: inline-block;
  vertical-align: middle;
  transition:
    fill 0.3s,
    transform 0.3s;
  font-size: 1em;
}

/* mono 模式下强制单色填充 */
.svg-icon--mono {
  fill: currentColor;
}

/* multi：不设置 fill，避免覆盖 symbol 内 path 的固定 fill */
</style>
