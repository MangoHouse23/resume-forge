// 简历渲染引擎：根据数据生成独立的 HTML（预览与导出共用）
import type { ResumeData, ResumeModuleKey, SkillItem, ExperienceItem } from '@/types/resume'
import { darken, accentText, relLum, parseHex } from '@/utils/color'
import { fontVarOf, fontFamilyOf, fontCssUrlOf } from '@/data/fonts'

export function esc(s: unknown): string {
  if (s === undefined || s === null) return ''
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function bullets(text: string): string {
  if (!text) return ''
  return text
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => `<li>${esc(l)}</li>`)
    .join('')
}

function range(start?: string, end?: string): string {
  const e = end || '至今'
  if (start && e) return `${esc(start)} - ${esc(e)}`
  return esc(e)
}

function contactChips(d: ResumeData): string[] {
  const b = d.basicInfo
  const c: { t?: string; v?: string }[] = [
    { t: '电话', v: b.phone },
    { t: '邮箱', v: b.email },
    { t: '城市', v: b.city || '' },
    { t: '微信', v: b.wechat },
    { t: '主页', v: b.website }
  ]
  return c.filter((x) => x.v).map((x) => `<span class="rf-chip">${x.t ? `<i>${esc(x.t)}</i>` : ''}${esc(x.v)}</span>`)
}

// 侧栏模块（双栏/创意风格）
const SIDEBAR: ResumeModuleKey[] = ['skills', 'languages', 'certificates', 'hobbies', 'honors', 'training']
const MAIN: ResumeModuleKey[] = [
  'targetInfo', 'summary', 'jobObjective', 'workExperience', 'projects', 'education',
  'internship', 'campusExperience', 'portfolio'
]

function skillBar(s: SkillItem): string {
  const dots = Array.from({ length: 5 }, (_, i) =>
    `<i class="${i < (s.level || 0) ? 'on' : ''}"></i>`
  ).join('')
  const tags = (s.tags || []).map((t) => `<em>${esc(t)}</em>`).join('')
  return `
    <div class="rf-skill">
      <div class="rf-skill-head"><b>${esc(s.name)}</b><span class="rf-dots">${dots}</span></div>
      ${tags ? `<div class="rf-skill-tags">${tags}</div>` : ''}
    </div>`
}

function sections(keys: ResumeModuleKey[], d: ResumeData): string {
  return keys.filter((k) => d.moduleOrder.includes(k)).map((k) => renderSection(k, d)).join('')
}

// 渲染单个模块区块；返回空串表示该模块无内容
export function renderSection(key: ResumeModuleKey, d: ResumeData): string {
  switch (key) {
    case 'targetInfo':
      return `
        <section class="rf-sec">
          <h3 class="rf-sec-title">求职意向</h3>
          <div class="rf-target">
            <div class="rf-target-main">
              <span class="rf-t-pos">${esc(d.targetInfo.position || '期望职位')}</span>
              <span class="rf-t-sub">${[d.targetInfo.city, d.targetInfo.salary, d.targetInfo.onBoardDate, d.targetInfo.workModel, d.targetInfo.industry].filter(Boolean).map((x) => esc(x!)).join(' · ')}</span>
            </div>
          </div>
        </section>`
    case 'summary':
      return d.summary
        ? `<section class="rf-sec"><h3 class="rf-sec-title">自我评价</h3><p class="rf-summary">${esc(d.summary)}</p></section>`
        : ''
    case 'jobObjective':
      return d.jobObjective
        ? `<section class="rf-sec"><h3 class="rf-sec-title">求职优势</h3><ul class="rf-jobs">${bullets(d.jobObjective)}</ul></section>`
        : ''
    case 'education':
      return listSection(
        '教育经历',
        d.education,
        (e) => `
          <div class="rf-edu">
            <div class="rf-main-line">
              <div class="rf-left"><b>${esc(e.school)}</b> <span class="rf-tag">${esc(e.degree)}</span><span class="rf-muted">${esc(e.major)}</span></div>
              <div class="rf-right">${range(e.start, e.end)}</div>
            </div>
            ${e.gpa ? `<div class="rf-gpa">绩点 / 成绩：${esc(e.gpa)}</div>` : ''}
            ${e.description ? `<p class="rf-desc">${esc(e.description)}</p>` : ''}
          </div>`
      )
    case 'workExperience':
    case 'internship':
    case 'campusExperience': {
      const title = key === 'workExperience' ? '工作经历' : key === 'internship' ? '实习经历' : '校园经历'
      const list = key === 'workExperience' ? d.workExperience : key === 'internship' ? d.internship : d.campusExperience
      return listSection(
        title,
        list,
        (e: ExperienceItem) => `
          <div class="rf-exp">
            <div class="rf-main-line">
              <div class="rf-left"><b>${esc(e.company)}</b><span class="rf-tag">${esc(e.position)}</span><span class="rf-muted">${esc(e.location)}</span></div>
              <div class="rf-right">${range(e.start, e.end)}</div>
            </div>
            ${e.description ? `<p class="rf-desc">${esc(e.description)}</p>` : ''}
            ${e.highlights?.length ? `<ul class="rf-hl">${e.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>` : ''}
          </div>`
      )
    }
    case 'projects':
      return listSection(
        '项目经历',
        d.projects,
        (p) => `
          <div class="rf-proj">
            <div class="rf-main-line">
              <div class="rf-left"><b>${esc(p.name)}</b>${p.role ? `<span class="rf-tag">${esc(p.role)}</span>` : ''}</div>
              <div class="rf-right">${range(p.start, p.end)}</div>
            </div>
            ${p.techStack ? `<div class="rf-stack">${esc(p.techStack)}</div>` : ''}
            ${p.description ? `<p class="rf-desc">${esc(p.description)}</p>` : ''}
          </div>`
      )
    case 'skills':
      return d.skills.length
        ? `<section class="rf-sec"><h3 class="rf-sec-title">专业技能</h3><div class="rf-skills">${d.skills.map(skillBar).join('')}</div></section>`
        : ''
    case 'certificates':
      return listSection('证书资质', d.certificates, (c) => `
        <div class="rf-simple-line"><span class="rf-dot">●</span><b>${esc(c.name)}</b><span class="rf-muted">${esc(c.issuer)} · ${esc(c.date)}</span></div>`)
    case 'languages':
      return listSection('语言能力', d.languages, (l) => `
        <div class="rf-simple-line"><span class="rf-dot">●</span><b>${esc(l.name)}</b><span class="rf-muted">${esc(l.level)}</span>${l.note ? `<span class="rf-muted">${esc(l.note)}</span>` : ''}</div>`)
    case 'training':
      return listSection('培训经历', d.training, (t) => `
        <div class="rf-simple-line"><span class="rf-dot">●</span><b>${esc(t.name)}</b><span class="rf-muted">${esc(t.issuer)} · ${esc(t.date)}</span></div>`)
    case 'portfolio':
      return listSection('作品集 / 链接', d.portfolio, (p) => `
        <div class="rf-port">
          <a>${esc(p.title || p.url || '')}</a>${p.url ? `<span class="rf-url">${esc(p.url)}</span>` : ''}${p.desc ? `<p class="rf-desc">${esc(p.desc)}</p>` : ''}
        </div>`)
    case 'hobbies':
      return d.hobbies.length
        ? `<section class="rf-sec"><h3 class="rf-sec-title">兴趣爱好</h3><div class="rf-tags">${d.hobbies.map((h) => `<span class="rf-chip">${esc(h)}</span>`).join('')}</div></section>`
        : ''
    case 'honors':
      return d.honors.length
        ? `<section class="rf-sec"><h3 class="rf-sec-title">荣誉奖励</h3><div class="rf-tags">${d.honors.map((h) => `<span class="rf-chip">${esc(h)}</span>`).join('')}</div></section>`
        : ''
    default:
      return ''
  }
}

function listSection(title: string, items: any[], itemHtml: (it: any) => string): string {
  return items.length
    ? `<section class="rf-sec"><h3 class="rf-sec-title">${title}</h3><div class="rf-list">${items.map(itemHtml).join('')}</div></section>`
    : ''
}

// 寸照：固定 5:7 竖向矩形区域，未设照片时显示占位人形图标
function idPhoto(d: ResumeData): string {
  const a = d.basicInfo.avatar
  const inner = a
    ? `<img src="${esc(a)}" alt="寸照"/>`
    : `<span class="rf-idphoto-ph" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4.5 20c.6-3.4 3.8-5 7.5-5s6.9 1.6 7.5 5"/></svg>
       </span>`
  return `<div class="rf-idphoto">${inner}</div>`
}

function buildHeader(d: ResumeData, showPhoto: boolean): string {
  const b = d.basicInfo
  const sub = [b.gender && `性别 ${esc(b.gender)}`, b.age && `${esc(b.age)}岁`, b.birthDate && esc(b.birthDate)]
    .filter(Boolean)
    .join(' · ')
  return `
    <div class="rf-header">
      <div class="rf-h-main">
        <h1 class="rf-name">${esc(b.name || '你的姓名')}</h1>
        <div class="rf-h-sub">${esc(d.targetInfo.position || '目标职位')}</div>
        ${sub ? `<div class="rf-h-basic">${sub}</div>` : ''}
        <div class="rf-chips">${contactChips(d).join('')}</div>
      </div>
      ${showPhoto ? idPhoto(d) : ''}
    </div>`
}

function buildHtml(d: ResumeData): string {
  const template = d.meta?.templateId || 'clean'
  const accent = d.meta?.accentColor || '#2563eb'
  if (template === 'elegant') return elegantHtml(d, accent)
  if (template === 'vibrant') return vibrantHtml(d, accent)
  if (template === 'timeline') return timelineHtml(d, accent)
  if (template === 'modern') return modernHtml(d, accent)
  if (template === 'editorial') return editorialHtml(d, accent)
  return cleanHtml(d, accent)
}

// 主题变量：色带/侧栏直接使用主题色 `--accent`，保证色块颜色与编辑器色板严格一致。
// 由 `--on-side`/`--on-band` 依据主题色亮度自动翻转文字颜色，兼顾可读性。
const INK = '#221d17' // 深墨文字
const LIGHT_LIMIT = 0.2 // 相对亮度高于该值视为浅色 → 用深墨文字
function styleVars(accent: string, font = ''): string {
  const base = accent || '#2563eb'
  const lum = relLum(parseHex(base))
  const on = lum > LIGHT_LIMIT ? INK : '#ffffff'
  // 仅做同色系轻微加深以营造层次，主色仍为 `--accent` 本身
  return `--accent:${base};--on-accent:${on};--accent-text:${accentText(base)};` +
    `--on-side:${on};--on-band:${on};` +
    `--side-deep:${darken(base, 0.18)};--band-deep:${darken(base, 0.3)};` +
    `--side-bg:linear-gradient(180deg,${base},${darken(base, 0.18)});` +
    `--band-bg:linear-gradient(120deg,${base} 0%,${darken(base, 0.3)} 130%);` +
    fontVarOf(font)
}

function cleanHtml(d: ResumeData, accent: string): string {
  const order = d.moduleOrder
  const body = [buildHeader(d, true), ...order.map((k) => renderSection(k, d)).filter(Boolean)].join('')
  return `<div class="rfp clean" style="${styleVars(accent, d.meta.font)}">${body}</div>`
}

function elegantHtml(d: ResumeData, accent: string): string {
  const side = SIDEBAR.filter((k) => d.moduleOrder.includes(k)).map((k) => renderSection(k, d)).filter(Boolean).join('')
  const main = MAIN.filter((k) => d.moduleOrder.includes(k)).map((k) => renderSection(k, d)).filter(Boolean).join('')
  const header = `
    <div class="rf-header side">
      ${idPhoto(d)}
      <h1 class="rf-name">${esc(d.basicInfo.name || '你的姓名')}</h1>
      <div class="rf-h-sub">${esc(d.targetInfo.position || '目标职位')}</div>
      <div class="rf-side-contacts">
        ${[
          ['📱', d.basicInfo.phone], ['✉️', d.basicInfo.email], ['📍', d.basicInfo.city],
          ['💬', d.basicInfo.wechat], ['🌐', d.basicInfo.website]
        ].map(([ic, v]) => (v ? `<div class="rf-side-li"><i>${ic}</i><span>${esc(v)}</span></div>` : '')).join('')}
        ${d.basicInfo.age ? `<div class="rf-side-li"><i>🎂</i><span>${esc(d.basicInfo.age)} 岁</span></div>` : ''}
      </div>
    </div>`
  return `
    <div class="rfp elegant" style="${styleVars(accent, d.meta.font)}">
      <aside class="rf-side">
        ${header}
        ${side}
      </aside>
      <main class="rf-main">${main}</main>
    </div>`
}

function vibrantHtml(d: ResumeData, accent: string): string {
  const side = SIDEBAR.filter((k) => d.moduleOrder.includes(k)).map((k) => renderSection(k, d)).filter(Boolean).join('')
  const main = MAIN.filter((k) => d.moduleOrder.includes(k)).map((k) => renderSection(k, d)).filter(Boolean).join('')
  const name = d.basicInfo.name || '你的姓名'
  return `
    <div class="rfp vibrant" style="${styleVars(accent, d.meta.font)}">
      <div class="rf-band">
        ${idPhoto(d)}
        <div class="rf-band-info">
          <h1 class="rf-name">${esc(name)}</h1>
          <div class="rf-h-sub">${esc(d.targetInfo.position || '目标职位')}</div>
          <div class="rf-chips dark">${contactChips(d).join('')}</div>
        </div>
      </div>
      <div class="rf-v-body">
        <aside class="rf-side v">
          <section class="rf-sec"><h3 class="rf-sec-title">基本</h3>
            <div class="rf-v-facts">
              ${d.basicInfo.age ? `<div><i>🎂</i><span>${esc(d.basicInfo.age)} 岁</span></div>` : ''}
              ${d.basicInfo.gender ? `<div><i>👤</i><span>${esc(d.basicInfo.gender)}</span></div>` : ''}
              ${d.basicInfo.city ? `<div><i>📍</i><span>${esc(d.basicInfo.city)}</span></div>` : ''}
              ${[d.targetInfo.salary, d.targetInfo.onBoardDate].filter(Boolean).map((x) => `<div><i>🎯</i><span>${esc(x!)}</span></div>`).join('')}
            </div>
          </section>
          ${side}
        </aside>
        <main class="rf-main">${main}</main>
      </div>
    </div>`
}

// ============ TIMELINE 时间轴 ============
function timelineHtml(d: ResumeData, accent: string): string {
  const order = d.moduleOrder
  const body = order.map((k) => renderSection(k, d)).filter(Boolean).join('')
  const b = d.basicInfo
  const head = `
    <div class="rf-headline">
      <div class="rf-headline-info">
        <h1 class="rf-name">${esc(b.name || '你的姓名')}</h1>
        <div class="rf-h-sub">${esc(d.targetInfo.position || '目标职位')}</div>
        <div class="rf-chips">${contactChips(d).join('')}</div>
      </div>
      ${idPhoto(d)}
    </div>`
  return `<div class="rfp timeline" style="${styleVars(accent, d.meta.font)}">${head}<div class="rf-tl-body">${body}</div></div>`
}

// ============ MODERN 极简现代 ============
function modernHtml(d: ResumeData, accent: string): string {
  const order = d.moduleOrder
  const body = order.map((k) => renderSection(k, d)).filter(Boolean).join('')
  const b = d.basicInfo
  const head = `
    <div class="rf-mod-head">
      <div class="rf-mod-info">
        <div class="rf-mod-role">${esc(d.targetInfo.position || '目标职位')}</div>
        <h1 class="rf-name">${esc(b.name || '你的姓名')}</h1>
        <div class="rf-mod-chips">${contactChips(d).join('')}</div>
      </div>
      ${idPhoto(d)}
    </div>`
  return `<div class="rfp modern" style="${styleVars(accent, d.meta.font)}">${head}<div class="rf-mod-body">${body}</div></div>`
}

// ============ EDITORIAL 杂志排版 ============
function editorialHtml(d: ResumeData, accent: string): string {
  const rail = SIDEBAR.filter((k) => d.moduleOrder.includes(k)).map((k) => renderSection(k, d)).filter(Boolean).join('')
  const main = MAIN.filter((k) => d.moduleOrder.includes(k)).map((k) => renderSection(k, d)).filter(Boolean).join('')
  const b = d.basicInfo
  const head = `
    <div class="rf-ed-head">
      <div class="rf-ed-info">
        <div class="rf-ed-role">${esc(d.targetInfo.position || '目标职位')}</div>
        <h1 class="rf-name">${esc(b.name || '你的姓名')}</h1>
        <div class="rf-ed-sub">${[b.gender && `性别 ${esc(b.gender)}`, b.age && `${esc(b.age)}岁`, b.birthDate && esc(b.birthDate)].filter(Boolean).join(' · ')}</div>
        <div class="rf-chips">${contactChips(d).join('')}</div>
      </div>
      ${idPhoto(d)}
    </div>`
  return `
    <div class="rfp editorial" style="${styleVars(accent, d.meta.font)}">
      ${head}
      <div class="rf-ed-body">
        <main class="rf-ed-main">${main}</main>
        <aside class="rf-rail">${rail}</aside>
      </div>
    </div>`
}

export interface RenderResult {
  html: string
  title: string
}

export function renderResume(d: ResumeData): RenderResult {
  return { html: buildHtml(d), title: d.meta?.title || '我的简历' }
}

export function buildFullHtml(d: ResumeData): string {
  const r = renderResume(d)
  const fontCss = fontCssUrlOf(d.meta.font)
  const fontLink = fontCss
    ? `<link rel="stylesheet" href="${esc(fontCss)}"/>`
    : ''
  const bodyFont = fontFamilyOf(d.meta.font)
  const bodyStyle = bodyFont
    ? `font-family:'${bodyFont.replace(/'/g, "\\'")}',-apple-system,"PingFang SC","Microsoft YaHei",sans-serif;`
    : ''
  return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${esc(r.title)}</title>
${fontLink}<style>${PREVIEW_CSS}\n${PRINT_CSS}</style></head>
<body style="${bodyStyle}"><div class="rf-canvas">${r.html}</div></body></html>`
}

export const PREVIEW_CSS = `
.rf-canvas{display:flex;justify-content:center;background:#eef1f6;padding:24px 0}
.rfp{width:794px;min-height:1123px;background:#fff;margin:0 auto;position:relative;
  box-shadow:0 4px 24px rgba(15,23,42,.12);font-family:var(--rf-font),-apple-system,"PingFang SC","Microsoft YaHei",sans-serif;
  color:#26221c;line-height:1.6;padding:40px 44px;box-sizing:border-box}
.rfp *{box-sizing:border-box;margin:0}
.rfp a{color:inherit;text-decoration:none}

/* ---------- header ---------- */
.rf-header{display:flex;gap:26px;align-items:center;margin-bottom:26px;padding-bottom:22px;border-bottom:1px solid #e6e0d4}
/* 寸照：5:7 竖向矩形，未设照片时显示占位图标 */
.rf-idphoto{width:100px;height:140px;border-radius:8px;overflow:hidden;flex-shrink:0;background:#f2f4f8;border:1px solid #e6e0d4;display:grid;place-items:center}
.rf-idphoto img{width:100%;height:100%;object-fit:cover;display:block}
.rf-idphoto-ph{width:100%;height:100%;display:grid;place-items:center;color:#c3c9d4}
.rf-idphoto-ph svg{width:34px;height:34px;opacity:.75}
.rf-h-main{flex:1}
.rf-name{font-size:32px;font-weight:700;letter-spacing:.04em;color:#1f1b15;line-height:1.2;font-family:var(--rf-font),"Noto Serif SC","Songti SC",serif}
.rf-h-sub{color:var(--accent-text,var(--accent));font-weight:600;font-size:15px;margin-top:5px}
.rf-h-basic{color:#8b8174;font-size:12px;margin-top:4px}
.rf-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.rf-chip{display:inline-flex;align-items:center;gap:6px;border:1px solid #ece6db;background:#faf8f4;border-radius:999px;padding:3px 12px;font-size:12px;color:#4b443a}
.rf-chip i{font-style:normal;color:var(--accent-text,var(--accent))}
.rf-chips.dark .rf-chip{background:color-mix(in srgb,var(--on-band) 16%,transparent);border-color:transparent;color:var(--on-band)}
.rf-chips.dark .rf-chip i{color:color-mix(in srgb,var(--on-band) 85%,transparent)}

/* ---------- section ---------- */
.rf-sec{margin-bottom:22px}
.rf-sec-title{font-size:16px;font-weight:700;color:#1f1b15;margin-bottom:12px;padding-left:12px;border-left:3px solid var(--accent);line-height:1.2;font-family:var(--rf-font),"Noto Serif SC","Songti SC",serif;letter-spacing:.02em}
.rf-sec+.rf-sec{margin-top:0}
.rf-summary{color:#3b362f;font-size:13px}
.rf-list{display:flex;flex-direction:column;gap:13px}

/* ---------- lines ---------- */
.rf-main-line{display:flex;justify-content:space-between;align-items:baseline;gap:12px;flex-wrap:wrap}
.rf-left b{font-size:14px;color:#111827}
.rf-tag{display:inline-block;background:var(--accent);color:var(--on-accent,#fff);font-size:11px;padding:1px 8px;border-radius:4px;margin-left:8px;vertical-align:1px}
.rf-muted{color:#6b7280;font-size:12px;margin-left:8px}
.rf-right{color:#6b7280;font-size:12px;white-space:nowrap}
.rf-desc{color:#4b5563;font-size:12.5px;margin-top:6px}
.rf-gpa{color:#059669;font-size:12px;margin-top:4px}
.rf-hl{margin:8px 0 0;padding-left:18px;color:#374151;font-size:12.5px;display:flex;flex-direction:column;gap:4px}
.rf-hl li::marker{color:var(--accent-text,var(--accent))}
.rf-stack{display:inline-block;background:#ecfdf5;color:#0f7a44;font-size:11px;padding:2px 8px;border-radius:4px;margin-top:6px}
.rf-simple-line{display:flex;align-items:baseline;gap:8px;font-size:13px}
.rf-simple-line b{font-size:13px}
.rf-dot{color:var(--accent-text,var(--accent));font-size:8px}
.rf-simple-line .rf-muted{margin-left:auto;margin-left:0}
.rf-simple-line .rf-muted:last-of-type{margin-left:auto}

/* ---------- skills ---------- */
.rf-skills{display:grid;grid-template-columns:1fr 1fr;gap:12px 24px}
.rf-skill-head{display:flex;flex-direction:column;align-items:stretch;gap:7px;font-size:13px;white-space:nowrap;min-width:0}
.rf-skill-head b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
/* 进度条独占一行、通栏显示，避免与名称互相挤压 */
.rf-skill-head .rf-dots{display:flex;gap:4px;width:100%}
.rf-skill-head .rf-dots i{flex:1 1 0;height:6px;border-radius:3px}
.rf-dots{display:inline-flex;gap:4px}
.rf-dots i{width:12px;height:7px;border-radius:2px;background:#e5e7eb}
.rf-dots i.on{background:var(--accent)}
.rf-skill-tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}
.rf-skill-tags em{font-style:normal;font-size:11px;color:#6b7280;background:#f3f4f6;padding:1px 7px;border-radius:999px;white-space:nowrap}

/* ---------- tags ---------- */
.rf-tags{display:flex;flex-wrap:wrap;gap:8px}
.rf-tags .rf-chip{padding:4px 12px}

/* ---------- target ---------- */
.rf-target{padding:12px 14px;background:#f8fafc;border-radius:8px;border:1px solid #eef2f7}
.rf-t-pos{font-size:15px;font-weight:700;color:#111827;display:block}
.rf-t-sub{color:#6b7280;font-size:12px;margin-top:4px;display:block}

/* ---------- portfolio ---------- */
.rf-port a{font-weight:600;color:var(--accent)}
.rf-port .rf-url{margin-left:8px;color:#94a3b8;font-size:12px}
.rf-port .rf-desc{margin-top:2px}

/* ============ ELEGANT (two-column) ============ */
.rfp.elegant{display:flex;padding:0;min-height:1123px;overflow:hidden}
/* 侧栏背景直接为主题色，文字按 on-side 变量自动翻转深浅，与色板一致 */
.rf-side{width:288px;flex-shrink:0;color:var(--on-side);padding:34px 24px;background:var(--side-bg,var(--accent))}
.rf-side .rf-sec-title{color:var(--on-side);border-left-color:color-mix(in srgb,var(--on-side) 55%,transparent);font-size:14px}
.rf-side .rf-h-sub,.rf-side .rf-name{color:var(--on-side)}
.rf-side .rf-h-basic{color:color-mix(in srgb,var(--on-side) 72%,transparent)}
.rf-side .rf-summary,.rf-side .rf-desc,.rf-side b,.rf-side .rf-muted,.rf-side .rf-dots i{color:var(--on-side)}
.rf-side .rf-muted{color:color-mix(in srgb,var(--on-side) 78%,transparent)}
.rf-side .rf-dots i{background:color-mix(in srgb,var(--on-side) 26%,transparent)}
.rf-side .rf-dots i.on{background:var(--on-side)}
.rf-side .rf-chip{background:color-mix(in srgb,var(--on-side) 15%,transparent);color:var(--on-side)}
.rf-side .rf-chip i{color:color-mix(in srgb,var(--on-side) 85%,transparent)}
.rf-side .rf-dot{color:color-mix(in srgb,var(--on-side) 75%,transparent)}
.rf-side .rf-skill-tags em{background:color-mix(in srgb,var(--on-side) 16%,transparent);color:color-mix(in srgb,var(--on-side) 86%,transparent)}
.rf-header.side{flex-direction:column;align-items:center;text-align:center;gap:10px;padding-bottom:18px;margin-bottom:16px;border-bottom-color:color-mix(in srgb,var(--on-side) 25%,transparent)}
.rf-header.side .rf-name{font-size:23px}
.rf-side-contacts{display:flex;flex-direction:column;gap:8px;margin-top:8px;align-items:flex-start;text-align:left;width:100%}
.rf-side-li{display:flex;align-items:center;gap:10px;font-size:12px}
.rf-side-li i{font-style:normal;font-size:14px}
.rf-main{flex:1;padding:32px 34px}

/* ============ VIBRANT (creative) ============ */
.rfp.vibrant{padding:0;overflow:hidden}
.rf-band{display:flex;align-items:center;gap:24px;padding:32px 40px;background:var(--band-bg,var(--accent));color:var(--on-band)}
.rfp.vibrant .rf-idphoto{width:108px;height:108px;border-radius:50%;background:color-mix(in srgb,var(--on-band) 14%,transparent);border:3px solid color-mix(in srgb,var(--on-band) 60%,transparent)}
.rfp.vibrant .rf-idphoto-ph{color:color-mix(in srgb,var(--on-band) 60%,transparent)}
.rf-band .rf-name,.rf-band .rf-h-sub{color:var(--on-band)}
.rf-v-body{display:flex;}
.rf-side.v{width:260px;background:#f8fafc;padding:26px 22px;border-right:1px solid #eef2f7;flex-shrink:0}
.rf-side.v .rf-sec-title{color:#111827}
.rf-v-facts{display:flex;flex-direction:column;gap:8px;font-size:12.5px;color:#374151}
.rf-v-facts div{display:flex;gap:8px;align-items:center}
.rf-v-facts i{font-style:normal;color:var(--accent-text,var(--accent))}
.rf-pill{display:inline-block;background:var(--accent);color:var(--on-accent,#fff);font-size:12px;padding:2px 10px;border-radius:999px}

/* 典雅双栏侧栏照片：圆形居上 */
.rfp.elegant .rf-idphoto{width:104px;height:104px;border-radius:50%;background:color-mix(in srgb,var(--on-side) 14%,transparent);border:2px solid color-mix(in srgb,var(--on-side) 45%,transparent)}
.rfp.elegant .rf-idphoto-ph{color:color-mix(in srgb,var(--on-side) 55%,transparent)}

/* ============ TIMELINE 时间轴 ============ */
.rfp.timeline{padding:34px 44px 44px}
.rf-headline{display:flex;gap:26px;align-items:center;padding-bottom:20px;margin-bottom:20px;border-bottom:1px solid #ece6db}
.rf-headline-info{flex:1}
.rf-headline .rf-name{font-size:30px}
.rf-headline .rf-h-sub{margin-top:5px}
.rfp.timeline .rf-tl-body{padding-top:4px}
/* 轴线与所有圆点/结束圆点水平中心统一为 x=10，保证严格对齐 */
.rfp.timeline .rf-sec{position:relative;padding-left:30px}
.rfp.timeline .rf-sec::before{content:'';position:absolute;left:9px;top:12px;bottom:-34px;width:2px;background:color-mix(in srgb,var(--accent) 34%,transparent)}
.rfp.timeline .rf-sec:last-child::before{bottom:8px}
.rfp.timeline .rf-sec-title{position:relative;padding-left:0;border-left:none}
.rfp.timeline .rf-sec-title::before{content:'';position:absolute;left:-27px;top:50%;transform:translateY(-50%);width:14px;height:14px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 4px color-mix(in srgb,var(--accent) 18%,transparent)}
.rfp.timeline .rf-exp,.rfp.timeline .rf-edu,.rfp.timeline .rf-proj{position:relative}
.rfp.timeline .rf-main-line{position:relative}
.rfp.timeline .rf-main-line::before{content:'';position:absolute;left:-24px;top:6px;width:8px;height:8px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 2px color-mix(in srgb,var(--accent) 22%,transparent)}
/* 时间轴终止圆点 */
.rfp.timeline .rf-sec:last-child::after{content:'';position:absolute;left:5px;bottom:2px;width:10px;height:10px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 20%,transparent)}

/* ============ MODERN 极简现代 ============ */
.rfp.modern{padding:36px 48px 44px;background:#fff}
.rf-mod-head{display:flex;gap:30px;align-items:center;padding-bottom:22px;border-bottom:2px solid var(--accent)}
.rf-mod-info{flex:1}
.rf-mod-role{font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--accent-text,var(--accent));font-weight:700;margin-bottom:4px}
.rf-mod-head .rf-name{font-size:34px;font-weight:700}
.rf-mod-head .rf-idphoto{width:94px;height:126px;border-radius:8px;border:1px solid #e6e6e6;background:#f7f7f7}
.rf-mod-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:14px}
.rf-mod-chips .rf-chip{background:#fff;border:1px solid #e6e6e6;border-radius:0}
.rf-mod-body{padding-top:6px}
.rfp.modern .rf-sec{margin-bottom:24px}
.rfp.modern .rf-sec-title{display:flex;align-items:center;gap:10px;border-left:none;padding-left:0;color:#171412;font-size:14px;letter-spacing:.14em;text-transform:uppercase}
.rfp.modern .rf-sec-title::before{content:'';width:7px;height:7px;background:var(--accent);transform:rotate(45deg);flex-shrink:0}
.rfp.modern .rf-sec-title::after{content:'';flex:1;height:1px;background:#ececec}
.rfp.modern .rf-tag{background:transparent;color:var(--accent-text,var(--accent));border:1px solid color-mix(in srgb,var(--accent) 45%,transparent);border-radius:999px}
.rfp.modern .rf-dots i.on{background:var(--accent)}
.rfp.modern .rf-skill-tags em{background:#fff;border:1px solid #ececec;border-radius:0}

/* ============ EDITORIAL 杂志排版 ============ */
.rfp.editorial{display:block;padding:0;min-height:1123px}
.rf-ed-head{display:flex;gap:28px;align-items:center;padding:36px 44px 22px;border-bottom:3px double color-mix(in srgb,var(--accent) 55%,transparent)}
.rf-ed-info{flex:1}
.rf-ed-role{font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:var(--accent-text,var(--accent));font-weight:700;margin-bottom:6px}
.rf-ed-head .rf-name{font-size:36px}
.rf-ed-sub{color:#9aa0a6;font-size:12px;margin:4px 0 10px}
.rf-ed-head .rf-idphoto{width:96px;height:128px;border-radius:8px;border:1px solid color-mix(in srgb,var(--accent) 30%,transparent)}
.rf-ed-body{display:flex;align-items:stretch}
.rf-ed-main{flex:1;padding:30px 36px 40px}
.rf-rail{width:244px;flex-shrink:0;background:color-mix(in srgb,var(--accent) 5%,#fffbf6);border-left:1px solid color-mix(in srgb,var(--accent) 16%,transparent);padding:30px 20px 40px}
.rfp.editorial .rf-sec-title{font-size:16px;letter-spacing:.06em}
.rf-rail .rf-sec{background:#fff;padding:14px;border:1px solid color-mix(in srgb,var(--accent) 14%,transparent);border-radius:6px}
.rf-rail .rf-sec-title{font-size:13px;margin-bottom:10px}

/* ============ 移动端响应式（手机宽度） ============ */
@media screen and (max-width:520px){
  .rfp{width:100%;padding:20px 16px;box-shadow:none}
  .rf-name{font-size:24px}
  .rf-idphoto{width:68px;height:95px}
  .rf-header{gap:18px}
  .rf-header.gap:not(.side){gap:14px;padding-bottom:14px;margin-bottom:16px}
  .rf-chips{gap:6px;margin-top:10px}
  .rf-chip{font-size:11px;padding:2px 9px}
  .rf-sec-title{font-size:14px;margin-bottom:8px}
  .rf-skills{grid-template-columns:1fr;gap:10px}
  .rf-list{gap:10px}
  /* 典雅双栏 -> 单列堆叠 */
  .rfp.elegant{display:block}
  .rf-side{width:100%;padding:22px 18px}
  .rf-side .rf-sec-title{font-size:13px}
  .rf-side .rf-skill-tags em{font-size:10px}
  .rf-main{padding:18px 16px}
  .rf-header.side .rf-idphoto{width:84px;height:84px}
  .rf-header.side .rf-name{font-size:20px}
  /* 创意活力 -> 单列堆叠 */
  .rfp.vibrant .rf-band{flex-direction:column;text-align:center;gap:14px;padding:24px 16px 20px}
  .rfp.vibrant .rf-chips.dark{justify-content:center}
  .rfp.vibrant .rf-v-body{display:block}
  .rf-side.v{width:100%;padding:16px;border-right:none;border-bottom:1px solid #eef2f7}
  .rf-v-body .rf-main{padding:16px}
  .rfp.vibrant .rf-band .rf-idphoto{width:84px;height:84px}
  /* 时间轴：小屏轴心 x=9 */
  .rfp.timeline{padding:26px 18px 30px}
  .rf-headline{flex-direction:column;text-align:center;gap:14px}
  .rf-headline .rf-chips{justify-content:center}
  .rfp.timeline .rf-idphoto{width:74px;height:74px;border-radius:50%}
  .rfp.timeline .rf-sec{padding-left:22px}
  .rfp.timeline .rf-sec::before{left:8px}
  .rfp.timeline .rf-sec-title::before{left:-19px;width:12px;height:12px}
  .rfp.timeline .rf-main-line::before{left:-17px}
  .rfp.timeline .rf-sec:last-child::after{left:4px}
  /* 极简现代 */
  .rfp.modern{padding:26px 20px 32px}
  .rf-mod-head{flex-direction:column;text-align:center;gap:14px}
  .rf-mod-head .rf-mod-chips{justify-content:center}
  .rf-mod-head .rf-idphoto{width:72px;height:96px}
  .rfp.modern .rf-sec-title{font-size:12.5px}
  /* 杂志排版 -> 单列 */
  .rfp.editorial{display:block}
  .rf-ed-head{flex-direction:column;text-align:center;gap:14px;padding:26px 18px 18px}
  .rf-ed-head .rf-chips{justify-content:center}
  .rf-ed-body{display:block}
  .rf-ed-main{padding:22px 18px 26px}
  .rf-rail{width:100%;padding:22px 18px 26px;border-left:none;border-top:3px double color-mix(in srgb,var(--accent) 40%,transparent)}
  .rf-main-line{flex-direction:column;align-items:flex-start;gap:4px}
  .rf-right{white-space:normal}
  .rf-simple-line .rf-muted:last-of-type{margin-left:0;display:block}
  .rf-simple-line{flex-wrap:wrap}
}
`

export const PRINT_CSS = `
@media print{
  @page{size:A4;margin:10mm}
  html,body{margin:0;padding:0;background:#fff}
  /* 一比一还原：保留背景色与文字颜色，不被打印引擎改色 */
  *,*::before,*::after{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;color-adjust:exact!important}
  .rf-canvas{padding:0;background:#fff}
  .rfp{box-shadow:none;margin:0;width:auto;max-width:none;min-height:auto}
}
`