import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Table 表格","description":"","frontmatter":{},"headers":[],"relativePath":"components/table.md","filePath":"components/table.md"}');
const _sfc_main = { name: "components/table.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_DemoContainer = resolveComponent("DemoContainer");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="table-表格" tabindex="-1">Table 表格 <a class="header-anchor" href="#table-表格" aria-label="Permalink to &quot;Table 表格&quot;">​</a></h1><p>基于 Element Plus <code>el-table</code> 的列配置驱动表格，支持插槽列、render 列、多级表头和可选分页。</p><h2 id="基础用法" tabindex="-1">基础用法 <a class="header-anchor" href="#基础用法" aria-label="Permalink to &quot;基础用法&quot;">​</a></h2>`);
  _push(ssrRenderComponent(_component_DemoContainer, {
    path: "table/basic",
    description: "使用 `columns` 配置快速渲染表格，支持 slot 列。"
  }, null, _parent));
  _push(`<h2 id="操作列" tabindex="-1">操作列 <a class="header-anchor" href="#操作列" aria-label="Permalink to &quot;操作列&quot;">​</a></h2><p>当定义 <code>#action</code> 插槽时，会自动生成右侧操作列。</p>`);
  _push(ssrRenderComponent(_component_DemoContainer, {
    path: "table/action",
    description: "当提供 `#action` 插槽时，组件自动追加“操作列”。"
  }, null, _parent));
  _push(`<h2 id="前端分页" tabindex="-1">前端分页 <a class="header-anchor" href="#前端分页" aria-label="Permalink to &quot;前端分页&quot;">​</a></h2><p>设置 <code>frontPagination</code> 后，会对传入 <code>data</code> 自动切片。</p>`);
  _push(ssrRenderComponent(_component_DemoContainer, {
    path: "table/pagination",
    description: "启用 `frontPagination` 后，按 `currentPage/pageSize` 对 data 切片。"
  }, null, _parent));
  _push(`<h2 id="api" tabindex="-1">API <a class="header-anchor" href="#api" aria-label="Permalink to &quot;API&quot;">​</a></h2><h3 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-label="Permalink to &quot;Props&quot;">​</a></h3><table tabindex="0"><thead><tr><th>名称</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead><tbody><tr><td>columns</td><td>列配置</td><td><code>TableColumn[]</code></td><td><code>[]</code></td></tr><tr><td>action-column-props</td><td>操作列额外属性（有 <code>#action</code> 时生效）</td><td><code>Record&lt;string, any&gt;</code></td><td><code>{ width: 180 }</code></td></tr><tr><td>show-pagination</td><td>是否显示分页</td><td><code>boolean</code></td><td><code>false</code></td></tr><tr><td>current-page</td><td>当前页码</td><td><code>number</code></td><td><code>1</code></td></tr><tr><td>page-size</td><td>每页数量</td><td><code>number</code></td><td><code>10</code></td></tr><tr><td>page-sizes</td><td>可选每页条数</td><td><code>number[]</code></td><td><code>[10,20,50,100]</code></td></tr><tr><td>total</td><td>总条数（后端分页时使用）</td><td><code>number</code></td><td><code>0</code></td></tr><tr><td>pagination-layout</td><td>分页布局</td><td><code>string</code></td><td><code>&#39;total, sizes, prev, pager, next, jumper&#39;</code></td></tr><tr><td>front-pagination</td><td>是否启用前端分页切片</td><td><code>boolean</code></td><td><code>false</code></td></tr></tbody></table><blockquote><p>其余 <code>el-table</code> 原生属性与事件通过 <code>$attrs</code> 全量透传，例如 <code>data</code>、<code>border</code>、<code>stripe</code>、<code>row-key</code>、<code>@selection-change</code> 等。</p></blockquote><h3 id="events" tabindex="-1">Events <a class="header-anchor" href="#events" aria-label="Permalink to &quot;Events&quot;">​</a></h3><table tabindex="0"><thead><tr><th>事件名</th><th>说明</th><th>回调参数</th></tr></thead><tbody><tr><td>size-change</td><td>每页数量变化</td><td><code>(size: number) =&gt; void</code></td></tr><tr><td>current-change</td><td>当前页变化</td><td><code>(page: number) =&gt; void</code></td></tr></tbody></table><h3 id="slots" tabindex="-1">Slots <a class="header-anchor" href="#slots" aria-label="Permalink to &quot;Slots&quot;">​</a></h3><table tabindex="0"><thead><tr><th>插槽名</th><th>说明</th></tr></thead><tbody><tr><td>action</td><td>操作列插槽，自动渲染右侧“操作”列</td></tr><tr><td>append</td><td>透传 <code>el-table</code> append 插槽</td></tr><tr><td>empty</td><td>透传 <code>el-table</code> empty 插槽</td></tr><tr><td>自定义列名</td><td>对应 <code>columns[].slot</code> 的单元格插槽</td></tr><tr><td>自定义表头插槽</td><td>对应 <code>columns[].headerSlot</code> 的表头插槽</td></tr></tbody></table></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/table.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const table = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  table as default
};
