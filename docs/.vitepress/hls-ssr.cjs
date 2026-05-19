/**
 * hls.js SSR polyfill - 提供 mock 对象供 SSR 环境使用
 */
module.exports = {
  default: {
    isSupported: () => false,
  },
}
