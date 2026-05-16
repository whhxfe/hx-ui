export interface RouteMeta {
  title: string
  icon: string
}

export const componentRoutes: Record<string, RouteMeta> = {
  button: {
    title: '按钮 Button',
    icon: 'ep-document',
  },
  icon: {
    title: '图标 Icon',
    icon: 'ep-picture-outline-round',
  },
  link: {
    title: '链接 Link',
    icon: 'ep-link',
  },
  text: {
    title: '文本 Text',
    icon: 'ep-document-copy',
  },
  'content-text': {
    title: '文本内容 ContentText',
    icon: 'ep-document-copy',
  },
  map: {
    title: '地图 Map',
    icon: 'ep-location-information',
  },
}
