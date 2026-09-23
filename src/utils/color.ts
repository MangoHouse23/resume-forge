// 颜色工具：按背景亮度自动选可读前景色，保证对比度
export interface RGB { r: number; g: number; b: number }

export function parseHex(hex: string): RGB {
  let s = String(hex || '').trim().replace(/^#/, '')
  if (s.length === 3) s = s.split('').map((c) => c + c).join('')
  if (!/^[0-9a-fA-F]{6}$/.test(s)) return { r: 169, g: 71, b: 47 } // 兜底朱砂
  return {
    r: parseInt(s.slice(0, 2), 16),
    g: parseInt(s.slice(2, 4), 16),
    b: parseInt(s.slice(4, 6), 16)
  }
}

export function relLum(c: RGB): number {
  const f = (v: number) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b)
}

export function isLight(hex: string): boolean {
  return relLum(parseHex(hex)) > 0.3
}

function toHex(c: RGB): string {
  return '#' + [c.r, c.g, c.b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')
}

// 放在 hex 背景上的可读文字色（深背景下白、浅背景下墨）
export function onColor(hex: string): string {
  return isLight(hex) ? '#221d17' : '#ffffff'
}

// 将 hex 向黑色加深 k（0~1）
export function darken(hex: string, k: number): string {
  const c = parseHex(hex)
  return toHex({ r: c.r * (1 - k), g: c.g * (1 - k), b: c.b * (1 - k) })
}

// 用于白/浅底上的强调文字：浅色/白色主题自动充分加深以保证对比度
export function accentText(hex: string): string {
  const base = hex || '#a9472f'
  return isLight(base) ? darken(base, 0.62) : base
}