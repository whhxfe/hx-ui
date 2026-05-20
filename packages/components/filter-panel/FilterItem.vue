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
              v-if="isActive(option)"
              class="hx-filter-item__option-check"
              :class="{ 'is-multiple': multiple }"
              width="12" height="12" viewBox="0 0 12 12" fill="none"
            >
              <template v-if="multiple">
                <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
              </template>
              <template v-else>
                <circle cx="6" cy="6" r="2.5" fill="currentColor"/>
              </template>
            </svg>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, useAttrs } from 'vue'
import type { FilterOption, FilterItemInstance, FilterItemProps, FilterItemEmits } from './types'
import { useFilterRemoteOptions } from '../../hooks/useFilterRemoteOptions'

const props = withDefaults(defineProps<FilterItemProps>(), {
  modelValue: undefined,
  label: '',
  labelKey: 'label',
  valueKey: 'value',
  multiple: false,
  modelValueType: 'array',
  allowDeselectAll: true,
})

const emit = defineEmits<FilterItemEmits>()

defineOptions({ inheritAttrs: false })
const attrs = useAttrs()

const MODEL_VALUE_SEPARATOR = ","

/** 解析 modelValueType：优先从 props 取，未注册时从 attrs 取 */
const modelValueTypeResolved = computed((): "string" | "array" => {
  const p = props.modelValueType
  if (p === "array" || p === "string") return p
  const raw = attrs["model-value-type"] ?? attrs.modelValueType
  if (typeof raw === "string") {
    const s = raw.trim()
    if (s === "array" || s === "string") return s
  }
  return "array"
})

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

// --- currentValue: computed getter/setter（参考 Select.vue 模式） ---
const currentValue = computed({
  get: () => {
    const v = props.modelValue
    const useArray = props.multiple && modelValueTypeResolved.value === "array"
    if (!useArray) {
      if (!props.multiple) {
        return v ?? ""
      }
      // multiple + string: 返回逗号分隔的原始字符串
      if (typeof v === "string") return v
      return ""
    }
    // multiple + array: 返回数组
    return Array.isArray(v) ? [...v] : []
  },
  set: (val) => {
    const useArray = props.multiple && modelValueTypeResolved.value === "array"
    if (!useArray) {
      if (!props.multiple) {
        emit("update:modelValue", val)
        emit("change", val)
        return
      }
      // multiple + string: join array to comma-separated string
      emit("update:modelValue", Array.isArray(val) ? val.join(MODEL_VALUE_SEPARATOR) : "")
      emit("change", Array.isArray(val) ? val.join(MODEL_VALUE_SEPARATOR) : "")
      return
    }
    // multiple + array: emit array
    emit("update:modelValue", val)
    emit("change", val)
  },
})

// --- 联动：父值变化 → 清空自身选中（通过 setter 自动 emit） ---
watch(
  () => props.dependsOnValue,
  () => {
    if (!props.dependsOn) return
    currentValue.value = props.multiple ? [] : ''
  },
  { immediate: true },
)

const isActive = (option: FilterOption): boolean => {
  const value = getValue(option)
  if (props.multiple) {
    if (modelValueTypeResolved.value === "string" && typeof currentValue.value === "string") {
      return currentValue.value.split(MODEL_VALUE_SEPARATOR).map(x => x.trim()).filter(Boolean).includes(String(value))
    }
    return Array.isArray(currentValue.value) ? currentValue.value.includes(value) : false
  }
  return currentValue.value === value
}

const handleSingleSelect = (value: string | number) => {
  currentValue.value = currentValue.value !== value ? value : ''
}

const handleMultipleSelect = (value: string | number) => {
  const currentValues = Array.isArray(currentValue.value) ? [...(currentValue.value as (string | number)[])] : []
  const index = currentValues.indexOf(value)
  let newValues: (string | number)[]
  if (index > -1) {
    const sliced = [...currentValues.slice(0, index), ...currentValues.slice(index + 1)]
    newValues = props.allowDeselectAll || sliced.length > 0 ? sliced : currentValues
  } else {
    newValues = [...currentValues, value]
  }
  currentValue.value = newValues
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
</script>

<style lang="scss" scoped>
$primary: var(--hx-primary-color);
$bg: var(--hx-bg-color);
$bg-page: var(--hx-bg-color-page);
$bg-hover: var(--hx-bg-color-hover);
$bg-active: var(--hx-bg-color-active);
$text-primary: var(--hx-text-color-primary);
$text-regular: var(--hx-text-color-regular);
$text-secondary: var(--hx-text-color-secondary);
$text-placeholder: var(--hx-text-color-placeholder);
$border-base: var(--hx-border-color-base);
$border-light: var(--hx-border-color-light);

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
    color: $text-regular;
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
    background-color: $text-placeholder;
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
    color: $text-placeholder;
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
    border: 1px solid $border-base;
    background: $bg;
    color: $text-regular;
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
      border-color: $primary;
      color: $primary;
      background: $bg-hover;
    }

    &.active {
      background-color: var(--hx-option-active-bg, #eff3fd);
      color: $primary;
      border: 1px solid $primary;
      font-weight: 500;

      &:hover:not(.disabled) {
        background-color: var(--hx-option-active-hover-bg, #e4ebfc);
      }
    }

    &.disabled {
      color: $text-placeholder;
      border-color: var(--hx-option-disabled-border, #edf0f6);
      cursor: not-allowed;
      background-color: var(--hx-option-disabled-bg, #fafafc);
    }

    &:focus-visible {
      outline: 2px solid rgba($primary, 0.3);
      outline-offset: 2px;
    }
  }
}
</style>