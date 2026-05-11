# 贡献指南

## 开发规范

### 1. 组件命名

#### 目录与文件命名
- 组件目录统一使用 **kebab-case**（如 `button/`、`date-picker/`）
- 组件 `.vue` 文件统一使用 **PascalCase**（如 `Button.vue`、`DatePicker.vue`）
- 类型文件统一命名为 **`types.ts`**
- 组件入口文件统一命名为 **`index.ts`**

#### 复合组件命名规范
- 父组件：按功能命名（如 `Form.vue`、`Menu.vue`、`Steps.vue`）
- 子组件：统一使用 **`父名 + Item`** 后缀（如 `MenuItem`、`StepItem`、`BreadcrumbItem`、`DescriptionsItem`、`CollapseItem`、`CarouselItem`、`TabPanel` 统一为 `TabItem`）
- 特例说明：`FormField` 保持现有名称以兼容已有代码，新复合组件统一使用 `XxxItem` 模式

### 2. Props 定义规范

统一使用 `withDefaults(defineProps<Props>(), { ... })` 模式：

```ts
// ✅ 推荐
interface ButtonProps {
  type?: 'primary' | 'default'
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'default',
  size: 'medium',
})
```

```ts
// ❌ 不推荐——默认值分散在 template 中处理
const props = defineProps<{ ... }>()
// template 中用 ?? 兜底
```

### 3. Emit 定义规范

统一使用类型化 `defineEmits`：

```ts
// ✅ 推荐
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}>()
```

```ts
// ❌ 不推荐——字符串数组不提供类型安全
const emit = defineEmits(['update:modelValue', 'change'])
```

### 4. provide / inject 规范

- 必须使用 `InjectionKey` 进行类型化
- Key 统一在 `packages/constants/` 中定义

```ts
// packages/constants/xxx.ts
import type { InjectionKey } from 'vue'
export const MY_KEY: InjectionKey<MyType> = Symbol('MyKey')
```

### 5. 样式规范

- 每个组件在 `packages/theme-chalk/src/` 中有对应的 `.scss` 文件
- 样式类名统一使用 `hx-` 前缀（如 `.hx-button`、`.hx-form`）
- 新增组件后，需要在 `theme-chalk/src/index.scss` 中注册样式导入

### 6. 组件注册

所有组件使用 `withInstall` 工具函数注册：

```ts
import { withInstall } from '../../utils/install'
import _Component from './Component.vue'

export const HxComponent = withInstall(_Component, 'HxComponent')
export default HxComponent
```

### 7. 新增组件步骤

1. 创建组件目录 `packages/components/xxx/`
2. 创建 `Component.vue`、`types.ts`、`index.ts`
3. 在 `packages/theme-chalk/src/` 创建对应样式文件
4. 在 `packages/components/index.ts` 中导出
5. 在 `packages/index.ts` 中导出（如果是顶层组件）
6. 在 `play/src/` 中添加测试示例

### 8. 开发原则

- **配置驱动**：复杂的表单/表格等优先使用 columns 配置而非大量手写模板
- **Element Plus 封装**：在 El-XXX 基础上增强，不重复造轮子
- **类型优先**：所有 Props 必须定义完整的 TypeScript 类型
- **全局配置**：需要感知全局配置的组件，使用 `useConfig` / `useGlobalConfig`