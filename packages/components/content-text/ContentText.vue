<template>
  <div class="hx-content-text" :class="{ 'is-copyable': copyable }">
    <!-- 普通文本视图 -->
    <div
      v-if="line > 0"
      class="hx-content-text__text hx-content-text__text--clamp"
      :class="`line-clamp-${Math.min(line, 10)}`"
      :style="clampStyle"
      :title="content"
    >{{ displayContent }}</div>
    <div
      v-else
      class="hx-content-text__text"
      :style="clampStyle"
    >{{ displayContent }}</div>

    <div
      v-if="line > 0 && canExpand"
      class="hx-content-text__expand-btn"
      @click="toggleExpand"
    >
      <span>{{ expanded ? '收起' : '展开' }}</span>
      <svg
        width="10" height="10" viewBox="0 0 10 10" fill="none"
        :style="{ transform: expanded ? 'rotate(180deg)' : '', transition: 'transform 0.2s' }"
      >
        <path d="M2 3.5l3 3 3-3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>

    <!-- 复制按钮 -->
    <transition name="fade">
      <button
        v-if="copyable"
        class="hx-content-text__copy-btn"
        :class="{ copied: copyFeedback }"
        :title="copyFeedback ? '已复制' : '复制'"
        @click="copy"
      >
        <svg v-if="!copyFeedback" width="13" height="13" viewBox="0 0 13 13" fill="none">
          <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.3"/>
          <path d="M9 4V2.5A1.5 1.5 0 0 0 7.5 1H2.5A1.5 1.5 0 0 0 1 2.5v5A1.5 1.5 0 0 0 2.5 9H4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        </svg>
        <svg v-else width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M2 7l3.5 3.5L11 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ContentTextProps } from './types'

defineOptions({ name: 'HxContentText' })

const props = withDefaults(defineProps<ContentTextProps>(), {
  line: 0,
  copyable: true,
  placeholder: '',
  maxHeight: 0,
})

// ── 展开状态 ────────────────────────────────────────────────────────
const expanded = ref(false)

const canExpand = computed(() => props.line > 0)

function toggleExpand() {
  expanded.value = !expanded.value
}

// ── 普通文本显示 ───────────────────────────────────────────────────
const displayContent = computed(() => {
  if (!props.content && props.placeholder) return props.placeholder
  return props.content ?? ''
})

const clampStyle = computed(() => {
  if (typeof props.maxHeight === 'number' && props.maxHeight > 0) {
    return { maxHeight: `${props.maxHeight}px`, overflow: 'hidden' }
  }
  if (typeof props.maxHeight === 'string' && props.maxHeight) {
    return { maxHeight: props.maxHeight, overflow: 'hidden' }
  }
  return {}
})

// ── 复制 ───────────────────────────────────────────────────────────
const copyFeedback = ref(false)

async function copy() {
  const text = props.content || ''
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }
  copyFeedback.value = true
  setTimeout(() => {
    copyFeedback.value = false
  }, 1800)
}
</script>

<style lang="scss">
// ── 变量 ─────────────────────────────────────────────────────────────
$primary: var(--hx-primary-color);
$success: var(--hx-success-color);
$text-main: var(--hx-text-color-primary);
$text-regular: var(--hx-text-color-regular);
$text-secondary: var(--hx-text-color-secondary);
$text-placeholder: var(--hx-text-color-placeholder);
$border-color: var(--hx-border-color-base);
$bg-hover: var(--hx-bg-color-hover);

.hx-content-text {
  display: block;
  position: relative;
  font-size: 14px;
  color: $text-main;
  line-height: 1.6;

  // ── 普通文本样式 ─────────────────────────────────────────────────
  &__text {
    color: $text-main;
    word-break: break-word;
    font-family: 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', sans-serif;
    font-size: 14px;
    line-height: 1.6;

    &--clamp {
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
    }

    @for $i from 1 through 10 {
      &.line-clamp-#{$i} {
        -webkit-line-clamp: $i;
        line-clamp: $i;
      }
    }
  }

  // ── 展开按钮 ────────────────────────────────────────────────────
  &__expand-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 4px;
    font-size: 12px;
    color: $primary;
    cursor: pointer;
    user-select: none;
    font-family: inherit;

    &:hover {
      opacity: 0.75;
    }
  }

  // ── 复制按钮 ────────────────────────────────────────────────────
  &__copy-btn {
    position: absolute;
    top: 0;
    right: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 5px;
    background: transparent;
    border: 1px solid $border-color;
    color: $text-secondary;
    cursor: pointer;
    padding: 0;
    opacity: 0;
    transition: opacity 0.15s ease, background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
    font-family: inherit;

    .hx-content-text:hover & {
      opacity: 1;
    }

    &:hover {
      color: $primary;
      border-color: $primary;
      background: $bg-hover;
    }

    &.copied {
      color: $success;
      border-color: $success;
    }

    &:focus-visible {
      outline: 2px solid rgba($primary, 0.3);
      outline-offset: 2px;
    }
  }
}

// ── 过渡 ─────────────────────────────────────────────────────────────
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>