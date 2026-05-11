export { default as HxConfigProvider } from './provider/ConfigProvider.vue'
export {
  useConfig,
  HxConfigKey,
  buildImageSourceMap,
  registerImageIcon,
} from './composable'
export { useComponentConfig } from './useComponentConfig'
export {
  registerOfflineCollections,
  type IconifyCollectionName,
} from './offline-icons'
export type { RequestProviderProps } from './types'
export {
  request,
  get,
  post,
  getRequest,
  setRequestInstance,
  getRequestOptions,
  setRequestOptions,
} from '../utils/request'
export type { RequestConfig, RequestInstance, RequestOptions } from '../utils/request'
