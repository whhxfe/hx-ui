<template>
  <div class="demo-section">
    <p class="demo-title">基础用法</p>
    <div class="link-demo-row">
      <HxLink href="https://github.com" target="_blank">默认链接</HxLink>
      <HxLink type="primary">主要链接</HxLink>
      <HxLink type="success">成功链接</HxLink>
      <HxLink type="warning">警告链接</HxLink>
      <HxLink type="danger">危险链接</HxLink>
      <HxLink type="info">信息链接</HxLink>
    </div>

    <p class="demo-title link-demo-title-next">带下划线与禁用</p>
    <div class="link-demo-row">
      <HxLink underline="always">始终下划线</HxLink>
      <HxLink underline="never">无下划线</HxLink>
      <HxLink disabled>禁用链接</HxLink>
    </div>

    <p class="demo-title link-demo-title-next">图标</p>
    <div class="link-demo-row">
      <HxLink underline="hover" @click="editClick('edit')">
        <hx-icon type="iconify" name="ep:edit" />
        编辑
      </HxLink>
      <HxLink underline="never">
        <hx-icon type="iconify" name="ep:view" />
        查看
      </HxLink>
      <HxLink underline="never">
        <hx-icon type="iconify" name="ep:delete" />
        删除
      </HxLink>
    </div>

    <p class="demo-title link-demo-title-next">自动跳转</p>
    <div class="link-demo-row">
      <HxLink href="https://github.com" :auto-jump="true">点击后自动跳转</HxLink>
      <HxLink href="https://github.com" :auto-jump="false">点击后不跳转</HxLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HxLink } from '@hx/ui'

const editClick = (text: string) => {
  console.log(text)
}
</script>

<style scoped>
.demo-section {
  padding: 4px 0;
}
.demo-title {
  margin: 0 0 10px;
  font-size: 13px;
  color: #8a92a6;
  font-weight: 500;
}
.link-demo-title-next {
  margin-top: 28px;
}
.link-demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}
</style>
