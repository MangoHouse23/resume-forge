// 简历渲染引擎：根据数据生成独立的 HTML（预览与导出共用）
import type { ResumeData, ResumeModuleKey, SkillItem, ExperienceItem } from '@/types/resume'

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

function buildHeader(d: ResumeData, showAvatar: boolean): string {
  const b = d.basicInfo
  const avatar = b.avatar
    ? `<div class="rf-avatar" style="background-image:url(${esc(b.avatar)})"></div>`
    : ''
  const sub = [b.gender && `性别 ${esc(b.gender)}`, b.age && `${esc(b.age)}岁`, b.birthDate && esc(b.birthDate)]
    .filter(Boolean)
    .join(' · ')
  return `
    <div class="rf-header">
      ${showAvatar && avatar ? `<div class="rf-avatar-wrap">${avatar}</div>` : ''}
      <div class="rf-h-main">
        <h1 class="rf-name">${esc(b.name || '你的姓名')}</h1>
        <div class="rf-h-sub">${esc(d.targetInfo.position || '目标职位')}</div>
        ${sub ? `<div class="rf-h-basic">${sub}</div>` : ''}
        <div class="rf-chips">${contactChips(d).join('')}</div>
      </div>
    </div>`
}

function buildHtml(d: ResumeData): string {
  const template = d.meta?.templateId || 'clean'
  const accent = d.meta?.accentColor || '#2563eb'
  if (template === 'elegant') return elegantHtml(d, accent)
  if (template === 'vibrant') return vibrantHtml(d, accent)
  return cleanHtml(d, accent)
}

function cleanHtml(d: ResumeData, accent: string): string {
  const order = d.moduleOrder
  const body = [buildHeader(d, true), ...order.map((k) => renderSection(k, d)).filter(Boolean)].join('')
  return `<div class="rfp clean" style="--accent:${accent}">${body}</div>`
}

function elegantHtml(d: ResumeData, accent: string): string {
  const side = SIDEBAR.filter((k) => d.moduleOrder.includes(k)).map((k) => renderSection(k, d)).filter(Boolean).join('')
  const main = MAIN.filter((k) => d.moduleOrder.includes(k)).map((k) => renderSection(k, d)).filter(Boolean).join('')
  const header = `
    <div class="rf-header side">
      ${d.basicInfo.avatar ? `<div class="rf-avatar-wrap"><div class="rf-avatar" style="background-image:url(${esc(d.basicInfo.avatar)})"></div></div>` : ''}
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
    <div class="rfp elegant" style="--accent:${accent}">
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
  const initial = name.charAt(0)
  return `
    <div class="rfp vibrant" style="--accent:${accent}">
      <div class="rf-band">
        <div class="rf-band-avatar">${d.basicInfo.avatar ? `<img src="${esc(d.basicInfo.avatar)}" alt=""/>` : esc(initial)}</div>
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

export interface RenderResult {
  html: string
  title: string
}

export function renderResume(d: ResumeData): RenderResult {
  return { html: buildHtml(d), title: d.meta?.title || '我的简历' }
}

export function buildFullHtml(d: ResumeData): string {
  const r = renderResume(d)
  return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${esc(r.title)}</title>
<style>${PREVIEW_CSS}\n${PRINT_CSS}</style></head>
<body><div class="rf-canvas">${r.html}</div></body></html>`
}

export const PREVIEW_CSS = `
.rf-canvas{display:flex;justify-content:center;background:#eef1f6;padding:24px 0}
.rfp{width:794px;min-height:1123px;background:#fff;margin:0 auto;position:relative;
  box-shadow:0 4px 24px rgba(15,23,42,.12);font-family:-apple-system,"PingFang SC","Microsoft YaHei",sans-serif;
  color:#26221c;line-height:1.6;padding:40px 44px;box-sizing:border-box}
.rfp *{box-sizing:border-box;margin:0}
.rfp a{color:inherit;text-decoration:none}

/* ---------- header ---------- */
.rf-header{display:flex;gap:26px;align-items:center;margin-bottom:26px;padding-bottom:22px;border-bottom:1px solid #e6e0d4}
.rf-avatar-wrap{flex-shrink:0}
.rf-avatar{width:96px;height:96px;border-radius:50%;background-position:center;background-size:cover;border:1px solid rgba(0,0,0,.08);box-shadow:0 2px 10px rgba(0,0,0,.08)}
.rf-h-main{flex:1}
.rf-name{font-size:32px;font-weight:700;letter-spacing:.04em;color:#1f1b15;line-height:1.2;font-family:"Noto Serif SC","Songti SC",serif}
.rf-h-sub{color:var(--accent);font-weight:600;font-size:15px;margin-top:5px}
.rf-h-basic{color:#8b8174;font-size:12px;margin-top:4px}
.rf-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.rf-chip{display:inline-flex;align-items:center;gap:6px;border:1px solid #ece6db;background:#faf8f4;border-radius:999px;padding:3px 12px;font-size:12px;color:#4b443a}
.rf-chip i{font-style:normal;color:var(--accent)}
.rf-chips.dark .rf-chip{background:rgba(255,255,255,.16);border-color:transparent;color:#fff}

/* ---------- section ---------- */
.rf-sec{margin-bottom:22px}
.rf-sec-title{font-size:16px;font-weight:700;color:#1f1b15;margin-bottom:12px;padding-left:12px;border-left:3px solid var(--accent);line-height:1.2;font-family:"Noto Serif SC","Songti SC",serif;letter-spacing:.02em}
.rf-sec+.rf-sec{margin-top:0}
.rf-summary{color:#3b362f;font-size:13px}
.rf-list{display:flex;flex-direction:column;gap:13px}

/* ---------- lines ---------- */
.rf-main-line{display:flex;justify-content:space-between;align-items:baseline;gap:12px;flex-wrap:wrap}
.rf-left b{font-size:14px;color:#111827}
.rf-tag{display:inline-block;background:var(--accent);color:#fff;font-size:11px;padding:1px 8px;border-radius:4px;margin-left:8px;vertical-align:1px}
.rf-muted{color:#6b7280;font-size:12px;margin-left:8px}
.rf-right{color:#6b7280;font-size:12px;white-space:nowrap}
.rf-desc{color:#4b5563;font-size:12.5px;margin-top:6px}
.rf-gpa{color:#059669;font-size:12px;margin-top:4px}
.rf-hl{margin:8px 0 0;padding-left:18px;color:#374151;font-size:12.5px;display:flex;flex-direction:column;gap:4px}
.rf-hl li::marker{color:var(--accent)}
.rf-stack{display:inline-block;background:#ecfdf5;color:#059669;font-size:11px;padding:2px 8px;border-radius:4px;margin-top:6px}
.rf-simple-line{display:flex;align-items:baseline;gap:8px;font-size:13px}
.rf-simple-line b{font-size:13px}
.rf-dot{color:var(--accent);font-size:8px}
.rf-simple-line .rf-muted{margin-left:auto;margin-left:0}
.rf-simple-line .rf-muted:last-of-type{margin-left:auto}

/* ---------- skills ---------- */
.rf-skills{display:grid;grid-template-columns:1fr 1fr;gap:12px 24px}
.rf-skill-head{display:flex;justify-content:space-between;align-items:center;font-size:13px}
.rf-dots{display:inline-flex;gap:4px}
.rf-dots i{width:12px;height:7px;border-radius:2px;background:#e5e7eb}
.rf-dots i.on{background:var(--accent)}
.rf-skill-tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}
.rf-skill-tags em{font-style:normal;font-size:11px;color:#6b7280;background:#f3f4f6;padding:1px 7px;border-radius:999px}

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
.rf-side{width:288px;flex-shrink:0;background:linear-gradient(180deg,var(--accent) 0%,color-mix(in srgb,var(--accent) 55%,#0f172a) 100%);color:#fff;padding:34px 24px}
.rf-side .rf-sec-title{color:#fff;border-left-color:rgba(255,255,255,.6);font-size:14px}
.rf-side .rf-summary,.rf-side .rf-desc,.rf-side b,.rf-side .rf-muted,.rf-side .rf-dots i{color:#fff}
.rf-side .rf-muted{color:rgba(255,255,255,.75)}
.rf-side .rf-dots i{background:rgba(255,255,255,.25)}
.rf-side .rf-dots i.on{background:#fff}
.rf-side .rf-chip{background:rgba(255,255,255,.15);color:#fff}
.rf-side .rf-dot{color:rgba(255,255,255,.7)}
.rf-side .rf-skill-tags em{background:rgba(255,255,255,.15);color:rgba(255,255,255,.85)}
.rf-header.side{flex-direction:column;align-items:flex-start;gap:12px;padding-bottom:18px;margin-bottom:16px;border-bottom-color:rgba(255,255,255,.25)}
.rf-header.side .rf-avatar{width:84px;height:84px;border-color:rgba(255,255,255,.6)}
.rf-header.side .rf-name{color:#fff;font-size:24px}
.rf-side-contacts{display:flex;flex-direction:column;gap:8px;margin-top:6px}
.rf-side-li{display:flex;align-items:center;gap:10px;font-size:12px}
.rf-side-li i{font-style:normal;font-size:14px}
.rf-main{flex:1;padding:32px 34px}

/* ============ VIBRANT (creative) ============ */
.rfp.vibrant{padding:0;overflow:hidden}
.rf-band{display:flex;align-items:center;gap:22px;padding:30px 40px;background:linear-gradient(120deg,var(--accent),color-mix(in srgb,var(--accent) 45%,#000) 130%);color:#fff}
.rf-band-avatar{width:92px;height:92px;border-radius:24px;flex-shrink:0;display:grid;place-items:center;
  background:rgba(255,255,255,.16);border:2px solid rgba(255,255,255,.5);overflow:hidden;font-size:40px;font-weight:800}
.rf-band-avatar img{width:100%;height:100%;object-fit:cover}
.rf-band .rf-name{color:#fff}
.rf-v-body{display:flex;}
.rf-side.v{width:260px;background:#f8fafc;padding:26px 22px;border-right:1px solid #eef2f7;flex-shrink:0}
.rf-side.v .rf-sec-title{color:#111827}
.rf-v-facts{display:flex;flex-direction:column;gap:8px;font-size:12.5px;color:#374151}
.rf-v-facts div{display:flex;gap:8px;align-items:center}
.rf-v-facts i{font-style:normal;color:var(--accent)}
.rf-pill{display:inline-block;background:var(--accent);color:#fff;font-size:12px;padding:2px 10px;border-radius:999px}

/* ============ 移动端响应式（手机宽度） ============ */
@media screen and (max-width:520px){
  .rfp{width:100%;padding:20px 16px;box-shadow:none}
  .rf-name{font-size:24px}
  .rf-avatar{width:64px;height:64px}
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
  .rf-header.side .rf-avatar{width:60px;height:60px}
  .rf-header.side .rf-name{font-size:20px}
  /* 创意活力 -> 单列堆叠 */
  .rfp.vibrant .rf-band{flex-direction:column;text-align:center;gap:14px;padding:24px 16px 20px}
  .rfp.vibrant .rf-chips.dark{justify-content:center}
  .rfp.vibrant .rf-v-body{display:block}
  .rf-side.v{width:100%;padding:16px;border-right:none;border-bottom:1px solid #eef2f7}
  .rf-v-body .rf-main{padding:16px}
  .rf-main-line{flex-direction:column;align-items:flex-start;gap:4px}
  .rf-right{white-space:normal}
  .rf-simple-line .rf-muted:last-of-type{margin-left:0;display:block}
  .rf-simple-line{flex-wrap:wrap}
}
`

export const PRINT_CSS = `
@media print{
  @page{size:A4;margin:10mm}
  body{margin:0;padding:0;background:#fff}
  .rf-canvas{padding:0;background:#fff}
  .rfp{box-shadow:none;margin:0;width:100%}
}
`