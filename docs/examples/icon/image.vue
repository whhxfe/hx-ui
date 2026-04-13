<template>
  <div>
    <p class="desc">
      Image 图标通过 <code>source</code> 属性切换资源加载策略：<code>local</code> 从本地 glob 加载，<code>cdn</code> 从配置的 CDN 地址加载。
      props 配置优先级高于全局 <code>HxConfigProvider</code> 配置。
    </p>

    <h4 class="sub-title">source 加载策略</h4>
    <table class="config-table">
      <thead>
        <tr>
          <th>属性</th>
          <th>说明</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>source="local"</code></td>
          <td>从本地 glob 资源加载，忽略 CDN 配置</td>
        </tr>
        <tr>
          <td><code>source="cdn"</code></td>
          <td>从 CDN 地址加载，需配合 <code>cdnBaseUrl</code></td>
        </tr>
        <tr>
          <td><code>cdnBaseUrl</code></td>
          <td>CDN 基础路径，props 优先级高于全局配置</td>
        </tr>
      </tbody>
    </table>

    <!-- Local 模式需要独立的 HxConfigProvider（不设置 cdnBaseUrl，强制使用本地资源） -->
    <h4 class="sub-title">Local 模式 — 本地 glob 资源</h4>
    <p class="desc sub-desc">
      图片存放在 <code>@/assets/icons/</code> 目录下，glob 自动扫描后注入组件。
      <code>source="local"</code> 强制使用本地资源。
    </p>
    <hx-config-provider :icon="localIconConfig">
      <div class="icon-list">
        <div class="icon-item">
          <hx-icon type="image" group="app" name="qq" size="32px" ext="webp" source="local" />
          <span>app/qq</span>
          <span class="tag">local glob</span>
        </div>
        <div class="icon-item">
          <hx-icon type="image" group="test" name="马年恭喜发财" size="32px" source="local" />
          <span>test/马年恭喜发财</span>
          <span class="tag">local glob</span>
        </div>
      </div>
    </hx-config-provider>

    <h4 class="sub-title">CDN 模式 — 使用 props cdnBaseUrl</h4>
    <p class="desc sub-desc">
      通过 <code>cdn-base-url</code> prop 单独指定 CDN 地址，覆盖全局配置。
      <code>{cdnBaseUrl}/{group}/{name}.{ext}</code>
    </p>
    <div class="icon-list">
      <div class="icon-item">
        <hx-icon
          type="image"
          group="app"
          name="alipay"
          size="32px"
          source="cdn"
          cdn-base-url="/icons"
        />
        <span>app/alipay</span>
        <span class="tag">cdn + /icons</span>
      </div>
      <div class="icon-item">
        <hx-icon
          type="image"
          group="menu"
          name="stock"
          size="32px"
          source="cdn"
          cdn-base-url="/icons"
        />
        <span>menu/stock</span>
        <span class="tag">cdn + /icons</span>
      </div>
      <div class="icon-item">
        <hx-icon
          type="image"
          group="title"
          name="location"
          size="32px"
          source="cdn"
          cdn-base-url="/icons"
        />
        <span>title/location</span>
        <span class="tag">cdn + /icons</span>
      </div>
    </div>

    <h4 class="sub-title">CDN 模式 — 使用全局 cdnBaseUrl</h4>
    <p class="desc sub-desc">
      在 <code>HxConfigProvider</code> 中配置 <code>cdnBaseUrl</code> 后，组件无需单独指定。
      <code>/icons</code> 会通过 docs 代理到 server。
    </p>
    <div class="icon-list">
      <div class="icon-item">
        <hx-icon type="image" group="app" name="alipay" size="32px" source="cdn" />
        <span>app/alipay</span>
        <span class="tag">全局配置</span>
      </div>
      <div class="icon-item">
        <hx-icon type="image" group="menu" name="stock" size="32px" source="cdn" />
        <span>menu/stock</span>
        <span class="tag">全局配置</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HxIcon as Icon, HxConfigProvider } from "@hx/ui"

/** Local 模式：imageIconModules 自动扫描本地资源，不设置 cdnBaseUrl */
const localIconConfig = {
  image: {
    imageIconModules: [import.meta.glob<{ default: string }>('@/assets/icons/**/*', { eager: true })],
    source: "local" as const,
  },
}
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
