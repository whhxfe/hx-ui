# Icon 图标

一个功能强大、灵活的图标组件，支持 SVG、Image、Iconify 等多种图标类型。

## 安装

### Iconify 图标依赖

Iconify 图标使用 `@iconify/vue/offline` 从本地 `@iconify/json` 包获取图标数据，无需 CDN。

```bash
# 安装 Iconify Vue 组件库
pnpm add @iconify/vue

# 安装 Iconify 图标集（按需安装）
pnpm add -D @iconify/json
```

## 基础用法

使用 `name` 属性指定图标名称，图标类型默认为 SVG。

:::demo 通过 name 属性指定图标名称。
icon/basic
:::

## SVG 图标

SVG 图标支持两种模式：

- **单色 mono（默认）**：使用 `color` 属性设置颜色，图标使用 `currentColor` 填充
- **多色 multi**：保留 SVG 原始填充色，`color` 属性失效

:::demo 使用 mode 属性切换 SVG 图标模式（mono / multi），type="svg" 时生效。
icon/svg
:::

## Iconify 图标

使用 `type="iconify"` 切换到 Iconify 图标模式，格式为 `collection:name`（如 `ep:add-circle`）。

Iconify 图标数据完全来自本地 `@iconify/json` 包，无需任何额外配置。

:::demo 使用 type="iconify" 渲染 Iconify 图标。
icon/iconify
:::

## Image 图标

使用 `type="image"` 加载图片图标。

Image 图标支持两种资源挂载方式：**本地 glob 模式（默认）** 和 **CDN 模式**。通过 `source` 属性切换：

:::demo 使用 type="image" 加载图片图标。
icon/image
:::

## Image 图标 — CDN 模式

使用 `cdnBaseUrl` 加载 CDN 图片，组件按 `{cdnBaseUrl}/{group}/{name}.{ext}` 规则拼接 URL：

:::demo CDN 模式：全局配置、props 覆盖、强制本地三种场景示例。
icon/cdn
:::

### 概念说明

CDN 模式通过 `cdnBaseUrl` 指定图片服务器地址，组件按以下规则动态拼接 URL：

```
{cdnBaseUrl}/{group}/{name}.{ext}
```

### source 资源来源

通过 `source` 属性控制资源加载策略，优先级为：**组件 props > 全局配置 > 默认值**。

| source 值 | 行为描述 |
| --- | --- |
| `'auto'`（默认） | 优先使用 CDN 地址（cdnBaseUrl 有配置就用），无配置则 fallback 到本地 glob 资源 |
| `'local'` | 始终使用本地 glob 资源，忽略 CDN 配置 |
| `'cdn'` | 始终使用 CDN 地址（cdnBaseUrl 必须有配置，否则返回空） |

### 全局配置

在 `HxConfigProvider` 中统一配置 CDN 相关参数：

```vue
<template>
  <HxConfigProvider
    :icon="{
      imageIconModules: [imageIconModules],
      cdnBaseUrl: 'https://cdn.example.com/icons',
      source: 'auto'
    }"
  >
    <App />
  </HxConfigProvider>
</template>

<script setup lang="ts">
/** 本地 glob 资源（构建时打包） */
const imageIconModules = import.meta.glob('@/assets/icons/**/*', { eager: true })
</script>
```

### 组件级别覆盖

props 传入的配置优先级高于全局配置，可按需覆盖：

```vue
<!-- 使用 CDN（走全局 cdnBaseUrl） -->
<hx-icon type="image" group="app" name="alipay" source="cdn" />

<!-- 使用本地 glob（忽略全局 CDN 配置） -->
<hx-icon type="image" group="app" name="alipay" source="local" />

<!-- 使用 CDN 并指定单独的 CDN 地址（优先级最高） -->
<hx-icon
  type="image"
  group="gif"
  name="1"
  source="cdn"
  cdn-base-url="https://cdn2.example.com/icons"
  ext="gif"
/>
```

::: tip 资源来源选择建议

- **静态资源平台（图片已打包上传 CDN）**：使用 `source="cdn"`，配合全局 `cdnBaseUrl`
- **开发环境 / 本地测试**：使用 `source="local"`，使用本地 glob 资源
- **线上优先、本地兜底**：使用 `source="auto"`（默认行为）

:::

## 尺寸

使用 `size` 属性设置图标尺寸，支持像素值和 CSS 单位。

:::demo 使用 size 属性设置不同尺寸的图标。
icon/size
:::

## 颜色

使用 `color` 属性设置图标颜色（SVG 和 Iconify 图标）。

:::demo 使用 color 属性设置图标颜色。
icon/color
:::

## 旋转

使用 `rotate` 属性设置图标的旋转角度。

:::demo 使用 rotate 属性旋转图标。
icon/rotate
:::

## 翻转

使用 `flip` 属性设置图标的翻转方向。

:::demo 使用 flip 属性翻转图标。
icon/flip
:::

## 按钮结合图标

图标可以与按钮等组件结合使用。

:::demo 将图标与按钮组件结合使用。
icon/button
:::

## SVG 图标注册（业务项目）

使用 **vite-plugin-svg-icons** 时，在入口引入 `import 'virtual:svg-icons-register'`，并在 Vite 中配置与组件一致的 `symbolId`（本库默认为 `icon-[dir]-[name]`，对应子目录 `mono` / `multi` 与文件名）。

## API

### HxConfigProvider — Icon 配置

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `icon.imageIconModules` | 本地图片 glob 模块列表（`import.meta.glob` 结果） | `Record<string, { default: string }>[]` | `[]` |
| `icon.cdnBaseUrl` | CDN 基础地址 | `string` | `''` |
| `icon.source` | 资源来源模式：`'auto' \| 'local' \| 'cdn'` | `'auto' \| 'local' \| 'cdn'` | `'auto'` |

### HxIcon Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 图标类型 | `'svg' \| 'iconify' \| 'image'` | `'svg'` |
| name | 图标名称 | `string` | `'default'` |
| size | 图标尺寸 | `number \| string` | `'1em'` |
| color | 图标颜色 | `string` | `'currentColor'` |
| rotate | 旋转角度（度） | `number` | `0` |
| flip | 翻转方向 | `'horizontal' \| 'vertical' \| 'both'` | `undefined` |
| mode | SVG 图标模式：`'mono'` 单色（使用 currentColor），`'multi'` 多色（保留原始填充色） | `'mono' \| 'multi'` | `'mono'` |
| group | 图标分组（仅 Image 模式生效），对应 `@/assets/icons/{group}/` 下的子目录名 | `string` | `'mono'` |
| cdnBaseUrl | CDN 资源地址（Image 图标，优先级高于全局配置） | `string` | `''` |
| baseUrl | `cdnBaseUrl` 的别名 | `string` | `''` |
| ext | 图片扩展名（Image 图标） | `string` | `'png'` |
| source | 资源来源模式（Image 图标）：`'auto' \| 'local' \| 'cdn'` | `'auto' \| 'local' \| 'cdn'` | `'auto'` |
| inline | Iconify 行内渲染模式 | `boolean` | `false` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| default | 图标内容（可用于自定义图标） |

### 引入方式

```ts
// 全量引入
import { HxIcon } from '@hx/ui'

// 按需引入子组件
import { SvgIcon, IconifyIcon, ImageIcon } from '@hx/ui'
```

## 类型定义

```ts
import type {
  IconType,
  IconProps,
  SvgIconProps,
  IconifyIconProps,
  ImageIconProps,
  FlipDirection,
} from '@hx/ui'
```
