# 快速开始

## 安装

```bash
pnpm add @hx/ui element-plus vue
```

## 全量引入

```ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@hx/ui/index.css'
import HxUI from '@hx/ui'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
app.use(HxUI)
app.mount('#app')
```

> 样式与 JS 分离打包，**必须**引入 `@hx/ui/style.css`（或等价路径 `import '@hx/ui/dist/ui.css'`），否则 Transfer、Form 等自定义布局组件会没有样式。

## 按需引入

```ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@hx/ui/index.css'
import { Button } from '@hx/ui'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
app.use(Button)
app.mount('#app')
```

## 开发调试

```bash
pnpm --dir play dev
```

## 构建验证

```bash
pnpm --dir play build
```
