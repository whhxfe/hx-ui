<template>
  <div class="hx-filter-item">
    <div class="hx-filter-item__row">
      <label v-if="label" class="hx-filter-item__label">{{ label }}</label>
      <div class="hx-filter-item__options" role="listbox" :aria-multiselectable="multiple">
        <!-- 加载态 -->
        <div v-if="loading" class="hx-filter-item__loading">
          <span class="hx-filter-item__loading-dot"></span>
          <span class="hx-filter-item__loading-dot"></span>
          <span class="hx-filter-item__loading-dot"></span>
        </div>
        <!-- 无数据时显示空态 -->
        <span v-else-if="effectiveOptions.length === 0" class="hx-filter-item__empty">
          <template v-if="dependsOn">请先选择上级</template>
          <template v-else>暂无数据</template>
        </span>
        <!-- 选项列表 -->
        <template v-else>
          <div
            v-for="(option, index) in effectiveOptions"
            :key="`${getValue(option)}-${index}`"
            class="hx-filter-item__option"
            :class="{
              active: isActive(option),
              disabled: option.disabled,
            }"
            role="option"
            :aria-selected="isActive(option)"
            :aria-disabled="option.disabled"
            :tabindex="option.disabled ? -1 : 0"
            @click="handleClick(option)"
            @keydown.enter.prevent="handleClick(option)"
            @keydown.space.prevent="handleClick(option)"
          >
            <span class="hx-filter-item__option-text">{{ getLabel(option) }}</span>
            <svg
              v-if="multiple && isActive(option)"
              class="hx-filter-item__option-check"
              width="12" height="12" viewBox="0 0 12 12" fill="none"
            >
              <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, type Ref, computed } from 'vue'
import type { FilterOption, FilterItemInstance, FilterValueType, ValueType, FilterRemoteConfig } from './types'
import { useFilterRemoteOptions } from '../../hooks/useFilterRemoteOptions'

const props = withDefaults(defineProps<{
	modelValue?: FilterValueType
	label?: string
	options?: FilterOption[]
	labelKey?: string
	valueKey?: string
	multiple?: boolean
	allowDeselectAll?: boolean
	remote?: FilterRemoteConfig
	dependsOn?: string
	dependsOnValue?: FilterValueType
}>(), {
	modelValue: undefined,
	label: '',
	labelKey: 'label',
	valueKey: 'value',
	multiple: true,
	allowDeselectAll: true,
})

const emit = defineEmits<{
	'update:modelValue': [value: FilterValueType]
	'change': [value: FilterValueType]
	'options-updated': []
}>()

// --- 远程 options（传 getter 让 watch 追踪 props.dependsOnValue 变化） ---
const { remoteOptions, loading } = useFilterRemoteOptions(props.remote, {
  dependsOnValue: () => props.dependsOnValue ?? undefined,
})

const effectiveOptions = computed<FilterOption[]>(() => {
  if (props.remote) return remoteOptions.value as FilterOption[]
  return props.options ?? []
})

defineExpose<FilterItemInstance>({
  get effectiveOptions(): FilterOption[] {
    return effectiveOptions.value
  },
})

watch(
  effectiveOptions,
  () => {
    emit('options-updated')
  },
  { deep: true, flush: 'post' },
)

const getLabel = (option: FilterOption): string => String(option[props.labelKey] ?? '')

const getValue = (option: FilterOption): string | number => {
  const value = option[props.valueKey]
  return typeof value === 'number' || typeof value === 'string' ? value : ''
}

// --- normalize / isSameValue ---
const normalizeModelValue = (value: ValueType | undefined): ValueType => {
  if (props.multiple) {
    return Array.isArray(value) ? [...value] : []
  }
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '')
}

const isSameValue = (a: ValueType, b: ValueType): boolean => {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    return a.every((item, index) => item === b[index])
  }
  return !Array.isArray(a) && !Array.isArray(b) && a === b
}

// --- currentValue 必须在所有 watch 之前声明 ---
const currentValue: Ref<ValueType> = ref(normalizeModelValue(props.modelValue))
const isSyncingFromProps = ref(false)

// --- 联动：父值变化 → 清空自身选中 ---
watch(
  () => props.dependsOnValue,
  () => {
    if (!props.dependsOn) return
    currentValue.value = normalizeModelValue(undefined)
    emit('update:modelValue', currentValue.value)
    emit('change', currentValue.value)
  },
  { immediate: true },
)

const isActive = (option: FilterOption): boolean => {
  const value = getValue(option)
  if (props.multiple) {
    return Array.isArray(currentValue.value) ? currentValue.value.includes(value) : false
  }
  return currentValue.value === value
}

const handleClick = (option: FilterOption) => {
  if (option.disabled) return
  const value = getValue(option)
  if (props.multiple) {
    handleMultipleSelect(value)
  } else {
    handleSingleSelect(value)
  }
}

const handleSingleSelect = (value: string | number) => {
  currentValue.value = currentValue.value !== value ? value : ''
}

const handleMultipleSelect = (value: string | number) => {
  if (!Array.isArray(currentValue.value)) {
    currentValue.value = []
  }
  const currentValues = currentValue.value as (string | number)[]
  const index = currentValues.indexOf(value)
  if (index > -1) {
    const newValues = [...currentValues.slice(0, index), ...currentValues.slice(index + 1)]
    currentValue.value = props.allowDeselectAll || newValues.length > 0 ? newValues : currentValues
  } else {
    currentValue.value = [...currentValues, value]
  }
}

watch(
  () => props.modelValue,
  (newVal) => {
    const normalizedValue = normalizeModelValue(newVal)
    if (isSameValue(currentValue.value, normalizedValue)) return
    isSyncingFromProps.value = true
    currentValue.value = normalizedValue
    isSyncingFromProps.value = false
  },
)

watch(
  currentValue,
  (newVal) => {
    if (isSyncingFromProps.value) return
    if (isSameValue(newVal, normalizeModelValue(props.modelValue))) return
    emit('update:modelValue', newVal)
    emit('change', newVal)
  },
)
</script>

<style lang="scss" scoped>
.hx-filter-item {
  display: block;
  padding: 0;

  &__row {
    display: flex;
    align-items: flex-start;
    gap: 0 16px;
  }

  &__label {
    flex: 0 0 72px;
    padding-top: 7px;
    font-size: 13px;
    font-weight: 500;
    color: #3b4458;
    letter-spacing: 0.01em;
    line-height: 1;
    white-space: nowrap;
  }

  &__options {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 8px;
    flex: 1;
    min-width: 0;
  }

  &__loading {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 7px 8px;
  }

  &__loading-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #c2c8d4;
    animation: hx-filter-item__loading-bounce 1.2s infinite ease-in-out both;

    &:nth-child(1) {
      animation-delay: -0.32s;
    }
    &:nth-child(2) {
      animation-delay: -0.16s;
    }
    &:nth-child(3) {
      animation-delay: 0s;
    }
  }

  @keyframes hx-filter-item__loading-bounce {
    0%,
    80%,
    100% {
      transform: scale(0.6);
      opacity: 0.4;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }

  &__empty {
    font-size: 13px;
    color: #a8afc2;
    padding: 7px 8px;
    font-style: italic;
  }

  &__option {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    height: 28px;
    padding: 0 12px;
    border-radius: 6px;
    border: 1px solid #e2e7ee;
    background: #fff;
    color: #4a5568;
    font-size: 13px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
    user-select: none;
    font-family: inherit;
    font-weight: 450;
    letter-spacing: 0;

    &-text {
      line-height: 1;
    }

    &-check {
      flex-shrink: 0;
    }

    &:hover:not(.disabled) {
      border-color: #2d5be6;
      color: #2d5be6;
      background: #f5f7fd;
    }

    &.active {
      background-color: #eff3fd;
      color: #2d5be6;
      border: 1px solid #2d5be6;
      font-weight: 500;

      &:hover:not(.disabled) {
        background-color: #e4ebfc;
      }
    }

    &.disabled {
      color: #c2c8d4;
      border-color: #edf0f6;
      cursor: not-allowed;
      background-color: #fafafc;
    }

    &:focus-visible {
      outline: 2px solid rgba(45, 91, 230, 0.3);
      outline-offset: 2px;
    }
  }
}
</style>
