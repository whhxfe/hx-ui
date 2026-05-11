/**
 * useTeleport
 * 管理 Teleport to 目标选择器，用于弹层类组件挂载到指定容器
 */
import { computed, type Ref } from 'vue'

export function useTeleport(to: Ref<string | HTMLElement | undefined>) {
  const teleportTarget = computed(() => {
    const target = to.value
    if (!target || target === 'body') return 'body'

    if (typeof target === 'string') {
      // 查询选择器，找不到则 fallback 到 body
      const el = document.querySelector<HTMLElement>(target)
      return el ?? 'body'
    }

    return target
  })

  return { teleportTarget }
}