<script setup lang="ts">
</script>

<template>
  <div class="icon-demo">
    <h2>Icon 图标组件示例</h2>

    <!-- SVG Icon: mono（单色） -->
    <section class="demo-section">
      <h3>SVG 图标 (type="svg") — 单色 mono</h3>
      <p class="description">使用 group="mono"（默认），color 属性生效，图标使用 currentColor 填充</p>
      <div class="icon-grid">
        <div class="icon-item">
          <hx-icon name="home" size="24px" color="#ff0000" />
          <span>home</span>
        </div>
        <div class="icon-item">
          <hx-icon name="user" size="24px" color="#00ff00" />
          <span>user</span>
        </div>
        <div class="icon-item">
          <hx-icon name="settings" size="24px" color="#0000ff" />
          <span>settings</span>
        </div>
      </div>
    </section>

    <!-- SVG Icon: multi（多色） -->
    <section class="demo-section">
      <h3>SVG 图标 (type="svg") — 多色 multi</h3>
      <p class="description">使用 group="multi"，保留 SVG 原始填充色，color 属性失效</p>
      <div class="icon-grid">
        <div class="icon-item">
          <hx-icon type="svg" group="multi" name="beef" size="32px" />
          <span>beef (multi)</span>
        </div>
        <div class="icon-item">
          <hx-icon type="svg" group="multi" name="coffee" size="32px" />
          <span>coffee (multi)</span>
        </div>
      </div>
    </section>

    <!-- Iconify Icon -->
    <section class="demo-section">
      <h3>Iconify 图标 (type="iconify")</h3>
      <p class="description">
        直接使用完整图标名称（collection:name），支持所有 Iconify 集合
      </p>
      <div class="icon-grid">
        <div class="icon-item">
          <hx-icon type="iconify" name="ep:user" size="24px" />
          <span>ep:user</span>
        </div>
        <div class="icon-item">
          <hx-icon type="iconify" name="ep:home-filled" size="24px" />
          <span>ep:home-filled</span>
        </div>
        <div class="icon-item">
          <hx-icon type="iconify" name="ep:search" size="24px" />
          <span>ep:search</span>
        </div>
        <div class="icon-item">
          <hx-icon type="iconify" name="ep:setting" size="24px" />
          <span>ep:setting</span>
        </div>
        <div class="icon-item">
          <hx-icon type="iconify" name="ep:star-filled" size="24px" color="#ffd700" />
          <span>ep:star-filled</span>
        </div>
        <div class="icon-item">
          <hx-icon type="iconify" name="ep:delete" size="24px" color="#ff4d4f" />
          <span>ep:delete</span>
        </div>
        <div class="icon-item">
          <hx-icon type="iconify" name="ep:edit" size="24px" color="#1890ff" />
          <span>ep:edit</span>
        </div>
        <div class="icon-item">
          <hx-icon type="iconify" name="mdi:heart" size="24px" color="#e91e63" />
          <span>mdi:heart</span>
        </div>
        <div class="icon-item">
          <hx-icon type="iconify" name="mdi:twitter" size="24px" color="#1da1f2" />
          <span>mdi:twitter</span>
        </div>
        <div class="icon-item">
          <hx-icon type="iconify" name="mdi:alert-octagon" size="24px" color="#1da1f2" />
          <span>mdi:alert-octagon</span>
        </div>
        <div class="icon-item">
          <hx-icon type="iconify" name="logos:google" size="24px" color="#1da1f2" />
          <span>logos:google</span>
        </div>
        <div class="icon-item">
          <hx-icon type="iconify" name="logos:argo-icon" size="24px" color="#1da1f2" />
          <span>logos:argo-icon</span>
        </div>
        <div class="icon-item">
          <hx-icon type="iconify" name="streamline-logos:3ds-max-logo" size="24px" color="#1da1f2" />
          <span>streamline-logos:3ds-max-logo</span>
        </div>
      </div>
    </section>

    <!-- Image Icon: CDN 模式（cdnBaseUrl 统一由 HxConfigProvider 全局配置） -->
    <section class="demo-section">
      <h3>Image 图标 (type="image") — CDN 模式</h3>
      <p class="description">
        通过 HxConfigProvider 全局配置 <code>icon.cdnBaseUrl</code>，图片按 <code>/{group}/{name}.{ext}</code> 规则拼接 URL。
      </p>
      <div class="icon-grid">
        <div class="icon-item">
          <hx-icon type="image" group="app" name="alipay" size="32px" />
          <span>app/alipay</span>
        </div>
        <div class="icon-item">
          <hx-icon type="image" group="menu" name="stock" size="32px" />
          <span>menu/stock</span>
        </div>
        <div class="icon-item">
          <hx-icon type="image" group="test" name="alipay" size="32px" />
          <span>test/alipay</span>
        </div>
        <div class="icon-item">
          <hx-icon type="image" group="title" name="location" size="32px" />
          <span>title/location</span>
        </div>
      </div>
    </section>

    <!-- Size Examples -->
    <section class="demo-section">
      <h3>尺寸示例</h3>
      <div class="icon-grid">
        <div class="icon-item">
          <hx-icon name="home" size="12px" />
          <span>12px</span>
        </div>
        <div class="icon-item">
          <hx-icon name="home" size="16px" />
          <span>16px</span>
        </div>
        <div class="icon-item">
          <hx-icon name="home" size="20px" />
          <span>20px</span>
        </div>
        <div class="icon-item">
          <hx-icon name="home" size="24px" />
          <span>24px</span>
        </div>
        <div class="icon-item">
          <hx-icon name="home" size="32px" />
          <span>32px</span>
        </div>
        <div class="icon-item">
          <hx-icon name="home" size="48px" />
          <span>48px</span>
        </div>
      </div>
    </section>

    <!-- Button with Icon -->
    <section class="demo-section">
      <h3>按钮结合图标</h3>
      <div class="button-group">
        <hx-button type="primary">
          <hx-icon name="check" size="16px" />
          确认
        </hx-button>
        <hx-button type="danger">
          <hx-icon name="close" size="16px" />
          取消
        </hx-button>
        <hx-button type="default">
          <hx-icon name="settings" size="16px" />
          设置
        </hx-button>
        <hx-button type="primary">
          <hx-icon type="iconify" name="ep:search" size="16px" />
          搜索
        </hx-button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.icon-demo {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.icon-demo h2 {
  margin-bottom: 24px;
  color: #333;
}

.demo-section {
  margin-bottom: 32px;
}

.demo-section h3 {
  margin-bottom: 8px;
  color: #1890ff;
}

.description {
  color: #666;
  font-size: 14px;
  margin-bottom: 16px;
  line-height: 1.6;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 16px;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  transition: all 0.3s;
}

.icon-item:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
}

.icon-item span {
  font-size: 12px;
  color: #666;
  text-align: center;
  word-break: break-all;
}

.button-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
