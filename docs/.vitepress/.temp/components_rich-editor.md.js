import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"RichEditor 富文本编辑器","description":"","frontmatter":{},"headers":[],"relativePath":"components/rich-editor.md","filePath":"components/rich-editor.md"}');
const _sfc_main = { name: "components/rich-editor.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_DemoContainer = resolveComponent("DemoContainer");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="richeditor-富文本编辑器" tabindex="-1">RichEditor 富文本编辑器 <a class="header-anchor" href="#richeditor-富文本编辑器" aria-label="Permalink to &quot;RichEditor 富文本编辑器&quot;">​</a></h1><p>基于 <a href="https://www.wangeditor.com/" target="_blank" rel="noreferrer">WangEditor v5</a> 封装的富文本编辑器组件，支持图文混排、图片/视频上传（可配 MinIO 或任意 HTTP 接口）、图片压缩、只读预览等场景。</p><h2 id="基础用法" tabindex="-1">基础用法 <a class="header-anchor" href="#基础用法" aria-label="Permalink to &quot;基础用法&quot;">​</a></h2>`);
  _push(ssrRenderComponent(_component_DemoContainer, {
    path: "rich-editor/basic",
    description: "基础富文本编辑器"
  }, null, _parent));
  _push(`<h2 id="只读预览" tabindex="-1">只读预览 <a class="header-anchor" href="#只读预览" aria-label="Permalink to &quot;只读预览&quot;">​</a></h2><p>通过 <code>read-only</code> 属性切换为只读模式，适合文章预览、公告展示等只读场景。</p>`);
  _push(ssrRenderComponent(_component_DemoContainer, {
    path: "rich-editor/readonly",
    description: "只读预览模式"
  }, null, _parent));
  _push(`<h2 id="上传配置" tabindex="-1">上传配置 <a class="header-anchor" href="#上传配置" aria-label="Permalink to &quot;上传配置&quot;">​</a></h2><p>通过 <code>upload-url</code> 或 <code>upload-image</code> / <code>upload-video</code> 分别配置图片和视频的上传接口。内置<strong>图片压缩</strong>（最大宽度 1600px，JPEG 80%）。</p><p>支持两种上传方式：</p><ul><li><strong>HTTP 接口</strong>：传入上传地址，组件自动 <code>POST FormData</code>，并通过 <code>responseAdapter</code> 从响应体解析资源 URL</li><li><strong>MinIO 直传</strong>：传入 MinIO 配置，组件直接在浏览器端签名上传到 MinIO，无需后端介入</li></ul>`);
  _push(ssrRenderComponent(_component_DemoContainer, {
    path: "rich-editor/upload",
    description: "上传图片 / 视频"
  }, null, _parent));
  _push(`<h2 id="api" tabindex="-1">API <a class="header-anchor" href="#api" aria-label="Permalink to &quot;API&quot;">​</a></h2><h3 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-label="Permalink to &quot;Props&quot;">​</a></h3><table tabindex="0"><thead><tr><th>参数</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead><tbody><tr><td>v-model</td><td>绑定值（HTML 字符串）</td><td><code>string</code></td><td><code>&#39;&#39;</code></td></tr><tr><td>read-only</td><td>是否只读</td><td><code>boolean</code></td><td><code>false</code></td></tr><tr><td>upload-url</td><td>图片/视频统一上传接口地址</td><td><code>string</code></td><td><code>&#39;&#39;</code></td></tr><tr><td>upload-image</td><td>图片上传配置（优先级高于 upload-url）</td><td><code>UploadOptions</code></td><td><code>{}</code></td></tr><tr><td>upload-video</td><td>视频上传配置</td><td><code>UploadOptions</code></td><td><code>{}</code></td></tr><tr><td>response-adapter</td><td>从上传响应体解析资源 URL</td><td><code>(res: any) =&gt; string</code></td><td>取 <code>res.url / res.data / res.data.url / res.path</code></td></tr></tbody></table><h3 id="uploadoptions" tabindex="-1">UploadOptions <a class="header-anchor" href="#uploadoptions" aria-label="Permalink to &quot;UploadOptions&quot;">​</a></h3><table tabindex="0"><thead><tr><th>参数</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead><tbody><tr><td>url</td><td>上传接口地址</td><td><code>string</code></td><td>-</td></tr><tr><td>headers</td><td>请求头</td><td><code>Record&lt;string, string&gt;</code></td><td>-</td></tr><tr><td>field-name</td><td>FormData 字段名</td><td><code>string</code></td><td><code>&#39;file&#39;</code></td></tr><tr><td>extra-data</td><td>额外表单字段</td><td><code>Record&lt;string, string | Blob&gt;</code></td><td>-</td></tr><tr><td>minio</td><td>MinIO 直传配置</td><td><code>MinioConfig</code></td><td>-</td></tr></tbody></table><h3 id="minioconfig" tabindex="-1">MinioConfig <a class="header-anchor" href="#minioconfig" aria-label="Permalink to &quot;MinioConfig&quot;">​</a></h3><table tabindex="0"><thead><tr><th>参数</th><th>说明</th><th>类型</th></tr></thead><tbody><tr><td>endpoint</td><td>MinIO 服务地址</td><td><code>string</code></td></tr><tr><td>bucket</td><td>存储桶名称</td><td><code>string</code></td></tr><tr><td>access-key</td><td>Access Key</td><td><code>string</code></td></tr><tr><td>secret-key</td><td>Secret Key</td><td><code>string</code></td></tr></tbody></table><h3 id="emits" tabindex="-1">Emits <a class="header-anchor" href="#emits" aria-label="Permalink to &quot;Emits&quot;">​</a></h3><table tabindex="0"><thead><tr><th>事件名</th><th>说明</th><th>参数</th></tr></thead><tbody><tr><td>update:modelValue</td><td>内容变化时触发</td><td><code>(html: string)</code></td></tr><tr><td>upload-success</td><td>文件上传成功后触发</td><td><code>(url: string)</code></td></tr></tbody></table></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/rich-editor.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const richEditor = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  richEditor as default
};
