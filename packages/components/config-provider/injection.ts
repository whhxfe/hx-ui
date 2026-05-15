import type { InjectionKey, Ref } from 'vue'
import type { HxConfig } from '../../types/config'

/** App-wide injection key - 支持响应式 ComputedRef */
export const HxConfigKey: InjectionKey<HxConfig | Ref<HxConfig>> = Symbol('hx-config')
