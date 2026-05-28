# MapMarkers 标记点

地图标记点组件，用于在地图上渲染多个点位。

## 基本用法

将 `HxMapMarkers` 嵌套在 `HxMap` 内使用，通过 `markers` 属性传入点位数据。默认使用 `circle`（圆形）形状渲染。

:::demo 基础标记点
map-markers/basic
:::

:::demo 建筑类型点位展示
map-markers/building-types
:::

---

## 样式配置

通过 `markerStyle` 属性配置标记点的默认样式。

### 形状（shape）

使用 `markerStyle.shape` 配置标记点的默认形状。默认为 `circle`（圆形）。其他形状需通过 `registerMapMarkerShapes` 注册。

```vue
<!-- 圆形标记（默认） -->
<hx-map-markers :markers="markers" :marker-style="{ shape: 'circle', iconSize: [20, 20], color: '#f56c6c' }" />

<!-- 自定义形状（需先注册） -->
<hx-map-markers :markers="markers" :marker-style="{ shape: 'star' }" />

<!-- 自定义图标 URL -->
<hx-map-markers :markers="markers" :marker-style="{ iconUrl: 'https://example.com/icon.png', iconSize: [32, 32] }" />
```

### 图标尺寸统一

圆形和图标模式使用统一的 `iconSize` 属性控制大小：
- 圆形模式：`iconSize[0]` 即为圆的直径
- 图标模式：`iconSize` 即为渲染尺寸

### 渲染优先级

标记点样式遵循以下优先级（从高到低）：

```
1. item.iconUrl                   （数据项级 URL 图标，最高优先级）
2. item.render                    （数据项级自定义渲染函数）
3. markerStyle.render             （组件级自定义渲染函数）
4. markerStyle.iconUrl            （组件级图标 URL）
5. markerStyle.shape              （注册的自定义形状）
6. circle                         （默认圆形，保底渲染方式）
```

:::demo 展示完整的 6 级渲染优先级
map-markers/priority
:::

---

## 自定义形状

通过 `registerMapMarkerShapes` 注册自定义形状，注册后即可在 `markerStyle.shape` 中使用自定义名称。

```typescript
import { registerMapMarkerShapes } from '@hx/ui'

// 方式1：Raw SVG 字符串（支持颜色替换）
import starSvg from './star.svg?raw'

registerMapMarkerShapes([
  { name: 'star', svg: starSvg, defaultColor: '#f5a623' },
])

// 方式2：SVG URL（自动获取内容，支持颜色替换）
// 注意：URL 指向的 SVG 内容需要包含 currentColor 占位符
registerMapMarkerShapes([
  { name: 'custom', svg: 'https://cdn.example.com/icons/custom.svg' },
])

// 推荐方式：异步注册
await registerMapMarkerShapes([
  { name: 'marker', svg: 'https://api.iconify.design/mdi/map-marker.svg' },
])
```

### ShapeDefinition

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 形状唯一标识 | `string` | - |
| svg | SVG 内容（raw 字符串或 URL） | `string` | - |
| defaultColor | 默认颜色（仅 raw SVG 模式有效） | `string` | `'#409eff'` |
| size | SVG 原始尺寸 `[width, height]`，默认从 viewBox 或 width/height 属性解析 | `[number, number]` | - |

### SVG 颜色替换

Raw SVG 字符串中使用 `currentColor` 作为颜色占位符，注册时会自动被替换为实际颜色：

```svg
<!-- star.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <path d="M12 2L15 9H23L17 14L19 22L12 17L5 22L7 14L1 9H9Z" fill="currentColor"/>
</svg>
```

### 查询已注册形状

```typescript
import { getRegisteredShapes } from '@hx/ui'

console.log(getRegisteredShapes()) // ['star', ...]
```

---

## HxMapMarkers 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| markers | 标记点数据 | `MapMarkerItem[]` | `[]` |
| markerStyle | 样式配置 | `MarkerStyle` | `{ shape: 'location' }` |

## MarkerStyle

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| shape | 形状类型（内置或自定义注册的名称） | `string` | `'circle'` |
| iconUrl | 图标 URL（覆盖 shape） | `string` | - |
| iconSize | 图标渲染尺寸 `[width, height]`（像素），同时适用于圆形和图标模式 | `[number, number]` | `[20, 20]` |
| iconOriginalSize | 图标原始尺寸，用于精确计算缩放比例 | `[number, number]` | - |
| iconAnchor | 图标锚点（相对比例，默认底部中心） | `[number, number]` | `[0.5, 1]` |
| render | 自定义渲染函数（返回 HTML 字符串或 VNode） | `(item: MapMarkerItem) => string \| VNode` | - |
| color | 填充颜色（仅 `shape='circle'` 时生效） | `string` | `'#ff0000'` |
| radius | **@deprecated 请使用 `iconSize` 代替** | `number` | - |

## MapMarkerItem

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| id | 唯一标识 | `string \| number` |
| lon | 经度 | `number` |
| lat | 纬度 | `number` |
| name | 点位名称（可选） | `string` |
| iconUrl | 点位图标 URL（最高优先级） | `string` |
| iconSize | 图标渲染尺寸 `[width, height]`（像素） | `[number, number]` |
| iconOriginalSize | 图标原始尺寸 | `[number, number]` |
| iconAnchor | 图标锚点（比例） | `[number, number]` |
| render | 数据项级自定义渲染函数（优先级最高） | `(item: MapMarkerItem) => string \| VNode` |
| extra | 扩展信息（用于自定义 popup 内容） | `Record<string, string>` |
| [key: string] | 其他自定义字段（可用于分组） | `any` |