// SVG sprite: inject symbols into DOM (must match createSvgIconsPlugin icon-[dir]-[name])
import 'virtual:svg-icons-register'

import './styles/app-shell.css'

import './register-icons'

import { createApp } from 'vue'
import 'uno.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@hx/ui/index.css'
import App from './App.vue'
import router from './router'
import HxUI from '@hx/ui'

const app = createApp(App)

app.use(router)
app.use(ElementPlus)
app.use(HxUI)
app.mount('#app')
