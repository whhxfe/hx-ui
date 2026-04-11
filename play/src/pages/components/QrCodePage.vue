<script setup lang="ts">
import { ref } from 'vue'

const url = ref('https://example.com')

const mode = ref<'svg' | 'canvas'>('svg')
const size = ref(160)
const colorDark = ref('#000000')
const colorLight = ref('#ffffff')
const level = ref<'L' | 'M' | 'Q' | 'H'>('M')
const showDownload = ref(true)
</script>

<template>
  <div class="qrcode-demo">
    <h2>二维码（QrCode）组件示例</h2>

    <!-- 输入区 -->
    <section class="demo-section">
      <h3>URL 输入</h3>
      <el-input v-model="url" placeholder="请输入链接或文本" style="max-width: 400px" />
    </section>

    <!-- 配置项 -->
    <section class="demo-section">
      <h3>参数配置</h3>
      <div class="config-grid">
        <el-form label-width="90px">
          <el-form-item label="渲染模式">
            <el-radio-group v-model="mode">
              <el-radio value="svg">SVG</el-radio>
              <el-radio value="canvas">Canvas</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="尺寸 (px)">
            <el-slider v-model="size" :min="80" :max="400" :step="20" style="width: 200px" />
            <span style="margin-left: 12px">{{ size }}px</span>
          </el-form-item>
          <el-form-item label="前景色">
            <el-color-picker v-model="colorDark" />
          </el-form-item>
          <el-form-item label="背景色">
            <el-color-picker v-model="colorLight" />
          </el-form-item>
          <el-form-item label="纠错等级">
            <el-select v-model="level" style="width: 160px">
              <el-option value="L" label="L (7%)" />
              <el-option value="M" label="M (15%)" />
              <el-option value="Q" label="Q (25%)" />
              <el-option value="H" label="H (30%)" />
            </el-select>
          </el-form-item>
          <el-form-item label="显示下载">
            <el-switch v-model="showDownload" />
          </el-form-item>
        </el-form>
      </div>
    </section>

    <!-- 预览 -->
    <section class="demo-section">
      <h3>预览</h3>
      <div class="qrcode-preview">
        <hx-qr-code
          :value="url"
          :render-mode="mode"
          :size="size"
          :color-dark="colorDark"
          :color-light="colorLight"
          :error-correction-level="level"
          :show-download="showDownload"
          download-file-name="my-qrcode"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.qrcode-demo {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.qrcode-demo h2 {
  margin-bottom: 24px;
  color: #333;
}

.demo-section {
  margin-bottom: 32px;
}

.demo-section h3 {
  margin-bottom: 12px;
  color: #1890ff;
}

.config-grid {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 16px 16px 4px;
  max-width: 500px;
}

.qrcode-preview {
  display: flex;
  justify-content: center;
  padding: 24px;
  border: 1px solid #eee;
  border-radius: 8px;
}
</style>
