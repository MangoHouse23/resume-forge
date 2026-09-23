// 常用免费中文网络字体：优先用 Google Fonts 官方（免费、开源、可靠），
// 部分热门中文字体用 jsdelivr 开源 CDN。选中后由加载器动态注入 <link>，
// 并同步写入导出 HTML 的 <head>，保证预览与导出字体一致。
export interface FontOption {
  id: string
  name: string
  family: string // CSS font-family 名；'' 表示跟随默认（不覆盖）
  cssUrl: string // 加载该字体的样式表 URL；'' 表示无需外链
}

const GF = (q: string) => `https://fonts.googleapis.com/css2?${q}&display=swap`

export const FONT_OPTIONS: FontOption[] = [
  { id: 'default', name: '系统默认', family: '', cssUrl: '' },
  { id: 'notosans', name: '思源黑体', family: 'Noto Sans SC', cssUrl: GF('family=Noto+Sans+SC:wght@400;500;700;900') },
  { id: 'notoserif', name: '思源宋体', family: 'Noto Serif SC', cssUrl: GF('family=Noto+Serif+SC:wght@400;500;700;900') },
  { id: 'zcool', name: '站酷小薇', family: 'ZCOOL XiaoWei', cssUrl: GF('family=ZCOOL+XiaoWei') },
  { id: 'zcoolqing', name: '站酷庆科黄油体', family: 'ZCOOL QingKe HuangYou', cssUrl: GF('family=ZCOOL+QingKe+HuangYou') },
  { id: 'msz', name: '马善政毛笔手书', family: 'Ma Shan Zheng', cssUrl: GF('family=Ma+Shan+Zheng') },
  { id: 'lxgw', name: '霞鹜文楷', family: 'LXGW WenKai', cssUrl: 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/style.css' },
  { id: 'smiley', name: '得意黑', family: 'Smiley Sans', cssUrl: 'https://cdn.jsdelivr.net/npm/smiley-sans@1.1.0/dist/webfont/smiley-sans.css' }
]

export const fontById = (id: string): FontOption =>
  FONT_OPTIONS.find((f) => f.id === id) || FONT_OPTIONS[0]

export const fontFamilyOf = (id: string): string => fontById(id).family

export const fontCssUrlOf = (id: string): string => fontById(id).cssUrl

// 生成应用于简历 HTML 的 --rf-font 内联值（字形族名），未选字体返回空串
export const fontVarOf = (id: string): string => {
  const family = fontFamilyOf(id)
  return family ? `--rf-font:'${family.replace(/'/g, "\\'")}';` : ''
}