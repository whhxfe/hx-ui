/**
 * useComponentConfig
 * 从全局 ConfigProvider 中读取当前组件的默认属性。
 * 当组件自身未传入对应 prop 时，回退到 ConfigProvider 中配置的默认值。
 *
 * @example
 * ```ts
 * const componentDefaults = useComponentConfig('Button', { size: 'default' as const })
 * // componentDefaults.size.value 类型为 'default' | undefined
 * // 优先级：config.componentDefaults.Button?.size > localDefaults.size
 * ```
 */
import { inject, computed, type Ref } from 'vue'
import { HxConfigKey } from '../components/config-provider/injection'

export function useComponentConfig<T extends Record<string, unknown>>(
  componentName: string,
  localDefaults: T,
): { [K in keyof T]: Ref<T[K] | undefined> } {
  const config = inject<{ componentDefaults?: Record<string, Record<string, unknown>> }>(HxConfigKey)

  const result = {} as { [K in keyof T]: Ref<T[K] | undefined> }

  for (const key of Object.keys(localDefaults) as Array<keyof T>) {
    result[key] = computed<T[typeof key] | undefined>(() => {
      const globalDefault = config?.componentDefaults?.[componentName]?.[key as string]
      return (globalDefault ?? localDefaults[key]) as T[typeof key]
    })
  }

  return result
}
