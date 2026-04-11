<script setup lang="ts">
import { Icon } from '@iconify/vue/offline'
import { computed } from 'vue'
import type { IconifyIconProps } from '../types'

defineOptions({
  name: 'HxIconifyIcon',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<IconifyIconProps>(), {
  icon: 'ep:info',
  size: 16,
  color: 'currentColor',
  inline: false,
})

const widthHeight = computed(() =>
  typeof props.size === 'number' ? props.size : props.size,
)

const iconStyle = computed(() => ({
  color: props.color,
  verticalAlign: 'middle' as const,
  display: props.inline ? ('inline' as const) : ('inline-block' as const),
}))
</script>

<template>
  <span class="hx-iconify-icon" v-bind="$attrs">
    <Icon
      :icon="props.icon"
      :width="widthHeight"
      :height="widthHeight"
      :style="iconStyle"
      aria-hidden="true"
    />
  </span>
</template>

<style scoped>
.hx-iconify-icon {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition:
    color 0.3s,
    transform 0.3s;
}
</style>
