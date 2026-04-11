# Hx UI 文档

Hx UI 是基于 Element Plus 的业务组件二次封装库，目标是在保持原生体验的前提下，沉淀统一交互和业务能力。

## 指南

- [快速开始](./guide/quickstart.md)
- [二次封装组件流程](./guide/wrapper-flow.md)

## 组件

- [Button 按钮](./components/button.md)
- [Icon 图标](./components/icon.md)
- [Table 表格](./components/table.md)

## 设计原则

1. **能力继承**：优先继承 Element Plus 原始能力，不破坏原使用习惯。
2. **业务增强**：通过扩展 props / events 注入业务语义。
3. **接入一致**：统一 `withInstall` 与入口导出策略，保证全量和按需两种接入方式。
4. **类型友好**：在可维护前提下保证 TypeScript 体验。
