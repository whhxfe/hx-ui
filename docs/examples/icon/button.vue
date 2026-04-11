<template>
  <div>
    <hx-button type="primary">
      <hx-icon type="iconify" name="ep:check" size="16px" />
      确认
    </hx-button>
    <hx-button type="danger">
      <hx-icon type="iconify" name="ep:close" size="16px" />
      取消
    </hx-button>
    <hx-button type="default">
      <hx-icon type="iconify" name="ep:setting" size="16px" />
      设置
    </hx-button>
    <hx-button type="primary">
      <hx-icon type="iconify" name="ep:search" size="16px" />
      搜索
    </hx-button>
  </div>
</template>

<script setup lang="ts">
import { HxButton as Button } from "@hx/ui"
</script>
