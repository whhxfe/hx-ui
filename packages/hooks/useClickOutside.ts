/**
 * useClickOutside
 * 监听点击元素外部的事件，常用于弹层/下拉等组件的关闭逻辑
 */
import { onMounted, onUnmounted, type Ref } from 'vue'

export function useClickOutside(
  targetRef: Ref<HTMLElement | undefined>,
  handler: (event: MouseEvent) => void,
  excludeRefs?: Ref<HTMLElement | undefined>[],
) {
  function onDocumentClick(event: MouseEvent) {
    const target = targetRef.value
    if (!target) return

    // 点击目标元素内部 → 不触发
    if (target.contains(event.target as Node)) return

    // 点击排除列表中的元素内部 → 不触发
    if (excludeRefs) {
      for (const ref of excludeRefs) {
        if (ref.value?.contains(event.target as Node)) return
      }
    }

    handler(event)
  }

  onMounted(() => {
    document.addEventListener('mousedown', onDocumentClick)
  })

  onUnmounted(() => {
    document.removeEventListener('mousedown', onDocumentClick)
  })
}