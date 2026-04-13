<template>
  <div class="demo-dynamic">
    <div class="demo-dynamic__controls">
      <div class="demo-dynamic__label">文件类型：</div>
      <el-select v-model="selectedType" placeholder="请选择类型" clearable style="width: 340px">
        <el-option-group
          v-for="group in groups"
          :key="group.label"
          :label="group.label"
        >
          <el-option
            v-for="item in group.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-option-group>
      </el-select>
    </div>

    <div class="demo-dynamic__preview">
      <hx-file-preview
        :url="currentUrl"
        preview-width="240px"
        preview-height="160px"
      />
    </div>

    <div class="demo-dynamic__info" v-if="currentUrl">
      当前 url: <code>{{ currentUrl }}</code>
    </div>
    <div class="demo-dynamic__info demo-dynamic__info--null" v-else>
      当前 url: <code>null</code>（无文件，组件展示空状态图标）
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { HxFilePreview as FilePreview } from "@hx/ui"

const BASE = '/files'

interface FileOption {
  label: string
  value: string
}

interface OptionGroup {
  label: string
  options: FileOption[]
}

const groups: OptionGroup[] = [
  {
    label: '图片',
    options: [
      { label: 'svg', value: 'svg' },
      { label: 'webp', value: 'webp' },
      { label: 'png', value: 'png' },
      { label: 'jpg', value: 'jpg' },
      { label: 'jpeg', value: 'jpeg' },
      { label: 'gif', value: 'gif' },
      { label: 'bmp', value: 'bmp' },
      { label: 'ico', value: 'ico' },
    ],
  },
  {
    label: '视频',
    options: [
      { label: 'mp4', value: 'mp4' },
      { label: 'flv', value: 'flv' },
      { label: 'm3u8', value: 'm3u8' },
      { label: 'webm', value: 'webm' },
      { label: 'mov', value: 'mov' },
      { label: 'avi', value: 'avi' },
      { label: 'wmv', value: 'wmv' },
      { label: 'ogg', value: 'ogg_video' },
    ],
  },
  {
    label: '音频',
    options: [
      { label: 'mp3', value: 'mp3' },
      { label: 'wav', value: 'wav' },
      { label: 'ogg', value: 'ogg_audio' },
      { label: 'aac', value: 'aac' },
      { label: 'flac', value: 'flac' },
      { label: 'm4a', value: 'm4a' },
    ],
  },
  {
    label: '文档',
    options: [
      { label: 'pdf', value: 'pdf' },
      { label: 'eml', value: 'eml' },
      { label: 'md', value: 'md' },
    ],
  },
  {
    label: '文本',
    options: [
      { label: 'txt', value: 'txt' },
      { label: 'yaml', value: 'yaml' },
      { label: 'yml', value: 'yml' },
      { label: 'json', value: 'json' },
      { label: 'xml', value: 'xml' },
      { label: 'csv', value: 'csv' },
    ],
  },
  {
    label: '其他',
    options: [
      { label: 'null', value: 'null' },
    ],
  },
]

const selectedType = ref('svg')

// 所有路径均为占位符，真实文件由使用者自行补充到 server/public/files 对应目录
const typeMap: Record<string, string> = {
  svg:          `${BASE}/images/1.svg`,
  webp:         `${BASE}/images/1.webp`,
  png:          `${BASE}/images/1.png`,
  jpg:          `${BASE}/images/1.jpg`,
  jpeg:         `${BASE}/images/1.jpeg`,
  gif:          `${BASE}/images/1.gif`,
  bmp:          `${BASE}/images/1.bmp`,
  ico:          `${BASE}/images/1.ico`,
  mp4:          `${BASE}/videos/1.mp4`,
  flv:          `${BASE}/videos/1.flv`,
  m3u8:         `${BASE}/videos/1.m3u8`,
  webm:         `${BASE}/videos/1.webm`,
  mov:          `${BASE}/videos/1.mov`,
  avi:          `${BASE}/videos/1.avi`,
  wmv:          `${BASE}/videos/1.wmv`,
  ogg_video:    `${BASE}/videos/1.ogg`,
  mp3:          `${BASE}/audio/1.mp3`,
  wav:          `${BASE}/audio/1.wav`,
  ogg_audio:    `${BASE}/audio/1.ogg`,
  aac:          `${BASE}/audio/1.aac`,
  flac:         `${BASE}/audio/1.flac`,
  m4a:          `${BASE}/audio/1.m4a`,
  pdf:          `${BASE}/pdf/1.pdf`,
  eml:          `${BASE}/eml/1.eml`,
  md:           `${BASE}/markdown/sample.md`,
  txt:          `${BASE}/text/sample.txt`,
  yaml:         `${BASE}/yaml/sample.yaml`,
  yml:          `${BASE}/yaml/sample.yml`,
  json:         `${BASE}/json/1.json`,
  xml:          `${BASE}/xml/sample.xml`,
  csv:          `${BASE}/csv/sample.csv`,
}

const currentUrl = computed(() => {
  if (selectedType.value === 'null') return null as any
  return typeMap[selectedType.value] ?? null as any
})
</script>

<style lang="scss" scoped>
.demo-dynamic {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__controls {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__label {
    font-size: 14px;
    color: #333;
    font-weight: 500;
    flex-shrink: 0;
  }

  &__preview {
    display: flex;
    align-items: flex-start;
  }

  &__info {
    font-size: 13px;
    color: #666;
    display: flex;
    align-items: center;
    gap: 6px;

    code {
      background: #f5f5f5;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      color: #d63384;
      word-break: break-all;
    }

    &--null code {
      color: #e57373;
      background: #fff5f5;
    }
  }
}
</style>
