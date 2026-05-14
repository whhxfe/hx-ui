<template>
  <div class="hx-json-view" :class="{ 'is-copyable': copyable }">
    <div class="hx-json-view__header">
      <span class="hx-json-view__tag">JSON</span>
      <div class="hx-json-view__actions">
        <button
          class="hx-json-view__action-btn"
          :title="expanded ? '折叠' : '展开'"
          @click="toggleExpand"
        >
          <svg
            width="12" height="12" viewBox="0 0 12 12" fill="none"
            :style="{ transform: expanded ? 'rotate(180deg)' : '', transition: 'transform 0.2s' }"
          >
            <path d="M3 4.5l3 3 3-3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>{{ expanded ? '折叠' : '展开' }}</span>
        </button>
        <button
          v-if="copyable"
          class="hx-json-view__action-btn"
          :class="{ copied: copyFeedback }"
          title="复制"
          @click="copy"
        >
          <svg v-if="!copyFeedback" width="13" height="13" viewBox="0 0 13 13" fill="none">
            <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.3"/>
            <path d="M9 4V2.5A1.5 1.5 0 0 0 7.5 1H2.5A1.5 1.5 0 0 0 1 2.5v5A1.5 1.5 0 0 0 2.5 9H4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
          </svg>
          <svg v-else width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2 7l3.5 3.5L11 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>{{ copyFeedback ? '已复制' : '复制' }}</span>
        </button>
      </div>
    </div>
    <div class="hx-json-view__body" :class="{ 'is-expanded': expanded }">
      <!-- 完全展开态 -->
      <vue-json-pretty
        v-if="expanded"
        :key="'expanded-' + jsonDataKey"
        :data="(jsonData as any)"
        :deep="99"
        :collapsed-node-length="9999"
        :show-line-number="true"
        :show-icon="true"
        :show-length="true"
        :selectable-type="'single'"
        :highlight-selected-node="true"
        theme="light"
      />
      <!-- 完全折叠态 -->
      <vue-json-pretty
        v-else
        :key="'collapsed-' + jsonDataKey"
        :data="(jsonData as any)"
        :deep="0"
        :collapsed-node-length="0"
        :show-line-number="true"
        :show-icon="true"
        :show-length="true"
        :selectable-type="'single'"
        :highlight-selected-node="true"
        theme="light"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
import type { JsonViewProps } from './types'

defineOptions({ name: 'HxJsonView' })

const props = withDefaults(defineProps<JsonViewProps>(), {
  defaultExpanded: false,
  indent: 2,
  defaultCollapsedDepth: 1,
  collapsedNodeLength: 20,
  copyable: true,
})

// ── JSON 解析 ───────────────────────────────────────────────────────
function tryParseJson(text: string): object | null {
  const trimmed = text.trim()
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return null
  try {
    const parsed = JSON.parse(trimmed)
    if (typeof parsed === 'object' && parsed !== null) return parsed
    return null
  } catch {
    return null
  }
}

const jsonData = computed(() => {
  if (props.data !== undefined) {
    return props.data as any
  }
  return tryParseJson(props.content ?? '') ?? {}
})

const jsonDataKey = computed(() => JSON.stringify(jsonData.value))

const formattedJson = computed(() => {
  try {
    return JSON.stringify(jsonData.value, null, props.indent)
  } catch {
    return props.content ?? ''
  }
})

// ── 展开状态 ────────────────────────────────────────────────────────
const expanded = ref(props.defaultExpanded)

function toggleExpand() {
  expanded.value = !expanded.value
}

// ── 复制 ───────────────────────────────────────────────────────────
const copyFeedback = ref(false)

async function copy() {
  const text = formattedJson.value
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
$bg: var(--hx-bg-color);
$bg-hover: var(--hx-bg-color-hover);

.hx-json-view {
  display: block;
  border: 1px solid $border-color;
  border-radius: 8px;
  overflow: hidden;
  background: var(--hx-json-view-bg, #fafbff);
  font-size: 14px;

  // ── Header ────────────────────────────────────────────────────────
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 12px;
    background: var(--hx-json-view-header-bg, linear-gradient(135deg, #f0f3ff 0%, #f5f7fb 100%));
    border-bottom: 1px solid $border-color;
  }

  &__tag {
    font-size: 11px;
    font-weight: 600;
    font-family: 'SF Mono', 'Consolas', 'Monaco', monospace;
    color: $primary;
    background: rgba(24, 144, 255, 0.08);
    padding: 2px 8px;
    border-radius: 4px;
    border: 1px solid rgba(24, 144, 255, 0.15);
    letter-spacing: 0.06em;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  // ── Body ──────────────────────────────────────────────────────────
  &__body {
    overflow: hidden;
    max-height: 240px;
    transition: max-height 0.28s ease;

    &.is-expanded {
      max-height: 2000px;
    }
  }

  // ── 操作按钮 ──────────────────────────────────────────────────────
  &__action-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 24px;
    padding: 0 8px;
    border-radius: 5px;
    background: $bg;
    border: 1px solid $border-color;
    color: $text-secondary;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.15s ease;
    font-family: inherit;

    &:hover {
      color: $primary;
      border-color: $primary;
      background: $bg-hover;
    }

    &.copied {
      color: $success;
      border-color: $success;
      background: rgba($success, 0.06);
    }

    &:focus-visible {
      outline: 2px solid rgba($primary, 0.3);
      outline-offset: 2px;
    }
  }
}

// ── vue-json-pretty 主题覆盖 ────────────────────────────────────────
.hx-json-view {
  // vue-json-pretty 默认使用硬编码 #e6f7ff 作为 hover/highlight 背景色
  // 此处用 CSS 变量覆盖，使其在明亮/暗黑模式下正确适配
  .vjs-tree-node {
    &:hover,
    &.is-highlight {
      background-color: $bg-hover;
      border-radius: 4px;
    }
  }

  // actions 跟随节点背景色
  .vjs-tree-node .vjs-tree-node-actions {
    background-color: $bg-hover;
  }

  .vjs-tree {
    font-family: 'SF Mono', 'Consolas', 'Monaco', monospace;
    font-size: 13px;
    line-height: 1.65;
    padding: 12px 16px;
    color: $text-main;
    background: transparent;
    user-select: text;

    &__node-content {
      color: $text-main;
    }

    &__key {
      color: var(--hx-json-key, #c678dd);
    }

    &__string {
      color: var(--hx-json-string, #98c379);
    }

    &__number {
      color: var(--hx-json-number, #d19a66);
    }

    &__boolean,
    &__constant {
      color: var(--hx-json-boolean, #56b6c2);
    }

    &__null {
      color: var(--hx-json-null, #6c71c4);
      font-style: italic;
    }

    &__comma {
      color: var(--hx-json-comma, #abb2bf);
    }

    &__brackets {
      color: var(--hx-json-brackets, #abb2bf);
    }

    &__value-node {
      &::before {
        color: $text-secondary;
      }
    }

    &__item-arrow {
      color: $text-secondary;
      transition: transform 0.12s ease;
    }

    &__node-count {
      color: $text-placeholder;
      font-size: 12px;
      margin-left: 4px;
    }

    &__line-number {
      color: $text-placeholder;
      min-width: 28px;
      padding-right: 8px;
      user-select: none;
      flex-shrink: 0;
    }

    &__node-body {
      flex: 1;
    }

    &--collapsed &__node-header {
      .vjs-tree__brackets {
        cursor: pointer;
      }
    }
  }
}

// ── 黑暗模式覆盖 ─────────────────────────────────────────────────
html.dark .hx-json-view {
  &__tag {
    background: rgba(24, 144, 255, 0.15);
    border-color: rgba(24, 144, 255, 0.25);
  }

  .vjs-tree-node {
    &:hover,
    &.is-highlight {
      background-color: $bg-hover;
    }
  }
}
</style>