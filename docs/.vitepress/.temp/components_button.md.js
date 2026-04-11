import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Button 按钮","description":"","frontmatter":{},"headers":[],"relativePath":"components/button.md","filePath":"components/button.md"}');
const _sfc_main = { name: "components/button.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_DemoContainer = resolveComponent("DemoContainer");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="button-按钮" tabindex="-1">Button 按钮 <a class="header-anchor" href="#button-按钮" aria-label="Permalink to &quot;Button 按钮&quot;">​</a></h1><p>用于触发业务动作，基于 Element Plus 的 <code>ElButton</code> 二次封装。</p><h2 id="基础用法" tabindex="-1">基础用法 <a class="header-anchor" href="#基础用法" aria-label="Permalink to &quot;基础用法&quot;">​</a></h2><p>使用 <code>type</code>、<code>plain</code>、<code>round</code>、<code>dashed</code> 和 <code>circle</code> 来定义按钮样式。</p>`);
  _push(ssrRenderComponent(_component_DemoContainer, {
    path: "button/basic",
    description: "使用 type、plain、round、dashed 和 circle 定义按钮样式。"
  }, null, _parent));
  _push(`<h2 id="扩展事件" tabindex="-1">扩展事件 <a class="header-anchor" href="#扩展事件" aria-label="Permalink to &quot;扩展事件&quot;">​</a></h2>`);
  _push(ssrRenderComponent(_component_DemoContainer, {
    path: "button/custom-event",
    description: "在 custom-click 事件里扩展业务交互。"
  }, null, _parent));
  _push(`<h2 id="扩展属性" tabindex="-1">扩展属性 <a class="header-anchor" href="#扩展属性" aria-label="Permalink to &quot;扩展属性&quot;">​</a></h2>`);
  _push(ssrRenderComponent(_component_DemoContainer, {
    path: "button/custom-prop",
    description: "通过 custom-prop 注入业务语义。"
  }, null, _parent));
  _push(`<h2 id="api" tabindex="-1">API <a class="header-anchor" href="#api" aria-label="Permalink to &quot;API&quot;">​</a></h2><h3 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-label="Permalink to &quot;Props&quot;">​</a></h3><table tabindex="0"><thead><tr><th>名称</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead><tbody><tr><td>custom-prop</td><td>业务扩展属性示例</td><td>string</td><td>&#39;&#39;</td></tr><tr><td>type</td><td>按钮类型（继承 ElButton）</td><td>string</td><td>-</td></tr><tr><td>size</td><td>按钮尺寸（继承 ElButton）</td><td>string</td><td>-</td></tr></tbody></table><blockquote><p>除 <code>custom-prop</code> 外，其余 <code>ElButton</code> 原生属性均可通过 <code>v-bind=&quot;$attrs&quot;</code> 继续透传。</p></blockquote><h3 id="events" tabindex="-1">Events <a class="header-anchor" href="#events" aria-label="Permalink to &quot;Events&quot;">​</a></h3><table tabindex="0"><thead><tr><th>事件名</th><th>说明</th><th>回调参数</th></tr></thead><tbody><tr><td>custom-click</td><td>自定义点击事件</td><td><code>(e: MouseEvent) =&gt; void</code></td></tr></tbody></table><h3 id="slots" tabindex="-1">Slots <a class="header-anchor" href="#slots" aria-label="Permalink to &quot;Slots&quot;">​</a></h3><table tabindex="0"><thead><tr><th>插槽名</th><th>说明</th></tr></thead><tbody><tr><td>default</td><td>按钮内容</td></tr></tbody></table></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/button.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const button = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  button as default
};
