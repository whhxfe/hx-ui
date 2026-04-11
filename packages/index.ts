// 注意：uno.css 由使用方在 uno.config.ts 中配置并在其入口处 import
export * from './components'
export { HxConfigProvider } from './config'

// 兼容全局注册（HxUI.install 会按需注册 hx-* 标签名）
import { HxButton, HxTable, HxIcon, HxLabelText, HxFilePreview, HxForm, HxSelect, HxRadio, HxCheckbox, HxRichEditor, HxTransfer, HxQrCode } from './components'
import { HxConfigProvider as _HxConfigProvider } from './config'
import { withInstall } from './utils/install'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const HxConfigProvider = withInstall(_HxConfigProvider, 'HxConfigProvider')

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
]

const HxUI = {
  install(app: any) {
    app.use(ElementPlus, { locale: zhCn })
    components.forEach((component) => {
      app.use(component)
    })
    app.use(HxConfigProvider)
  },
}

export default HxUI
