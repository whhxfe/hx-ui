<template>
  <div class="demo-section">
    <p class="demo-label">类型</p>
    <div class="demo-row">
      <HxText>默认</HxText>
      <HxText type="primary">主要</HxText>
      <HxText type="success">成功</HxText>
      <HxText type="warning">警告</HxText>
      <HxText type="danger">危险</HxText>
      <HxText type="info">信息</HxText>
    </div>

    <p class="demo-label">尺寸</p>
    <div class="demo-row">
      <HxText size="large">大号</HxText>
      <HxText>默认</HxText>
      <HxText size="small">小号</HxText>
    </div>

    <p class="demo-label">截断</p>
    <div class="demo-column">
      <div class="demo-fixed-width">
        <HxText truncated>这是一段很长的文本，超出容器宽度时会自动截断并显示省略号。</HxText>
      </div>
      <div class="demo-fixed-width">
        <HxText :line-clamp="2">
          这是一段多行文本，通过 line-clamp 属性限制最大显示行数。超出指定行数的部分会以省略号收尾。
          这是一段多行文本，通过 line-clamp 属性限制最大显示行数。超出指定行数的部分会以省略号收尾。
        </HxText>
      </div>
    </div>

    <p class="demo-label">自定义标签</p>
    <div class="demo-row">
      <HxText tag="h1">H1 标题</HxText>
      <HxText tag="h2">H2 标题</HxText>
      <HxText tag="h3">H3 标题</HxText>
    </div>

    <p class="demo-label">可点击文本</p>
    <div class="demo-row">
      <HxText type="primary" class="cursor-pointer" @click="handleClick">
        点击触发 click 事件
      </HxText>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HxText } from '@hx/ui'

function handleClick() {
  console.log('click')
}
</script>

<style scoped>
.demo-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.demo-label {
  margin: 0;
  font-size: 13px;
  color: #8a92a6;
  font-weight: 500;
}
.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}
.demo-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.demo-fixed-width {
  width: 260px;
  max-width: 100%;
}
.cursor-pointer {
  cursor: pointer;
}
</style>