<template>
  <div class="hx-label-text" :class="[alignClass, sizeClass]">
    <label
      class="hx-label-text__label"
      :class="[labelAlignClass, labelWrap ? 'label-wrap' : 'label-nowrap', { 'no-colon': !colon }]"
      :style="labelWidthStyle"
    >
      {{ label }}
    </label>
    <div class="hx-label-text__text" :title="text" :class="textLineClass">
      <slot>{{ text }}</slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { LabelTextProps } from './types'

defineOptions({
  name: 'HxLabelText',
})

const props = withDefaults(defineProps<LabelTextProps>(), {
  size: 'default',
  align: 'center',
  labelWidth: 'auto',
  labelAlign: 'left',
  labelWrap: false,
  textWrap: true,
  textLine: 0,
  colon: true,
})

const SIZE_MAP = { small: 'size-small', default: 'size-default', large: 'size-large' } as const
const ALIGN_MAP = { start: 'align-start', center: 'align-center', end: 'align-end', stretch: 'align-stretch', baseline: 'align-baseline' } as const
const LABEL_ALIGN_MAP = { left: 'text-left', center: 'text-center', right: 'text-right' } as const

const alignClass = computed(() => ALIGN_MAP[props.align])
const sizeClass = computed(() => SIZE_MAP[props.size])

const labelAlignClass = computed(() => LABEL_ALIGN_MAP[props.labelAlign])

const labelWidthStyle = computed(() => {
  if (props.labelWidth === 'auto') return {}
  return { width: typeof props.labelWidth === 'number' ? `${props.labelWidth}px` : props.labelWidth }
})

const textLineClass = computed(() => {
  if (props.textLine > 0) return `line-clamp-${Math.min(props.textLine, 10)}`
  return props.textWrap ? 'text-wrap' : 'text-nowrap'
})
</script>

<style lang="scss" scoped>
$label-color: #94a3b8;
$text-color: #111827;

.hx-label-text {
  display: inline-flex;
  justify-content: flex-start;

  @each $align in (start center end stretch baseline) {
    &.align-#{$align} {
      @if $align == start { align-items: flex-start; }
      @else if $align == end { align-items: flex-end; }
      @else { align-items: $align; }
    }
  }

  &.size-small { font-size: 12px; padding: 4px 0; }
  &.size-default { font-size: 14px; padding: 6px 0; }
  &.size-large { font-size: 18px; padding: 8px 0; }
}

.hx-label-text__label {
  flex-shrink: 0;
  font-weight: 500;
  line-height: 1.5;
  margin-right: 8px;
  color: $label-color;

  &::after { content: ':'; }

  &.label-nowrap { white-space: nowrap; }
  &.label-wrap { white-space: normal; }
  &.no-colon::after { content: none; }
}

.hx-label-text__text {
  flex: 1;
  color: $text-color;

  &.text-wrap { white-space: normal; }
  &.text-nowrap { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  @for $i from 1 through 10 {
    &.line-clamp-#{$i} {
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: $i;
    }
  }
}
</style>
