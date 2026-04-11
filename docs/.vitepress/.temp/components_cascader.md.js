import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Cascader 级联选择","description":"","frontmatter":{},"headers":[],"relativePath":"components/cascader.md","filePath":"components/cascader.md"}');
const _sfc_main = { name: "components/cascader.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_DemoContainer = resolveComponent("DemoContainer");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="cascader-级联选择" tabindex="-1">Cascader 级联选择 <a class="header-anchor" href="#cascader-级联选择" aria-label="Permalink to &quot;Cascader 级联选择&quot;">​</a></h1><p>基于 Element Plus <code>el-cascader</code> 封装，支持静态 options 和远程数据源。</p><h2 id="基础用法" tabindex="-1">基础用法 <a class="header-anchor" href="#基础用法" aria-label="Permalink to &quot;基础用法&quot;">​</a></h2>`);
  _push(ssrRenderComponent(_component_DemoContainer, {
    path: "cascader/basic",
    description: "基础 / 可搜索 / 禁用"
  }, null, _parent));
  _push(`<h2 id="远程数据" tabindex="-1">远程数据 <a class="header-anchor" href="#远程数据" aria-label="Permalink to &quot;远程数据&quot;">​</a></h2><p>传入 <code>remote</code> 配置自动请求远端接口获取 options，支持字段映射。</p>`);
  _push(ssrRenderComponent(_component_DemoContainer, {
    path: "cascader/remote",
    description: "静态 / 远程请求"
  }, null, _parent));
  _push(`<h2 id="api" tabindex="-1">API <a class="header-anchor" href="#api" aria-label="Permalink to &quot;API&quot;">​</a></h2><h3 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-label="Permalink to &quot;Props&quot;">​</a></h3><table tabindex="0"><thead><tr><th>参数</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead><tbody><tr><td>v-model</td><td>绑定值</td><td><code>string | number | string[]</code></td><td>-</td></tr><tr><td>options</td><td>静态选项列表（优先级高于 remote）</td><td><code>Record&lt;string, any&gt;[]</code></td><td>-</td></tr><tr><td>remote</td><td>远程数据获取配置</td><td><code>RemoteConfig</code></td><td>-</td></tr><tr><td>placeholder</td><td>占位文本</td><td><code>string</code></td><td>-</td></tr><tr><td>disabled</td><td>是否禁用</td><td><code>boolean</code></td><td><code>false</code></td></tr><tr><td>filterable</td><td>是否可搜索</td><td><code>boolean</code></td><td><code>false</code></td></tr><tr><td>clearable</td><td>是否可清空</td><td><code>boolean</code></td><td><code>true</code></td></tr></tbody></table><h3 id="remoteconfig" tabindex="-1">RemoteConfig <a class="header-anchor" href="#remoteconfig" aria-label="Permalink to &quot;RemoteConfig&quot;">​</a></h3><table tabindex="0"><thead><tr><th>参数</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead><tbody><tr><td>url</td><td>请求地址</td><td><code>string</code></td><td>-</td></tr><tr><td>method</td><td>请求方法</td><td><code>&#39;get&#39; | &#39;post&#39;</code></td><td><code>&#39;get&#39;</code></td></tr><tr><td>params</td><td>URL query 参数</td><td><code>Record&lt;string, any&gt;</code></td><td>-</td></tr><tr><td>body</td><td>请求体参数（POST）</td><td><code>Record&lt;string, any&gt;</code></td><td>-</td></tr><tr><td>bodyType</td><td>body 格式</td><td><code>&#39;json&#39; | &#39;form-data&#39;</code></td><td><code>&#39;json&#39;</code></td></tr><tr><td>labelKey</td><td>响应中 label 字段名</td><td><code>string</code></td><td><code>&#39;label&#39;</code></td></tr><tr><td>valueKey</td><td>响应中 value 字段名</td><td><code>string</code></td><td><code>&#39;value&#39;</code></td></tr><tr><td>childrenKey</td><td>响应中 children 字段名</td><td><code>string</code></td><td><code>&#39;children&#39;</code></td></tr></tbody></table></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cascader.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const cascader = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  cascader as default
};
