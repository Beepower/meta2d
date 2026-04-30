/**
 * 运行时把 theme 应用到 DOM 元素(默认 :root)
 */

import type { ResolvedTheme } from '../resolver/resolver'
import { themeToCssVars } from './to-css-vars'

export interface ApplyOptions {
  /** 应用到哪个元素,默认 document.documentElement */
  target?: HTMLElement
  /** style 元素 ID(用于切换主题时移除旧 style),默认 'meta2d-theme' */
  styleId?: string
  /** 前缀,与 themeToCssVars 一致 */
  prefix?: string
}

/**
 * 把 ResolvedTheme 应用到 DOM
 *
 * 实装方式:在 <head> 注入 <style id="meta2d-theme">,而非每个变量 element.style.setProperty
 * 优势:切换主题时只需替换 style 内容,不触发 element 大规模 reflow
 */
export function applyThemeToDom(
  theme: ResolvedTheme,
  options: ApplyOptions = {}
): void {
  if (typeof document === 'undefined') {
    throw new Error('[meta2d/tokens] applyThemeToDom requires DOM environment')
  }

  const styleId = options.styleId ?? 'meta2d-theme'
  const target = options.target ?? document.documentElement
  const prefix = options.prefix ?? 'm2d'

  // 设置 data-theme 属性(让 CSS 选择器能匹配)
  target.setAttribute('data-theme', theme.id)

  // 注入或更新 style 标签
  let styleEl = document.getElementById(styleId) as HTMLStyleElement | null
  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = styleId
    document.head.appendChild(styleEl)
  }
  styleEl.textContent = themeToCssVars(theme, { prefix, withRootSelector: true })
}

/**
 * 移除已应用的 theme(回到无 token 状态)
 */
export function removeAppliedTheme(options: ApplyOptions = {}): void {
  if (typeof document === 'undefined') return
  const styleId = options.styleId ?? 'meta2d-theme'
  const styleEl = document.getElementById(styleId)
  styleEl?.remove()
  const target = options.target ?? document.documentElement
  target.removeAttribute('data-theme')
}
