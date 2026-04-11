import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"","description":"","frontmatter":{"layout":"home","hero":{"name":"Hx UI","text":"企业级业务组件二次封装方案","tagline":"基于 Vue 3 + TypeScript + Element Plus，沉淀统一交互与业务能力","image":{"src":"/logo.svg","alt":"Hx UI"},"actions":[{"theme":"brand","text":"快速开始","link":"/guide/quickstart"},{"theme":"alt","text":"Button 组件","link":"/components/button"}]},"features":[{"title":"保留原始体验","details":"继承 Element Plus 原生 props、事件与插槽，迁移成本低。"},{"title":"业务能力增强","details":"通过扩展属性和事件，统一业务语义，减少重复封装。"},{"title":"工程化可扩展","details":"支持整库注册与按需引入，便于规模化维护与组件扩展。"}]},"headers":[],"relativePath":"index.md","filePath":"index.md"}');
const _sfc_main = { name: "index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
