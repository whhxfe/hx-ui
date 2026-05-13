<template>
  <div class="hx-page-layout">
    <div class="hx-page-layout__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'PageLayout',
})
</script>

<style scoped>
.hx-page-layout {
  min-height: 100%;
  background: var(--hx-bg-color-page);
}

.hx-page-layout__content {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 24px;
  background: var(--hx-bg-color);
  min-height: calc(100vh - 64px);
  box-shadow: 0 1px 3px var(--hx-shadow-color-light);
}
</style>
