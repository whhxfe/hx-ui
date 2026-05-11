# 二次封装组件流程

本文档描述在 `@hx/ui` 中创建二次封装组件的标准流程。

> 详细开发规范请参阅根目录下的 [CONTRIBUTING.md](../../CONTRIBUTING.md)。

## 组件列表

| 组件 | 说明 |
|------|------|
| `HxButton` | 按钮，基于 el-button |
| `HxTable` | 表格，基于 el-table |
| `HxForm / DynamicForm` | 动态表单 |
| `HxSelect` | 选择器，基于 el-select |
| `HxInput` | 输入框，基于 el-input |
| `HxCascader` | 级联选择器 |
| `HxIcon / SvgIcon / ImageIcon / IconifyIcon` | 图标组件 |
| `HxLabelText` | 标签文本 |
| `HxFilePreview` | 文件预览 |
| `HxRadio` | 单选框组，基于 el-radio-group |
| `HxCheckbox` | 多选框组，基于 el-checkbox-group |
| `HxRichEditor` | 富文本编辑器 |
| `HxQuickDateButton` | 快捷日期按钮 |
| `HxTransfer` | 穿梭框 |
| `HxQrCode` | 二维码 |
| `HxFilterPanel` | 筛选面板 |
| `HxContentText` | 内容文本 |
| `HxMenu / HxMenuItem` | 菜单 |
| `HxLink` | 链接 |
| `HxText` | 文本 |

## 创建步骤概要

### 1. 创建组件目录

```
packages/components/
├── button/
│   ├── Button.vue          # 组件本体
│   ├── types.ts            # 类型定义
│   └── index.ts            # 组件导出（含 withInstall 注册）
└── ...
```

### 2. 编写组件（Button.vue）

- 使用 `defineOptions({ name: 'HxButton' })` 定义组件名
- 使用 `defineProps<Props>()` 声明 Props
- 通过 `useAttrs()` 透传原生 Attributes
- 使用 `defineEmits` 声明事件

```vue
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

const buttonBindProps = computed(() => ({ ...props, ...attrs }))
</script>
```

### 3. 类型定义（types.ts）

```ts
// 直接复用 Element Plus 类型
export type { ButtonProps } from 'element-plus'

// 或按需扩展
import type { ButtonProps as ElButtonProps } from 'element-plus'
export interface ButtonProps extends ElButtonProps {
  customProp?: string // 业务扩展
}
```

### 4. 导出注册（index.ts）

```ts
import { withInstall } from '../../utils/install'
import _Button from './Button.vue'

export const HxButton = withInstall(_Button, 'HxButton')
export default HxButton
export type { ButtonProps } from './types'
```

### 5. 聚合导出

在 `packages/components/index.ts` 中汇总导出：

```ts
export { HxButton } from './button'
// ...
```

### 6. 全局注册

在 `packages/index.ts` 的 components 数组中添加：

```ts
const components = [HxButton, HxTable, /* ... */]
```

## 业务项目使用

```ts
// 全量引入
import HxUI from '@hx/ui'
app.use(ElementPlus)
app.use(HxUI)

// 按需引入
import { HxButton } from '@hx/ui'
app.use(HxButton)
```

> **注意**：样式与 JS 分离打包，必须引入 `@hx/ui/index.css`。

## 开发调试

```bash
pnpm --dir play dev