# Hx UI

基于 `Vue 3` + `TypeScript` + `Element Plus` 的业务组件二次封装库。

## 特性

- 基于 Element Plus 组件进行一致性业务封装
- 保留原始 props/事件能力，同时支持业务扩展
- 支持插件方式全局注册与单组件按需使用
- TypeScript 友好

## 安装

```bash
pnpm add @whhx/ui element-plus vue
```

## 快速开始

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

## 文档目录

- `docs/guide/quickstart.md`：快速开始
- `docs/components/button.md`：Button 组件文档
- `docs/guide/wrapper-flow.md`：二次封装组件完整流程

## 开发说明

当前仓库为 workspace 结构：

- `packages`：组件库源码
- `play`：本地示例工程
