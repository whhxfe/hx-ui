# Switch 开关

基于 Element Plus `el-switch` 的包装组件，提供开关切换功能。

## 基础用法

:::demo 基础的开关切换
switch/basic
:::

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model / modelValue | 开关的值 | `boolean \| string \| number` | `false` |
| disabled | 是否禁用 | `boolean` | `false` |
| active-text | 开启时的文字描述 | `string` | - |
| inactive-text | 关闭时的文字描述 | `string` | - |
| active-value | 开启时的值 | `boolean \| string \| number` | `true` |
| inactive-value | 关闭时的值 | `boolean \| string \| number` | `false` |
| active-color | 开启时的背景色 | `string` | `#409eff` |
| inactive-color | 关闭时的背景色 | `string` | `#c0ccda` |
| width | 开关的宽度 | `number` | `40` |
| inline-prompt | 是否以内联形式展示文字提示 | `boolean` | `false` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 开关状态变化时触发 | `(value: boolean \| string \| number)` |
| update:modelValue | 值更新时触发 | `(value: boolean \| string \| number)` |
