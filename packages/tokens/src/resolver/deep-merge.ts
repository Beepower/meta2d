/**
 * Deep merge - 用于 theme partial → full 合并
 *
 * 规则:
 * - 对象递归合并
 * - 数组直接 override(不合并)
 * - 原始值直接 override
 * - undefined override 不生效(保留 base)
 */

export function deepMerge<T>(base: T, override: unknown): T {
  if (override === undefined) return base
  if (override === null) return null as T
  if (Array.isArray(override)) return override as T
  if (typeof override !== 'object') return override as T
  if (typeof base !== 'object' || base === null) return override as T
  if (Array.isArray(base)) return override as T

  const result: Record<string, unknown> = { ...(base as Record<string, unknown>) }
  for (const [k, v] of Object.entries(override as Record<string, unknown>)) {
    if (v === undefined) continue
    result[k] = deepMerge((base as Record<string, unknown>)[k], v)
  }
  return result as T
}
