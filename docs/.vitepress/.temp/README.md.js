import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Hx UI 文档","description":"","frontmatter":{},"headers":[],"relativePath":"README.md","filePath":"README.md"}');
const _sfc_main = { name: "README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="hx-ui-文档" tabindex="-1">Hx UI 文档 <a class="header-anchor" href="#hx-ui-文档" aria-label="Permalink to &quot;Hx UI 文档&quot;">​</a></h1><p>Hx UI 是基于 Element Plus 的业务组件二次封装库，目标是在保持原生体验的前提下，沉淀统一交互和业务能力。</p><h2 id="指南" tabindex="-1">指南 <a class="header-anchor" href="#指南" aria-label="Permalink to &quot;指南&quot;">​</a></h2><ul><li><a href="./guide/quickstart">快速开始</a></li><li><a href="./guide/wrapper-flow">二次封装组件流程</a></li></ul><h2 id="组件" tabindex="-1">组件 <a class="header-anchor" href="#组件" aria-label="Permalink to &quot;组件&quot;">​</a></h2><ul><li><a href="./components/button">Button 按钮</a></li><li><a href="./components/icon">Icon 图标</a></li><li><a href="./components/table">Table 表格</a></li></ul><h2 id="设计原则" tabindex="-1">设计原则 <a class="header-anchor" href="#设计原则" aria-label="Permalink to &quot;设计原则&quot;">​</a></h2><ol><li><strong>能力继承</strong>：优先继承 Element Plus 原始能力，不破坏原使用习惯。</li><li><strong>业务增强</strong>：通过扩展 props / events 注入业务语义。</li><li><strong>接入一致</strong>：统一 <code>withInstall</code> 与入口导出策略，保证全量和按需两种接入方式。</li><li><strong>类型友好</strong>：在可维护前提下保证 TypeScript 体验。</li></ol></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
