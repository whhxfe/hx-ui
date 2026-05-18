/**
 * 统一 OL 模块加载，三个 marker composable 共享同一缓存
 *
 * 提供两个入口：
 * - useOlModules()       → 同步获取（适用于 OL style 回调等同步上下文）
 * - ensureOlModules()    → 异步加载确保就绪（适用于 init/rebuild 等异步上下文）
 */

let _modules: any = null
let _loadPromise: Promise<any> | null = null

async function _load() {
  const [
    { default: VectorLayer },
    { default: VectorSource },
    { default: ClusterSource },
    { default: Feature },
    { default: Point },
    { default: Overlay },
    { fromLonLat },
    { Style, Fill, Stroke, Circle, Text, Icon },
    { unByKey },
  ] = await Promise.all([
    import('ol/layer/Vector'),
    import('ol/source/Vector'),
    import('ol/source/Cluster'),
    import('ol/Feature'),
    import('ol/geom/Point'),
    import('ol/Overlay'),
    import('ol/proj'),
    import('ol/style'),
    import('ol/Observable'),
  ])

  _modules = {
    VectorLayer,
    VectorSource,
    ClusterSource,
    Feature,
    Point,
    Overlay,
    fromLonLat,
    Style,
    Fill,
    Stroke,
    Circle,
    Text,
    Icon,
    unByKey,
  }
  return _modules
}

/** 同步获取已缓存的模块（首次调用返回 null，需先调用 ensureOlModules） */
export function useOlModules() {
  return _modules
}

/** 同步获取已缓存的模块（内部使用，返回 null 表示未加载） */
export function getOlModulesSync() {
  return _modules
}

/** 异步确保模块已加载 */
export async function ensureOlModules() {
  if (_modules) return _modules
  if (!_loadPromise) {
    _loadPromise = _load()
  }
  return _loadPromise
}
