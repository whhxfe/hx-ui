# 快速开始

## 安装

```bash
pnpm add @whhx/ui element-plus vue
```

## 使用

### 全量引入

```ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@whhx/ui/index.css'
import HxUI from '@whhx/ui'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
app.use(HxUI)
app.mount('#app')
```

### 按需引入

```ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@whhx/ui/index.css'
import { Button } from '@whhx/ui'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
app.use(Button)
app.mount('#app')
```

> 样式与 JS 分离打包，**必须**引入 `@whhx/ui/index.css`，否则 Transfer、Form 等自定义布局组件会没有样式。

## 开发调试

```bash
pnpm --dir play dev
```

## 构建验证

```bash
pnpm --dir play build