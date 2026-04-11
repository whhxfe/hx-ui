<!--
  HxText - 基于 Element Plus el-text 的文本组件
  支持类型、尺寸、截断、多行省略等功能
-->
<template>
  <!-- 外层 span 保证 scoped :deep() 样式可命中 el-text 内部元素 -->
  <span class="hx-text">
    <el-text v-bind="textProps" @click="handleClick">
      <slot />
    </el-text>
  </span>
</template>

<script lang="ts" setup>
import { computed, useAttrs } from 'vue'
import { ElText } from 'element-plus'
import type { HxTextProps } from './types'

defineOptions({ name: 'HxText' })

const props = withDefaults(defineProps<HxTextProps>(), {
  tag: 'span',
  truncated: false,
})

const emit = defineEmits<{
  (e: 'click', evt: MouseEvent): void
}>()

const attrs = useAttrs()

const textProps = computed(() => ({
  ...props,
  ...attrs,
}))

function handleClick(evt: MouseEvent) {
  emit('click', evt)
}
</script>

<style scoped>
.hx-text {
  display: inline-flex;
  vertical-align: middle;
}

/*
 * el-text 默认对子级 .el-icon 做了 vertical-align，hx-icon 走 Iconify 渲染为 .hx-iconify-icon，需用 flex 对齐图标与文案。
 * 截断 / line-clamp 依赖 EP 的 display，此处不覆盖。
 */
.hx-text :deep(.el-text:not(.is-truncated):not(.is-line-clamp)) {
  display: inline-flex;
  align-items: center;
  column-gap: 4px;
  flex-wrap: nowrap;
}

.hx-text :deep(.hx-iconify-icon) {
  display: inline-flex;
  align-items: center;
  line-height: 0;
}
</style>