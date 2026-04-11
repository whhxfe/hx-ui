export { default as HxConfigProvider } from './provider/ConfigProvider.vue'
export { useConfig, HxConfigKey, buildImageSourceMap, registerImageIcon } from './composable'
export type {
  HxConfig,
  HxConfigProviderProps,
  ImageIconSourceItem,
  ImageIconConfig,
} from './types'
