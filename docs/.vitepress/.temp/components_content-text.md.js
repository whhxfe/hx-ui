import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"ContentText 内容文本","description":"","frontmatter":{},"headers":[],"relativePath":"components/content-text.md","filePath":"components/content-text.md"}');
const _sfc_main = { name: "components/content-text.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_DemoContainer = resolveComponent("DemoContainer");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="contenttext-内容文本" tabindex="-1">ContentText 内容文本 <a class="header-anchor" href="#contenttext-内容文本" aria-label="Permalink to &quot;ContentText 内容文本&quot;">​</a></h1><p>用于展示纯文本内容，支持 JSON 格式自动识别与语法高亮、展开折叠、复制等交互。</p><h2 id="基础用法" tabindex="-1">基础用法 <a class="header-anchor" href="#基础用法" aria-label="Permalink to &quot;基础用法&quot;">​</a></h2>`);
  _push(ssrRenderComponent(_component_DemoContainer, {
    path: "content-text/basic",
    description: "纯文本内容展示，支持行数截断"
  }, null, _parent));
  _push(`<h2 id="json-格式化展示" tabindex="-1">JSON 格式化展示 <a class="header-anchor" href="#json-格式化展示" aria-label="Permalink to &quot;JSON 格式化展示&quot;">​</a></h2>`);
  _push(ssrRenderComponent(_component_DemoContainer, {
    path: "content-text/json",
    description: "自动检测 JSON 内容并格式化展示，带语法高亮"
  }, null, _parent));
  _push(`<h2 id="复制功能" tabindex="-1">复制功能 <a class="header-anchor" href="#复制功能" aria-label="Permalink to &quot;复制功能&quot;">​</a></h2>`);
  _push(ssrRenderComponent(_component_DemoContainer, {
    path: "content-text/copyable",
    description: "通过 `copyable` 开启复制功能"
  }, null, _parent));
  _push(`<h2 id="api" tabindex="-1">API <a class="header-anchor" href="#api" aria-label="Permalink to &quot;API&quot;">​</a></h2><h3 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-label="Permalink to &quot;Props&quot;">​</a></h3><table tabindex="0"><thead><tr><th>参数</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead><tbody><tr><td>content</td><td>显示的文本内容</td><td><code>string</code></td><td>—</td></tr><tr><td>line</td><td>行数限制，超出后显示「展开」按钮，0 表示不限制</td><td><code>number</code></td><td><code>0</code></td></tr><tr><td>copyable</td><td>是否支持复制，hover 后显示复制按钮</td><td><code>boolean</code></td><td><code>false</code></td></tr><tr><td>placeholder</td><td>内容为空时的占位文本</td><td><code>string</code></td><td><code>&#39;&#39;</code></td></tr><tr><td>maxHeight</td><td>最大高度（px 或带单位字符串），超出后截断</td><td><code>number | string</code></td><td><code>0</code></td></tr><tr><td>jsonDefaultExpanded</td><td>JSON 视图默认是否展开</td><td><code>boolean</code></td><td><code>false</code></td></tr><tr><td>jsonIndent</td><td>JSON 缩进空格数</td><td><code>number</code></td><td><code>2</code></td></tr></tbody></table><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><ul><li><strong>JSON 自动检测</strong>：文本以 <code>{</code> 或 <code>[</code> 开头且能被 <code>JSON.parse</code> 成功解析时，自动渲染为带语法高亮的 JSON 视图</li><li><strong>语法高亮</strong>：key 蓝色、字符串橙色、数字绿色、布尔/ null 灰色</li><li><strong>展开折叠</strong>：JSON 视图和普通文本截断均支持展开/折叠，JSON 通过最大高度动画过渡</li><li><strong>复制</strong>：点击复制按钮将格式化后的内容写入剪贴板，复制成功显示 1.8s「已复制」反馈</li></ul><h2 id="类型定义" tabindex="-1">类型定义 <a class="header-anchor" href="#类型定义" aria-label="Permalink to &quot;类型定义&quot;">​</a></h2><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">import</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}"> type</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> { ContentTextProps } </span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">from</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}"> &#39;@hx/ui&#39;</span></span></code></pre></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/content-text.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const contentText = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  contentText as default
};
