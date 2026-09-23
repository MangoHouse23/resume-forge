// 主题配色预设：精选的专业级品牌色，同时适配深/浅色面板的自动文字翻转。
// 值即最终渲染到简历上的 `--accent`，与编辑页色块颜色严格一致。
export interface AccentPreset {
  name: string
  value: string
}

// 覆盖蓝 / 青 / 绿 / 紫 / 玫 / 橙 / 暖砂 / 石墨 主流色系
export const ACCENT_PRESETS: AccentPreset[] = [
  // —— 蓝 · 沉稳专业 ——
  { name: '深海军蓝', value: '#1e40af' },
  { name: '皇室蓝', value: '#2563eb' },
  { name: '天空蓝', value: '#0ea5e9' },
  { name: '青蓝', value: '#0891b2' },
  // —— 青绿 · 清爽通透 ——
  { name: '薄荷青', value: '#14b8a6' },
  { name: '松石青', value: '#0d9488' },
  { name: '黛青', value: '#0f766e' },
  // —— 绿 · 稳进生气 ——
  { name: '森林绿', value: '#15803d' },
  { name: '草绿', value: '#16a34a' },
  { name: '橄榄绿', value: '#4d7c0f' },
  // —— 紫 · 优雅知性 ——
  { name: '靛蓝紫', value: '#4f46e5' },
  { name: '深紫', value: '#6d28d9' },
  { name: '亮紫', value: '#7c3aed' },
  { name: '香芋紫', value: '#9333ea' },
  // —— 玫红 · 时尚活力 ——
  { name: '品红', value: '#db2777' },
  { name: '玫红', value: '#be185d' },
  { name: '蔷薇红', value: '#e11d48' },
  { name: '亮玫粉', value: '#ec4899' },
  // —— 橙红 · 热情亲和 ——
  { name: '中国红', value: '#dc2626' },
  { name: '绯红', value: '#b91c1c' },
  { name: '赤橙', value: '#ea580c' },
  { name: '活力橙', value: '#f97316' },
  // —— 暖砂 · 温润踏实 ——
  { name: '深琥珀', value: '#d97706' },
  { name: '暖棕', value: '#92400e' },
  { name: '陶土红', value: '#a9472f' },
  // —— 石墨 · 高级中性 ——
  { name: '石墨黑', value: '#1f2937' },
  { name: '岩板灰', value: '#334155' },
  { name: '深曜黑', value: '#0f172a' }
]

export const ACCENT_PRESET_VALUES = ACCENT_PRESETS.map((p) => p.value)

export function accentPresetName(value: string): string {
  return ACCENT_PRESETS.find((p) => p.value === value)?.name || ''
}