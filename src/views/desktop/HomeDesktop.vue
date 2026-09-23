<template>
  <div class="home">
    <!-- 顶栏 -->
    <header class="mast">
      <div class="mast-inner">
        <a class="wordmark" href="#" @click.prevent="$router.push('/')">
          <span class="wm-mark">履</span>
          <span class="wm-name serif">简历工坊</span>
        </a>
        <nav class="mast-nav">
          <span class="mn-item" @click="scrollTo('.profession-section-bg')">职业模版</span>
          <span class="mn-item" @click="scrollTo('.feature-section')">特性</span>
          <span class="mn-note serif">为每一种职业，写一份体面的简历</span>
        </nav>
        <el-button round class="mast-cta" @click="goBlank">开始制作</el-button>
      </div>
    </header>

    <!-- Hero -->
    <section class="hero">
      <div class="hero-grid">
        <div class="hero-copy">
          <div class="hero-eyebrow rv rv-1 serif">Resume Atelier · 简历工坊</div>
          <h1 class="hero-title rv rv-2 serif">
            每一种职业，<br />都值得一份<span class="t-accent">体面</span>的简历。
          </h1>
          <p class="hero-sub rv rv-3">
            为程序员、设计师、教师、医护等 20+ 职业量身打造专属模版，
            模块自由组合，实时预览，导出即投递。
          </p>
          <div class="hero-cta rv rv-4">
            <el-button round size="large" class="btn-ink" @click="goBlank">从空白开始</el-button>
            <el-button round size="large" class="btn-line" @click="scrollTo('.profession-section-bg')">浏览职业模版</el-button>
          </div>
          <div class="hero-saved rv rv-4" v-if="saved.length">
            <span class="hs-label">已保存 ·</span>
            <button v-for="s in saved.slice(0, 4)" :key="s.id" class="hs-chip" @click="openSaved(s.id)">{{ s.title }}</button>
          </div>
        </div>

        <!-- 纯 CSS 样张 -->
        <div class="hero-visual rv rv-3" aria-hidden="true">
          <div class="doc doc-back"></div>
          <div class="doc doc-mid"></div>
          <div class="doc doc-front">
            <div class="df-rule"></div>
            <div class="df-head">
              <div class="df-dot"></div>
              <div class="df-title serif">张  明</div>
              <div class="df-sub">前端开发工程师</div>
            </div>
            <div class="df-lines">
              <i v-for="n in 6" :key="n" :class="{ short: n > 4 }"></i>
            </div>
            <div class="df-seal serif">履</div>
            <div class="df-lines df-wide">
              <i v-for="n in 4" :key="n"></i>
            </div>
          </div>
          <div class="hero-num serif">No.01</div>
        </div>
      </div>
    </section>

    <!-- 我的简历 -->
    <section class="myresume-section">
      <div class="mr-head rv">
        <div class="sh-eyebrow serif">— 我的简历</div>
        <button class="mr-open" @click="goBlank"><el-icon><DocumentAdd /></el-icon> 新建并保存</button>
      </div>

      <div v-if="saved.length" class="mr-grid">
        <div v-for="s in saved" :key="s.id" class="mr-card rv" @click="openSaved(s.id)">
          <div class="mr-tile" :style="{ background: professionColor(s.professionId), color: onColor(professionColor(s.professionId)) }">
            <VecIcon :name="s.professionId" :size="18" />
          </div>
          <div class="mr-info">
            <div class="mr-title serif">{{ s.title }}</div>
            <div class="mr-meta">{{ s.professionName }} · {{ s.updatedAt }}</div>
          </div>
          <span class="mr-del" @click.stop="confirmDelete(s.id)"><el-icon><Delete /></el-icon></span>
        </div>
      </div>
      <div v-else class="mr-empty rv">
        <el-icon :size="40"><FolderOpened /></el-icon>
        <p>还没有保存的简历</p>
        <el-button round class="btn-line" @click="goBlank">去创建第一份</el-button>
      </div>
    </section>

    <!-- 职业模版 -->
    <section class="profession-section-bg">
      <div class="profession-section">
        <div class="section-head rv">
          <div class="sh-eyebrow serif">— 选择你的身份</div>
          <h2 class="sh-title serif">从职业开始，<em>别从空白开始</em></h2>
          <p class="sh-sub">每个模版都已预置对应职业的模块与示例内容，套用即改</p>
        </div>

        <div class="grid">
          <div v-for="(p, i) in professions" :key="p.id" class="prof-card rv" :style="{ animationDelay: (i % 4) * 0.05 + 's' }" @click="startProfession(p)">
            <div class="pc-num serif">{{ String(i + 1).padStart(2, '0') }}</div>
            <div class="pc-top">
              <span class="pc-tile" :style="{ background: p.color, color: onColor(p.color) }">
                <VecIcon :name="p.id" :size="20" />
              </span>
            </div>
            <h3 class="pc-name serif">{{ p.name }}</h3>
            <p class="pc-mod">{{ moduleSummary(p) }}</p>
            <div class="pc-foot">
              <span class="pc-go">制作这份简历</span>
              <span class="pc-arrow">→</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 特性 -->
    <section class="feature-section">
      <div class="fs-head rv">
        <div class="sh-eyebrow serif fs-eyebrow">为什么选择</div>
        <h2 class="sh-title serif">把简历，做成作品</h2>
      </div>
      <div class="feat-grid">
        <div class="feat rv" v-for="(f, i) in features" :key="f.title">
          <div class="feat-num serif">{{ String(i + 1).padStart(2, '0') }}</div>
          <h4 class="feat-title serif">{{ f.title }}</h4>
          <p>{{ f.desc }}</p>
        </div>
      </div>
    </section>

    <footer class="home-footer">
      <div class="hf-mark serif">履</div>
      <div>简历工坊 · 为你打造每一份心动简历 · 数据仅保存在本地浏览器</div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { PROFESSIONS, presetById, type ProfessionPreset } from '@/data/presets'
import { MODULE_MAP } from '@/data/meta'
import { useResumeStore } from '@/store/resumeStore'
import VecIcon from '@/components/VecIcon.vue'
import { onColor } from '@/utils/color'
import type { ResumeModuleKey } from '@/types/resume'

const router = useRouter()
const store = useResumeStore()
const professions = PROFESSIONS
const saved = computed(() => store.getSavedList())

const features = [
  { title: '丰富模块', desc: '16 个简历模块自由增删、排序，覆盖教育、项目、技能、证书等一切经历。' },
  { title: '职业预填', desc: '按职业预置示例内容与推荐模块，10 分钟完成一份有质感的简历。' },
  { title: '实时预览', desc: '左侧编辑右侧所见即所得，三种版式、多种主题色随时切换。' },
  { title: '导出投递', desc: '一键导出 PDF / HTML，版式整洁，打印即投递。' }
]

function moduleSummary(p: ProfessionPreset) {
  return (p.moduleOrder.slice(0, 5) as ResumeModuleKey[]).map((k) => MODULE_MAP[k]?.label).filter(Boolean).join(' · ')
}
function professionColor(id?: string): string {
  return presetById(id ?? '')?.color ?? '#1f2937'
}
function startProfession(p: ProfessionPreset) {
  store.newFromProfession(p)
  router.push({ name: 'editor' })
}
function confirmDelete(id: string) {
  ElMessageBox.confirm('删除这份简历？该操作不可恢复。', '删除确认', {
    confirmButtonText: '删除', cancelButtonText: '取消', type: 'warning', roundButton: true
  })
    .then(() => { store.deleteSaved(id); ElMessage.success('已删除') })
    .catch(() => {})
}
function openSaved(id: string) {
  store.openSaved(id)
  router.push({ name: 'editor', params: { id } })
}
function goBlank() {
  router.push({ name: 'editor' })
}
function scrollTo(sel: string) {
  document.querySelector(sel)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<style scoped>
.home { min-height: 100vh; background: var(--rf-paper); }

/* —— 顶栏 —— */
.mast { border-bottom: 1px solid var(--rf-line-soft); background: color-mix(in srgb, var(--rf-paper) 84%, #fff); backdrop-filter: blur(10px); position: sticky; top: 0; z-index: 50; box-shadow: 0 1px 0 rgba(255,255,255,.4), 0 10px 28px rgba(34,29,23,.04); }
.mast-inner { max-width: 1240px; margin: 0 auto; padding: 0 40px; height: 64px; display: flex; align-items: center; gap: 32px; }
.wordmark { display: inline-flex; align-items: center; gap: 10px; color: var(--rf-ink); text-decoration: none; }
.wm-mark { width: 34px; height: 34px; display: grid; place-items: center; background: linear-gradient(160deg, var(--rf-ink), #3a3228); color: var(--rf-paper); font-family: var(--rf-font-serif); font-size: 17px; border-radius: 9px; box-shadow: var(--rf-tile-shadow); }
.wm-mark:hover { transform: translateY(-1px); }
.wm-name { font-size: 18px; font-weight: 700; letter-spacing: .04em; }
.mast-nav { flex: 1; display: flex; align-items: center; gap: 22px; }
.mn-item { font-size: 14px; color: var(--rf-ink-2); cursor: pointer; padding: 6px 0; border-bottom: 1px solid transparent; }
.mn-item:hover { color: var(--rf-accent); border-bottom-color: var(--rf-accent); }
.mn-note { margin-left: auto; font-size: 12px; color: var(--rf-faint); letter-spacing: .1em; }
.mast-cta { background: var(--rf-ink); border-color: var(--rf-ink); color: #fff; font-weight: 600; }
.mast-cta:hover { background: var(--rf-accent); border-color: var(--rf-accent); color: #fff; }

/* —— Hero —— */
.hero { padding: 72px 40px 96px; border-bottom: 1px solid var(--rf-line-soft); overflow: hidden; position: relative; }
.hero::before { content: ''; position: absolute; right: -140px; top: -160px; width: 460px; height: 460px; border-radius: 50%; background: radial-gradient(circle, var(--rf-accent-soft), transparent 62%); pointer-events: none; }
.hero-grid { max-width: 1240px; margin: 0 auto; display: grid; grid-template-columns: 1.1fr .9fr; gap: 60px; align-items: center; }
.hero-eyebrow { color: var(--rf-accent); letter-spacing: .2em; font-size: 13px; margin-bottom: 22px; }
.hero-title { font-size: clamp(40px, 5vw, 62px); font-weight: 700; line-height: 1.16; letter-spacing: .01em; margin: 0 0 24px; }
.t-accent { color: var(--rf-accent); font-style: italic; padding-bottom: 4px; background-image: linear-gradient(var(--rf-accent), var(--rf-accent)); background-repeat: no-repeat; background-size: 100% .085em; background-position: 0 100%; }
.hero-sub { color: var(--rf-ink-2); font-size: 16px; line-height: 1.8; max-width: 480px; margin: 0 0 32px; }
.hero-cta { display: flex; gap: 14px; flex-wrap: wrap; }
.btn-ink { background: linear-gradient(160deg, var(--rf-ink), #2c251d); border: 1px solid var(--rf-ink); color: #fff; font-weight: 600; padding: 0 26px; box-shadow: 0 4px 12px rgba(34,29,23,.18); }
.btn-ink:hover { background: linear-gradient(160deg, var(--rf-accent), var(--rf-accent-deep)); border-color: var(--rf-accent); color: #fff; transform: translateY(-1px); box-shadow: 0 8px 20px rgba(169,71,47,.28); }
.btn-line { background: transparent; border: 1px solid var(--rf-line); color: var(--rf-ink); font-weight: 500; }
.btn-line:hover { border-color: var(--rf-accent); color: var(--rf-accent); transform: translateY(-1px); }
.hero-saved { margin-top: 26px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.hs-label { font-size: 13px; color: var(--rf-faint); letter-spacing: .04em; }
.hs-chip { border: 1px solid var(--rf-line); background: var(--rf-card); color: var(--rf-ink-2); font-size: 12px; padding: 4px 11px; border-radius: 999px; cursor: pointer; transition: transform .18s, border-color .18s, color .18s, box-shadow .18s; }
.hs-chip:hover { border-color: var(--rf-accent); color: var(--rf-accent); transform: translateY(-1px); box-shadow: var(--rf-shadow-sm); }

/* 样张 */
.hero-visual { position: relative; height: 420px; display: flex; align-items: center; justify-content: center; }
.doc { position: absolute; width: 300px; height: 400px; background: var(--rf-card); border: 1px solid var(--rf-line); border-radius: 6px; }
.doc-back { transform: rotate(8deg) translate(18px, 6px); opacity: .55; }
.doc-mid { transform: rotate(-5deg) translate(-16px, 4px); opacity: .7; }
.doc-front { transform: rotate(1deg); box-shadow: var(--rf-shadow-lg); padding: 26px 24px; display: flex; flex-direction: column; gap: 14px; }
.df-rule { height: 3px; width: 46px; background: var(--rf-accent); border-radius: 2px; }
.df-head { display: flex; flex-direction: column; gap: 4px; }
.df-dot { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #dcd4c6, #bfb2a0); margin-bottom: 6px; }
.df-title { font-size: 24px; font-weight: 700; letter-spacing: .1em; }
.df-sub { font-size: 12px; color: var(--rf-muted); }
.df-lines { display: flex; flex-direction: column; gap: 8px; }
.df-lines i { height: 7px; border-radius: 4px; background: linear-gradient(90deg, #ddd6c9 75%, transparent); }
.df-lines i.short { width: 60%; }
.df-wide { margin-top: 2px; }
.df-wide i { background: linear-gradient(90deg, var(--rf-accent-soft) 55%, transparent); }
.df-seal { position: absolute; right: 22px; bottom: 20px; width: 46px; height: 46px; border: 2px solid var(--rf-accent); color: var(--rf-accent); display: grid; place-items: center; font-size: 22px; border-radius: 50%; transform: rotate(-12deg); }
.hero-num { position: absolute; left: -6px; bottom: 10px; font-size: 76px; color: var(--rf-line); letter-spacing: .02em; line-height: 1; }

/* —— 职业模版 —— */
.profession-section-bg { background: var(--rf-paper-3); border-bottom: 1px solid var(--rf-line-soft); }
.profession-section { max-width: 1240px; margin: 0 auto; padding: 88px 40px; }
.section-head { margin-bottom: 48px; }
.sh-eyebrow { color: var(--rf-accent); font-size: 14px; letter-spacing: .1em; margin-bottom: 14px; }
.sh-title { font-size: clamp(28px, 3.4vw, 40px); font-weight: 700; margin: 0 0 12px; }
.sh-title em { font-style: normal; color: var(--rf-muted); font-weight: 500; }
.sh-sub { color: var(--rf-muted); font-size: 15px; margin: 0; }

.grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.prof-card {
  position: relative; background: var(--rf-card); border: 1px solid var(--rf-line); border-radius: var(--rf-radius);
  padding: 26px 22px 20px; cursor: pointer;
  transition: transform .28s cubic-bezier(.2,.7,.2,1), box-shadow .28s, border-color .28s;
}
.prof-card::after { content: ''; position: absolute; inset: 0 0 auto 0; height: 3px; border-radius: 14px 14px 0 0; background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--rf-accent) 40%, transparent), transparent); opacity: 0; transition: opacity .28s; }
.prof-card:hover { transform: translateY(-5px); border-color: #d5c9ba; box-shadow: var(--rf-ring), var(--rf-shadow-md); }
.prof-card:hover::after { opacity: 1; }
.prof-card:hover .pc-arrow { transform: translateX(5px); color: var(--rf-accent); }
.pc-num { position: absolute; top: 18px; right: 20px; font-size: 22px; color: var(--rf-line); font-weight: 600; transition: color .28s; }
.prof-card:hover .pc-num { color: color-mix(in srgb, var(--rf-accent) 45%, var(--rf-line)); }
.pc-top { display: flex; align-items: center; margin-bottom: 18px; }
.pc-tile { width: 42px; height: 42px; border-radius: 12px; display: grid; place-items: center; color: #fff; box-shadow: var(--rf-shadow-sm); transition: transform .28s cubic-bezier(.2,.7,.2,1), box-shadow .28s; }
.prof-card:hover .pc-tile { transform: translateY(-1px) scale(1.05); box-shadow: var(--rf-tile-shadow); }
.pc-name { font-size: 19px; font-weight: 700; margin: 0 0 8px; }
.pc-mod { color: var(--rf-muted); font-size: 12.5px; line-height: 1.7; min-height: 44px; margin: 0 0 16px; }
.pc-foot { display: flex; align-items: center; justify-content: space-between; padding-top: 12px; border-top: 1px solid var(--rf-line-soft); }
.pc-go { font-size: 13px; color: var(--rf-ink-2); font-weight: 600; }
.pc-arrow { color: var(--rf-faint); transition: transform .25s; }

/* —— 我的简历 —— */
.myresume-section { max-width: 1240px; margin: 0 auto; padding: 88px 40px 64px; }
.mr-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 14px; }
.mr-open { display: inline-flex; align-items: center; gap: 6px; border: 1px solid var(--rf-line); background: var(--rf-card); color: var(--rf-ink-2); border-radius: 999px; padding: 8px 16px; font-size: 13px; cursor: pointer; transition: transform .18s, border-color .18s, color .18s, box-shadow .18s; }
.mr-open:hover { color: var(--rf-accent); border-color: var(--rf-accent); transform: translateY(-1px); box-shadow: var(--rf-shadow-sm); }
.mr-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.mr-card { display: flex; align-items: center; gap: 14px; background: var(--rf-card); border: 1px solid var(--rf-line); border-radius: var(--rf-radius); padding: 16px 18px; cursor: pointer; transition: transform .22s cubic-bezier(.2,.7,.2,1), box-shadow .22s, border-color .22s; }
.mr-card:hover { transform: translateY(-3px); box-shadow: var(--rf-ring), var(--rf-shadow-md); border-color: #d5c9ba; }
.mr-tile { width: 38px; height: 38px; border-radius: 10px; display: grid; place-items: center; color: #fff; flex-shrink: 0; box-shadow: var(--rf-shadow-sm); }
.mr-card:hover .mr-tile { box-shadow: var(--rf-tile-shadow); }
.mr-info { flex: 1; min-width: 0; }
.mr-title { font-size: 16px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mr-meta { font-size: 12px; color: var(--rf-muted); margin-top: 3px; }
.mr-del { color: var(--rf-faint); padding: 6px; border-radius: 8px; flex-shrink: 0; }
.mr-del:hover { color: var(--rf-accent); background: var(--rf-accent-soft); }
.mr-empty { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 48px 0; color: var(--rf-faint); border: 1px dashed var(--rf-line); border-radius: var(--rf-radius); }
.mr-empty p { margin: 0; font-size: 14px; color: var(--rf-muted); }

/* —— 特性 —— */
.feature-section { max-width: 1240px; margin: 0 auto; padding: 88px 40px 96px; }
.fs-head { text-align: center; margin-bottom: 52px; }
.fs-eyebrow { display: inline-flex; align-items: center; gap: 16px; color: var(--rf-accent); }
.fs-eyebrow::before, .fs-eyebrow::after { content: ''; width: 40px; height: 1px; background: linear-gradient(90deg, transparent, var(--rf-accent)); opacity: .4; }
.fs-eyebrow::after { background: linear-gradient(90deg, var(--rf-accent), transparent); }
.feat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.feat { border-top: 1px solid var(--rf-line); padding: 22px 8px 0; transition: transform .28s cubic-bezier(.2,.7,.2,1), border-color .28s; }
.feat:hover { transform: translateY(-4px); border-top-color: color-mix(in srgb, var(--rf-accent) 55%, transparent); }
.feat-num { font-size: 15px; color: var(--rf-accent); margin-bottom: 16px; font-weight: 600; transition: color .28s; }
.feat:hover .feat-num { color: var(--rf-accent-deep); }
.feat-title { font-size: 19px; font-weight: 700; margin: 0 0 10px; transition: color .28s; }
.feat p { color: var(--rf-muted); font-size: 13.5px; line-height: 1.8; margin: 0; transition: color .28s; }
.feat:hover p { color: var(--rf-ink-2); }

/* —— footer —— */
.home-footer { text-align: center; color: var(--rf-muted); font-size: 13px; padding: 40px 24px 56px; border-top: 1px solid var(--rf-line-soft); display: flex; flex-direction: column; gap: 12px; align-items: center; }
.hf-mark { width: 34px; height: 34px; border: 1px solid var(--rf-line); color: var(--rf-accent); display: grid; place-items: center; border-radius: 50%; font-size: 16px; }

/* —— 响应 —— */
@media (max-width: 1080px) { .grid, .feat-grid, .mr-grid { grid-template-columns: repeat(2, 1fr); } .hero-grid { grid-template-columns: 1fr; } .hero-visual { margin-top: 30px; } }
@media (max-width: 640px) { .mast-inner, .hero, .profession-section, .feature-section { padding-left: 20px; padding-right: 20px; } .grid, .feat-grid, .mr-grid { grid-template-columns: 1fr; } }
</style>