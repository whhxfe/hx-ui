# 组件开发规范

## Props 类型定义

### 避免冗余类型别名

不要为已有基础类型定义冗余的别名：

```typescript
// ❌ 错误 - IconGroup = string 只是 string 的别名，没有增加语义价值
export type IconGroup = string
export interface ImageIconProps {
  group?: IconGroup
}

// ✅ 正确 - 直接使用基础类型
export interface ImageIconProps {
  group?: string
}
```

类型别名仅在以下场景使用：
- 联合类型（如 `type Size = 'small' | 'medium' | 'large'`）
- 复杂对象类型的复用
- 需要导出的接口类型

### Props 命名一致性

相同功能的 prop 在不同组件中必须使用相同的字段名：

| 功能 | 统一字段名 | 说明 |
|------|-----------|------|
| CDN 基础地址 | `cdnBaseUrl` | 所有需要 CDN 的组件统一使用此字段 |
| 图标分组/集合 | `group` | 表示图标所属的集合或分组 |
| 尺寸 | `size` | 统一使用 `string \| number` 类型 |

```typescript
// ✅ 正确 - 统一字段名
export interface ImageIconProps {
  group?: string
  cdnBaseUrl?: string
  size?: string | number
}

// ❌ 错误 - 相同功能不同字段名
export interface ImageIconProps {
  imageType?: string // ❌ 应使用 group
  baseUrl?: string   // ❌ 应使用 cdnBaseUrl
}
```

### Props 类型一致性

相同语义的 prop 在不同组件中必须使用相同的 TypeScript 类型：

```typescript
// ✅ 正确 - 所有组件的 size prop 类型一致
interface ImageIconProps {
  size?: string | number
}
interface SvgIconProps {
  size?: string | number
}

// ❌ 错误 - size 类型不一致
interface ImageIconProps {
  size?: string | number   // ✅
}
interface SvgIconProps {
  size?: number            // ❌
}
```

## Props 文档规范

### JSDoc 注释

为每个 prop 添加 JSDoc 注释，说明其用途和取值：

```typescript
export interface ImageIconProps {
  /**
   * 图标分组/集合名称
   * 对应 config-provider 中 icon.image.groups 的 key
   */
  group?: string

  /** CDN 图标的基础 URL，覆盖 config-provider 中的全局配置 */
  cdnBaseUrl?: string

  /** 图标尺寸，支持数值（px）或 CSS 尺寸字符串 */
  size?: string | number
}
```

### 弃用标记

废弃的 prop 使用 `@deprecated` 标记，并指明替代方案：

```typescript
export interface ImageIconProps {
  /**
   * 图标分组/集合名称
   * @deprecated 请使用 group 替代
   */
  imageType?: string
}
```

## Props 默认值规范

在 `withDefaults` 中为 props 设置合理的默认值：

```typescript
const props = withDefaults(defineProps<ImageIconProps>(), {
  group: undefined,
  cdnBaseUrl: undefined,
  size: undefined,
})
```

- 基础类型（string, number, boolean）提供有意义的默认值而非 `undefined`
- 对象类型使用 `() => ({})` 工厂函数
- 从 config-provider 获取配置的 prop 默认值为 `undefined`，表示使用全局配置

## 组件职责单一原则

每个组件只做一件事，避免职责混杂：

```typescript
// ❌ 错误 - 一个组件处理多种图标类型
<HxIcon type="iconify" name="mdi:home" />
<HxIcon type="svg" name="home" />
<HxIcon type="image" name="logo.png" />

// ✅ 正确 - 各司其职
<IconifyIcon icon="mdi:home" />
<SvgIcon name="home" />
<ImageIcon src="logo.png" />
```

## 导出规范

### Barrel 导出

使用 index.ts 统一导出模块内的所有公开类型和组件：

```typescript
// packages/components/icon/index.ts
export { default as IconifyIcon } from './iconify-icon/IconifyIcon.vue'
export { default as SvgIcon } from './svg-icon/SvgIcon.vue'
export { default as ImageIcon } from './image-icon/ImageIcon.vue'
export { default as BaseIcon } from './base-icon/BaseIcon.vue'
export type { ImageIconProps, BaseIconProps }
```

### 类型导出

- 组件 Props 接口必须从 index.ts 导出，供外部使用
- 仅导出公开的 Props 接口，内部辅助类型不需要导出

## 避免过度抽象

不要为了一时的"通用性"增加不必要的抽象层：

```
// ❌ 错误 - 不必要的抽象
components/icon/
├── base-icon/          # 只有一个子组件使用，不应抽象
├── image-icon/
├── svg-icon/
└── iconify-icon/

// ✅ 正确 - 仅在确有多个组件共享代码时抽象
// （可以使用 composable 替代中间组件层）
```

如果某段逻辑需要被复用，优先使用 composable 而非创建中间组件。