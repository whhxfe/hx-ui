import type { InjectionKey } from 'vue'
import type { HxConfig } from '../../types/config'

/** App-wide injection key */
export const HxConfigKey: InjectionKey<HxConfig> = Symbol('hx-config')
