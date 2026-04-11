import type { App, Plugin } from 'vue'

type SFCWithInstall<T> = T & Plugin

export const withInstall = <T>(component: T, name?: string): SFCWithInstall<T> => {
  const c = component as SFCWithInstall<T> & { name?: string }

  c.install = (app: App) => {
    const componentName = name ?? c.name
    if (!componentName) return
    app.component(componentName, c as unknown as Record<string, unknown>)
  }

  return c
}
