<template>
  <div class="demo-section">
    <p class="demo-title">基础用法</p>
    <div class="text-demo-row">
      <HxText>默认文本</HxText>
      <HxText type="primary">主要文本</HxText>
      <HxText type="success">成功文本</HxText>
      <HxText type="warning">警告文本</HxText>
      <HxText type="danger">危险文本</HxText>
      <HxText type="info">信息文本</HxText>
    </div>

    <p class="demo-title text-demo-title-next">尺寸</p>
    <div class="text-demo-row">
      <HxText size="large">大号文本</HxText>
      <HxText>默认文本</HxText>
      <HxText size="small">小号文本</HxText>
    </div>

    <p class="demo-title text-demo-title-next">截断与省略</p>
    <div class="text-demo-column">
      <div class="text-demo-fixed-width">
        <HxText truncated>这是一段很长的文本，超出容器宽度时会自动截断并显示省略号。</HxText>
      </div>
      <div class="text-demo-fixed-width">
        <HxText :line-clamp="2">
          这是一段多行文本，通过 line-clamp 属性限制最大显示行数。超出指定行数的部分会以省略号收尾。
          这是一段多行文本，通过 line-clamp 属性限制最大显示行数。超出指定行数的部分会以省略号收尾。
        </HxText>
      </div>
    </div>

    <p class="demo-title text-demo-title-next">自定义标签</p>
    <div class="text-demo-row">
      <HxText tag="h1">H1 标题文本</HxText>
      <HxText tag="h2">H2 标题文本</HxText>
      <HxText tag="h3">H3 标题文本</HxText>
    </div>

    <p class="demo-title text-demo-title-next">可点击文本</p>
    <div class="text-demo-row">
      <HxText type="primary" class="cursor-pointer">可点击的文本，点击触发 click 事件</HxText>
    </div>

    <p class="demo-title text-demo-title-next">配合图标使用</p>
    <div class="text-demo-row">
      <HxText type="success">
        <hx-icon type="iconify" name="mdi:check-circle" />
        操作成功
      </HxText>
      <HxText type="warning">
        <hx-icon type="iconify" name="mdi:alert" />
        请注意安全
      </HxText>
      <HxText type="danger">
        <hx-icon type="iconify" name="mdi:close-circle" />
        操作失败
      </HxText>
      <HxText type="info">
        <hx-icon type="iconify" name="mdi:information" />
        信息提示
      </HxText>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HxText } from '@whhx/ui'
</script>

<style scoped>
.demo-section {
  padding: 4px 0;
}
.demo-title {
  margin: 0 0 10px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
  font-weight: 500;
}
.text-demo-title-next {
  margin-top: 28px;
}
.text-demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}
.text-demo-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.text-demo-fixed-width {
  width: 260px;
  max-width: 100%;
}
.cursor-pointer {
  cursor: pointer;
}
</style>