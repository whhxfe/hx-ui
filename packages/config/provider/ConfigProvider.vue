<template>
  <slot />
</template>

<script setup lang="ts">
import { provide } from 'vue'
import type { HxConfig, HxConfigProviderProps } from '../types'
import { HxConfigKey } from '../composable'
import { buildImageSourceMap } from '../composable'

const props = withDefaults(defineProps<HxConfigProviderProps>(), {
  icon: () => ({}),
})

const sourceMap = buildImageSourceMap(props.icon?.imageIconModules ?? [])
const groups = Object.keys(sourceMap).sort()

const config: HxConfig = {
  imageIcon: {
    cdnBaseUrl: props.icon?.cdnBaseUrl ?? '',
    source: (props.icon?.source ?? 'auto') as 'auto' | 'local' | 'cdn',
    sourceMap,
    groups,
    defaultGroup: groups[0] ?? 'title',
  },
}

provide(HxConfigKey, config)
</script>
