<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Icon as OfflineIcon } from '@iconify/vue/offline'
import { computed, watch, onMounted, ref } from 'vue'
import type { IconifyIconProps } from '../types'
import { useConfig } from '../../../config/composable'
import { registerIconCollection } from '../../../config/offline-icons'

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

const config = useConfig()
const isOffline = computed(() => config.iconifyIcon.source.source === 'offline')
// 图标集是否已加载完成
const iconReady = ref(false)

const widthHeight = computed(() =>
  typeof props.size === 'number' ? props.size : props.size,
)

/** CSS 尺寸值，用于加载占位符的宽高 */
const sizeStyle = computed(() =>
  typeof props.size === 'number' ? `${props.size}px` : props.size,
)

const iconStyle = computed(() => ({
  color: props.color,
  verticalAlign: 'middle' as const,
  display: props.inline ? ('inline' as const) : ('inline-block' as const),
}))

// 动态注册图标集，等待加载完成后显示
const ensureIconLoaded = async () => {
  await registerIconCollection(props.icon)
  iconReady.value = true
}

// 组件挂载时注册当前图标集
onMounted(() => {
  ensureIconLoaded()
})

// 监听 icon 属性变化，重新检测并注册
watch(() => props.icon, () => {
  iconReady.value = false
  ensureIconLoaded()
})
</script>

<template>
  <span class="hx-iconify-icon" v-bind="$attrs">
    <!-- 图标集加载完成后才渲染 -->
    <template v-if="iconReady">
      <OfflineIcon
        v-if="isOffline"
        :icon="props.icon"
        :width="widthHeight"
        :height="widthHeight"
        :style="iconStyle"
        aria-hidden="true"
      />
      <Icon
        v-else
        :icon="props.icon"
        :width="widthHeight"
        :height="widthHeight"
        :style="iconStyle"
        aria-hidden="true"
      />
    </template>
    <!-- 加载中占位，避免空白闪烁 -->
    <template v-else>
      <span
        class="hx-iconify-icon__placeholder"
        :style="{ width: sizeStyle, height: sizeStyle }"
        aria-hidden="true"
      />
    </template>
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
