<template>
  <div class="m-home">
    <div class="m-hero">
      <div class="m-badge">📋 简历工坊</div>
      <h1 class="m-title">多职业<br /><em>简历模版</em>生成器</h1>
      <p class="m-sub">为 20+ 职业量身打造 · 丰富模块自由组合 · 一键导出</p>
      <van-button round type="primary" class="m-cta" size="large" @click="goBlank">
        <van-icon name="plus" /> 从空白开始制作
      </van-button>
    </div>

    <div class="m-body">
      <div v-if="saved.length" class="m-sec">
        <div class="m-sec-head">
          <span class="m-sec-title"><van-icon name="orders-o" /> 我的简历</span>
          <van-tag round type="primary" size="medium">{{ saved.length }} 份</van-tag>
        </div>
        <div class="m-saved-list">
          <van-swipe-cell v-for="s in saved" :key="s.id">
            <div class="m-saved" @click="openSaved(s.id)">
              <div class="m-saved-ic" :style="{ background: presetById(s.professionId)?.color || '#2563eb' }">
                {{ presetById(s.professionId)?.icon || '📄' }}
              </div>
              <div class="m-saved-info">
                <div class="m-saved-name">{{ s.title }}</div>
                <div class="m-saved-meta">{{ s.professionName }} · {{ s.updatedAt }}</div>
              </div>
              <van-icon name="arrow" class="m-arrow" />
            </div>
            <template #right>
              <van-button square type="danger" text="删除" class="m-del" @click="removeSaved(s.id)" />
            </template>
          </van-swipe-cell>
        </div>
      </div>

      <div class="m-sec">
        <div class="m-sec-head">
          <span class="m-sec-title"><van-icon name="apps-o" /> 选择职业模版</span>
        </div>
        <van-search
          v-model="keyword"
          class="m-search"
          placeholder="搜索职业，如：前端 / 设计 / 教师"
          shape="round"
          clearable
        />
        <div class="m-grid">
          <div v-for="p in filtered" :key="p.id" class="m-card" @click="startProfession(p)">
            <span class="m-card-icon" :style="{ background: p.color }">{{ p.icon }}</span>
            <div class="m-card-name">{{ p.name }}</div>
            <div class="m-card-mod">{{ moduleSummary(p) }}</div>
          </div>
        </div>
        <van-empty v-if="!filtered.length" description="没有匹配的职业" />
      </div>

      <div class="m-feats">
        <div class="m-feat" v-for="f in features" :key="f.t">
          <van-icon :name="f.i" :color="f.c" />
          <div class="mf-t">{{ f.t }}</div>
          <div class="mf-d">{{ f.d }}</div>
        </div>
      </div>

      <div class="m-footer">简历工坊 · 数据仅保存在本地浏览器</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showConfirmDialog, closeToast } from 'vant'
import { PROFESSIONS, presetById, type ProfessionPreset } from '@/data/presets'
import { MODULE_MAP } from '@/data/meta'
import { useResumeStore } from '@/store/resumeStore'
import type { ResumeModuleKey } from '@/types/resume'

const router = useRouter()
const store = useResumeStore()
const keyword = ref('')
const saved = computed(() => store.getSavedList())

const features = [
  { t: '丰富模块', d: '15+ 模块自由增删排序', i: 'apps-o', c: '#2563eb' },
  { t: '一键套用', d: '职业预置示例内容', i: 'flash', c: '#ec4899' },
  { t: '实时预览', d: '所见即所得', i: 'eye-o', c: '#16a34a' },
  { t: '导出 PDF', d: '打印即投递', i: 'down', c: '#f59e0b' }
]

const filtered = computed(() => {
  const k = keyword.value.trim().toLowerCase()
  if (!k) return PROFESSIONS
  return PROFESSIONS.filter(
    (p) =>
      p.name.toLowerCase().includes(k) ||
      p.tagline.toLowerCase().includes(k)
  )
})

function moduleSummary(p: ProfessionPreset) {
  return (p.moduleOrder.slice(0, 4) as ResumeModuleKey[])
    .map((k) => MODULE_MAP[k]?.label)
    .filter(Boolean)
    .join('·')
}

function startProfession(p: ProfessionPreset) {
  store.newFromProfession(p)
  router.push({ name: 'editor' })
}
function openSaved(id: string) {
  store.openSaved(id)
  router.push({ name: 'editor', params: { id } })
}
function goBlank() {
  router.push({ name: 'editor' })
}
function removeSaved(id: string) {
  showConfirmDialog({ title: '删除简历', message: '确定删除这份简历吗？此操作不可撤销。' })
    .then(() => {
      store.deleteSaved(id)
      closeToast()
    })
    .catch(() => {})
}
</script>

<style scoped>
.m-home { min-height: 100vh; background: var(--rf-paper); padding-bottom: 24px; }

.m-hero {
  background: var(--rf-paper-2);
  color: var(--rf-ink); padding: 26px 20px 38px; border-radius: 0 0 24px 24px; position: relative; overflow: hidden;
  border-bottom: 1px solid var(--rf-line-soft);
}
.m-hero::after { content: ''; position: absolute; width: 200px; height: 200px; border-radius: 50%; background: radial-gradient(circle, var(--rf-accent-soft), transparent 65%); right: -50px; top: -40px; }
.m-badge { display: inline-block; background: transparent; border: 1px solid var(--rf-accent); color: var(--rf-accent); padding: 4px 12px; border-radius: 999px; font-size: 12px; position: relative; z-index: 1; letter-spacing: .04em; }
.m-title { font-size: 33px; font-weight: 700; line-height: 1.3; margin: 14px 0 8px; position: relative; z-index: 1; font-family: var(--rf-font-serif); letter-spacing: .02em; }
.m-title em { font-style: normal; color: var(--rf-accent); }
.m-sub { font-size: 13px; opacity: .8; margin: 0 0 20px; position: relative; z-index: 1; color: var(--rf-ink-2); }
.m-cta { width: 100%; font-weight: 600; box-shadow: 0 8px 20px rgba(0,0,0,.2); position: relative; z-index: 1; }

.m-body { padding: 16px 14px; }
.m-sec { margin-bottom: 20px; }
.m-sec-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.m-sec-title { font-size: 16px; font-weight: 700; color: #1f2937; display: inline-flex; align-items: center; gap: 6px; }
.m-search { margin-bottom: 12px; padding: 0; background: transparent; }

.m-saved-list { background: var(--rf-card); border: 1px solid var(--rf-line-soft); border-radius: 14px; overflow: hidden; }
.m-saved { display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: var(--rf-card); }
.m-saved-ic { width: 42px; height: 42px; border-radius: 12px; display: grid; place-items: center; font-size: 20px; color: #fff; flex-shrink: 0; opacity: .92; }
.m-saved-info { flex: 1; min-width: 0; }
.m-saved-name { font-size: 15px; font-weight: 600; color: #1f2937; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.m-saved-meta { font-size: 12px; color: #94a3b8; margin-top: 3px; }
.m-arrow { color: #cbd5e1; }
.m-del { height: 66px; }

.m-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.m-card { background: var(--rf-card); border: 1px solid var(--rf-line); border-radius: 14px; padding: 13px; }
.m-card-icon { width: 40px; height: 40px; border-radius: 11px; display: grid; place-items: center; font-size: 20px; box-shadow: inset 0 0 0 1px rgba(0,0,0,.05); }
.m-card-name { font-size: 15px; font-weight: 600; margin-top: 8px; color: var(--rf-ink); font-family: var(--rf-font-serif); }
.m-card-mod { font-size: 11px; color: var(--rf-muted); margin-top: 3px; line-height: 1.5; }

.m-feats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 4px 0 18px; }
.m-feat { background: var(--rf-card); border: 1px solid var(--rf-line-soft); border-radius: 12px; padding: 14px; }
.m-feat :deep(.van-icon) { font-size: 22px; }
.mf-t { font-size: 14px; font-weight: 600; margin-top: 8px; color: #1f2937; }
.mf-d { font-size: 11px; color: #94a3b8; margin-top: 3px; }

.m-footer { text-align: center; color: #b6c2d2; font-size: 12px; padding: 12px 0 6px; }
</style>