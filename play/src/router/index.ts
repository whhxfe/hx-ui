import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { componentRoutes } from '@/config/routes'

const children: RouteRecordRaw[] = Object.keys(componentRoutes).map(name => ({
  path: name,
  name,
  component: () => import(`@/views/demos/${name}/index.vue`),
  meta: componentRoutes[name] as unknown as Record<string, unknown>,
}))

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: children[0]?.path ? `/components/${children[0].path}` : '/',
  },
  {
    path: '/components',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
