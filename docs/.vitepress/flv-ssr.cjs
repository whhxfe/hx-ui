/**
 * flv.js SSR polyfill - 提供 self 全局变量供 SSR 环境使用
 */
module.exports = {
  default: {
    isSupported: () => false,
    createPlayer: () => ({ destroy: () => {} }),
  },
}
