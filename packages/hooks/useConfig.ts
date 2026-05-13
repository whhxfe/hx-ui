import { inject } from 'vue'
import { HxConfigKey } from '../components/config-provider/injection'
import type { HxConfig } from '../types/config'

/**
 * 在组件内调用，读取最近的 HxConfigProvider 注入的配置。
 * 若无 Provider 则返回默认值。
 */
export function useConfig(): HxConfig {
  const config = inject(HxConfigKey, getDefaultConfig())
  return config
}

// ---------- default config ----------

function getDefaultConfig(): HxConfig {
  return {
    svgIcon: {
      symbolPrefix: 'icon',
    },
    imageIcon: {
      cdnBaseUrl: '',
      source: 'auto',
      sourceMap: {},
      groups: [],
      defaultGroup: 'title',
    },
    iconifyIcon: {
      source: { source: 'offline', cdnUrl: undefined },
      offlineCollections: [],
    },
  }
}
