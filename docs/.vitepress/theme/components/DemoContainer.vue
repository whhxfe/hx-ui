<template>
  <div class="hx-doc-demo">
    <p v-if="description" class="hx-doc-demo__desc">{{ description }}</p>
    <DemoBlock :source="demoSource">
      <component v-if="demoComponent" :is="demoComponent" />
      <div v-else class="hx-doc-demo__missing">
        <div class="hx-doc-demo__missing-title">Demo not found</div>
        <div class="hx-doc-demo__missing-path">{{ path }}</div>
        <p class="hx-doc-demo__missing-tip">请检查 `:::demo` 中路径是否存在于 `docs/examples` 目录。</p>
        <ul v-if="availableExamples.length" class="hx-doc-demo__missing-list">
          <li v-for="item in availableExamples" :key="item">{{ item }}</li>
        </ul>
      </div>
    </DemoBlock>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'

const props = defineProps<{
  path: string
  description?: string
}>()

const demoModules = import.meta.glob('../../../examples/**/*.vue', {
  eager: true,
}) as Record<string, { default: Component }>

const sourceModules = import.meta.glob('../../../examples/**/*.vue', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

const normalizePath = (value: string) => value.trim().replace(/^\.?\//, '').replace(/^examples\//, '')

const normalizeKey = (filePath: string) => {
  const normalized = filePath.replace(/\\/g, '/')
  const afterExamples = normalized.split('/examples/')[1]
  return afterExamples?.replace(/\.vue(\?raw)?$/, '')
}

const demoMap: Record<string, Component> = {}
Object.entries(demoModules).forEach(([filePath, mod]) => {
  const key = normalizeKey(filePath)
  if (!key) return
  demoMap[key] = mod.default
})

const sourceMap: Record<string, string> = {}
Object.entries(sourceModules).forEach(([filePath, raw]) => {
  const key = normalizeKey(filePath)
  if (!key) return
  sourceMap[key] = raw
})

const resolvedPath = computed(() => normalizePath(props.path))
const demoComponent = computed(() => demoMap[resolvedPath.value])
const demoSource = computed(() => sourceMap[resolvedPath.value] || `<template>\n  <!-- Demo not found: ${resolvedPath.value} -->\n</template>`)
const availableExamples = computed(() => Object.keys(demoMap).sort())
</script>
