// SVG sprite: inject symbols into DOM (must match createSvgIconsPlugin icon-[dir]-[name])
import 'virtual:svg-icons-register'

import './styles/app-shell.css'

import { createApp } from 'vue'
import 'uno.css'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@whhx/ui/dist/index.css'
import App from './App.vue'
import router from './router'
import HxUI from '@whhx/ui'
import * as dayjs from "dayjs"
import isLeapYear from "dayjs/plugin/isLeapYear.js" // 导入插件
import "dayjs/locale/zh-cn" // 导入本地化语言

dayjs.extend(isLeapYear) // 使用插件
dayjs.locale("zh-cn") // 使用本地化语言
// import "dayjs/locale/zh-cn";
const app = createApp(App)

app.use(router)
app.use(ElementPlus, { locale: zhCn })
app.use(HxUI)
app.mount('#app')
