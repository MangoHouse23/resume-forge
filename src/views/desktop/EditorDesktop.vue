<template>
  <div class="editor">
    <!-- 顶部工具栏 -->
    <header class="toolbar">
      <div class="tb-left">
        <el-button text class="tb-back" @click="$router.push('/')">
          <el-icon><Back /></el-icon><span>首页</span>
        </el-button>
        <span class="tb-divider"></span>
        <el-input
          v-model="store.state.current.meta.title"
          class="tb-title"
          placeholder="输入简历标题"
          @change="store.cacheCurrent()"
        />
        <el-tooltip :content="'职业：' + (profession?.name || '')" placement="bottom">
          <span class="tb-prof" :style="{ background: profession?.color || '#1f2937' }">
            <VecIcon :name="store.state.current.meta.professionId" :size="18" />
          </span>
        </el-tooltip>
      </div>

      <div class="tb-mid">
        <el-radio-group
          :model-value="store.state.current.meta.templateId"
          size="small"
          class="tpl-group"
          @update:model-value="(v)=>setTemplate(v as string)"
        >
          <el-radio-button v-for="t in templates" :key="t.id" :value="t.id" class="tpl-btn">{{ t.name }}</el-radio-button>
        </el-radio-group>

        <el-popover placement="bottom" width="210" trigger="click">
          <template #reference>
            <el-button size="small" class="tb-color-btn">
              <span class="color-swatch" :style="{ background: accent }"></span>配色
            </el-button>
          </template>
          <div class="color-picker">
            <div class="cp-title serif">主题色</div>
            <div class="cp-grid">
              <span v-for="c in colorPresets" :key="c" class="cp-dot" :class="{ active: accent === c }" :style="{ background: c }" @click="setAccent(c)"></span>
            </div>
            <el-color-picker :model-value="accent" size="small" @update:model-value="(v)=>v && setAccent(v as string)" />
          </div>
        </el-popover>
      </div>

      <div class="tb-right">
        <el-button @click="managerOpen = true" class="tb-ghost">
          <el-icon><SetUp /></el-icon><span class="hide-sm">模块</span>
        </el-button>
        <el-button @click="handleSave" class="tb-ghost">
          <el-icon><FolderChecked /></el-icon><span>保存</span>
        </el-button>
        <el-dropdown trigger="click" @command="onExport">
          <el-button class="btn-export">
            导出
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="pdf"><el-icon><Printer /></el-icon>导出 / 打印 PDF</el-dropdown-item>
              <el-dropdown-item command="html"><el-icon><Document /></el-icon>导出 HTML 文件</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>

    <!-- 内容区 -->
    <div class="workbench">
      <!-- 模块导航 -->
      <aside class="mnav">
        <div class="mnav-head">
          <span class="serif">模块</span>
          <el-button text circle size="small" title="管理模块" @click="managerOpen = true"><el-icon><Setting /></el-icon></el-button>
        </div>
        <div class="mnav-list">
          <div v-for="k in activeOrder" :key="k" class="mnav-item" :class="{ active: activeModule === k }" @click="activeModule = k">
            <span class="mn-icon"><VecIcon :name="k" :size="15" /></span>
            <span class="mn-label">{{ labelOf(k) }}</span>
          </div>
        </div>
        <div class="mnav-add">
          <button class="mnav-addbtn" @click="managerOpen = true"><el-icon><Plus /></el-icon> 管理 / 添加模块</button>
        </div>
      </aside>

      <!-- 编辑表单 -->
      <section class="form-panel">
        <div class="form-head">
          <h2 class="serif">{{ labelOf(activeModule) }}</h2>
          <span class="muted">{{ hintOf(activeModule) }}</span>
        </div>
        <ModuleForm :data="store.state.current" :active="activeModule" />
      </section>

      <!-- 实时预览 -->
      <section class="preview-panel">
        <div class="pv-meta">
          <span class="pv-eyebrow">实时预览 · {{ templateName }}</span>
          <span class="pv-hint">数据仅存本地</span>
        </div>
        <div class="pv-stage">
          <TemplatePreview :data="store.state.current" />
        </div>
      </section>
    </div>

    <!-- 模块管理抽屉 -->
    <ModuleManager
      v-model="managerOpen"
      :module-order="store.state.current.moduleOrder"
      @update:module-order="(o)=>store.state.current.moduleOrder = o"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import ModuleForm from '@/components/ModuleForm.vue'
import ModuleManager from '@/components/ModuleManager.vue'
import TemplatePreview from '@/components/TemplatePreview.vue'
import { MODULE_MAP, TEMPLATES } from '@/data/meta'
import { presetById } from '@/data/presets'
import { useResumeStore } from '@/store/resumeStore'
import VecIcon from '@/components/VecIcon.vue'
import { buildFullHtml } from '@/render/resumeHtml'
import type { ResumeModuleKey } from '@/types/resume'

const route = useRoute()
const store = useResumeStore()

watch(
  () => route.params.id,
  (id) => {
    if (id && typeof id === 'string') store.openSaved(id)
  },
  { immediate: true }
)

const activeModule = ref<ResumeModuleKey>('targetInfo')
const managerOpen = ref(false)
const templates = TEMPLATES

const COVERED: ResumeModuleKey[] = [
  'basicInfo', 'targetInfo', 'summary', 'jobObjective', 'education', 'workExperience',
  'projects', 'skills', 'certificates', 'languages', 'hobbies', 'honors', 'training',
  'internship', 'campusExperience', 'portfolio'
]

const activeOrder = computed(() => {
  const order = store.state.current.moduleOrder
  return COVERED.filter((k) => order.includes(k))
})

const profession = computed(() => presetById(store.state.current.meta.professionId))
const accent = computed(() => store.state.current.meta.accentColor)
const templateName = computed(() => templates.find((t) => t.id === store.state.current.meta.templateId)?.name || '')

const colorPresets = ['#2563eb', '#0ea5e9', '#7c3aed', '#ec4899', '#f59e0b', '#16a34a', '#ef4444', '#0d9488', '#1f2937']

function labelOf(k: ResumeModuleKey) { return MODULE_MAP[k]?.label || k }
function hintOf(k: ResumeModuleKey) { return MODULE_MAP[k]?.hint || '' }

function setTemplate(id: string) { store.state.current.meta.templateId = id; store.cacheCurrent() }
function setAccent(c: string) { store.state.current.meta.accentColor = c; store.cacheCurrent() }

function handleSave() {
  const t = store.state.current.meta.title || '我的简历'
  if (store.state.currentId) { store.saveCurrent(t); ElMessage.success('已保存到“我的简历”'); return }
  ElMessageBox.prompt('为这份简历取个标题吧', '保存简历', {
    inputValue: t, confirmButtonText: '保存', cancelButtonText: '取消', roundButton: true
  })
    .then(({ value }) => { store.saveCurrent(value?.trim() || t); ElMessage.success('已保存到“我的简历”') })
    .catch(() => {})
}

async function onExport(cmd: string) {
  const html = buildFullHtml(store.state.current)
  if (cmd === 'html') { downloadBlob(html, `${store.state.current.meta.title || '简历'}.html`, 'text/html;charset=utf-8'); return }
  if (cmd === 'pdf') {
    const win = window.open('', '_blank')
    if (!win) { ElMessage.warning('浏览器拦截了弹窗，请允许后再试'); return }
    win.document.open(); win.document.write(html); win.document.close()
    win.onload = () => { setTimeout(() => { win.focus(); win.print() }, 300) }
    setTimeout(() => { win.focus(); win.print() }, 800)
  }
}

function downloadBlob(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

let saveTimer: number | undefined
const stopWatch = watch(
  () => store.state.current,
  () => { clearTimeout(saveTimer); saveTimer = window.setTimeout(() => store.cacheCurrent(), 400) },
  { deep: true }
)
onBeforeUnmount(() => { stopWatch(); clearTimeout(saveTimer) })
</script>

<style scoped>
.editor { height: 100vh; display: flex; flex-direction: column; background: var(--rf-paper); }

/* —— 工具栏 —— */
.toolbar {
  height: 60px; background: color-mix(in srgb, var(--rf-paper) 90%, #fff); border-bottom: 1px solid var(--rf-line-soft);
  flex-shrink: 0; display: flex; align-items: center; gap: 16px; padding: 0 18px; z-index: 20;
}
.tb-left { display: flex; align-items: center; gap: 12px; min-width: 0; }
.tb-back { font-weight: 600; color: var(--rf-ink-2); }
.tb-back:hover { color: var(--rf-accent); }
.tb-divider { width: 1px; height: 24px; background: var(--rf-line); }
.tb-title { width: 200px; }
.tb-title :deep(.el-input__wrapper) { background: transparent; border-radius: 8px; box-shadow: none; border-bottom: 1px solid var(--rf-line); }
.tb-title :deep(.el-input__wrapper:hover), .tb-title :deep(.el-input__wrapper.is-focus) { box-shadow: none; border-bottom-color: var(--rf-accent); }
.tb-prof { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 10px; color: #fff; flex-shrink: 0; box-shadow: var(--rf-shadow-sm); }
.tb-mid { flex: 1; display: flex; align-items: center; gap: 12px; justify-content: center; }
.tpl-group :deep(.el-radio-button__inner) { border-color: var(--rf-line); color: var(--rf-ink-2); box-shadow: none; padding: 10px 16px; background: var(--rf-card); }
.tpl-group :deep(.el-radio-button:first-child .el-radio-button__inner) { border-radius: 999px 0 0 999px; }
.tpl-group :deep(.el-radio-button:last-child .el-radio-button__inner) { border-radius: 0 999px 999px 0; }
.tpl-group :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) { background: var(--rf-ink); border-color: var(--rf-ink); }
.tb-color-btn { border-color: var(--rf-line); color: var(--rf-ink-2); background: var(--rf-card); }
.tb-color-btn .color-swatch { width: 13px; height: 13px; border-radius: 50%; display: inline-block; margin-right: 6px; vertical-align: -2px; box-shadow: inset 0 0 0 1px rgba(0,0,0,.06); }
.tb-right { display: flex; align-items: center; gap: 8px; }
.tb-ghost { border-color: var(--rf-line); color: var(--rf-ink-2); background: var(--rf-card); }
.tb-ghost:hover { color: var(--rf-accent); border-color: var(--rf-accent); }
.btn-export { background: var(--rf-ink); border-color: var(--rf-ink); color: #fff; font-weight: 600; }
.btn-export:hover { background: var(--rf-accent); border-color: var(--rf-accent); color: #fff; }

/* —— 工作台 —— */
.workbench { flex: 1; display: flex; min-height: 0; }

.mnav { width: 204px; background: var(--rf-paper); border-right: 1px solid var(--rf-line-soft); display: flex; flex-direction: column; flex-shrink: 0; }
.mnav-head { padding: 16px 16px 10px; display: flex; justify-content: space-between; align-items: center; font-weight: 700; color: var(--rf-ink); }
.mnav-list { flex: 1; overflow-y: auto; padding: 0 10px; display: flex; flex-direction: column; gap: 3px; }
.mnav-item { display: flex; align-items: center; gap: 11px; padding: 9px 12px; border-radius: 9px; cursor: pointer; color: var(--rf-ink-2); font-size: 13px; transition: background .15s, color .15s; }
.mnav-item:hover { background: var(--rf-line-soft); color: var(--rf-ink); }
.mnav-item.active { background: var(--rf-card); color: var(--rf-accent); font-weight: 600; box-shadow: var(--rf-shadow-sm); }
.mnav-item.active::before { content: ''; width: 3px; height: 16px; border-radius: 2px; background: var(--rf-accent); margin-right: -3px; }
.mn-icon { font-size: 15px; }
.mnav-add { padding: 12px 10px; border-top: 1px dashed var(--rf-line); }
.mnav-addbtn { width: 100%; border: 1px dashed var(--rf-line); color: var(--rf-muted); background: transparent; border-radius: 9px; padding: 8px; font-size: 12.5px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 6px; }
.mnav-addbtn:hover { color: var(--rf-accent); border-color: var(--rf-accent); }

.form-panel { width: 468px; background: var(--rf-card); border-right: 1px solid var(--rf-line-soft); flex-shrink: 0; display: flex; flex-direction: column; min-height: 0; }
.form-head { padding: 18px 22px 14px; border-bottom: 1px solid var(--rf-line-soft); }
.form-head h2 { margin: 0; font-size: 20px; letter-spacing: .02em; }
.form-head .muted { display: block; margin-top: 3px; font-size: 12px; }
.form-panel :deep(.module-form) { flex: 1; overflow-y: auto; padding: 20px 22px; }
.form-panel :deep(.el-form-item), .form-panel :deep(.rf-field) { font-family: var(--rf-font-sans); }
.form-panel :deep(.el-input__wrapper), .form-panel :deep(.el-textarea__inner) { background: var(--rf-paper); box-shadow: none; border: 1px solid transparent; border-radius: 9px; }
.form-panel :deep(.el-input__wrapper:hover), .form-panel :deep(.el-textarea__inner:hover) { border-color: var(--rf-line); }
.form-panel :deep(.el-input__wrapper.is-focus), .form-panel :deep(.el-textarea__inner:focus) { border-color: var(--rf-accent); box-shadow: none; }
.form-panel :deep(.el-textarea__inner) { box-shadow: none; }

.preview-panel { flex: 1; min-width: 0; display: flex; flex-direction: column; background: var(--rf-paper); }
.pv-meta { height: 46px; display: flex; align-items: center; justify-content: space-between; padding: 0 18px; flex-shrink: 0; }
.pv-eyebrow { font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--rf-muted); }
.pv-hint { font-size: 12px; color: var(--rf-faint); }
.pv-stage { flex: 1; min-height: 0; padding: 8px 16px 16px; }
.preview-panel :deep(.tp-wrap) { border-radius: 12px; box-shadow: inset 0 0 0 1px var(--rf-line-soft); }

/* —— 配色 —— */
.color-picker .cp-title { font-size: 12px; color: var(--rf-muted); margin-bottom: 10px; letter-spacing: .06em; }
.cp-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-bottom: 14px; }
.cp-dot { width: 26px; height: 26px; border-radius: 50%; cursor: pointer; transition: transform .12s; }
.cp-dot:hover { transform: scale(1.15); }
.cp-dot.active { outline: 2px solid var(--rf-ink); outline-offset: 2px; }

@media (max-width: 1180px) { .form-panel { width: 400px; } }
@media (max-width: 900px) { .tb-mid { display: none; } .mnav { width: 60px; } .mnav .mn-label, .mnav-add { display: none; } .form-panel { width: 340px; } .hide-sm { display: none; } }
</style>