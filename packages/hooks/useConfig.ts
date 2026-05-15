import { inject, isRef, type Ref } from 'vue'
import { HxConfigKey } from '../components/config-provider/injection'
import type { HxConfig } from '../types/config'

/**
 * 在组件内调用，读取最近的 HxConfigProvider 注入的配置。
 * 若无 Provider 则返回默认值。
 *
 * @returns 响应式的 HxConfig 对象（内部自动解包 ComputedRef）
 */
export function useConfig(): HxConfig {
  const injected = inject(HxConfigKey, getDefaultConfig())
  // 处理 ConfigProvider 可能提供的 ComputedRef
  return isRef(injected) ? injected.value : injected
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
    qrCode: {
      renderMode: 'svg',
      size: 120,
      colorDark: '#000000',
      colorLight: '#ffffff',
      errorCorrectionLevel: 'M',
      margin: 2,
    },
  }
}
