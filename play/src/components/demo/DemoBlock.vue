<template>
  <div class="hx-demo-block">
    <div class="hx-demo-block__preview">
      <component v-if="demoComponent" :is="demoComponent" />
      <div v-else class="hx-demo-block__missing">Demo not found</div>
    </div>

    <div class="hx-demo-block__actions">
      <button type="button" class="hx-demo-block__toggle-btn" @click="toggleCode">
        <svg viewBox="0 0 24 24" fill="currentColor" :class="{ 'is-expanded': showCode }">
          <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
        </svg>
        <span>{{ showCode ? '收起' : '源码' }}</span>
      </button>

      <button type="button" class="hx-demo-block__copy-btn" :class="{ 'is-copied': copied }"
        @click="copyCode">
        <svg v-if="!copied" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 1H6a2 2 0 0 0-2 2v12h2V3h10V1zm3 4H10a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16h-9V7h9v14z" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
      </button>
    </div>

    <transition name="slide">
      <div v-show="showCode" class="hx-demo-block__code">
        <div class="hx-demo-block__code-header">
          <span class="hx-demo-block__filename">{{ filename }}</span>
        </div>
        <div class="hx-demo-block__code-body">
          <pre><code>{{ source }}</code></pre>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  path: string
}>()

const showCode = ref(false)
const copied = ref(false)

const filename = computed(() => props.path.split('/').pop() || props.path)

// 动态加载组件
const demoComponent = computed(() => {
  const modules = import.meta.glob('../../views/demos/**/*.vue', { eager: true })
  const key = Object.keys(modules).find(k => k.endsWith(props.path))
  if (key) {
    return (modules[key] as { default: any }).default
  }
  return null
})

// 加载源码
const source = computed(() => {
  const modules = import.meta.glob('../../views/demos/**/*.vue', {
    eager: true,
    query: '?raw',
    import: 'default',
  })
  const key = Object.keys(modules).find(k => k.endsWith(props.path))
  return key ? (modules[key] as string) : `<!-- Not found: ${props.path} -->`
})

const toggleCode = () => {
  showCode.value = !showCode.value
}

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(source.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 1500)
  } catch { /* ignore */ }
}
</script>

<style scoped>
.hx-demo-block {
  border: 1px solid var(--hx-border-color, #e8e8e8);
  border-radius: 8px;
  margin-bottom: 24px;
  background: var(--hx-bg-color, #fff);
  overflow: hidden;
}

.hx-demo-block__preview {
  padding: 24px;
  min-height: 80px;
  border-bottom: 1px dashed var(--hx-border-color, #e8e8e8);
}

.hx-demo-block__missing {
  color: var(--hx-text-color-secondary, #999);
  text-align: center;
  padding: 20px;
  font-size: 14px;
}

.hx-demo-block__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--hx-border-color, #e8e8e8);
  background: var(--hx-bg-color-page, #fafafa);
}

.hx-demo-block__toggle-btn,
.hx-demo-block__copy-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border: none;
  background: transparent;
  color: var(--hx-text-color-regular, #666);
  font-size: 13px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.hx-demo-block__toggle-btn:hover,
.hx-demo-block__copy-btn:hover {
  background: var(--hx-bg-color-hover, rgba(0, 0, 0, 0.06));
  color: var(--hx-text-color-primary, #333);
}

.hx-demo-block__copy-btn.is-copied {
  color: var(--hx-success-color, #52c41a);
}

.hx-demo-block__toggle-btn svg {
  width: 16px;
  height: 16px;
  transition: transform 0.2s;
}

.hx-demo-block__toggle-btn svg.is-expanded {
  transform: rotate(180deg);
}

.hx-demo-block__copy-btn svg {
  width: 16px;
  height: 16px;
}

.hx-demo-block__code {
  background: var(--hx-bg-color-page, #fafafa);
}

.hx-demo-block__code-header {
  padding: 10px 16px;
  border-bottom: 1px solid var(--hx-border-color, #e8e8e8);
}

.hx-demo-block__filename {
  font-size: 12px;
  color: var(--hx-text-color-secondary, #999);
  font-family: 'Monaco', 'Menlo', monospace;
}

.hx-demo-block__code-body {
  max-height: 350px;
  overflow: auto;
  padding: 16px;
}

.hx-demo-block__code-body pre {
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: var(--hx-text-color-primary, #333);
  white-space: pre;
}

.slide-enter-active,
.slide-leave-active {
  transition: max-height 0.25s ease;
  max-height: 400px;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
}
</style>
