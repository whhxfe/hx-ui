/**
 * 从 features 中按 type 字段统计数量
 */
export function calcTypeCount(features: any[]): Record<string, number> {
  const typeCount: Record<string, number> = {}
  features.forEach((f: any) => {
    const item = f.get ? f.get('data') : f
    const type = item?.type || '其他'
    typeCount[type] = (typeCount[type] || 0) + 1
  })
  return typeCount
}