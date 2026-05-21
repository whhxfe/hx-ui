// SVG sprite: inject symbols into DOM (must match createSvgIconsPlugin icon-[dir]-[name])
import 'virtual:svg-icons-register'

import './styles/app-shell.css'

import { createApp } from 'vue'
import 'uno.css'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@hx/ui/dist/index.css'
import App from './App.vue'
import router from './router'
import HxUI from '@hx/ui'

const app = createApp(App)

app.use(router)
app.use(ElementPlus, { locale: zhCn })
app.use(HxUI)
app.mount('#app')
