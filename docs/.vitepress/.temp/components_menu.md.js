import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Menu 导航菜单","description":"","frontmatter":{},"headers":[],"relativePath":"components/menu.md","filePath":"components/menu.md"}');
const _sfc_main = { name: "components/menu.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_DemoContainer = resolveComponent("DemoContainer");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="menu-导航菜单" tabindex="-1">Menu 导航菜单 <a class="header-anchor" href="#menu-导航菜单" aria-label="Permalink to &quot;Menu 导航菜单&quot;">​</a></h1><p>基于 Element Plus 的 <code>ElMenu</code> 二次封装，支持普通菜单项、可折叠子菜单及分组三种渲染模式。</p><h2 id="基础用法" tabindex="-1">基础用法 <a class="header-anchor" href="#基础用法" aria-label="Permalink to &quot;基础用法&quot;">​</a></h2><p>默认垂直模式，直接传入 <code>menu</code> 数据和当前激活路径 <code>active</code>。</p>`);
  _push(ssrRenderComponent(_component_DemoContainer, {
    path: "menu/basic",
    description: "展示竖向和横向两种布局模式。"
  }, null, _parent));
  _push(`<h2 id="子菜单与图标" tabindex="-1">子菜单与图标 <a class="header-anchor" href="#子菜单与图标" aria-label="Permalink to &quot;子菜单与图标&quot;">​</a></h2><p>通过 <code>type: &#39;sub&#39;</code> 定义可展开子菜单，支持无限递归嵌套。通过 <code>icon</code> 属性配置图标。</p>`);
  _push(ssrRenderComponent(_component_DemoContainer, {
    path: "menu/icon",
    description: "展示子菜单、嵌套菜单及各类图标配置。"
  }, null, _parent));
  _push(`<h2 id="分组菜单" tabindex="-1">分组菜单 <a class="header-anchor" href="#分组菜单" aria-label="Permalink to &quot;分组菜单&quot;">​</a></h2><p>通过 <code>type: &#39;group&#39;</code> 将菜单项分组，每组显示标题，适用于功能模块归类。</p>`);
  _push(ssrRenderComponent(_component_DemoContainer, {
    path: "menu/group",
    description: "展示分组菜单，每组有独立标题。"
  }, null, _parent));
  _push(`<h2 id="api" tabindex="-1">API <a class="header-anchor" href="#api" aria-label="Permalink to &quot;API&quot;">​</a></h2><h3 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-label="Permalink to &quot;Props&quot;">​</a></h3><table tabindex="0"><thead><tr><th>名称</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead><tbody><tr><td>menu</td><td>菜单数据</td><td><code>MenuItem[]</code></td><td><code>[]</code></td></tr><tr><td>mode</td><td>布局模式</td><td><code>&#39;horizontal&#39; | &#39;vertical&#39;</code></td><td><code>&#39;vertical&#39;</code></td></tr><tr><td>active</td><td>当前激活的路径（由使用方从 <code>route.path</code> 传入）</td><td><code>string</code></td><td><code>&#39;&#39;</code></td></tr><tr><td>width</td><td>垂直模式下的菜单宽度（如 <code>240</code> 或 <code>&#39;16rem&#39;</code>）</td><td><code>string | number</code></td><td>-</td></tr></tbody></table><h3 id="menuitem" tabindex="-1">MenuItem <a class="header-anchor" href="#menuitem" aria-label="Permalink to &quot;MenuItem&quot;">​</a></h3><table tabindex="0"><thead><tr><th>名称</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead><tbody><tr><td>type</td><td>菜单项类型</td><td><code>&#39;item&#39; | &#39;sub&#39; | &#39;group&#39;</code></td><td><code>&#39;item&#39;</code></td></tr><tr><td>title</td><td>菜单项显示文本（group 分组时对应标题）</td><td><code>string</code></td><td>-</td></tr><tr><td>path</td><td>路由路径（作为菜单唯一标识，item 类型必填）</td><td><code>string</code></td><td>-</td></tr><tr><td>icon</td><td>图标配置</td><td><code>MenuIconProps</code></td><td>-</td></tr><tr><td>children</td><td>子菜单</td><td><code>MenuItem[]</code></td><td>-</td></tr></tbody></table><h3 id="menuiconprops" tabindex="-1">MenuIconProps <a class="header-anchor" href="#menuiconprops" aria-label="Permalink to &quot;MenuIconProps&quot;">​</a></h3><table tabindex="0"><thead><tr><th>名称</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead><tbody><tr><td>type</td><td>图标类型</td><td><code>&#39;svg&#39; | &#39;iconify&#39;</code></td><td><code>&#39;svg&#39;</code></td></tr><tr><td>name</td><td>图标名称</td><td><code>string</code></td><td>-</td></tr><tr><td>size</td><td>图标尺寸</td><td><code>number | string</code></td><td>-</td></tr><tr><td>color</td><td>图标颜色</td><td><code>string</code></td><td>-</td></tr><tr><td>rotate</td><td>旋转角度（deg）</td><td><code>number</code></td><td>-</td></tr><tr><td>flip</td><td>翻转方向</td><td><code>&#39;horizontal&#39; | &#39;vertical&#39; | &#39;both&#39;</code></td><td>-</td></tr></tbody></table></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/menu.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const menu = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  menu as default
};
