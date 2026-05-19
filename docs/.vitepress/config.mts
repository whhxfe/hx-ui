import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vitepress'
import markdownItContainer from 'markdown-it-container'
import UnoCSS from 'unocss/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

const __dirname = dirname(fileURLToPath(import.meta.url))
const env = loadEnv('', process.cwd(), '')
/** 与 play 共用 SVG 资源目录，保证文档与 playground 行为一致 */
const svgIconDir = resolve(__dirname, '../../play/src/assets/svg')

export default defineConfig({
  title: 'Hx UI',
  description: '基于 Element Plus 的业务组件二次封装库',
  lang: 'zh-CN',
  base: '/hx-ui/',
  cleanUrls: true,
  ignoreDeadLinks: true,
  srcExclude: ['**/*.md'],
  ssr: false,
  markdown: {
    config(md) {
      md.use(markdownItContainer, 'demo', {
        validate(params) {
          const value = params.trim()
          return value === '' || /^demo\s*(.*)$/.test(value)
        },
        render(tokens, idx) {
          const token = tokens[idx]
          if (token.nesting === -1) {
            return '</DemoContainer>\n'
          }

          const match = token.info.trim().match(/^demo\s*(.*)$/)
          if (!match) return ''

          if (token.nesting === 1) {
            const description = md.utils
              .escapeHtml((match[1] || '').trim())
              .replace(/`/g, '&#96;')
              .replace(/"/g, '&quot;')
            let rawPath = ''

            for (let i = idx + 1; i < tokens.length; i++) {
              if (tokens[i].type === 'container_demo_close') break
              if (tokens[i].type === 'inline') {
                const content = tokens[i].content.trim()
                if (content) {
                  rawPath = content
                }
                tokens[i].content = ''
                tokens[i].children = []
              } else if (tokens[i].type === 'paragraph_open' || tokens[i].type === 'paragraph_close') {
                tokens[i].hidden = true
              }
            }

            const path = rawPath.replace(/"/g, '&quot;')
            return `<DemoContainer path="${path}" description="${description}">\n`
          }
          return ''
        },
      })
    },
  },
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '指南', link: '/guide/quickstart' },
      { text: '组件', link: '/components/file-preview' },
      { text: '表单', link: '/components/form' },
      { text: '地图', link: '/components/map' },
      { text: '关系图', link: '/components/relation-graph' },
      { text: '二次封装流程', link: '/guide/wrapper-flow' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '快速开始', link: '/guide/quickstart' },
            { text: '二次封装组件流程', link: '/guide/wrapper-flow' },
          ],
        },
      ],
      '/components/': [
        {
          text: 'Basic 基础组件',
          items: [
            { text: 'Button 按钮', link: '/components/button' },
            { text: 'Icon 图标', link: '/components/icon' },
            { text: 'Link 链接', link: '/components/link' },
            { text: 'Text 文本', link: '/components/text' },
          ],
        },
        {
          text: 'Map 地图组件',
          items: [
            { text: 'Map 地图', link: '/components/map' },
          ],
        },
        {
          text: 'Form表单组件',
          items: [
            { text: 'Form 动态表单', link: '/components/form' },
            { text: 'Select 下拉选择', link: '/components/select' },
            { text: 'Cascader 级联选择', link: '/components/cascader' },
            { text: 'Radio 单选组', link: '/components/radio' },
            { text: 'Checkbox 多选组', link: '/components/checkbox' },
            { text: 'Switch 开关', link: '/components/switch' },
            { text: 'Transfer 穿梭框', link: '/components/transfer' },
            { text: 'Upload 上传', link: '/components/upload' },
            { text: 'RichEditor 富文本编辑器', link: '/components/rich-editor' },
          ],
        },
        {
          text: 'Data 数据展示',
          items: [
            { text: 'Table 表格', link: '/components/table' },
            { text: 'CardList 卡片列表', link: '/components/card-list' },
            { text: 'LabelText 标签文本', link: '/components/label-text' },
            { text: 'ContentText 内容文本', link: '/components/content-text' },
            { text: 'JsonView JSON 视图', link: '/components/json-view' },
          ],
        },
        {
          text: 'Navigation 导航',
          items: [
            { text: 'Menu 导航菜单', link: '/components/menu' },
          ],
        },


        {
          text: '文件预览',
          items: [
            { text: 'FilePreview 文件预览', link: '/components/file-preview' },

          ],
        },
        {
          text: '业务组件',
          items: [
            { text: 'FilterPanel 筛选面板', link: '/components/filter-panel' },
            { text: 'FilterItem 筛选选项', link: '/components/filter-item' },
            { text: 'FilterDateRange 日期范围选择', link: '/components/filter-date-range' },
          ],
        },
        {
          text: 'Others 其他',
          items: [
            { text: 'QrCode 二维码', link: '/components/qrcode' },
            { text: 'RelationGraph 关系图', link: '/components/relation-graph' },
          ],
        },
      ],
    },
    search: {
      provider: 'local',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 Hx UI',
    },
  },
  vite: {
    server: {
      port: Number(env.PORT_DOCS) || 4001,
      proxy: {
        '/api': {
          target: `${env.VITE_API_BASE_URL}`,
          changeOrigin: true,
        },
        '/files': {
          target: `${env.VITE_API_BASE_URL}`,
          changeOrigin: true,
        },
        '/icons': {
          target: `${env.VITE_API_BASE_URL}`,
          changeOrigin: true,
        },
        '/uploads': {
          target: `${env.VITE_API_BASE_URL}`,
          changeOrigin: true,
        },
      },
    },
    plugins: [
      // VitePress 内置 Vite 5 与根目录 Vite 8 插件类型不兼容，运行时正常
      UnoCSS() as any,
      createSvgIconsPlugin({
        iconDirs: [svgIconDir],
        symbolId: 'icon-[dir]-[name]',
        inject: 'body-last',
        customDomId: '__svg__icons__dom__',
      }) as any,
    ],
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['legacy-js-api'],
        },
      },
    },
    resolve: {
      alias: [
        // 浏览器专用库 SSR polyfill
        { find: /^flv\.js$/, replacement: resolve(__dirname, 'flv-ssr.cjs') },
        { find: /^hls\.js$/, replacement: resolve(__dirname, 'hls-ssr.cjs') },
        { find: '@', replacement: resolve(__dirname, '../../play/src') },
        // CSS 别名必须在 @hx/ui 之前，防止被更宽泛的别名覆盖
        { find: '@hx/ui/dist/index.css', replacement: resolve(__dirname, '../../packages/dist/index.css') },
        { find: '@hx/ui/index.css', replacement: resolve(__dirname, '../../packages/dist/index.css') },
        { find: '@hx/ui/theme-chalk/index.css', replacement: resolve(__dirname, '../../packages/theme-chalk/index.scss') },
        { find: '@hx/ui', replacement: resolve(__dirname, '../../packages/index.ts') },
        { find: '@iconify-json', replacement: resolve(__dirname, '../../node_modules/@iconify/json/json') },
      ],
    },
  },
})
