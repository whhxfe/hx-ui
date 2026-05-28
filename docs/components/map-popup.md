# MapPopup 地图弹窗

点击 `HxMapMarkers` 中的标记点时，弹出信息展示卡片。需要作为 `HxMapMarkers` 的子组件使用。

## 基本用法

`HxMapPopup` 作为 `HxMapMarkers` 的子组件，点击标记点会自动弹出信息卡片。

:::demo 基础弹窗
map-popup/basic
:::

---

## HxMapPopup 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| render | 自定义弹窗内容渲染函数 | `(item: MapMarkerItem) => VNode \| string` | - |
| offset | 弹窗偏移量 | `[number, number]` | `[0, -10]` |
| showClose | 是否显示关闭按钮 | `boolean` | `true` |
| multiple | 是否支持多弹窗同时显示 | `boolean` | `false` |

## HxMapPopup 方法

| 方法 | 说明 | 参数 |
| --- | --- | --- |
| show | 手动显示弹窗 | `(item: MapMarkerItem, coord: [number, number])` |
| hide | 手动隐藏弹窗 | - |
| destroy | 销毁所有弹窗 | - |