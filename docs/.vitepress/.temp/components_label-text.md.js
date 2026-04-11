import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"LabelText 标签文本","description":"","frontmatter":{},"headers":[],"relativePath":"components/label-text.md","filePath":"components/label-text.md"}');
const _sfc_main = { name: "components/label-text.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_DemoContainer = resolveComponent("DemoContainer");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="labeltext-标签文本" tabindex="-1">LabelText 标签文本 <a class="header-anchor" href="#labeltext-标签文本" aria-label="Permalink to &quot;LabelText 标签文本&quot;">​</a></h1><p>用于展示标签和文本的左右布局，常用于表单详情页、数据展示等场景。</p><h2 id="基础用法" tabindex="-1">基础用法 <a class="header-anchor" href="#基础用法" aria-label="Permalink to &quot;基础用法&quot;">​</a></h2><p>使用 <code>label</code> 和 <code>text</code> 属性展示简单的标签文本。</p>`);
  _push(ssrRenderComponent(_component_DemoContainer, {
    path: "label-text/basic",
    description: "基础用法"
  }, null, _parent));
  _push(`<h2 id="尺寸" tabindex="-1">尺寸 <a class="header-anchor" href="#尺寸" aria-label="Permalink to &quot;尺寸&quot;">​</a></h2><p>通过 <code>size</code> 属性设置尺寸大小。</p>`);
  _push(ssrRenderComponent(_component_DemoContainer, {
    path: "label-text/size",
    description: "small / default / large"
  }, null, _parent));
  _push(`<h2 id="固定宽度" tabindex="-1">固定宽度 <a class="header-anchor" href="#固定宽度" aria-label="Permalink to &quot;固定宽度&quot;">​</a></h2><p>通过 <code>label-width</code> 设置标签宽度。</p>`);
  _push(ssrRenderComponent(_component_DemoContainer, {
    path: "label-text/label-width",
    description: "设置固定宽度，如 100px 或百分比"
  }, null, _parent));
  _push(`<h2 id="文本行数限制" tabindex="-1">文本行数限制 <a class="header-anchor" href="#文本行数限制" aria-label="Permalink to &quot;文本行数限制&quot;">​</a></h2><p>通过 <code>text-line</code> 限制文本显示行数，超出部分省略。</p>`);
  _push(ssrRenderComponent(_component_DemoContainer, {
    path: "label-text/text-line",
    description: "设置文本行数限制"
  }, null, _parent));
  _push(`<h2 id="自定义对齐" tabindex="-1">自定义对齐 <a class="header-anchor" href="#自定义对齐" aria-label="Permalink to &quot;自定义对齐&quot;">​</a></h2><p>通过 <code>align</code> 和 <code>label-align</code> 设置对齐方式。</p>`);
  _push(ssrRenderComponent(_component_DemoContainer, {
    path: "label-text/align",
    description: "align-items 对齐 / label 文本对齐"
  }, null, _parent));
  _push(`<h2 id="插槽使用" tabindex="-1">插槽使用 <a class="header-anchor" href="#插槽使用" aria-label="Permalink to &quot;插槽使用&quot;">​</a></h2><p>使用默认插槽自定义文本内容。</p>`);
  _push(ssrRenderComponent(_component_DemoContainer, {
    path: "label-text/slot",
    description: "通过插槽插入富文本或自定义内容"
  }, null, _parent));
  _push(`<h2 id="api" tabindex="-1">API <a class="header-anchor" href="#api" aria-label="Permalink to &quot;API&quot;">​</a></h2><h3 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-label="Permalink to &quot;Props&quot;">​</a></h3><table tabindex="0"><thead><tr><th>参数</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead><tbody><tr><td>label</td><td>标签文本</td><td>string</td><td>-</td></tr><tr><td>text</td><td>展示文本（插槽优先）</td><td>string</td><td>-</td></tr><tr><td>size</td><td>尺寸</td><td>&#39;small&#39; | &#39;default&#39; | &#39;large&#39;</td><td>&#39;default&#39;</td></tr><tr><td>align</td><td>Flex 交叉轴对齐方式</td><td>AlignType</td><td>&#39;center&#39;</td></tr><tr><td>label-width</td><td>标签宽度</td><td>string | number</td><td>&#39;auto&#39;</td></tr><tr><td>label-align</td><td>标签水平对齐方式</td><td>&#39;left&#39; | &#39;center&#39; | &#39;right&#39;</td><td>&#39;left&#39;</td></tr><tr><td>label-wrap</td><td>标签是否换行</td><td>boolean</td><td>false</td></tr><tr><td>text-wrap</td><td>文本是否换行</td><td>boolean</td><td>true</td></tr><tr><td>text-line</td><td>文本显示行数（0=不限制）</td><td>number</td><td>0</td></tr></tbody></table><h3 id="aligntype" tabindex="-1">AlignType <a class="header-anchor" href="#aligntype" aria-label="Permalink to &quot;AlignType&quot;">​</a></h3><div class="language-typescript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">type</span><span style="${ssrRenderStyle({ "--shiki-light": "#6F42C1", "--shiki-dark": "#B392F0" })}"> AlignType</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}"> =</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}"> &#39;start&#39;</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}"> |</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}"> &#39;center&#39;</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}"> |</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}"> &#39;end&#39;</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}"> |</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}"> &#39;stretch&#39;</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}"> |</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}"> &#39;baseline&#39;</span></span></code></pre></div><h3 id="slots" tabindex="-1">Slots <a class="header-anchor" href="#slots" aria-label="Permalink to &quot;Slots&quot;">​</a></h3><table tabindex="0"><thead><tr><th>插槽名</th><th>说明</th></tr></thead><tbody><tr><td>default</td><td>自定义文本内容（优先于 text 属性）</td></tr></tbody></table></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/label-text.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const labelText = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  labelText as default
};
