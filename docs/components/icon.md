# Icon 图标

一个功能强大、灵活的图标组件，支持 SVG、Image、Iconify 等多种图标类型。

### 基本用法

通过统一组件 `HxIcon`，使用 `type` 和 `name` 属性即可展示图标。

:::demo 展示图标的基本用法
icon/basic
:::

## SVG 图标

SVG 图标使用本地 SVG sprite，通过 `vite-plugin-svg-icons` 插件注册。SVG 文件存放在 `src/assets/svg/` 目录下。

### 单色模式（mono）

使用 `currentColor` 填充，可通过 `color` 属性设置颜色。

:::demo SVG 图标单色模式
icon/svg-local
:::

### mode 属性

| 属性值 | 说明 |
| --- | --- |
| `mono`（默认） | 单色模式，使用 `currentColor` 填充，`color` 属性生效 |
| `multi` | 多色模式，保留 SVG 原始填充色，`color` 属性失效 |

### SVG 翻转与旋转

SVG 图标支持 `flip` 和 `rotate` 属性。`flip` 支持水平、垂直或双向翻转；`rotate` 支持 0~360 度旋转。

:::demo SVG 图标的翻转与旋转
icon/svg
:::

### 工作原理

SVG 文件放在 `src/assets/svg/mono/` 或 `src/assets/svg/multi/` 目录下，通过 `vite-plugin-svg-icons` 注册为 SVG sprite。组件使用 `<use>` 引用，symbol ID 格式为 `icon-{dir}-{name}`。

### 引入 SVG sprite

在项目入口文件中引入 SVG sprite 注册：

```ts
import 'virtual:svg-icons-register'
```

### Vite 配置

确保 `vite.config.ts` 中的 `symbolId` 与组件配置一致：

```ts
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default defineConfig({
  plugins: [
    createSvgIconsPlugin({
      iconDirs: [resolve(__dirname, 'src/assets/svg')],
      symbolId: 'icon-[dir]-[name]',  // 与组件默认格式一致
    }),
  ],
})
```

---

## Image 图标

Image 图标用于加载图片资源，支持本地 glob 和 CDN 两种模式。

### 本地图片

通过 `import.meta.glob` 加载本地图片资源，存放在 `@/assets/icons/{group}/` 目录下。

:::demo Image 图标本地模式
icon/image-local
:::

### CDN 模式

通过 `cdnBaseUrl` 配置 CDN 地址，组件按 `{cdnBaseUrl}/{group}/{name}.{ext}` 规则拼接 URL。

:::demo Image 图标 CDN 模式
icon/image-cdn
:::

### source 属性

通过 `source` 属性控制资源加载策略，优先级为：**组件 props > 全局配置 > 默认值**。

| source 值 | 行为描述 |
| --- | --- |
| `auto`（默认） | 优先使用 CDN 地址（cdnBaseUrl 有配置就用），无配置则 fallback 到本地 glob 资源 |
| `local` | 始终使用本地 glob 资源，忽略 CDN 配置 |
| `cdn` | 始终使用 CDN 地址（cdnBaseUrl 必须有配置，否则返回空） |

### alt 属性

Image 图标支持 `alt` 属性设置图片描述文字，用于无障碍访问。当图片加载失败时，组件会自动显示一个 SVG 错误图标作为 fallback 回退。

```vue
<!-- 设置图片描述 -->
<hx-icon type="image" group="app" name="qq" alt="QQ 图标" />

<!-- 图片加载失败时显示 fallback 错误图标 -->
<hx-icon type="image" group="app" name="non-existent" size="32px" />
```

> 加载失败时，组件内部会将 `alt` 用于 `<img>` 的 `alt` 属性，同时隐藏占位符 `aria-hidden="true"`，避免屏幕阅读器重复朗读。

### className 属性

Image 和 Iconify 图标支持 `className` 属性添加自定义 CSS 类名：

```vue
<hx-icon type="image" group="app" name="qq" class-name="custom-icon" />
<hx-icon type="iconify" name="ep:star" class-name="highlight-icon" />
```

### 配置图片资源

在应用入口中配置本地图片 glob：

```ts
import { buildImageSourceMap, registerImageIcon } from '@hx/ui'

// 方式一：使用 glob 自动构建
const imageIconModules = import.meta.glob('@/assets/icons/**/*', { eager: true })
const sourceMap = buildImageSourceMap([imageIconModules])

// 方式二：手动注册单个图片
registerImageIcon(sourceMap, 'app', 'qq', {
  url: '/icons/app/qq.png',
  ext: 'png',
})
```

---

## Iconify 图标

Iconify 图标提供海量图标库支持，格式为 `{prefix}:{name}`（如 `ep:edit`、`mdi:home`）。

### 离线模式

使用本地 `@iconify/json` 包中的图标集，无需网络请求。

:::demo Iconify 图标离线模式
icon/iconify-local
:::

### CDN 模式

通过 CDN API 获取图标数据，支持更多图标集。

:::demo Iconify 图标 CDN 模式
icon/iconify-cdn
:::

### 安装依赖

```bash
# 安装 Iconify Vue 组件库
pnpm add @iconify/vue

# 安装 Iconify 图标集（按需安装，减小包体积）
pnpm add -D @iconify/json
```

### 内置图标集

组件内置支持以下图标集的离线模式：

| 图标集 | 前缀 | 示例 |
| --- | --- | --- |
| Element Plus | `ep` | `ep:edit`、`ep:delete` |
| MDI | `mdi` | `mdi:home`、`mdi:account` |
| Tabler | `tabler` | `tabler:user`、`tabler:settings` |
| Lucide | `lucide` | `lucide:home`、`lucide:heart` |
| Carbon | `carbon` | `carbon:settings`、`carbon:document` |
| Bootstrap Icons | `bi` | `bi:alarm`、`bi:book` |
| Logos | `logos` | `logos:vue`、`logos:react` |
| Twemoji | `twemoji` | `twemoji:smile`、`twemoji:heart` |
| Streamline Logos | `streamline-logos` | `streamline-logos:amazon-aws` |

### 扩展离线图标集

如果你需要使用不在内置列表中的图标集（如 `fa-solid`、`ic` 等），可以手动调用 `addCollection` 注册：

```ts
import { addCollection } from '@iconify/vue'
import 'virtual:svg-icons-register'

// 以 Font Awesome Solid 为例，需要先安装 @iconify/json
// pnpm add -D @iconify/json

// 然后导入并注册
import(/* @vite-ignore */ '@iconify/json/json/fa-solid.json').then((module) => {
  addCollection(module.default || module)
})
```

注册完成后，即可直接在组件中使用：

```vue
<hx-icon type="iconify" name="fa-solid:user" size="24px" />
```

> 建议在应用入口文件（如 `main.ts`）中统一完成离线图标集的注册，避免在组件中重复注册。

### CDN 配置

在 `HxConfigProvider` 中配置 Iconify CDN：

```vue
<template>
  <HxConfigProvider
    :icon="{
      iconifyIcon: {
        source: { source: 'cdn', cdnUrl: 'http://localhost:3333' }
      }
    }"
  >
    <App />
  </HxConfigProvider>
</template>
```

---

## 通用属性

以下属性在不同图标类型中通用：

| 属性 | 说明 | 类型 | 默认值 | 生效范围 |
| --- | --- | --- | --- | --- |
| size | 图标尺寸 | `number \| string` | `16`（Iconify）/ `1em`（SVG/Image） | 全部类型 |
| color | 图标颜色 | `string` | `'currentColor'` | SVG mono、Iconify |
| rotate | 旋转角度（度） | `number` | `0` | SVG 专属 |
| flip | 翻转方向 | `'horizontal' \| 'vertical' \| 'both'` | `undefined` | SVG 专属 |
| inline | 行内渲染模式 | `boolean` | `false` | Iconify 专属 |
| className | 自定义样式类名 | `string` | `''` | Image、Iconify |
| alt | 图标描述（无障碍） | `string` | `''` | Image 专属 |

> **提示**：`rotate`、`flip`、`inline` 等属性虽为特定类型专属，但通过组件透传机制在其他类型上也可使用，只是效果可能不同。

### 颜色

:::demo 使用 color 属性设置图标颜色
icon/color
:::

### 旋转

:::demo 使用 rotate 属性旋转图标
icon/rotate
:::

### 翻转

:::demo 使用 flip 属性翻转图标
icon/flip
:::

### 行内渲染

:::demo 使用 inline 属性控制图标在文本中的对齐方式
icon/inline
:::


## 统一图标组件

除了使用 `SvgIcon`、`ImageIcon`、`IconifyIcon` 单独组件外，还可以通过统一的 `HxIcon` 组件配合 `type` 属性切换：

```vue
<!-- SVG 图标 -->
<hx-icon type="svg" name="home" color="#1890ff" />

<!-- Image 图标 -->
<hx-icon type="image" name="qq" group="app" :size="32" />

<!-- Iconify 图标 -->
<hx-icon type="iconify" name="ep:edit" :size="20" />
```

### HxIcon Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 图标类型 | `'svg' \| 'iconify' \| 'image'` | `'svg'` |
| name | 图标名称 | `string` | `'default'` |
| mode | SVG 图标模式 | `'mono' \| 'multi'` | `'mono'` |
| group | 图标分组（Image 图标） | `string` | - |
| cdnBaseUrl | CDN 资源地址（Image 图标） | `string` | `''` |
| ext | 图片扩展名（Image 图标） | `string` | `'png'` |
| source | 资源来源模式（Image 图标） | `'auto' \| 'local' \| 'cdn'` | `'auto'` |

---

## 按钮结合图标

图标可以与按钮等组件结合使用。

:::demo 将图标与按钮组件结合使用
icon/button
:::

---

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

### 引入方式

```ts
// 全量引入
import { HxIcon } from '@hx/ui'

// 按需引入子组件
import { SvgIcon, IconifyIcon, ImageIcon } from '@hx/ui'
```
