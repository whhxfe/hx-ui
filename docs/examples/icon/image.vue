<template>
  <div>
    <p class="desc">
      Image 图标支持两种资源挂载方式：<strong>本地 glob 模式</strong>（默认）和 <strong>CDN 模式</strong>（需配置 cdnBaseUrl）。
      通过 <code>source</code> 属性控制资源加载策略。
    </p>

    <h4 class="sub-title">source 资源来源说明</h4>
    <table class="config-table">
      <thead>
        <tr>
          <th>source 值</th>
          <th>行为</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>'auto'</code>（默认）</td>
          <td>优先使用 CDN 地址（cdnBaseUrl 有配置就用），无配置则 fallback 到本地 glob 资源</td>
        </tr>
        <tr>
          <td><code>'local'</code></td>
          <td>始终使用本地 glob 资源，忽略 CDN 配置</td>
        </tr>
        <tr>
          <td><code>'cdn'</code></td>
          <td>始终使用 CDN 地址（cdnBaseUrl 必须有配置，否则返回空）</td>
        </tr>
      </tbody>
    </table>

    <h4 class="sub-title">CDN 模式 — 使用全局 cdnBaseUrl</h4>
    <p class="desc sub-desc">
      在 <code>HxConfigProvider</code> 中配置 <code>cdnBaseUrl</code> 后，组件使用 <code>source="cdn"</code> 即可加载：
      <code>{cdnBaseUrl}/{group}/{name}.{ext}</code>
    </p>
    <div class="icon-list">
      <div class="icon-item">
        <hx-icon type="image" group="app" name="alipay" size="32px" source="cdn" />
        <span>app/alipay</span>
        <span class="tag">cdn + 全局 url</span>
      </div>
      <div class="icon-item">
        <hx-icon type="image" group="menu" name="stock" size="32px" source="cdn" />
        <span>menu/stock</span>
        <span class="tag">cdn + 全局 url</span>
      </div>
    </div>

    <h4 class="sub-title">CDN 模式 — 使用 props 单独指定 cdnBaseUrl</h4>
    <p class="desc sub-desc">
      通过 props 的 <code>cdn-base-url</code> 可覆盖全局配置（优先级最高）。
    </p>
    <div class="icon-list">
      <div class="icon-item">
        <hx-icon
          type="image"
          group="gif"
          name="1"
          size="32px"
          source="cdn"
          cdn-base-url="http://localhost:2999/static"
          ext="gif"
        />
        <span>gif/1</span>
        <span class="tag">cdn + props url</span>
      </div>
    </div>

    <h4 class="sub-title">本地 glob 模式（默认）</h4>
    <p class="desc sub-desc">
      图片放在 <code>@/assets/icons/</code> 目录下，通过 <code>HxConfigProvider</code> 注入 glob 结果自动扫描。
      使用 <code>source="local"</code> 可显式强制走本地资源。
    </p>
    <div class="icon-list">
      <div class="icon-item">
        <hx-icon type="image" group="test" name="alipay" size="32px" source="local" />
        <span>test/alipay</span>
        <span class="tag">local glob</span>
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

.config-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  margin-bottom: 16px;
}

.config-table th,
.config-table td {
  border: 1px solid #e8e8e8;
  padding: 8px 12px;
  text-align: left;
  color: #333;
}

.config-table th {
  background: #f5f5f5;
  font-weight: 600;
  color: #333;
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

.tag {
  font-size: 11px;
  color: #888;
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
