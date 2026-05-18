<template>
  <el-menu
    :class="menuClass"
    :style="menuStyle"
    v-bind="elMenuProps"
    @select="onSelect"
    @open="onOpen"
    @close="onClose"
  >
    <MenuItem
      v-for="item in menu"
      :key="(item.path ?? item.title) + item.type"
      :menu-item="item"
    />
  </el-menu>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { ElMenu } from 'element-plus'
import MenuItem from './MenuItem.vue'
import type { MenuItem as MenuItemType, MenuProps } from './types'

defineOptions({ name: 'HxMenu', inheritAttrs: false })

const props = withDefaults(defineProps<MenuProps>(), {
  menu: () => [],
  mode: 'vertical',
  active: '',
  router: false,
  ellipsis: true,
  collapseTransition: true,
  popperOffset: 6,
  popperEffect: 'dark',
  showTimeout: 300,
  hideTimeout: 300,
  persistent: true,
  closeOnClickOutside: false,
})

const emit = defineEmits<{
  'update:openeds': [value: string[]]
  select: [index: string, indexPath: string[], item: unknown, routerResult?: unknown]
  open: [index: string, indexPath: string[]]
  close: [index: string, indexPath: string[]]
}>()

const internalOpeneds = ref<string[]>(props.openeds ?? props.defaultOpeneds ?? [])

watch(
  () => props.openeds,
  (val) => {
    if (val !== undefined) {
      internalOpeneds.value = val
    }
  }
)

const elMenuProps = computed(() => {
  const { width, iconWidth, openeds, ...rest } = props
  return {
    ...rest,
    'model-value': internalOpeneds.value,
  }
})

const popperStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.iconWidth !== undefined) {
    style['--hx-menu-icon-slot-width'] = typeof props.iconWidth === 'number' ? `${props.iconWidth}px` : String(props.iconWidth)
  }
  if (props.popperStyle) Object.assign(style, props.popperStyle)
  return Object.keys(style).length ? style : undefined
})

const menuClass = computed(() => {
  const base = props.mode === 'horizontal' ? 'hx-menu hx-menu--horizontal' : 'hx-menu hx-menu--vertical'
  return props.popperClass ? [base, props.popperClass] : base
})

const menuStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.mode === 'vertical' && props.width !== undefined) {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  if (props.iconWidth !== undefined) {
    style['--hx-menu-icon-slot-width'] = typeof props.iconWidth === 'number' ? `${props.iconWidth}px` : String(props.iconWidth)
  }
  return Object.keys(style).length ? style : undefined
})

function onSelect(index: string, indexPath: string[], item: unknown, routerResult?: unknown) {
  emit('select', index, indexPath, item, routerResult)
}

function onOpen(index: string, indexPath: string[]) {
  internalOpeneds.value = [...internalOpeneds.value, index]
  emit('update:openeds', internalOpeneds.value)
  emit('open', index, indexPath)
}

function onClose(index: string, indexPath: string[]) {
  internalOpeneds.value = internalOpeneds.value.filter((i) => i !== index)
  emit('update:openeds', internalOpeneds.value)
  emit('close', index, indexPath)
}
</script>

<style lang="scss">
/* 避免 VitePress .vp-doc ul { list-style: disc } 等文档区样式盖过 Element Plus */
.hx-menu.el-menu {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  list-style: none !important;
  margin: 0 !important;
  padding-left: 0 !important;
  --hx-menu-icon-slot-width: var(--el-menu-icon-width, 24px);
}

.hx-menu.el-menu--horizontal {
  flex-wrap: wrap;
}

.hx-menu.el-menu .hx-menu__title-text,
.hx-menu-popper .hx-menu__title-text {
  flex: 1;
  min-width: 0;
}

.hx-menu.el-menu .hx-menu__icon-slot,
.hx-menu-popper .hx-menu__icon-slot {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: var(--hx-menu-icon-slot-width);
  min-width: var(--hx-menu-icon-slot-width);
  margin-right: 5px;
  vertical-align: middle;
  box-sizing: border-box;
}

.hx-menu.el-menu .hx-menu__icon-slot--empty,
.hx-menu-popper .hx-menu__icon-slot--empty {
  pointer-events: none;
}

.hx-menu.el-menu .hx-menu__icon,
.hx-menu-popper .hx-menu__icon {
  flex-shrink: 0;
  vertical-align: middle;
}

.hx-menu.el-menu .el-menu-item-group {
  list-style: none !important;
}

.hx-menu.el-menu .el-menu-item-group > ul {
  list-style: none !important;
  margin: 0 !important;
  padding-left: 0 !important;
}

.hx-menu-popper.el-popper {
  --hx-menu-icon-slot-width: var(--el-menu-icon-width, 24px);

  .el-menu-item,
  .el-sub-menu__title {
    font-size: 14px;
  }
}
</style>
