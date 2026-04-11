import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Form 动态表单","description":"","frontmatter":{},"headers":[],"relativePath":"components/form.md","filePath":"components/form.md"}');
const _sfc_main = { name: "components/form.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_DemoContainer = resolveComponent("DemoContainer");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="form-动态表单" tabindex="-1">Form 动态表单 <a class="header-anchor" href="#form-动态表单" aria-label="Permalink to &quot;Form 动态表单&quot;">​</a></h1><p>基于 Element Plus <code>el-form</code> 的列配置驱动表单，通过 <code>columns</code> 数组声明式定义表单字段，支持自动生成校验规则、栅格布局、远程数据等功能。</p><h2 id="基础用法" tabindex="-1">基础用法 <a class="header-anchor" href="#基础用法" aria-label="Permalink to &quot;基础用法&quot;">​</a></h2><p>使用 <code>columns</code> 配置声明表单字段，<code>v-model</code> 双向绑定表单数据。</p>`);
  _push(ssrRenderComponent(_component_DemoContainer, {
    path: "form/basic",
    description: "基础的 3 列栅格布局"
  }, null, _parent));
  _push(`<h2 id="提交与重置" tabindex="-1">提交与重置 <a class="header-anchor" href="#提交与重置" aria-label="Permalink to &quot;提交与重置&quot;">​</a></h2><p>通过 <code>ref</code> 获取表单实例，调用 <code>validate</code> 校验和 <code>reset</code> 重置方法。默认操作区可通过 <code>actions</code> 插槽自定义。</p>`);
  _push(ssrRenderComponent(_component_DemoContainer, {
    path: "form/submit-reset",
    description: "自定义操作按钮"
  }, null, _parent));
  _push(`<h2 id="输入类型" tabindex="-1">输入类型 <a class="header-anchor" href="#输入类型" aria-label="Permalink to &quot;输入类型&quot;">​</a></h2><p>支持 <code>input</code>、<code>textarea</code>、<code>number</code> 等文本输入类型。</p>`);
  _push(ssrRenderComponent(_component_DemoContainer, {
    path: "form/input-types",
    description: "文本输入 / 文本域 / 数字输入"
  }, null, _parent));
  _push(`<h2 id="选择类组件" tabindex="-1">选择类组件 <a class="header-anchor" href="#选择类组件" aria-label="Permalink to &quot;选择类组件&quot;">​</a></h2><p>支持 <code>select</code>、<code>radio</code>、<code>radio-btn</code>、<code>checkbox</code>、<code>switch</code> 等选择类组件。</p>`);
  _push(ssrRenderComponent(_component_DemoContainer, {
    path: "form/select-options",
    description: "单选下拉 / 多选下拉 / 单选框 / 多选框 / 开关"
  }, null, _parent));
  _push(`<h2 id="日期时间" tabindex="-1">日期时间 <a class="header-anchor" href="#日期时间" aria-label="Permalink to &quot;日期时间&quot;">​</a></h2><p>支持 <code>date</code>、<code>daterange</code>、<code>datetime</code>、<code>datetimerange</code>、<code>time</code>、<code>timerange</code> 等日期时间类型。</p>`);
  _push(ssrRenderComponent(_component_DemoContainer, {
    path: "form/date-time",
    description: "日期 / 日期范围 / 日期时间 / 时间 / 时间范围"
  }, null, _parent));
  _push(`<h2 id="级联选择" tabindex="-1">级联选择 <a class="header-anchor" href="#级联选择" aria-label="Permalink to &quot;级联选择&quot;">​</a></h2><p><code>cascader</code> 类型支持多级联动，可通过 <code>filterable</code> 开启搜索功能。</p>`);
  _push(ssrRenderComponent(_component_DemoContainer, {
    path: "form/cascader",
    description: "级联选择器"
  }, null, _parent));
  _push(`<h2 id="自动校验" tabindex="-1">自动校验 <a class="header-anchor" href="#自动校验" aria-label="Permalink to &quot;自动校验&quot;">​</a></h2><p>通过 <code>required: true</code> 自动生成必填校验规则，<code>rules</code> 可添加自定义校验规则，两者自动合并。</p>`);
  _push(ssrRenderComponent(_component_DemoContainer, {
    path: "form/validation",
    description: "required 自动校验 + rules 自定义校验"
  }, null, _parent));
  _push(`<h2 id="api" tabindex="-1">API <a class="header-anchor" href="#api" aria-label="Permalink to &quot;API&quot;">​</a></h2><h3 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-label="Permalink to &quot;Props&quot;">​</a></h3><table tabindex="0"><thead><tr><th>参数</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead><tbody><tr><td>v-model</td><td>表单数据对象</td><td><code>Record&lt;string, any&gt;</code></td><td><code>{}</code></td></tr><tr><td>columns</td><td>表单字段配置数组</td><td><code>FormColumn[]</code></td><td>-</td></tr><tr><td>cols</td><td>栅格列数</td><td><code>number</code></td><td><code>3</code></td></tr><tr><td>showAction</td><td>是否显示操作按钮区域</td><td><code>boolean</code></td><td><code>true</code></td></tr></tbody></table><h3 id="formcolumn-类型" tabindex="-1">FormColumn 类型 <a class="header-anchor" href="#formcolumn-类型" aria-label="Permalink to &quot;FormColumn 类型&quot;">​</a></h3><table tabindex="0"><thead><tr><th>属性</th><th>说明</th><th>类型</th></tr></thead><tbody><tr><td>prop</td><td>字段名</td><td><code>string</code></td></tr><tr><td>label</td><td>标签文本</td><td><code>string</code></td></tr><tr><td>type</td><td>字段类型</td><td><code>FieldType</code></td></tr><tr><td>defaultValue</td><td>默认值</td><td><code>any</code></td></tr><tr><td>colSpan</td><td>栅格列跨度</td><td><code>number</code></td></tr><tr><td>placeholder</td><td>占位文本</td><td><code>string</code></td></tr><tr><td>clearable</td><td>是否可清空</td><td><code>boolean</code></td></tr><tr><td>disabled</td><td>是否禁用</td><td><code>boolean</code></td></tr><tr><td>hidden</td><td>是否隐藏</td><td><code>boolean</code></td></tr><tr><td>required</td><td>是否必填（自动生成校验）</td><td><code>boolean</code></td></tr><tr><td>options</td><td>选项数据（select/radio/checkbox/cascader）</td><td><code>OptionItem[] | GroupOptionItem[]</code></td></tr><tr><td>multiple</td><td>是否多选（select/checkbox）</td><td><code>boolean</code></td></tr><tr><td>filterable</td><td>是否可搜索（select/cascader）</td><td><code>boolean</code></td></tr><tr><td>min / max / step</td><td>数字输入范围</td><td><code>number</code></td></tr><tr><td>maxlength</td><td>最大长度</td><td><code>number</code></td></tr><tr><td>showWordLimit</td><td>是否显示字数统计</td><td><code>boolean</code></td></tr><tr><td>rows</td><td>文本域行数</td><td><code>number</code></td></tr><tr><td>valueFormat</td><td>值格式化字符串</td><td><code>string</code></td></tr><tr><td>rules</td><td>自定义校验规则</td><td><code>any[]</code></td></tr><tr><td>componentProps</td><td>透传给底层组件的属性</td><td><code>Record&lt;string, any&gt;</code></td></tr><tr><td>formItemProps</td><td>透传给 el-form-item 的属性</td><td><code>Record&lt;string, any&gt;</code></td></tr><tr><td>onChange</td><td>值变更回调</td><td><code>(value: any, formData: Record&lt;string, any&gt;) =&gt; void</code></td></tr></tbody></table><h3 id="fieldtype-可选值" tabindex="-1">FieldType 可选值 <a class="header-anchor" href="#fieldtype-可选值" aria-label="Permalink to &quot;FieldType 可选值&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>input | textarea | number | select | radio | radio-btn | checkbox |</span></span>
<span class="line"><span>switch | cascader | datetime | datetimerange | date | daterange |</span></span>
<span class="line"><span>time | timerange | upload | slot | render</span></span></code></pre></div><h3 id="formexpose" tabindex="-1">FormExpose <a class="header-anchor" href="#formexpose" aria-label="Permalink to &quot;FormExpose&quot;">​</a></h3><p>通过 <code>ref</code> 获取的方法：</p><table tabindex="0"><thead><tr><th>方法</th><th>说明</th><th>返回值</th></tr></thead><tbody><tr><td>validate</td><td>校验表单</td><td><code>Promise&lt;boolean&gt;</code></td></tr><tr><td>reset</td><td>重置表单</td><td><code>void</code></td></tr><tr><td>getFormData</td><td>获取表单数据</td><td><code>Record&lt;string, any&gt;</code></td></tr><tr><td>setFormData</td><td>设置表单数据</td><td><code>void</code></td></tr><tr><td>getElFormRef</td><td>获取 el-form 实例</td><td><code>any</code></td></tr></tbody></table><h3 id="slots" tabindex="-1">Slots <a class="header-anchor" href="#slots" aria-label="Permalink to &quot;Slots&quot;">​</a></h3><table tabindex="0"><thead><tr><th>插槽名</th><th>说明</th><th>作用域变量</th></tr></thead><tbody><tr><td>default</td><td>默认插槽，渲染自定义表单项</td><td>-</td></tr><tr><td>[prop]</td><td>渲染指定字段的表单项</td><td><code>{ formData }</code></td></tr><tr><td>actions</td><td>操作按钮区域</td><td><code>{ formData, validate, reset }</code></td></tr></tbody></table></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/form.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const form = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  form as default
};
