<template>
  <div class="hx-content-text" :class="{ 'is-copyable': copyable, 'is-json': isJson }">
    <!-- JSON 视图（由 vue-json-pretty 驱动） -->
    <div v-if="isJson" class="hx-content-text__json">
      <div class="hx-content-text__json-header">
        <span class="hx-content-text__json-tag">JSON</span>
        <div class="hx-content-text__json-actions">
          <button
            class="hx-content-text__action-btn"
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
            class="hx-content-text__action-btn"
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
      <div class="hx-content-text__json-body" :class="{ 'is-expanded': expanded }">
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

    <!-- 普通文本视图 -->
    <template v-else>
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
    </template>

    <!-- 复制按钮（普通文本） -->
    <transition name="fade">
      <button
        v-if="copyable && !isJson"
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
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
import type { ContentTextProps } from './types'

defineOptions({ name: 'HxContentText' })

const props = withDefaults(defineProps<ContentTextProps>(), {
  line: 0,
  copyable: true,
  placeholder: '',
  maxHeight: 0,
  jsonDefaultExpanded: false,
  jsonIndent: 2,
  jsonDefaultCollapsedDepth: 1,
  jsonCollapsedNodeLength: 20,
})

// ── JSON 检测 ───────────────────────────────────────────────────────
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

const isJson = computed(() => {
  if (props.data !== undefined) return true
  return tryParseJson(props.content ?? '') !== null
})

const jsonData = computed(() => {
  if (props.data !== undefined) {
    return props.data as any
  }
  return tryParseJson(props.content ?? '') ?? {}
})

const jsonDataKey = computed(() => JSON.stringify(jsonData.value))

const formattedJson = computed(() => {
  try {
    return JSON.stringify(jsonData.value, null, props.jsonIndent)
  } catch {
    return props.content ?? ''
  }
})

// ── 展开状态 ────────────────────────────────────────────────────────
const expanded = ref(props.jsonDefaultExpanded)

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
  const text = formattedJson.value || props.content || ''
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
$primary: #2d5be6;
$text-main: #1a1d24;
$text-secondary: #56657a;
$text-placeholder: #a8afc2;
$border-color: #e8eaf0;
$bg-hover: #f5f7fb;
$success: #0ea57a;

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

  // ── 展开按钮（普通文本截断） ────────────────────────────────────
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

  // ── 复制按钮（普通文本） ────────────────────────────────────────
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

  // ── JSON 视图 ───────────────────────────────────────────────────
  &__json {
    border: 1px solid $border-color;
    border-radius: 8px;
    overflow: hidden;
    background: #fafbff;

    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 12px;
      background: linear-gradient(135deg, #f0f3ff 0%, #f5f7fb 100%);
      border-bottom: 1px solid $border-color;
    }

    &-tag {
      font-size: 11px;
      font-weight: 600;
      font-family: 'SF Mono', 'Consolas', 'Monaco', monospace;
      color: $primary;
      background: rgba($primary, 0.08);
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid rgba($primary, 0.15);
      letter-spacing: 0.06em;
    }

    &-actions {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    &-body {
      overflow: hidden;
      max-height: 240px;
      transition: max-height 0.28s ease;

      &.is-expanded {
        max-height: 2000px;
      }
    }
  }

  // ── 操作按钮（JSON 内） ─────────────────────────────────────────
  &__action-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 24px;
    padding: 0 8px;
    border-radius: 5px;
    background: #fff;
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
.hx-content-text .vjs-tree {
  font-family: 'SF Mono', 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.65;
  padding: 12px 16px;
  color: $text-main;
  background: transparent;
  user-select: text;

  &__node-header {
    padding: 1px 0;
    border-radius: 3px;
    &:hover {
      background: rgba($primary, 0.04);
    }
  }

  &__node-content {
    color: $text-main;
  }

  &__key {
    color: #c678dd;
  }

  &__string {
    color: #98c379;
  }

  &__number {
    color: #d19a66;
  }

  &__boolean,
  &__constant {
    color: #56b6c2;
  }

  &__null {
    color: #6c71c4;
    font-style: italic;
  }

  &__comma {
    color: #abb2bf;
  }

  &__brackets {
    color: #abb2bf;
  }

  &__value {
    &-node {
      &::before {
        color: #abb2bf;
      }
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
