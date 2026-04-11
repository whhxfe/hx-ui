<template>
  <!-- 分组：el-menu-item-group 下直接平铺子项，不再递归 menu-item -->
  <el-menu-item-group v-if="menuItem.type === 'group'" :title="menuItem.title">
    <el-menu-item
      v-for="child in menuItem.children"
      :key="child.path"
      :index="child.path!"
    >
      <span
        :class="['hx-menu__icon-slot', { 'hx-menu__icon-slot--empty': !child.icon }]"
        :aria-hidden="child.icon ? undefined : 'true'"
      >
        <HxIcon v-if="child.icon" class="hx-menu__icon" v-bind="child.icon" />
      </span>
      <span class="hx-menu__title-text">{{ child.title }}</span>
    </el-menu-item>
  </el-menu-item-group>

  <!-- 子菜单：el-sub-menu，title 插槽渲染图标 + 标题，children 递归 menu-item -->
  <el-sub-menu
    v-else-if="isSubLike"
    :index="menuIndex"
  >
    <template #title>
      <span
        :class="['hx-menu__icon-slot', { 'hx-menu__icon-slot--empty': !menuItem.icon }]"
        :aria-hidden="menuItem.icon ? undefined : 'true'"
      >
        <HxIcon v-if="menuItem.icon" class="hx-menu__icon" v-bind="menuItem.icon" />
      </span>
      <span class="hx-menu__title-text">{{ menuItem.title }}</span>
    </template>
    <MenuItem
      v-for="child in menuItem.children"
      :key="(child.path ?? child.title) + child.type"
      :menu-item="child"
    />
  </el-sub-menu>

  <!-- 普通菜单项 -->
  <el-menu-item
    v-else-if="menuItem.path"
    :index="menuItem.path"
  >
    <span
      :class="['hx-menu__icon-slot', { 'hx-menu__icon-slot--empty': !menuItem.icon }]"
      :aria-hidden="menuItem.icon ? undefined : 'true'"
    >
      <HxIcon v-if="menuItem.icon" class="hx-menu__icon" v-bind="menuItem.icon" />
    </span>
    <span class="hx-menu__title-text">{{ menuItem.title }}</span>
  </el-menu-item>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import HxIcon from '../icon/base-icon/BaseIcon.vue'

defineOptions({ name: 'HxMenuItem' })

const props = defineProps<{
	menuItem: {
		type?: 'item' | 'sub' | 'group'
		title: string
		path?: string
		icon?: {
			type?: 'svg' | 'image' | 'iconify'
			name: string
			size?: string | number
			color?: string
			rotate?: number
			flip?: 'horizontal' | 'vertical' | 'both'
		}
		children?: {
			type?: 'item' | 'sub' | 'group'
			title: string
			path?: string
			icon?: { name: string; size?: string | number; color?: string; rotate?: number; flip?: 'horizontal' | 'vertical' | 'both' }
			children?: any[]
		}[]
	}
}>()

const isSubLike = computed(
  () => props.menuItem.type === 'sub' || (!!props.menuItem.children?.length && props.menuItem.type !== 'item')
)

const menuIndex = computed(
  () => props.menuItem.path ?? `hx-sub-${props.menuItem.title}`
)
</script>
