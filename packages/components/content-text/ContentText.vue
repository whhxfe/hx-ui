<template>
  <div class="hx-content-text" :class="{ 'is-copyable': copyable }">
    <div class="hx-content-text__container">
      <div
        ref="textRef"
        class="hx-content-text__text"
        :class="{ 'hx-content-text__text--clamp': shouldClamp && !expanded }"
        :style="textStyle"
        :title="line > 0 && !expanded && isTruncated ? content : ''"
      >{{ displayContent }}</div>
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
        <HxIcon v-if="!copyFeedback" type="iconify" name="mdi:content-copy" />
        <HxIcon v-else type="iconify" name="mdi:check" />
      </button>
    </transition>

    <!-- 展开/折叠按钮 -->
    <div
      v-if="line > 0 && canExpand"
      class="hx-content-text__expand-btn"
      @click="toggleExpand"
    >
      <span>{{ expanded ? '收起' : '展开' }}</span>
      <HxIcon
        type="iconify"
        name="mdi:chevron-down"
        class="hx-content-text__expand-icon"
        :class="{ rotated: expanded }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick, onMounted } from 'vue'
import { HxIcon } from '../icon'
import type { ContentTextProps } from './index'

defineOptions({ name: 'HxContentText' })

const isSSR = import.meta.env.SSR

const props = withDefaults(defineProps<ContentTextProps>(), {
  line: 0,
  copyable: true,
  placeholder: '',
  maxHeight: 0,
})

const textRef = ref<HTMLElement>()

const expanded = ref(false)
const isTruncated = ref(false)

function toggleExpand() {
  expanded.value = !expanded.value
}

function checkTruncated() {
  if (!textRef.value || props.line <= 0) {
    isTruncated.value = false
    return
  }
  const el = textRef.value

  // 临时移除截断样式，测量完整高度
  const originalLineClamp = el.style.webkitLineClamp
  const originalOverflow = el.style.overflow
  const originalMaxHeight = el.style.maxHeight
  const originalDisplay = el.style.display

  el.style.webkitLineClamp = 'unset'
  el.style.overflow = 'visible'
  el.style.maxHeight = 'none'
  el.style.display = 'block'    // 确保不受 -webkit-box 影响

  const fullHeight = el.scrollHeight

  // 恢复
  el.style.webkitLineClamp = originalLineClamp
  el.style.overflow = originalOverflow
  el.style.maxHeight = originalMaxHeight
  el.style.display = originalDisplay

  // 计算限制行数下的最大可见高度
  const style = getComputedStyle(el)
  let lineHeight = 0
  if (style.lineHeight === 'normal') {
    lineHeight = parseFloat(style.fontSize) * 1.2
  } else {
    lineHeight = parseFloat(style.lineHeight)
  }

  const maxVisibleHeight = lineHeight * props.line
  isTruncated.value = fullHeight > maxVisibleHeight + 1
}

const safeCheckTruncated = () => {
  if (isSSR) return
  nextTick(() => {
    requestAnimationFrame(() => {
      checkTruncated()
    })
  })
}

onMounted(safeCheckTruncated)

const canExpand = computed(() => props.line > 0 && isTruncated.value)

const displayContent = computed(() => {
  if (!props.content && props.placeholder) return props.placeholder
  return props.content ?? ''
})

const shouldClamp = computed(() => props.line > 0)

const textStyle = computed(() => {
  const style: Record<string, string | number> = {}

  // 行数截断 — 通过 -webkit-line-clamp 控制
  if (props.line > 0 && !expanded.value) {
    style['-webkit-line-clamp'] = props.line
  }

  // maxHeight 截断 — 超出时显示滚动条
  if (typeof props.maxHeight === 'number' && props.maxHeight > 0) {
    style.maxHeight = expanded.value ? 'none' : `${props.maxHeight}px`
    style.overflow = expanded.value ? 'visible' : 'auto'
  } else if (typeof props.maxHeight === 'string' && props.maxHeight) {
    style.maxHeight = expanded.value ? 'none' : props.maxHeight
    style.overflow = expanded.value ? 'visible' : 'auto'
  }

  return style
})

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

<style scoped>
/* 根容器 */
.hx-content-text {
  display: block;
  position: relative;
  font-size: 14px;
  color: var(--hx-text-color-primary, #333);
  line-height: 1.6;
}

/* 文本容器 */
.hx-content-text__container {
  position: relative;
}

/* 文本内容 */
.hx-content-text__text {
  color: var(--hx-text-color-primary, #333);
  word-break: break-word;
  font-family: 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', sans-serif;
  font-size: 14px;
  line-height: 1.6;
}

/* 截断模式 */
.hx-content-text__text--clamp {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

/* 展开按钮 */
.hx-content-text__expand-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  font-size: 12px;
  color: var(--hx-primary-color, #1890ff);
  cursor: pointer;
  user-select: none;
  font-family: inherit;
}
.hx-content-text__expand-btn:hover {
  opacity: 0.75;
}

/* 展开图标 */
.hx-content-text__expand-icon {
  font-size: 12px;
  transition: transform 0.2s;
}
.hx-content-text__expand-icon.rotated {
  transform: rotate(180deg);
}

/* 复制按钮 */
.hx-content-text__copy-btn {
  position: absolute;
  top: 0;
  right: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid var(--hx-border-color-base, #dcdfe6);
  color: var(--hx-text-color-secondary, #999);
  cursor: pointer;
  padding: 0;
  opacity: 0;
  transition: opacity 0.15s ease, background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
  font-family: inherit;
  z-index: 1;
}

/* hover 显示复制按钮 */
.hx-content-text:hover .hx-content-text__copy-btn {
  opacity: 1;
}

.hx-content-text__copy-btn:hover {
  color: var(--hx-primary-color, #1890ff);
  border-color: var(--hx-primary-color, #1890ff);
  background: #fff;
}

.hx-content-text__copy-btn.copied {
  color: var(--hx-success-color, #52c41a);
  border-color: var(--hx-success-color, #52c41a);
}

.hx-content-text__copy-btn:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--hx-primary-color, #1890ff) 30%, transparent);
  outline-offset: 2px;
}

/* 过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>