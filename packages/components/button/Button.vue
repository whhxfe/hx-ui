<!--
  HxButton - 基于 Element Plus el-button 的按钮组件
-->
<template>
  <el-button v-bind="buttonBindProps">
    <slot />
  </el-button>
</template>

<script lang="ts" setup>
import { computed, useAttrs } from 'vue'
import type { ButtonProps } from './types'

defineOptions({ name: 'HxButton' })

const props = defineProps<ButtonProps>()

const attrs = useAttrs()

const buttonBindProps = computed(() => ({
  ...props,
  ...attrs,
}))
</script>