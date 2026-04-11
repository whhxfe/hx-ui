<script setup lang="ts">
import { HxConfigProvider } from '@hx/ui'

const iconModules = import.meta.glob<{ default: string }>('@/assets/icons/**/*', { eager: true })
</script>

<template>
  <HxConfigProvider :icon="{ imageIconModules: [iconModules], cdnBaseUrl: 'http://localhost:4300/icons' }">
    <router-view />
  </HxConfigProvider>
</template>
