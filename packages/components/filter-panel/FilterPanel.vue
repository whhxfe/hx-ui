<template>
  <div class="hx-filter-panel">
    <div class="hx-filter-panel__header">
      <div class="hx-filter-panel__title">{{ title }}</div>
      <div class="hx-filter-panel__selections">
        <transition-group name="chip">
          <span v-for="(filter, prop) in activeFilters" :key="prop" class="hx-chip">
            <span class="hx-chip-label">{{ getFilterLabel(prop) }}</span>
            <span class="hx-chip-sep" aria-hidden="true">:</span>
            <span class="hx-chip-value" :title="String(getSelectionLabel(prop, filter))">
              {{ getSelectionLabel(prop, filter) }}
            </span>
            <button
              class="hx-chip-close"
              :aria-label="`清除 ${getFilterLabel(prop)}`"
              @click="clearFilter(prop)"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          </span>
        </transition-group>
      </div>
      <div class="hx-filter-panel__actions">
        <button
          v-if="hasActiveFilters"
          class="hx-filter-panel__btn hx-filter-panel__btn--reset"
          @click="handleReset"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M10 6a4 4 0 1 1-1.17-2.83" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
            <path d="M8.5 3.5 11 1v2.5H8.5z" fill="currentColor"/>
          </svg>
          重置
        </button>
        <button class="hx-filter-panel__btn hx-filter-panel__btn--collapse" @click="toggle">
          {{ collapseState ? '展开' : '收起' }}
          <svg
            class="hx-filter-panel__caret"
            :class="{ 'hx-filter-panel__caret--up': !collapseState }"
            width="10" height="10" viewBox="0 0 10 10" fill="none"
          >
            <path d="M2 3.5l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
    <div class="hx-filter-panel__body">
      <transition name="collapse">
        <div class="hx-filter-panel__items" :class="{ 'is-collapsed': collapseState }">
          <template v-for="filter in filters" :key="filter.prop">
            <FilterItem
              v-if="filter.type === 'filter-item'"
              :ref="(el: any) => { if (el) filterItemRefs[filter.prop] = el as FilterItemInstance }"
              v-model="innerModelValue[filter.prop]"
              :label="filter.label"
              :options="filter.options"
              :remote="filter.remote"
              :multiple="filter.multiple"
              :model-value-type="filter.modelValueType"
              :label-key="filter.labelKey || 'label'"
              :value-key="filter.valueKey || 'value'"
              :depends-on="filter.remote?.dependsOn"
              :depends-on-value="filter.remote?.dependsOn ? innerModelValue[filter.remote.dependsOn] : undefined"
              @change="handleFilterChange(filter.prop, $event)"
              @options-updated="() => {}"
            />
            <FilterDateRange
              v-else-if="filter.type === 'date-range'"
              v-model="innerModelValue[filter.prop]"
              :label="filter.label"
              :shortcuts="filter.dateShortcuts"
              :format="filter.dateFormat || 'YYYY-MM-DD'"
              @change="handleFilterChange(filter.prop, $event)"
            />
          </template>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { isEqual } from '../../utils'
import FilterItem from './FilterItem.vue'
import FilterDateRange from './FilterDateRange.vue'
import type {
  FilterItemInstance,
  FilterConfig,
  FilterState,
  FilterValueType,
  FilterOption,
  FilterPanelProps,
  FilterPanelEmits,
} from './types'

const filterItemRefs = ref<Record<string, FilterItemInstance>>({})

const emit = defineEmits<FilterPanelEmits>()
const props = withDefaults(defineProps<FilterPanelProps>(), {
  title: '筛选条件',
  collapse: false,
})

/**
 * 根据 filter 配置生成初始空值状态
 * - multiple 为 true 时使用空数组（modelValueType="string" 时用空字符串）
 * - 其他情况使用空字符串
 */
function createEmptyState(filters: FilterConfig[]): FilterState {
  const state: Record<string, FilterValueType> = {}
  filters.forEach((filter) => {
    if (filter.multiple && filter.modelValueType !== 'string') {
      state[filter.prop] = []
    } else {
      state[filter.prop] = ''
    }
  })
  return state
}

const initialSelections = createEmptyState(props.filters)

const innerModelValue = reactive<FilterState>({ ...initialSelections })

if (props.modelValue) {
  Object.assign(innerModelValue, props.modelValue)
}

// 同步外部 modelValue 到内部状态
watch(
  () => props.modelValue,
  (val) => {
    if (val && !isEqual(val, innerModelValue)) {
      Object.assign(innerModelValue, val)
    }
  },
  { immediate: true, deep: true },
)

// 内部状态变化时同步到外部
watch(
  () => ({ ...innerModelValue }),
  (newVal) => {
    if (!isEqual(newVal, props.modelValue)) {
      emit('update:modelValue', { ...newVal })
    }
  },
  { deep: true },
)

// 筛选出有值的字段用于展示 chip
const activeFilters = computed(() => {
  return Object.fromEntries(
    Object.entries(innerModelValue).filter(([, value]) => {
      return (
        value !== null && value !== undefined && value !== '' && (!Array.isArray(value) || value.length > 0)
      )
    }),
  )
})

const hasActiveFilters = computed(() => Object.keys(activeFilters.value).length > 0)

/**
 * 折叠状态：由 props.collapse 控制，
 * 组件内部 toggle 切换时同步更新 props.collapse
 */
const collapseState = ref(props.collapse)

watch(
  () => props.collapse,
  (val) => {
    collapseState.value = val
  },
)

const toggle = () => {
  collapseState.value = !collapseState.value
}

const handleFilterChange = (prop: string, value: FilterValueType) => {
  innerModelValue[prop] = value
  emit('filter-change', prop, value)
}

const clearFilter = (prop: string | number) => {
  const filter = props.filters.find((f) => f.prop === prop)
  if (filter?.multiple && filter.modelValueType !== 'string') {
    innerModelValue[prop] = []
  } else {
    innerModelValue[prop] = ''
  }
}

const handleReset = () => {
  Object.keys(innerModelValue).forEach((prop) => {
    const filter = props.filters.find((f) => f.prop === prop)
    if (filter?.multiple && filter.modelValueType !== 'string') {
      innerModelValue[prop] = []
    } else {
      innerModelValue[prop] = ''
    }
  })
  emit('reset')
}

const getFilterLabel = (prop: string | number) => {
  const filter = props.filters.find((f) => f.prop === prop)
  return filter?.label || String(prop)
}

const getSelectionLabel = (prop: string | number, value: FilterValueType) => {
  const filter = props.filters.find((f) => f.prop === prop)
  if (!filter || !value) return ''
  const labelKey = filter.labelKey || 'label'
  const valueKey = filter.valueKey || 'value'

  const options =
    filter.type === 'filter-item' && filterItemRefs.value[prop]
      ? filterItemRefs.value[prop]?.effectiveOptions
      : filter.options

  if (!options || options.length === 0) {
    if (Array.isArray(value)) return value.join(', ')
    return String(value)
  }

  if (Array.isArray(value)) {
    return value
      .map((v) => {
        const option = (options as FilterOption[]).find((opt) => opt[valueKey] === v)
        return option ? option[labelKey] : v
      })
      .join(', ')
  }

  const option = (options as FilterOption[]).find((opt) => opt[valueKey] === value)
  return option ? option[labelKey] : String(value)
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
$border-base: var(--hx-border-color-base);
$border-light: var(--hx-border-color-light);

.hx-filter-panel {
  background: $bg;
  border: 1px solid $border-base;
  border-radius: 10px;
  overflow: hidden;

  &__header {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 0 12px;
    padding: 16px 20px 12px;
    border-bottom: 1px solid $border-light;
  }

  &__title {
    font-size: 15px;
    font-weight: 600;
    color: $text-primary;
    flex: 0 0 auto;
    line-height: 1;
    padding-top: 4px;
    letter-spacing: -0.01em;
  }

  &__selections {
    flex: 1 1 0;
    min-width: 0;
    max-height: 96px;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 6px;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 4px;
    flex: 0 0 auto;
    margin-left: auto;
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    height: 28px;
    padding: 0 12px;
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.18s ease;
    font-family: inherit;

    &--reset {
      color: $text-secondary;
      background: $bg-page;
      border-color: $border-base;

      svg {
        flex-shrink: 0;
      }

      &:hover {
        color: $text-primary;
        background: $bg-hover;
        border-color: $text-secondary;
      }
    }

    &--collapse {
      color: $text-secondary;
      background: transparent;
      border-color: transparent;
      padding: 0 8px;

      &:hover {
        color: $text-regular;
        background: $bg-hover;
      }
    }
  }

  &__caret {
    transition: transform 0.2s ease;
    flex-shrink: 0;

    &--up {
      transform: rotate(180deg);
    }
  }

  &__body {
    padding: 12px 20px 16px;
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 10px;

    &.is-collapsed {
      display: none;
    }
  }
}

// ── Chip 样式 ──────────────────────────────────────────────────────
.hx-chip {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  box-sizing: border-box;
  padding: 3px 4px 3px 10px;
  background-color: var(--hx-chip-bg, #eff3fd);
  border: 1px solid var(--hx-chip-border, #d4def8);
  border-radius: 6px;
  font-size: 13px;
  color: $text-primary;
  gap: 4px;
  flex-wrap: wrap;
  word-break: break-word;
  height: 26px;

  &-label {
    flex: 0 0 auto;
    color: $text-secondary;
    white-space: nowrap;
    font-weight: 400;
    line-height: 1.4;
  }

  &-sep {
    flex: 0 0 auto;
    color: var(--hx-chip-sep, #c2c8d4);
    line-height: 1.4;
  }

  &-value {
    flex: 0 1 auto;
    min-width: 0;
    max-width: 240px;
    font-weight: 500;
    color: $primary;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &-close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    width: 18px;
    height: 18px;
    border-radius: 4px;
    background: transparent;
    border: none;
    cursor: pointer;
    color: $text-secondary;
    padding: 0;
    transition: all 0.15s ease;

    &:hover {
      color: var(--hx-danger-color);
      background: var(--hx-chip-close-hover-bg, #ffeaea);
    }

    &:focus-visible {
      outline: 2px solid rgba($primary, 0.3);
      outline-offset: 1px;
    }
  }
}

// ── Chip 动画 ──────────────────────────────────────────────────────
.chip-enter-active,
.chip-leave-active {
  transition: all 0.2s ease;
}
.chip-enter-from {
  opacity: 0;
  transform: scale(0.85);
}
.chip-leave-to {
  opacity: 0;
  transform: scale(0.85);
}

// ── 折叠动画 ──────────────────────────────────────────────────────
.collapse-enter-active,
.collapse-leave-active {
  transition: opacity 0.25s ease, max-height 0.25s ease;
  overflow: hidden;
}
.collapse-enter-from,
.collapse-leave-to {
  opacity: 0;
  max-height: 0;
  padding-bottom: 0;
}
.collapse-enter-to,
.collapse-leave-from {
  opacity: 1;
  max-height: 400px;
}
</style>