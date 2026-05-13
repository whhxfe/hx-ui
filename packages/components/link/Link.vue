<!--
  HxLink - 基于 Element Plus el-link 的超链接组件
  支持自动跳转和点击事件
-->
<template>
  <!-- 包一层 <span> 使 scoped 样式 :deep(a.el-link) 能正确匹配 -->
  <span class="hx-link">
    <el-link v-bind="linkAttrs" @click="handleClick">
      <slot />
    </el-link>
  </span>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ElLink } from 'element-plus'
import type { HxLinkProps } from './types'

defineOptions({ name: 'HxLink' })

const props = withDefaults(defineProps<HxLinkProps>(), {
  autoJump: true,
})

const emit = defineEmits<{
  (e: 'click', evt: MouseEvent): void
}>()

/** 从 props 中分离出 autoJump，其余透传给 el-link */
const { autoJump: _autoJump, ...restProps } = props

const linkAttrs = computed(() => ({
  ...restProps,
}))

function handleClick(evt: MouseEvent) {
  emit('click', evt)

  if (!props.disabled && props.autoJump && props.href) {
    window.open(props.href, props.target ?? '_self')
  }
}
</script>

<style scoped>
.hx-link {
  display: inline-flex;
  vertical-align: middle;
}

/*
 * VitePress 等场景 .vp-doc a { text-decoration: underline } 特异性与 el-link 相当且后加载，
 * 会盖住 .el-link { text-decoration: none }。须由带 scoped 根包裹的祖先提高特异性。
 */
.hx-link :deep(a.el-link) {
  text-decoration: none;
  text-decoration-line: none;
}
</style>
