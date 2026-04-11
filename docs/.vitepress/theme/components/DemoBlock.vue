<template>
  <div class="hx-demo-block">
    <div class="hx-demo-block__preview">
      <slot />
    </div>

    <transition name="hx-demo-expand">
      <div v-show="showCode" class="hx-demo-block__code">
        <div class="hx-demo-block__code-body">
          <pre class="language-vue"><code class="language-vue">{{ source }}</code></pre>
        </div>
      </div>
    </transition>

    <div class="hx-demo-block__actions" :class="{ 'is-sticky': showCode }">
      <button
        type="button"
        class="hx-demo-block__expand-btn"
        :aria-label="showCode ? '收起源代码' : '展开源代码'"
        @click="toggleCode"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" :class="{ 'is-expanded': showCode }">
          <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
        </svg>
        <span>{{ codeActionText }}</span>
      </button>

      <div class="hx-demo-block__tools">
        <button
          type="button"
          class="hx-demo-block__icon-btn"
          :aria-label="copied ? '代码已复制' : '复制代码'"
          @click="copyCode"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M16 1H6a2 2 0 0 0-2 2v12h2V3h10V1zm3 4H10a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16h-9V7h9v14z"
            />
          </svg>
        </button>
        <button
          type="button"
          class="hx-demo-block__icon-btn"
          aria-label="展开源码"
          @click="toggleCode"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M14 3v2h3.59L8 14.59 9.41 16 19 6.41V10h2V3z" />
            <path d="M5 5h6V3H5a2 2 0 0 0-2 2v6h2z" />
            <path d="M19 19h-6v2h6a2 2 0 0 0 2-2v-6h-2z" />
            <path d="M5 13H3v6a2 2 0 0 0 2 2h6v-2H5z" />
          </svg>
        </button>
      </div>
    </div>

    <span v-if="copied" class="hx-demo-block__copied-tip">Copied</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  source: string
}>()

const showCode = ref(false)
const copied = ref(false)
const codeActionText = computed(() => (showCode.value ? '隐藏源代码' : '显示源代码'))

const toggleCode = () => {
  showCode.value = !showCode.value
}

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.source)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 1500)
  } catch {
    copied.value = false
  }
}
</script>
