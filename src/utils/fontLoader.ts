import { fontById } from '@/data/fonts'

const loaded = new Set<string>()

// 在文档头部注入字体的样式表 <link>，同一 URL 只加载一次。
// 用于预览页（v-html 注入）与编辑器界面：选中字体后动态拉取字形。
export function loadFontLink(fontId: string): void {
  const opt = fontById(fontId)
  if (!opt || !opt.cssUrl || loaded.has(opt.cssUrl)) return
  loaded.add(opt.cssUrl)
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = opt.cssUrl
  document.head.appendChild(link)
}