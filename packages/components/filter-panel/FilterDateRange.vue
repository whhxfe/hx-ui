<template>
  <div class="hx-filter-date-range">
    <label v-if="label" class="hx-filter-date-range__label">{{ label }}</label>
    <div class="hx-filter-date-range__row">
      <button
        v-for="s in resolvedShortcuts"
        :key="s.days"
        type="button"
        class="hx-filter-date-range__btn"
        :class="{ active: activeMode === 'preset' && activeDays === s.days }"
        @click="onPresetClick(s.days)"
      >
        {{ s.label }}
      </button>
      <div class="hx-filter-date-range__custom-wrapper">
        <button
          type="button"
          class="hx-filter-date-range__btn custom"
          :class="{ active: activeMode === 'custom' }"
          @click.stop="onCustomClick"
        >自定义</button>
        <div
          v-show="popoverVisible"
          class="hx-filter-date-range__dropdown"
          :class="dropdownClasses"
        >
          <el-date-picker
            v-model="pickerRange"
            type="daterange"
            unlink-panels
            :value-format="format"
            :format="format"
            range-separator=" - "
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :prefix-icon="Calendar"
            :clearable="true"
            @change="onPickerChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { Calendar } from '@element-plus/icons-vue'
import type { FilterValueType, FilterDateRangeProps } from './types'

const props = withDefaults(defineProps<FilterDateRangeProps>(), {
  modelValue: undefined,
  label: '',
  shortcuts: undefined,
  format: 'YYYY-MM-DD',
  dropdownPlacement: 'right',
})

const emit = defineEmits<{
  'update:modelValue': [value: FilterValueType]
  'change': [value: FilterValueType]
}>()

const DEFAULT_SHORTCUTS = [
  { label: '最近7天', days: 7 },
  { label: '最近30天', days: 30 },
  { label: '最近90天', days: 90 },
]

const popoverVisible = computed(() => activeMode.value === 'custom')

const resolvedShortcuts = computed(() => props.shortcuts?.length ? props.shortcuts : DEFAULT_SHORTCUTS)

const dropdownClasses = computed(() => ({
  'hx-filter-date-range__dropdown--right': props.dropdownPlacement === 'right',
  'hx-filter-date-range__dropdown--bottom': props.dropdownPlacement === 'bottom',
}))

type InnerMode = 'none' | 'preset' | 'custom'

const activeMode = ref<InnerMode>('none')
const activeDays = ref<number | null>(null)
const pickerRange = ref<[string, string] | null>(null)
const syncingFromProps = ref(false)
const applyingPreset = ref(false)

function rangeForDays(days: number): [string, string] {
  const end = dayjs().format(props.format)
  const start = dayjs().subtract(days, 'day').format(props.format)
  return [start, end]
}

function rangesEqual(a: [string, string] | null | undefined, b: [string, string] | null | undefined): boolean {
  if (!a || !b) return false
  return a[0] === b[0] && a[1] === b[1]
}

function normalizeIncoming(val: FilterValueType | undefined): [string, string] | null {
  if (val === '' || val === null || val === undefined) return null
  if (!Array.isArray(val) || val.length !== 2) return null
  const a = String(val[0])
  const b = String(val[1])
  if (!a || !b) return null
  return [a, b]
}

function inferPresetDays(range: [string, string]): number | null {
  for (const s of resolvedShortcuts.value) {
    const preset = rangeForDays(s.days)
    if (rangesEqual(range, preset)) return s.days
  }
  return null
}

function emitRange(range: [string, string] | null) {
  const out: FilterValueType = range ? [range[0], range[1]] : ''
  emit('update:modelValue', out)
  emit('change', out)
}

function syncFromModel(val: FilterValueType | undefined) {
  const range = normalizeIncoming(val)
  if (!range) {
    activeMode.value = 'none'
    activeDays.value = null
    pickerRange.value = null
    return
  }
  const days = inferPresetDays(range)
  if (days !== null) {
    activeMode.value = 'preset'
    activeDays.value = days
    pickerRange.value = [...range]
  } else {
    activeMode.value = 'custom'
    activeDays.value = null
    pickerRange.value = [...range]
  }
}

watch(
  () => props.modelValue,
  (val) => {
    syncingFromProps.value = true
    syncFromModel(val)
    syncingFromProps.value = false
  },
  { immediate: true },
)

function onPresetClick(days: number) {
  if (activeMode.value === 'preset' && activeDays.value === days) {
    activeMode.value = 'none'
    activeDays.value = null
    pickerRange.value = null
    emitRange(null)
    return
  }
  activeMode.value = 'preset'
  activeDays.value = days
  const range = rangeForDays(days)
  applyingPreset.value = true
  pickerRange.value = [...range]
  emitRange(range)
  nextTick(() => {
    applyingPreset.value = false
  })
}

function onCustomClick() {
  activeMode.value = 'custom'
  activeDays.value = null
  const existing = normalizeIncoming(props.modelValue)
  pickerRange.value = existing ? [...existing] : null
}

function onPickerChange(val: unknown) {
  if (syncingFromProps.value || applyingPreset.value) return
  const parsed =
    Array.isArray(val) && val.length === 2 && val[0] && val[1]
      ? ([String(val[0]), String(val[1])] as [string, string])
      : null
  if (!parsed) {
    activeMode.value = 'none'
    activeDays.value = null
    pickerRange.value = null
    emitRange(null)
    return
  }
  pickerRange.value = parsed
  activeMode.value = 'custom'
  activeDays.value = null
  emitRange(parsed)
}
</script>

<style lang="scss" scoped>
$primary: var(--hx-primary-color);
$bg: var(--hx-bg-color);
$bg-page: var(--hx-bg-color-page);
$bg-hover: var(--hx-bg-color-hover);
$text-primary: var(--hx-text-color-primary);
$text-regular: var(--hx-text-color-regular);
$text-secondary: var(--hx-text-color-secondary);
$border-base: var(--hx-border-color-base);

.hx-filter-date-range {
  display: flex;
  align-items: flex-start;
  padding: 4px 0;
  flex-wrap: wrap;
  gap: 0 8px;

  &__label {
    flex: 0 0 72px;
    padding-top: 7px;
    font-size: 13px;
    font-weight: 500;
    color: $text-regular;
    letter-spacing: 0.01em;
    line-height: 1;
    white-space: nowrap;
  }

  &__row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    flex: 1;
    min-width: 0;
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    
    height: 28px;
    line-height: 1;
    padding: 0 12px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 450;
    font-family: inherit;
    color: $text-regular;
    border: 1px solid $border-base;
    background: $bg;
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
    transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease;

    &:hover {
      border-color: $primary;
      color: $primary;
    }

    &.active {
      background-color: var(--hx-option-active-bg, #eff3fd);
      color: $primary;
      border-color: $primary;
      font-weight: 500;
    }
  }

  &__custom-wrapper {
    position: relative;
  }

  &__dropdown {
    position: absolute;
    z-index: 2000;
    background: var(--hx-bg-color, #fff);
    border-radius: 8px;
    box-shadow: 0 6px 20px var(--hx-shadow-color, rgba(0, 0, 0, 0.12));
    padding: 12px;

    &--right {
      left: 100%;
      top: 0;
    }

    &--bottom {
      left: 0;
      top: calc(100% + 4px);
    }

    :deep(.el-date-editor) {
      width: 260px;
    }
  }
}
</style>