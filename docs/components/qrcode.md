# QrCode 二维码

基于 `qrcode` 库封装的 Vue 3 二维码组件，支持 SVG / Canvas 两种渲染模式，可配置前景/背景色、纠错等级、Logo 等。

## 安装

### 依赖

```bash
pnpm add qrcode @types/qrcode
```

## 基础用法

:::demo 通过 `value` 属性指定二维码内容。
qrcode/basic
:::

## 自定义配置

调整尺寸、背景色、前景色等参数。

:::demo 通过 props 自定义二维码外观与下载行为。
qrcode/custom
:::

## 动态内容

实时响应输入内容变化，支持防抖处理。

:::demo 输入框内容变化后，300ms 防抖延迟更新二维码。
qrcode/dynamic
:::

## Logo

支持在二维码中心展示 Logo，自动添加白色背景。

:::demo 通过 `logo` 属性配置 Logo 图片。
qrcode/logo
:::

> Logo 与纠错等级 `L` 不兼容，请使用 `M` 及以上等级。

## 全局配置

可通过 `HxConfigProvider` 在应用顶层统一配置二维码默认值：

```vue
<template>
  <HxConfigProvider :qrCode="{ size: 200, colorDark: '#333333' }">
    <App />
  </HxConfigProvider>
</template>
```

## 渲染模式

| 模式 | 说明 | 适用场景 |
| --- | --- | --- |
| `svg`（默认） | 生成 SVG，缩放无损、CSS 可控 | 高清展示、主题适配 |
| `canvas` | 生成 Canvas，下载更直接 | 打印、直接保存 |

## 纠错等级

纠错等级越高，二维码可被遮挡的面积越大，但会导致码图变密。

| 等级 | 可纠错比例 | 说明 |
| --- | --- | --- |
| `L` | 7% | 低纠错，码图最简 |
| `M`（默认） | 15% | 中等纠错 |
| `Q` | 25% | 较高纠错 |
| `H` | 30% | 高纠错，码图最密 |

> Logo 与纠错等级 `L` 不兼容，请使用 `M` 及以上等级。

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 二维码内容（URL 或任意文本） | `string` | — |
| renderMode | 渲染方式 | `'svg' \| 'canvas'` | `'svg'` 或 ConfigProvider 配置 |
| size | 二维码尺寸（宽高） | `number \| string` | `120` 或 ConfigProvider 配置 |
| colorDark | 前景色（深色模块颜色） | `string` | `'#000000'` 或 ConfigProvider 配置 |
| colorLight | 背景色 | `string` | `'#ffffff'` 或 ConfigProvider 配置 |
| errorCorrectionLevel | 纠错等级 | `'L' \| 'M' \| 'Q' \| 'H'` | `'M'` 或 ConfigProvider 配置 |
| margin | 周围留白（单位 px） | `number` | `2` 或 ConfigProvider 配置 |
| showDownload | 是否显示下载按钮 | `boolean` | `true` |
| downloadText | 下载按钮文案 | `string` | `'下载二维码'` |
| downloadFileName | 下载文件名（不含扩展名） | `string` | `'qrcode'` |
| downloadIcon | 下载按钮图标组件 | `Component` | `Download` |
| logo | Logo 配置 | `QrCodeLogo` | `undefined` |
| style | 自定义样式 | `Record<string, string>` | `{}` |

### QrCodeLogo

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| url | Logo 图片 URL | `string` | — |
| width | Logo 宽度（px） | `number` | `40` |
| height | Logo 高度（px） | `number` | `40` |
| offsetX | Logo 距中心的水平偏移（px） | `number` | `0` |
| offsetY | Logo 距中心的垂直偏移（px） | `number` | `0` |

### Expose

| 方法 | 说明 | 参数 | 返回值 |
| --- | --- | --- | --- |
| regenerate | 重新生成二维码 | — | `Promise<void>` |

### 类型定义

```ts
import type { QrCodeProps, QrCodeLogo, QrCodeRenderMode, QrCodeErrorCorrectionLevel } from '@whhx/ui'
```
