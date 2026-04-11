# Menu 导航菜单

基于 Element Plus 的 `ElMenu` 二次封装，支持普通菜单项、可折叠子菜单及分组三种渲染模式。

菜单节点通过 `h()` 直接作为 `ElMenu` 的默认插槽子节点渲染，避免在中间再包一层自定义组件，从而与 Element Plus 内部的注入链一致，子菜单可正常展开。

图标区域使用固定宽度的 `.hx-menu__icon-slot` 占位（无图标时也会占位），默认宽度为 `var(--el-menu-icon-width)`，与各层级文案左缘对齐。可通过 `iconWidth` 或根节点 CSS 变量 `--hx-menu-icon-slot-width` 调整。

## 基础用法

默认垂直模式，直接传入 `menu` 数据和当前激活路径 `active`。

:::demo 展示竖向和横向两种布局模式。
menu/basic
:::

## 子菜单与图标

通过 `type: 'sub'` 定义可展开子菜单，支持无限递归嵌套。通过 `icon` 属性配置图标。

:::demo 展示子菜单、嵌套菜单及各类图标配置。
menu/icon
:::

## 分组菜单

通过 `type: 'group'` 将菜单项分组，每组显示标题，适用于功能模块归类。

:::demo 展示分组菜单，每组有独立标题。
menu/group
:::

## API

### Props

| 名称    | 说明                                        | 类型                    | 默认值     |
| ------- | ------------------------------------------ | ----------------------- | ---------- |
| menu    | 菜单数据                                    | `MenuItem[]`            | `[]`       |
| mode    | 布局模式                                    | `'horizontal' \| 'vertical'` | `'vertical'` |
| width   | 垂直模式下的菜单宽度（如 `240` 或 `'16rem'`） | `string \| number`           | -            |
| iconWidth     | 图标占位区宽度（px），写入 `--hx-menu-icon-slot-width`，折叠弹出层同步                     | `string \| number` | -      |
| defaultActive | 当前激活的菜单项 index                                                          | `string`           | `''`   |
| defaultOpeneds | 初始展开的 SubMenu index 数组                                                    | `string[]`         | `[]`   |
| uniqueOpened   | 是否只保持展开一个子菜单                                                        | `boolean`          | `false`|
| menuTrigger    | 子菜单触发方式                                                                  | `'hover' \| 'click'` | `'hover'` |
| collapse       | 是否折叠（vertical 模式生效）                                                    | `boolean`          | `false`|
| backgroundColor | 菜单背景色                                                                       | `string`           | -      |
| textColor      | 菜单文字色                                                                       | `string`           | -      |
| activeTextColor | 激活菜单项文字色                                                                | `string`           | -      |
| closeOnClickOutside | 点击菜单外是否关闭                                                        | `boolean`          | `false`|
| collapseTransition | 折叠时是否有动画                                                        | `boolean`          | `true` |
| ellipsis       | 是否显示横向菜单的省略图标                                                        | `boolean`          | `true` |
| popperOffset   | popper offset                                                                    | `number`           | `6`    |
| popperEffect   | popper 效果                                                                       | `'dark' \| 'light'` | `'dark'` |
| popperClass    | popper 额外 class                                                                | `string`           | -      |
| popperStyle    | popper 额外样式                                                                   | `CSSProperties`    | -      |
| showTimeout    | 子菜单展开延迟（ms）                                                              | `number`           | `300`  |
| hideTimeout    | 子菜单收起延迟（ms）                                                              | `number`           | `300`  |
| persistent     | 是否持久化 popper 内容                                                            | `boolean`          | `true` |

### MenuItem

| 名称     | 说明                     | 类型          | 默认值 |
| -------- | ------------------------ | ------------- | ------ |
| type     | 菜单项类型                | `'item' \| 'sub' \| 'group'` | `'item'` |
| title    | 菜单项显示文本（group 分组时对应标题）| `string` | -      |
| path     | 路由路径（作为菜单唯一标识，item 类型必填）| `string` | -  |
| icon     | 图标配置                  | `MenuIconProps` | -     |
| children | 子菜单                   | `MenuItem[]`  | -      |

### MenuIconProps

| 名称   | 说明                          | 类型                                   | 默认值 |
| ------ | ---------------------------- | -------------------------------------- | ------ |
| type   | 图标类型                      | `'svg' \| 'iconify'`                   | `'svg'` |
| name   | 图标名称                      | `string`                               | -      |
| size   | 图标尺寸                      | `number \| string`                     | -      |
| color  | 图标颜色                      | `string`                               | -      |
| rotate | 旋转角度（deg）               | `number`                               | -      |
| flip   | 翻转方向                      | `'horizontal' \| 'vertical' \| 'both'` | -      |