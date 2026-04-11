<script setup lang="ts">
import { ref } from 'vue'

// === 基础用法 ===
function handleClick() {
  alert('按钮点击')
}

// === 禁用和加载 ===
const loading = ref(false)
function toggleLoading() {
  loading.value = !loading.value
}

// === 图标按钮 ===
const searchLoading = ref(false)
function doSearch() {
  searchLoading.value = true
  setTimeout(() => {
    searchLoading.value = false
  }, 1500)
}
</script>

<template>
  <div class="page-container">
    <h1 class="page-title">Button 按钮</h1>
    <p class="page-desc">常用的操作按钮，基于 Element Plus 按钮二次封装。</p>

    <!-- 基础用法 -->
    <section class="demo-section">
      <h3 class="section-title">基础用法</h3>
      <p class="section-desc">使用 <code>type</code> 属性定义按钮样式，支持 primary / success / warning / danger / info 五种类型，默认为 default。</p>
      <div class="demo-block">
        <div class="demo-row">
          <hx-button @click="handleClick">Default</hx-button>
          <hx-button type="primary" @click="handleClick">Primary</hx-button>
          <hx-button type="success" @click="handleClick">Success</hx-button>
          <hx-button type="warning" @click="handleClick">Warning</hx-button>
          <hx-button type="danger" @click="handleClick">Danger</hx-button>
          <hx-button type="info" @click="handleClick">Info</hx-button>
        </div>
        <div class="demo-row">
          <hx-button plain>Plain</hx-button>
          <hx-button type="primary" plain>Primary</hx-button>
          <hx-button type="success" plain>Success</hx-button>
          <hx-button type="warning" plain>Warning</hx-button>
          <hx-button type="danger" plain>Danger</hx-button>
          <hx-button type="info" plain>Info</hx-button>
        </div>
        <div class="demo-row">
          <hx-button round>Round</hx-button>
          <hx-button type="primary" round>Primary</hx-button>
          <hx-button type="success" round>Success</hx-button>
          <hx-button type="warning" round>Warning</hx-button>
          <hx-button type="danger" round>Danger</hx-button>
          <hx-button type="info" round>Info</hx-button>
        </div>
        <div class="demo-row">
          <hx-button dashed>Dashed</hx-button>
          <hx-button type="primary" dashed>Primary</hx-button>
          <hx-button type="success" dashed>Success</hx-button>
          <hx-button type="warning" dashed>Warning</hx-button>
          <hx-button type="danger" dashed>Danger</hx-button>
          <hx-button type="info" dashed>Info</hx-button>
        </div>
        <div class="demo-row">
          <hx-button circle>Q</hx-button>
          <hx-button type="primary" circle>E</hx-button>
          <hx-button type="success" circle>O</hx-button>
          <hx-button type="warning" circle>S</hx-button>
          <hx-button type="danger" circle>D</hx-button>
          <hx-button type="info" circle>I</hx-button>
        </div>
      </div>
    </section>

    <!-- 禁用状态 -->
    <section class="demo-section">
      <h3 class="section-title">禁用状态</h3>
      <div class="demo-block">
        <div class="demo-row">
          <hx-button disabled>Default</hx-button>
          <hx-button type="primary" disabled>Primary</hx-button>
          <hx-button type="success" disabled>Success</hx-button>
          <hx-button type="danger" disabled>Danger</hx-button>
        </div>
      </div>
    </section>

    <!-- 图标按钮 -->
    <section class="demo-section">
      <h3 class="section-title">图标按钮</h3>
      <p class="section-desc">结合 <code>hx-icon</code> 组件使用。</p>
      <div class="demo-block">
        <div class="demo-row">
          <hx-button type="primary">
            <hx-icon type="iconify" name="ep:search" size="14px" />
            搜索
          </hx-button>
          <hx-button type="success">
            <hx-icon type="iconify" name="ep:check" size="14px" />
            确认
          </hx-button>
          <hx-button type="danger">
            <hx-icon type="iconify" name="ep:delete" size="14px" />
            删除
          </hx-button>
          <hx-button type="warning">
            <hx-icon type="iconify" name="ep:edit" size="14px" />
            编辑
          </hx-button>
        </div>
        <div class="demo-row">
          <hx-button circle type="primary">
            <hx-icon type="iconify" name="ep:plus" size="14px" />
          </hx-button>
          <hx-button circle type="success">
            <hx-icon type="iconify" name="ep:edit" size="14px" />
          </hx-button>
          <hx-button circle type="warning">
            <hx-icon type="iconify" name="ep:setting" size="14px" />
          </hx-button>
          <hx-button circle type="danger">
            <hx-icon type="iconify" name="ep:delete" size="14px" />
          </hx-button>
        </div>
      </div>
    </section>

    <!-- 加载状态 -->
    <section class="demo-section">
      <h3 class="section-title">加载状态</h3>
      <div class="demo-block">
        <div class="demo-row">
          <hx-button type="primary" :loading="loading" @click="toggleLoading">
            {{ loading ? '加载中...' : '点击切换' }}
          </hx-button>
          <hx-button type="primary" :loading="searchLoading" @click="doSearch">
            <template v-if="!searchLoading">
              <hx-icon type="iconify" name="ep:search" size="14px" />
              搜索
            </template>
          </hx-button>
        </div>
      </div>
    </section>

    <!-- 尺寸 -->
    <section class="demo-section">
      <h3 class="section-title">尺寸</h3>
      <div class="demo-block">
        <div class="demo-row">
          <hx-button size="large">Large</hx-button>
          <hx-button type="primary" size="large">Large</hx-button>
          <hx-button>Default</hx-button>
          <hx-button type="primary">Default</hx-button>
          <hx-button size="small">Small</hx-button>
          <hx-button type="primary" size="small">Small</hx-button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-container {
  max-width: 900px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.page-desc {
  color: #666;
  margin-bottom: 32px;
  line-height: 1.6;
}

.demo-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.section-desc {
  color: #666;
  font-size: 14px;
  margin-bottom: 16px;
}

.section-desc code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
  color: #c7254e;
}

.demo-block {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
}

.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
}

.demo-row:last-child {
  margin-bottom: 0;
}
</style>
