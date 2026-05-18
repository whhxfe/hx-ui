<template>
  <!-- 分割线：渲染在分组/子菜单/菜单项之前 -->
  <el-divider v-if="menuItem.divider" class="hx-menu__divider" />

  <!-- 分组：el-menu-item-group 下直接平铺子项，不再递归 menu-item -->
  <el-menu-item-group v-if="menuItem.type === 'group'" :title="menuItem.title">
    <el-menu-item
      v-for="child in menuItem.children"
      :key="child.path ?? child.title"
      :index="child.path ?? child.title"
      :disabled="child.disabled"
      @click="handleItemClick(child)"
    >
      <span
        :class="['hx-menu__icon-slot', { 'hx-menu__icon-slot--empty': !child.icon }]"
        :aria-hidden="child.icon ? undefined : 'true'"
      >
        <HxIcon v-if="child.icon" class="hx-menu__icon" v-bind="child.icon" />
      </span>
      <span class="hx-menu__title-text">{{ child.title }}</span>
      <el-badge v-if="child.badge" :value="child.badge" :max="99" class="hx-menu__badge" />
    </el-menu-item>
  </el-menu-item-group>

  <!-- 子菜单：el-sub-menu，title 插槽渲染图标 + 标题，children 递归 menu-item -->
  <el-sub-menu
    v-else-if="isSubLike"
    :index="menuIndex"
    :disabled="menuItem.disabled"
  >
    <template #title>
      <span
        :class="['hx-menu__icon-slot', { 'hx-menu__icon-slot--empty': !menuItem.icon }]"
        :aria-hidden="menuItem.icon ? undefined : 'true'"
      >
        <HxIcon v-if="menuItem.icon" class="hx-menu__icon" v-bind="menuItem.icon" />
      </span>
      <span class="hx-menu__title-text">{{ menuItem.title }}</span>
      <el-badge v-if="menuItem.badge" :value="menuItem.badge" :max="99" class="hx-menu__badge" />
    </template>
    <MenuItem
      v-for="child in menuItem.children"
      :key="(child.path ?? child.title) + child.type"
      :menu-item="child"
    />
  </el-sub-menu>

  <!-- 普通菜单项 -->
  <el-menu-item
    v-else-if="menuItem.path || menuItem.url"
    :index="menuItem.path ?? menuItem.url ?? menuItem.title"
    :disabled="menuItem.disabled"
    @click="handleItemClick(menuItem)"
  >
    <span
      :class="['hx-menu__icon-slot', { 'hx-menu__icon-slot--empty': !menuItem.icon }]"
      :aria-hidden="menuItem.icon ? undefined : 'true'"
    >
      <HxIcon v-if="menuItem.icon" class="hx-menu__icon" v-bind="menuItem.icon" />
    </span>
    <span class="hx-menu__title-text">{{ menuItem.title }}</span>
    <el-badge v-if="menuItem.badge" :value="menuItem.badge" :max="99" class="hx-menu__badge" />
  </el-menu-item>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ElBadge, ElDivider } from 'element-plus'
import HxIcon from '../icon/base-icon/BaseIcon.vue'
import type { MenuItem as MenuItemType } from './types'

defineOptions({ name: 'HxMenuItem', components: { ElBadge, ElDivider } })

const props = defineProps<{
  menuItem: MenuItemType
}>()

const isSubLike = computed(
  () => props.menuItem.type === 'sub' || (!!props.menuItem.children?.length && props.menuItem.type !== 'item')
)

const menuIndex = computed(
  () => props.menuItem.path ?? `hx-sub-${props.menuItem.title}`
)

function handleItemClick(item: MenuItemType) {
  if (item.url) {
    window.open(item.url, '_blank', 'noopener,noreferrer')
  }
}
</script>

<style lang="scss" scoped>
.hx-menu__badge {
  

  :deep(.el-badge__content) {
    position: static !important;
    transform: none !important;
    margin-bottom: 2px;
    vertical-align: super ;
  }
}

.hx-menu__divider {
  margin: 4px 0;
}
</style>
