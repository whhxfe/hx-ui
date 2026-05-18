<template>
  <div class="hx-video-viewer" :style="{ width: width, height: height }">
    <div
      v-if="!loading"
      class="hx-video-viewer__thumbnail"
      :style="{ backgroundImage: `url(${thumbnailUrl || fallbackThumbnail})` }"
      @click="openViewer"
    >
      <div class="hx-video-viewer__play">▶</div>
    </div>
    <div v-else class="hx-video-viewer__loading">加载中...</div>

    <teleport to="body">
      <div v-if="showModal" class="hx-video-viewer__mask">
        <button class="hx-video-viewer__close" @click="closeViewer">×</button>
        <div class="hx-video-viewer__wrapper" @click.self="closeViewer">
          <video ref="playVideoRef" class="hx-video-viewer__video" controls autoplay playsinline />
        </div>
      </div>
    </teleport>

    <video
      v-if="canCaptureFrame"
      ref="captureVideoRef"
      class="hx-video-viewer__hidden"
      :src="url ?? undefined"
      preload="auto"
      crossorigin="anonymous"
      @loadeddata="handleCaptureLoaded"
      @error="handleError"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onUnmounted, computed } from 'vue'
import type { VideoViewerProps } from './types'
import Hls from 'hls.js'
import flvjs from 'flv.js'

const props = withDefaults(defineProps<VideoViewerProps>(), {
  width: '400px',
  height: '225px',
  fallbackThumbnail: '',
})

const emit = defineEmits<{
  (e: 'error', msg: string): void
}>()

const loading = ref(true)
const showModal = ref(false)
const thumbnailUrl = ref('')
const captureVideoRef = ref<HTMLVideoElement | null>(null)
const playVideoRef = ref<HTMLVideoElement | null>(null)

let hls: any = null
let flvPlayer: any = null

const canCaptureFrame = computed(
  () => !!props.url && !String(props.url).endsWith('.flv')
)

const handleCaptureLoaded = () => {
  const video = captureVideoRef.value
  if (!video) return

  video.currentTime = Math.min(0.1, video.duration || 0.1)

  const onSeeked = () => {
    try {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth || 400
      canvas.height = video.videoHeight || 225
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error()

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      thumbnailUrl.value = canvas.toDataURL('image/jpeg', 0.8)
    } catch {
      emit('error', '视频封面截取失败')
    } finally {
      loading.value = false
      video.removeEventListener('seeked', onSeeked)
    }
  }

  video.addEventListener('seeked', onSeeked)
}

const openViewer = async () => {
  if (!props.url) return
  showModal.value = true
  document.body.style.overflow = 'hidden'
  await nextTick()

  const video = playVideoRef.value
  if (!video) return

  const url = props.url

  if (String(url).endsWith('.m3u8')) {
    if (Hls.isSupported()) {
      hls = new Hls()
      hls.loadSource(url)
      hls.attachMedia(video)
    } else {
      video.src = url
    }
  } else if (String(url).endsWith('.flv')) {
    if (flvjs.isSupported()) {
      flvPlayer = flvjs.createPlayer({ type: 'flv', url })
      flvPlayer.attachMediaElement(video)
      flvPlayer.load()
    } else {
      emit('error', '当前浏览器不支持 flv 播放')
    }
  } else {
    video.src = url
  }

  video.play().catch(() => {})
}

const closeViewer = () => {
  showModal.value = false
  document.body.style.overflow = ''

  const video = playVideoRef.value
  if (video) {
    video.pause()
    video.removeAttribute('src')
    video.load()
  }

  hls?.destroy()
  hls = null

  flvPlayer?.destroy()
  flvPlayer = null
}

watch(
  () => props.url,
  () => {
    loading.value = true
    thumbnailUrl.value = ''
    if (props.url && canCaptureFrame.value) {
      captureVideoRef.value?.load()
    } else {
      loading.value = false
    }
  },
  { immediate: true }
)

const handleError = () => {
  loading.value = false
  emit('error', '视频加载失败')
}

onUnmounted(closeViewer)
</script>

<style lang="scss" scoped>
$primary-color: var(--hx-primary-color);
$border-color: var(--hx-border-color-base);
$bg: var(--hx-bg-color-page);
$bg-hover: var(--hx-bg-color-hover);
$shadow: var(--hx-shadow-color);

.hx-video-viewer {
  display: inline-block;

  &__thumbnail {
    width: 100%;
    height: 100%;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-color: #000;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    border: 1px solid $border-color;
    overflow: hidden;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      border-color: $primary-color;
      transform: translateY(-2px);
      box-shadow: 0 2px 8px $shadow;

      .hx-video-viewer__play {
        transform: scale(1.2);
      }
    }
  }

  &__play {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: #fff;
    text-shadow: 0 0 10px #000;
    transition: transform 0.2s ease;
  }

  &__loading {
    width: 100%;
    height: 100%;
    background: $bg;
    border: 1px solid $border-color;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--hx-text-color-secondary);
    font-size: 14px;
  }

  &__hidden {
    display: none;
  }
}

.hx-video-viewer__mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hx-video-viewer__close {
  position: fixed;
  top: 20px;
  right: 24px;
  font-size: 36px;
  color: #fff;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 10000;
}

.hx-video-viewer__wrapper {
  width: 90vw;
  height: 90vh;
  max-width: 1200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hx-video-viewer__video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
}
</style>