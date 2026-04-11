import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"FilePreview 文件预览","description":"","frontmatter":{},"headers":[],"relativePath":"components/file-preview.md","filePath":"components/file-preview.md"}');
const _sfc_main = { name: "components/file-preview.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_DemoContainer = resolveComponent("DemoContainer");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="filepreview-文件预览" tabindex="-1">FilePreview 文件预览 <a class="header-anchor" href="#filepreview-文件预览" aria-label="Permalink to &quot;FilePreview 文件预览&quot;">​</a></h1><p>用于根据文件类型自动渲染对应的预览组件，支持图片、视频、音频、PDF、EML、Markdown、文本等文件类型的预览。</p><h2 id="动态切换" tabindex="-1">动态切换 <a class="header-anchor" href="#动态切换" aria-label="Permalink to &quot;动态切换&quot;">​</a></h2>`);
  _push(ssrRenderComponent(_component_DemoContainer, {
    path: "file-preview/dynamic-url",
    description: "通过下拉选择切换不同类型的文件，演示 url 从 undefined / null 变化时的容错处理。"
  }, null, _parent));
  _push(`<h2 id="图片预览" tabindex="-1">图片预览 <a class="header-anchor" href="#图片预览" aria-label="Permalink to &quot;图片预览&quot;">​</a></h2>`);
  _push(ssrRenderComponent(_component_DemoContainer, {
    path: "file-preview/image",
    description: "自动识别 jpg、png、gif、webp、svg 等图片格式并渲染缩略图。"
  }, null, _parent));
  _push(`<h2 id="视频预览" tabindex="-1">视频预览 <a class="header-anchor" href="#视频预览" aria-label="Permalink to &quot;视频预览&quot;">​</a></h2>`);
  _push(ssrRenderComponent(_component_DemoContainer, {
    path: "file-preview/video",
    description: "自动识别 mp4、flv、m3u8、webm、mov 等视频格式并渲染视频播放器。"
  }, null, _parent));
  _push(`<h2 id="音频预览" tabindex="-1">音频预览 <a class="header-anchor" href="#音频预览" aria-label="Permalink to &quot;音频预览&quot;">​</a></h2>`);
  _push(ssrRenderComponent(_component_DemoContainer, {
    path: "file-preview/audio",
    description: "自动识别 mp3、wav、ogg、aac、flac 等音频格式并渲染音频播放器。"
  }, null, _parent));
  _push(`<h2 id="pdf预览" tabindex="-1">PDF预览 <a class="header-anchor" href="#pdf预览" aria-label="Permalink to &quot;PDF预览&quot;">​</a></h2>`);
  _push(ssrRenderComponent(_component_DemoContainer, {
    path: "file-preview/pdf",
    description: "自动识别 pdf 格式并渲染 PDF 预览组件。"
  }, null, _parent));
  _push(`<h2 id="markdown预览" tabindex="-1">Markdown预览 <a class="header-anchor" href="#markdown预览" aria-label="Permalink to &quot;Markdown预览&quot;">​</a></h2>`);
  _push(ssrRenderComponent(_component_DemoContainer, {
    path: "file-preview/markdown",
    description: "自动识别 md、markdown 等格式并渲染 Markdown 预览组件。"
  }, null, _parent));
  _push(`<h2 id="文本预览" tabindex="-1">文本预览 <a class="header-anchor" href="#文本预览" aria-label="Permalink to &quot;文本预览&quot;">​</a></h2>`);
  _push(ssrRenderComponent(_component_DemoContainer, {
    path: "file-preview/text",
    description: "自动识别 txt、json、xml、yaml、csv 等文本格式并渲染文本预览组件。"
  }, null, _parent));
  _push(`<h2 id="api" tabindex="-1">API <a class="header-anchor" href="#api" aria-label="Permalink to &quot;API&quot;">​</a></h2><h3 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-label="Permalink to &quot;Props&quot;">​</a></h3><table tabindex="0"><thead><tr><th>参数名</th><th>说明</th><th>类型</th><th>默认值</th></tr></thead><tbody><tr><td>url</td><td>文件 URL，支持 <code>undefined / null</code>（组件自动展示空状态）</td><td><code>string | undefined | null</code></td><td>-</td></tr><tr><td>previewWidth</td><td>预览区域宽度</td><td>string</td><td>&#39;120px&#39;</td></tr><tr><td>previewHeight</td><td>预览区域高度</td><td>string</td><td>&#39;80px&#39;</td></tr><tr><td>fallbackThumbnail</td><td>备用缩略图（用于视频等）</td><td>string</td><td>&#39;&#39;</td></tr></tbody></table><h3 id="支持的文件类型" tabindex="-1">支持的文件类型 <a class="header-anchor" href="#支持的文件类型" aria-label="Permalink to &quot;支持的文件类型&quot;">​</a></h3><table tabindex="0"><thead><tr><th>类型</th><th>扩展名</th><th>组件</th></tr></thead><tbody><tr><td>图片</td><td>png, jpg, jpeg, gif, webp, svg, bmp, ico</td><td>ImgViewer</td></tr><tr><td>视频</td><td>mp4, flv, m3u8, webm, ogg, mov, avi, wmv</td><td>VideoViewer</td></tr><tr><td>音频</td><td>mp3, wav, ogg, aac, flac, m4a</td><td>AudioViewer</td></tr><tr><td>PDF</td><td>pdf</td><td>PdfViewer</td></tr><tr><td>邮件</td><td>eml</td><td>EmlViewer</td></tr><tr><td>Markdown</td><td>md, markdown, mdown, mkdn</td><td>MarkdownViewer</td></tr><tr><td>文本</td><td>txt, text, log, conf, ini, cfg, config, yaml, yml, json, xml, csv</td><td>TextViewer</td></tr><tr><td>其他</td><td>-</td><td>DefaultViewer</td></tr></tbody></table></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/file-preview.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const filePreview = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  filePreview as default
};
