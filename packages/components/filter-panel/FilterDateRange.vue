<template>
  <div class="hx-filter-date-range">
    <label v-if="label" class="hx-filter-date-range__label">{{ label }}:</label>
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
      <button
        type="button"
        class="hx-filter-date-range__btn"
        :class="{ active: activeMode === 'custom' }"
        @click="onCustomClick"
      >
        自定义
      </button>
      <el-date-picker
        v-show="activeMode === 'custom'"
        v-model="pickerRange"
        class="hx-filter-date-range__picker"
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
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { Calendar } from '@element-plus/icons-vue'

type ValueType = string | number | (string | number)[] | null | undefined

const props = withDefaults(defineProps<{
	modelValue?: ValueType
	label?: string
	shortcuts?: { label: string; days: number }[]
	format?: string
}>(), {
	modelValue: undefined,
	label: '',
	shortcuts: undefined,
	format: 'YYYY-MM-DD',
})

const emit = defineEmits<{
	'update:modelValue': [value: ValueType]
	'change': [value: ValueType]
}>()

const DEFAULT_SHORTCUTS = [
	{ label: '最近7天', days: 7 },
	{ label: '最近30天', days: 30 },
	{ label: '最近90天', days: 90 },
]

const resolvedShortcuts = computed(() => props.shortcuts?.length ? props.shortcuts : DEFAULT_SHORTCUTS)

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

function normalizeIncoming(val: ValueType | undefined): [string, string] | null {
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
  const out: ValueType = range ? [range[0], range[1]] : ''
  emit('update:modelValue', out)
  emit('change', out)
}

function syncFromModel(val: ValueType | undefined) {
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
  const tuple = parsed
  pickerRange.value = tuple
  activeMode.value = 'custom'
  activeDays.value = null
  emitRange(tuple)
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
    margin-right: 0.5em;
    flex: 0 0 auto;
    min-width: 70px;
    line-height: 32px;
    color: $text-regular;
    font-size: 14px;
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
    height: 32px;
    line-height: 30px;
    text-align: center;
    font-size: 14px;
    color: $text-primary;
    border: 1px solid $border-base;
    border-radius: 3px;
    padding: 0 16px;
    cursor: pointer;
    background: $bg;
    transition: all 0.2s ease;
    user-select: none;

    &:hover {
      border-color: $primary;
      color: $primary;
    }

    &.active {
      background-color: $bg-hover;
      color: $primary;
      border-color: $primary;
      font-weight: 500;
    }
  }

  &__picker {
    flex: 1;
    min-width: 220px;
    max-width: 360px;
  }

  :deep(.el-date-editor.el-input__wrapper) {
    width: 100%;
  }
}
</style>
