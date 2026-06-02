// 注意：uno.css 由使用方在 uno.config.ts 中配置并在其入口处 import

// 导入主题样式（CSS 变量定义），构建时会提取到 dist/index.css 中
import './theme-chalk/index.scss'

export * from './components'
export { default as HxConfigProvider } from './components/config-provider/index.vue'
export { useConfig } from './hooks/useConfig'
export { useComponentConfig } from './hooks/useComponentConfig'
export { addIconSet } from './utils/offline-icons'
export { registerIconCollection } from './utils/offline-icons'
export { buildImageSourceMap, registerImageIcon } from './utils/image-icon'
export type {
  HxConfig,
  HxConfigProviderProps,
  IconConfig,
  ImageIconConfig,
  ImageIconSourceItem,
  IconifyIconConfig,
  SvgIconConfig,
  ImageProps,
  SvgProps,
  IconifyProps,
  RequestProviderProps,
  ComponentDefaults,
  DateRangeShortcut,
  FormConfig,
} from './types/config'
export { ThemeToggle } from './components/theme-toggle'

// Hooks
export { useTheme } from './hooks'

// 兼容全局注册（HxUI.install 会按需注册 hx-* 标签名）
import {
  HxButton, HxTable, HxIcon, HxLabelText, HxFilePreview,
  HxForm, HxSelect, HxRadio, HxCheckbox, HxRichEditor,
  HxTransfer, HxQrCode, HxInput, HxCascader, HxUpload,
  HxFilterPanel, HxFilterItem, HxFilterDateRange, HxContentText, HxMenu, HxLink, HxText,
  HxUploadFilePreviewList, HxRelationGraph, HxImporter, HxExporter,
} from './components'
import _HxConfigProviderFile from './components/config-provider/index.vue'
import { withInstall } from './utils/install'

const HxConfigProvider = withInstall(_HxConfigProviderFile, 'HxConfigProvider')

const components = [
  HxButton,
  HxTable,
  HxIcon,
  HxLabelText,
  HxFilePreview,
  HxForm,
  HxSelect,
  HxRadio,
  HxCheckbox,
  HxRichEditor,
  HxTransfer,
  HxQrCode,
  HxInput,
  HxCascader,
  HxUpload,
  HxFilterPanel,
  HxFilterItem,
  HxFilterDateRange,
  HxContentText,
  HxMenu,
  HxLink,
  HxText,
  HxUploadFilePreviewList,
  HxRelationGraph,
  HxImporter,
  HxExporter,
]

const HxUI = {
  install(app: any) {
    // ElementPlus 应由消费方自行 app.use(ElementPlus, { locale: zhCn })
    // 组件库不再强制全局注册 ElementPlus
    components.forEach((component) => {
      app.use(component)
    })
    app.use(HxConfigProvider)
  },
}

export default HxUI