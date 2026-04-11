import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api'],
      },
    },
  },
  plugins: [
    /** 显式指向仓库根 uno.config，避免仅依赖 cwd 向上查找 */
    UnoCSS({ configFile: resolve(__dirname, '../uno.config.ts') }),
    vue(),
    createSvgIconsPlugin({
      iconDirs: [resolve(__dirname, 'src/assets/svg')],
      symbolId: 'icon-[dir]-[name]',
      inject: 'body-last',
      customDomId: '__svg__icons__dom__',
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      // CSS 文件需要指向 dist 目录（必须在 @hx/ui 之前，防止被更宽泛的别名覆盖）
      '@hx/ui/index.css': resolve(__dirname, '../packages/dist/index.css'),
      // 直接解析到源码而不是 dist（指向 index.ts 而非目录，避免被 package.json#module 覆盖）
      '@hx/ui': resolve(__dirname, '../packages/index.ts'),
    },
  },
  server: {
    port: 4000,
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:3000',
    //     changeOrigin: true,
    //   },
    // },
  },
})
