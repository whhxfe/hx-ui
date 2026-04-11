import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/components/file-preview',
  },
  {
    path: '/components',
    component: () => import('../layouts/DefaultLayout.vue'),
    children: [
      {
        path: 'file-preview',
        name: 'file-preview',
        component: () => import('../pages/components/FilePreviewPage.vue'),
        meta: { title: '文件预览 FilePreview', category: 'components' },
      },
      {
        path: 'icon',
        name: 'icon',
        component: () => import('../pages/components/IconPage.vue'),
        meta: { title: '图标 Icon', category: 'components' },
      },
      {
        path: 'button',
        name: 'button',
        component: () => import('../pages/components/ButtonPage.vue'),
        meta: { title: '按钮 Button', category: 'components' },
      },
      {
        path: 'table',
        name: 'table',
        component: () => import('../pages/components/TablePage.vue'),
        meta: { title: '表格 Table', category: 'components' },
      },
      {
        path: 'label-text',
        name: 'label-text',
        component: () => import('../pages/components/LabelTextPage.vue'),
        meta: { title: '标签文本 LabelText', category: 'components' },
      },
      {
        path: 'form',
        name: 'form',
        component: () => import('../pages/components/FormPage.vue'),
        meta: { title: '动态表单 Form', category: 'components' },
      },
      {
        path: 'transfer',
        name: 'transfer',
        component: () => import('../pages/components/TransferPage.vue'),
        meta: { title: '穿梭框 Transfer', category: 'components' },
      },
      {
        path: 'qrcode',
        name: 'qrcode',
        component: () => import('../pages/components/QrCodePage.vue'),
        meta: { title: '二维码 QrCode', category: 'components' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
