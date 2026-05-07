import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import fs from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '@iconify-json': resolve(__dirname, 'node_modules/@iconify/json/json'),
    },
  },
  plugins: [
    vue(),
    dts({
      outDir: resolve(__dirname, 'packages/dist'),
      tsconfigPath: resolve(__dirname, 'packages/tsconfig.json'),
      afterBuild() {
        const src = resolve(__dirname, 'packages/types/wangeditor.d.ts')
        const dst = resolve(__dirname, 'packages/dist/wangeditor.d.ts')
        fs.existsSync(src) && fs.copyFileSync(src, dst)
      },
    }),
  ],
  build: {
    outDir: 'packages/dist',
    lib: {
      entry: resolve(__dirname, 'packages/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: [
        // Vue 生态
        /^vue/,
        /^element-plus/,
        /^@element-plus/,
        // Iconify
        /^@iconify\/vue/,
        /^@iconify\/json/,
        /^@iconify\/types/,
        // 富文本编辑器
        /^@wangeditor\/editor/,
        /^@wangeditor\/editor-for-vue/,
        // 文件预览相关
        /^pdfjs-dist/,
        /^flv\.js$/,
        /^hls\.js$/,
        // 二维码
        /^qrcode$/,
        // 通用工具
        /^axios$/,
        /^dayjs$/,
        /^vue-json-pretty$/,
        /^lodash$/,
      ],
      output: {
        // preserveModules 保持源文件结构，实现组件级按需加载
        // 每个组件/模块输出为独立文件，消费者的打包工具可 tree-shake 未使用的组件
        preserveModules: true,
        preserveModulesRoot: resolve(__dirname, 'packages'),
        entryFileNames: '[name].js',
        assetFileNames: 'index.css',
      },
    },
  },
})
