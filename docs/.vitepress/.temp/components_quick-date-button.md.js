import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"HxQuickDateButton 快捷日期按钮","description":"","frontmatter":{},"headers":[],"relativePath":"components/quick-date-button.md","filePath":"components/quick-date-button.md"}');
const _sfc_main = { name: "components/quick-date-button.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_DemoContainer = resolveComponent("DemoContainer");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="hxquickdatebutton-快捷日期按钮" tabindex="-1">HxQuickDateButton 快捷日期按钮 <a class="header-anchor" href="#hxquickdatebutton-快捷日期按钮" aria-label="Permalink to &quot;HxQuickDateButton 快捷日期按钮&quot;">​</a></h1><p>提供快捷时间选项（近 N 天）和自定义日期范围选择的组件，支持通过 <code>change</code> 事件获取格式化后的 <code>[startTime, endTime]</code>。</p><h2 id="基础用法" tabindex="-1">基础用法 <a class="header-anchor" href="#基础用法" aria-label="Permalink to &quot;基础用法&quot;">​</a></h2><p>预设选项默认为「近 N 天」快捷时间，点击切换选中状态，再次点击取消选中。</p>`);
  _push(ssrRenderComponent(_component_DemoContainer, {
    path: "quick-date-button/basic",
    description: "默认快捷时间 / 带标签 / 隐藏自定义 / 监听 change"
  }, null, _parent));
  _push(`<h2 id="自定义快捷选项" tabindex="-1">自定义快捷选项 <a class="header-anchor" href="#自定义快捷选项" aria-label="Permalink to &quot;自定义快捷选项&quot;">​</a></h2><p>通过 <code>options</code> 传入自定义的快捷选项列表，格式为 <code>ShortcutItem[]</code>。</p>`);
  _push(ssrRenderComponent(_component_DemoContainer, {
    path: "quick-date-button/custom",
    description: "自定义快捷选项"
  }, null, _parent));
  _push(`<h2 id="api" tabindex="-1">API <a class="header-anchor" href="#api" aria-label="Permalink to &quot;API&quot;">​</a></h2><h3 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-label="Permalink to &quot;Props&quot;">​</a></h3><table tabindex="0"><thead><tr><th>参数</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead><tbody><tr><td>v-model</td><td>当前选中的 datetype 值（预设选项对应天数字符串，或 <code>&quot;custom&quot;</code>）</td><td><code>string</code></td><td><code>&#39;&#39;</code></td></tr><tr><td>label</td><td>左侧标签文本</td><td><code>string</code></td><td><code>&#39;&#39;</code></td></tr><tr><td>options</td><td>预设快捷选项列表</td><td><code>ShortcutItem[]</code></td><td><code>defaultShortcuts</code>（近 1/3/7/30/90/180/365 天）</td></tr><tr><td>format</td><td>输出日期格式（dayjs 格式）</td><td><code>string</code></td><td><code>&#39;YYYY-MM-DD&#39;</code></td></tr><tr><td>custom</td><td>是否显示「自定义」入口和日期范围选择器</td><td><code>boolean</code></td><td><code>true</code></td></tr><tr><td>textKey</td><td>options 中的文本字段名</td><td><code>string</code></td><td><code>&#39;text&#39;</code></td></tr><tr><td>daysKey</td><td>options 中的天数字段名</td><td><code>string</code></td><td><code>&#39;days&#39;</code></td></tr></tbody></table><h3 id="shortcutitem" tabindex="-1">ShortcutItem <a class="header-anchor" href="#shortcutitem" aria-label="Permalink to &quot;ShortcutItem&quot;">​</a></h3><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">interface</span><span style="${ssrRenderStyle({ "--shiki-light": "#6F42C1", "--shiki-dark": "#B392F0" })}"> ShortcutItem</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> {</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">  text</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">:</span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}"> string</span><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">   // 显示文本</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">  days</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">:</span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}"> number</span><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">   // 往前推的天数</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">}</span></span></code></pre></div><h3 id="emits" tabindex="-1">Emits <a class="header-anchor" href="#emits" aria-label="Permalink to &quot;Emits&quot;">​</a></h3><table tabindex="0"><thead><tr><th>事件名</th><th>说明</th><th>参数</th></tr></thead><tbody><tr><td>update:modelValue</td><td>选中值变化时触发</td><td><code>(datetype: string)</code></td></tr><tr><td>change</td><td>选中范围变化时触发</td><td><code>(range: string[])</code> 格式为 <code>[startTime, endTime]</code></td></tr></tbody></table><h3 id="expose" tabindex="-1">Expose <a class="header-anchor" href="#expose" aria-label="Permalink to &quot;Expose&quot;">​</a></h3><table tabindex="0"><thead><tr><th>方法名</th><th>说明</th></tr></thead><tbody><tr><td>reset</td><td>重置为未选中状态，清空所有选择</td></tr></tbody></table></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/quick-date-button.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const quickDateButton = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  quickDateButton as default
};
