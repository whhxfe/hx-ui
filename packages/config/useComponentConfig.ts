/**
 * useComponentConfig
 * 从全局 ConfigProvider 中读取当前组件的默认属性。
 * 当组件自身未传入对应 prop 时，回退到 ConfigProvider 中配置的默认值。
 *
 * @example
 * ```ts
 * const { size } = useComponentConfig('Button', { size: 'default' })
 * // size 优先级：props.size > config.componentDefaults.Button?.size > 'default'
 * ```
 */
import { inject, computed, type Ref } from 'vue'
import { HxConfigKey } from './composable'
import type { HxConfig } from './types'

export function useComponentConfig<T extends Record<string, unknown>>(
  componentName: string,
  localDefaults: T,
): { [K in keyof T]: Ref<T[K]> } {
  const config = inject<HxConfig>(HxConfigKey)

  const result = {} as { [K in keyof T]: Ref<T[K]> }

  for (const key of Object.keys(localDefaults) as Array<keyof T>) {
    result[key] = computed(() => {
      // 优先级：1. 传入的 props（已在组件层 resolved） 2. 全局配置 3. 组件本地默认值
      const globalDefault = (config?.componentDefaults as Record<string, any>)?.[componentName]?.[key]
      return (globalDefault ?? localDefaults[key]) as T[typeof key]
    })
  }

  return result
}