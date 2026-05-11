/**
 * useZIndex
 * 管理动态 z-index 值，用于弹层类组件避免层级冲突
 */
import { ref } from 'vue'

let globalZIndex = 2000

export function useZIndex(initialZIndex?: number) {
  const zIndex = ref(initialZIndex ?? ++globalZIndex)

  function nextZIndex() {
    zIndex.value = ++globalZIndex
    return zIndex.value
  }

  return {
    /** 当前 z-index 值 */
    zIndex,
    /** 递增并返回下一个 z-index */
    nextZIndex,
    /** 读取当前全局 z-index 基数 */
    getCurrentBase: () => globalZIndex,
  }
}