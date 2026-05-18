<template>
  <div class="hx-audio-viewer" :style="{ width, height }">
    <div class="hx-audio-viewer__thumb" @click="open">
      <div class="hx-audio-viewer__icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      </div>
      <div class="hx-audio-viewer__label">音频</div>
    </div>

    <teleport to="body">
      <Transition name="fade">
        <div v-if="visible" class="hx-audio-viewer__modal" @click.self="close">
          <div class="hx-audio-viewer__content">
            <div class="hx-audio-viewer__toolbar">
              <div class="hx-audio-viewer__toolbar-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
                <span>音频播放</span>
              </div>
              <div class="hx-audio-viewer__toolbar-actions">
                <button class="hx-audio-viewer__action-btn" @click="download">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>下载</span>
                </button>
                <button class="hx-audio-viewer__close-btn" @click="close">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="hx-audio-viewer__player-wrapper">
              <div class="hx-audio-viewer__player">
                <audio ref="audioRef" :src="url" controls @timeupdate="update" @canplay="loadingFinish" @ended="handleEnd" />
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import type { AudioViewerProps } from './types'

const props = withDefaults(defineProps<AudioViewerProps>(), {
  width: '120px',
  height: '80px',
})

const audioRef = ref<HTMLAudioElement | null>(null)
const visible = ref(false)

function open() {
  visible.value = true
  document.body.style.overflow = 'hidden'
  nextTick(() => {
    audioRef.value?.play()
  })
}

function close() {
  visible.value = false
  document.body.style.overflow = ''
  audioRef.value?.pause()
}

async function download() {
  try {
    const response = await fetch(props.url)
    if (!response.ok) throw new Error('下载失败')

    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)
    const filename = props.url.split('/').pop() || 'audio'

    const a = document.createElement('a')
    a.href = blobUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(blobUrl)
  } catch {
    const a = document.createElement('a')
    a.href = props.url
    a.download = props.url.split('/').pop() || 'audio'
    a.target = '_blank'
    a.click()
  }
}

const loadingFinish = () => {}
const update = () => {}
const handleEnd = () => {}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && visible.value) close()
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style lang="scss" scoped>
@use './transitions.scss' as *;

$primary-color: var(--hx-primary-color);
$border-color: var(--hx-border-color-base);
$bg: var(--hx-bg-color-page);
$bg-hover: var(--hx-bg-color-hover);
$shadow: var(--hx-shadow-color);
$text-color: var(--hx-text-color-regular);
$text-secondary: var(--hx-text-color-secondary);

.hx-audio-viewer {
  width: 100%;
  height: 100%;
  position: relative;

  &__thumb {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: $bg;
    border: 1px solid $border-color;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 8px;
    box-sizing: border-box;

    &:hover {
      background: $bg-hover;
      border-color: $primary-color;
      transform: translateY(-2px);
      box-shadow: 0 2px 8px $shadow;
    }
  }

  &__icon {
    color: $primary-color;
    margin-bottom: 4px;
    flex-shrink: 0;
  }

  &__label {
    font-size: 11px;
    color: $text-secondary;
    font-weight: 500;
  }

  &__modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 20px;
    overflow-y: auto;
    z-index: 9999;
  }

  &__content {
    background: transparent;
    max-width: 600px;
    width: 100%;
    border-radius: 0;
    overflow: visible;
    box-shadow: none;
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 80px);
  }

  &__toolbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 56px;
    background: rgba(30, 30, 30, 0.95);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    z-index: 10000;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

    &-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 18px;
      font-weight: 600;
      color: #fff;
    }

    &-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  &__action-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 6px;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.3);
    }
  }

  &__close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 6px;
    color: #fff;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(255, 77, 77, 0.2);
      border-color: rgba(255, 77, 77, 0.4);
      transform: rotate(90deg);
    }
  }

  &__player-wrapper {
    flex: 1;
    padding: 80px 40px 40px;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__player {
    width: 100%;
    max-width: 500px;

    audio {
      width: 100%;
      outline: none;
    }
  }
}
</style>