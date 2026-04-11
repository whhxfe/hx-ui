# 二次封装组件流程（以 HxButton 为例）

本文档描述了在 `@hx/ui` 中创建二次封装组件的标准流程。目标是：

1. 继承 Element Plus 组件能力
2. 增加业务属性或事件
3. 支持全局注册和按需引入
4. 在业务项目中稳定使用

## 组件列表

当前已有的组件：

| 组件 | 说明 |
|------|------|
| `HxButton` | 按钮，基于 el-button |
| `HxTable` | 表格，基于 el-table |
| `HxIcon / SvgIcon / ImageIcon / IconifyIcon` | 图标组件 |
| `HxLabelText` | 标签文本组件 |
| `HxFilePreview` | 文件预览组件 |
| `HxForm / DynamicForm` | 动态表单组件 |
| `HxSelect` | 选择器，基于 el-select |
| `HxRadio` | 单选框组，基于 el-radio-group |
| `HxCheckbox` | 多选框组，基于 el-checkbox-group |
| `HxRichEditor` | 富文本编辑器 |
| `HxQuickDateButton` | 快捷日期按钮 |
| `HxInput` | 输入框，基于 el-input |
| `HxCascader` | 级联选择器 |
| `HxTransfer` | 穿梭框组件 |
| `HxQrCode` | 二维码组件 |
| `HxFilterPanel` | 筛选面板组件 |
| `HxContentText` | 内容文本组件 |
| `HxMenu / HxMenuItem` | 菜单组件 |
| `HxLink` | 链接组件 |
| `HxText` | 文本组件 |

---

## 1. 组件目录结构

```
packages/components/
├── button/
│   ├── Button.vue          # 组件本体
│   ├── types.ts             # 类型定义
│   └── index.ts             # 组件导出
├── table/
│   ├── Table.vue
│   ├── ColumnItem.vue
│   ├── types.ts
│   └── index.ts
└── ...
```

---

## 2. 编写组件本体

文件：`packages/components/button/Button.vue`

关键点：

- 使用 `defineOptions({ name: 'HxButton' })` 定义组件名称
- 使用 `defineProps<ButtonProps>()` 定义 Props
- 通过 `useAttrs()` 获取透传的 Attributes
- 使用计算属性合并 Props 和 Attributes

```vue
<!--
  HxButton - 基于 Element Plus el-button 的按钮组件
-->
<template>
  <el-button v-bind="buttonBindProps">
    <slot />
  </el-button>
</template>

<script lang="ts" setup>
import { computed, useAttrs } from 'vue'
import type { ButtonProps } from './types'

defineOptions({ name: 'HxButton' })

const props = defineProps<ButtonProps>()

const attrs = useAttrs()

const buttonBindProps = computed(() => ({
  ...props,
  ...attrs,
}))
</script>
```

---

## 3. 类型定义

文件：`packages/components/button/types.ts`

```ts
export type { ButtonProps } from 'element-plus'
```

类型定义可以直接复用 Element Plus 的类型，也可以自定义扩展：

```ts
// 如果需要扩展自定义类型
import type { ButtonProps as ElButtonProps } from 'element-plus'

export interface ButtonProps extends ElButtonProps {
  // 自定义业务属性
  customProp?: string
}
```

---

## 4. withInstall 工具函数

文件：`packages/utils/install.ts`

目的：让组件可以通过 `app.use(HxButton)` 进行安装。

```ts
import type { App, Plugin } from 'vue'

type SFCWithInstall<T> = T & Plugin

export const withInstall = <T>(component: T, name?: string): SFCWithInstall<T> => {
  const c = component as SFCWithInstall<T> & { name?: string }

  c.install = (app: App) => {
    const componentName = name ?? c.name
    if (!componentName) return
    app.component(componentName, c as unknown as Record<string, unknown>)
  }

  return c
}
```

---

## 5. 组件级导出

文件：`packages/components/button/index.ts`

```ts
import { withInstall } from '../../utils/install'
import _Button from './Button.vue'

export const HxButton = withInstall(_Button, 'HxButton')
export default HxButton

export type { ButtonProps } from './types'
```

关键点：

- 使用 `withInstall` 包装组件
- 传入第二个参数指定注册的组件名称
- 同时导出 `export default` 和命名导出 `export`
- 导出类型定义供外部使用

---

## 6. 聚合导出

文件：`packages/components/index.ts`

汇总导出所有组件及其类型：

```ts
export { HxButton } from './button'
export { HxTable } from './table'
export type { TableColumn } from './table'
export { HxIcon, SvgIcon, ImageIcon, IconifyIcon } from './icon'
// ... 其他组件
```

---

## 7. 库入口导出

文件：`packages/index.ts`

目的：同时支持两种接入方式：

- `app.use(HxUI)`：全量注册
- `import { HxButton } from '@hx/ui'`：按需引入

```ts
// 导出所有组件和类型
export * from './components'
export { HxConfigProvider } from './config'

// 全局注册
import { HxButton, HxTable, HxIcon, /* ... */ } from './components'
import { withInstall } from './utils/install'

const components = [
  HxButton,
  HxTable,
  HxIcon,
  // ... 其他需要全局注册的组件
]

const HxUI = {
  install(app: any) {
    components.forEach((component) => {
      app.use(component)
    })
  },
}

export default HxUI
```

---

## 8. 配置包入口

文件：`packages/package.json`

确保 workspace 内引用时可以被正确解析：

```json
{
  "name": "@hx/ui",
  "version": "0.0.1",
  "main": "dist/index.es.js",
  "module": "dist/index.es.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.es.js",
      "default": "./dist/index.es.js"
    },
    "./index.css": "./dist/index.css",
    "./dist/index.css": "./dist/index.css"
  },
  "sideEffects": [
    "**/*.css",
    "**/*.scss",
    "**/*.vue"
  ]
}
```

---

## 9. 业务项目使用示例

### 全量引入

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

### 按需引入

```ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@hx/ui/index.css'
import { HxButton } from '@hx/ui'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
app.use(HxButton)
app.mount('#app')
```

> **注意**：样式与 JS 分离打包，**必须**引入 `@hx/ui/index.css`（或等价路径 `import '@hx/ui/dist/index.css'`），否则 Transfer、Form 等自定义布局组件会没有样式。

---

## 10. 开发调试

```bash
# 进入 play 目录启动开发服务器
pnpm --dir play dev
```

---

## 11. 常见问题

### 找不到模块 `@hx/ui`

- 检查 `packages/package.json` 的 `main/module/types/exports` 配置
- 检查根目录 `pnpm-workspace.yaml` 是否包含 `packages/*`
- 确保已运行 `pnpm install` 安装依赖

### `Plugin` 类型不兼容

- 常见于依赖重复安装导致的 Vue 类型冲突
- 统一 Vue 版本，或在库入口使用更宽松的 `install` 签名

### 样式预处理器报错

- 若使用 `lang="scss"`，需要安装 `sass-embedded` 或 `sass`
- 不需要 SCSS 时可改为普通 `<style>`

### 组件未注册

- 检查组件是否在 `packages/index.ts` 的 `components` 数组中
- 全局注册后才能使用 `<hx-xxx>` 标签名

### Props 类型不生效

- 确保类型定义文件已正确导出
- 重新构建 `pnpm build` 生成 `dist` 目录
