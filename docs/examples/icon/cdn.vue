<template>
  <div>
    <p class="desc">
      通过 <code>cdnBaseUrl</code> 指定图片服务器地址，组件按 <code>{cdnBaseUrl}/{group}/{name}.{ext}</code> 拼接完整 URL。
      <code>source</code> 属性控制资源加载策略，优先级：<strong>组件 props > 全局配置 > 默认值</strong>。
    </p>

    <h4 class="sub-title">全局配置（HxConfigProvider）</h4>
    <p class="desc sub-desc">
      在应用根组件中统一配置 <code>cdnBaseUrl</code>，子组件使用 <code>source="cdn"</code> 即可走 CDN 加载。
    </p>
    <div class="icon-list">
      <div class="icon-item">
        <hx-icon type="image" group="cdn-resouces" name="1" size="32px" ext="png" source="cdn" />
        <span>cdn-resouces/1</span>
      </div>
      <div class="icon-item">
        <hx-icon type="image" group="menu" name="stock" size="32px" source="cdn" />
        <span>menu/stock</span>
      </div>
    </div>

    <h4 class="sub-title">组件级别覆盖（cdn-base-url props）</h4>
    <p class="desc sub-desc">
      通过 <code>cdn-base-url</code> props 可覆盖全局配置，适用于不同 CDN 地址的场景。
    </p>
    <div class="icon-list">
      <div class="icon-item">
        <hx-icon
          type="image"
          group="gif"
          name="1"
          size="32px"
          source="cdn"
          cdn-base-url="http://localhost:2999/static/icons"
          
        />
        
        <span>gif/1/gif</span>
      </div>
    </div>

    <h4 class="sub-title">强制本地模式（source="local"）</h4>
    <p class="desc sub-desc">
      使用 <code>source="local"</code> 可显式强制走本地 glob 资源，忽略全局 CDN 配置。
    </p>
    <div class="icon-list">
      <div class="icon-item">
        <hx-icon type="image" group="test" name="alipay" size="32px" source="local" />
        <span>test/alipay</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HxIcon as Icon } from "@hx/ui"
</script>

<style scoped>
.desc {
  margin-bottom: 16px;
  font-size: 12px;
  color: #666;
  line-height: 1.6;
}

.sub-title {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin: 24px 0 10px;
}

.sub-desc {
  margin-bottom: 12px;
}

.icon-list {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.icon-item span {
  font-size: 12px;
  color: #666;
}
</style>
