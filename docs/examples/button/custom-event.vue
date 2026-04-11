<template>
  <hx-button type="primary" @custom-click="(e) => console.log('custom-click', e)">
    业务按钮
  </hx-button>
</template>

<script setup lang="ts">
import { HxButton as Button } from "@hx/ui"
</script>
