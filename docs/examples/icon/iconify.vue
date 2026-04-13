<template>
  <div>
    <h4>Offline 模式（预加载图标集）</h4>
    <p>需要在 HxConfigProvider 中配置 collections，预加载的图标集会全部打包进应用</p>
    <div class="icon-row">
      <hx-icon type="iconify" name="twemoji:alien" size="32px" />
      <hx-icon type="iconify" name="ep:user" size="32px" />
      <hx-icon type="iconify" name="ep:home-filled" size="32px" />
      <hx-icon type="iconify" name="ep:search" size="32px" />
      <hx-icon type="iconify" name="ep:setting" size="32px" />
      <hx-icon type="iconify" name="ep:star-filled" size="32px" color="#ffd700" />
      <hx-icon type="iconify" name="mdi:heart" size="32px" color="#e91e63" />
    </div>

    <h4>CDN 模式（按需加载，在Offline模式下，未注册的图标不会显示）</h4>
    <p>需要配置 cdnUrl，图标按需从 CDN 获取，适合图标数量多、不想增加包体积的场景</p>
    <div class="icon-row">
      <hx-icon type="iconify" name="bi:github" size="32px" />
      <hx-icon type="iconify" name="lucide:rocket" size="32px" />
      <hx-icon type="iconify" name="carbon:car" size="32px" />
      <hx-icon type="iconify" name="tabler:brand-tabler" size="32px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { HxIcon as Icon } from "@hx/ui"
</script>

<style scoped>
h4 {
  margin: 16px 0 8px;
  font-size: 14px;
  font-weight: 600;
}
p {
  margin: 0 0 12px;
  font-size: 13px;
  color: #666;
}
.icon-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
</style>
