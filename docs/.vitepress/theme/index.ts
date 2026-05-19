import DefaultTheme from 'vitepress/theme'
/** SVG sprite：与 play 使用同一目录与 symbolId（icon-[dir]-[name]） */
import 'virtual:svg-icons-register'
import ElementPlus from 'element-plus'
import { ID_INJECTION_KEY } from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import HxUI from '@hx/ui'
import '@hx/ui/dist/index.css'
import Layout from './Layout.vue'
import DemoBlock from './components/DemoBlock.vue'
import DemoContainer from './components/DemoContainer.vue'
import './style.css'
/** 注册 Iconify 图标集（离线），使 <hx-icon type="iconify"> 可正常渲染 */
// import './iconify'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.provide(ID_INJECTION_KEY, { prefix: 100, current: 0 })
    app.use(ElementPlus, { locale: zhCn })
    app.use(HxUI)
    app.component('DemoBlock', DemoBlock)
    app.component('DemoContainer', DemoContainer)
  },
}
