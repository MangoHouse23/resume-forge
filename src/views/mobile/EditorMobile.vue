<template>
  <div class="medit">
    <!-- 顶部导航 -->
    <van-nav-bar
      :title="store.state.current.meta.title || '未命名简历'"
      left-text="首页"
      left-arrow
      fixed
      placeholder
      class="m-nav"
      @click-left="$router.push('/')"
      @click-right="handleSave"
    >
      <template #right>
        <span class="m-save" :class="{ saved: !!store.state.currentId }">
          <van-icon name="checked" v-if="store.state.currentId" />
          {{ store.state.currentId ? '已保存' : '保存' }}
        </span>
      </template>
    </van-nav-bar>

    <!-- 次级工具栏 -->
    <div class="m-toolbar">
      <div class="m-pill">
        <span :class="['m-pill-item', viewMode === 'edit' && 'on']" @click="viewMode = 'edit'">
          <van-icon name="editor" /> 编辑
        </span>
        <span :class="['m-pill-item', viewMode === 'preview' && 'on']" @click="viewMode = 'preview'">
          <van-icon name="eye-o" /> 预览
        </span>
      </div>
      <div class="m-tools">
        <van-icon name="apps-o" title="模块管理" @click="showModule = true" />
        <van-icon name="flower-o" title="风格与配色" @click="showStyle = true" />
        <van-icon name="share-o" title="导出" @click="showExport = true" @click.stop />
      </div>
    </div>

    <!-- 内容 -->
    <div class="m-content">
      <template v-if="viewMode === 'edit'">
        <!-- 选择当前编辑模块 -->
        <div class="m-modpick" @click="showModulePick = true">
          <span class="mmo-icon"><VecIcon :name="activeModule" :size="18" /></span>
          <span class="mmo-label">{{ labelOf(activeModule) }}</span>
          <span class="mmo-hint">{{ hintOf(activeModule) }}</span>
          <van-icon name="arrow" class="mmo-arrow" />
        </div>
        <MobileModuleForm :data="store.state.current" :active="activeModule" :accent="accent" />
      </template>
      <template v-else>
        <MobilePreview :data="store.state.current" />
      </template>
    </div>

    <!-- 模块选择 ActionSheet -->
    <van-action-sheet
      v-model:show="showModulePick"
      title="选择要编辑的模块"
      :actions="moduleActions"
      round
      @select="onPickModule"
    />

    <!-- 模块管理 popup -->
    <van-popup v-model:show="showModule" position="bottom" round :style="{ height: '80%' }">
      <div class="mm-wrap">
        <div class="mm-title">模块管理</div>
        <p class="mm-tip">勾选显示 / 隐藏模块，拖条可上下调整顺序。</p>
        <div class="mm-list">
          <div v-for="(mod, idx) in moduleList" :key="mod.key" class="mm-item" :class="{ off: !isOn(mod.key) }">
            <van-switch :model-value="isOn(mod.key)" size="20px" @update:model-value="(v)=>toggle(mod.key, v as boolean)" />
            <span class="mm-item-icon"><VecIcon :name="mod.key" :size="17" /></span>
            <div class="mm-item-info">
              <div class="mm-item-name">{{ mod.label }}</div>
              <div class="mm-item-hint">{{ mod.hint }}</div>
            </div>
            <span class="mm-ord" v-if="orderIndex(mod.key) >= 0">
              <van-icon name="arrow-up" :disabled="orderIndex(mod.key) === 0" @click="moveOrd(mod.key, -1)" />
              <van-icon name="arrow-down" :disabled="orderIndex(mod.key) === orderCount - 1" @click="moveOrd(mod.key, 1)" />
            </span>
          </div>
        </div>
      </div>
    </van-popup>

    <!-- 风格与配色 popup -->
    <van-popup v-model:show="showStyle" position="bottom" round>
      <div class="st-wrap">
        <div class="st-title">视觉风格</div>
        <div class="st-tpls">
          <div
            v-for="t in templates"
            :key="t.id"
            class="st-tpl"
            :class="{ on: templateId === t.id }"
            @click="setTemplate(t.id)"
          >
            <div class="st-tpl-name"><van-icon :name="templateId === t.id ? 'checked' : 'check'" />{{ t.name }}</div>
            <div class="st-tpl-desc">{{ t.desc }}</div>
          </div>
        </div>
        <div class="st-title">主题色</div>
        <div class="st-colors">
          <span
            v-for="p in colorPresets"
            :key="p.value"
            class="st-color"
            :class="{ on: accent === p.value }"
            :style="{ background: p.value }"
            :title="p.name"
            @click="setAccent(p.value)"
          ></span>
        </div>
        <div class="st-title">正文字体</div>
        <div class="st-fonts">
          <div
            v-for="f in fontOptions"
            :key="f.id"
            class="st-font"
            :class="{ on: font === f.id }"
            :style="f.family ? `font-family:'${f.family}',sans-serif` : ''"
            @click="setFont(f.id)"
          >
            <van-icon :name="font === f.id ? 'checked' : 'check'" />{{ f.name }}
          </div>
        </div>
      </div>
    </van-popup>

    <!-- 导出 ActionSheet -->
    <van-action-sheet
      v-model:show="showExport"
      title="导出简历"
      :actions="exportActions"
      round
      cancel-text="取消"
      @select="onExport"
      @cancel="showExport = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { showToast } from 'vant'
import MobileModuleForm from './MobileModuleForm.vue'
import MobilePreview from './MobilePreview.vue'
import { MODULE_CATALOG, MODULE_MAP, TEMPLATES } from '@/data/meta'
import { presetById } from '@/data/presets'
import { useResumeStore } from '@/store/resumeStore'
import VecIcon from '@/components/VecIcon.vue'
import { ACCENT_PRESETS } from '@/data/themes'
import { FONT_OPTIONS } from '@/data/fonts'
import { loadFontLink } from '@/utils/fontLoader'
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

const ALWAYS: ResumeModuleKey[] = ['targetInfo', 'basicInfo']
const viewMode = ref<'edit' | 'preview'>('edit')
const activeModule = ref<ResumeModuleKey>('targetInfo')
const accent = computed(() => store.state.current.meta.accentColor)
const templateId = computed(() => store.state.current.meta.templateId)
const templates = TEMPLATES
const fontOptions = FONT_OPTIONS
const font = computed(() => store.state.current.meta.font)

const labelOf = (k: ResumeModuleKey) => MODULE_MAP[k]?.label || k
const hintOf = (k: ResumeModuleKey) => MODULE_MAP[k]?.hint || ''

// 当前启用的模块（含固定项）
const enabled = computed<ResumeModuleKey[]>(() => {
  const order = store.state.current.moduleOrder
  const base = [...ALWAYS.filter((k) => !order.includes(k)), ...order]
  return base.filter((k) => MODULE_MAP[k])
})

const showModulePick = ref(false)
const moduleActions = computed(() =>
  enabled.value.map((k) => ({ name: labelOf(k), key: k }))
)
function onPickModule(action: { key: ResumeModuleKey }) {
  activeModule.value = action.key
}

// 模块管理
const showModule = ref(false)
// 按当前顺序展示：固定模块靠前，其余按 moduleOrder 排序，未启用项排后
const moduleList = computed(() => {
  const order = [...ALWAYS.filter((k) => !store.state.current.moduleOrder.includes(k)), ...store.state.current.moduleOrder]
  const pos = (k: ResumeModuleKey) => {
    const i = order.indexOf(k)
    return i === -1 ? 999 : i
  }
  return [...MODULE_CATALOG].sort((a, b) => pos(a.key) - pos(b.key))
})
const isOn = (k: ResumeModuleKey) => ALWAYS.includes(k) || store.state.current.moduleOrder.includes(k)
function toggle(k: ResumeModuleKey, on: boolean) {
  const order = [...store.state.current.moduleOrder]
  if (on) {
    if (!order.includes(k)) order.push(k)
  } else {
    const i = order.indexOf(k)
    if (i > -1) order.splice(i, 1)
  }
  store.state.current.moduleOrder = order
  if (!on && activeModule.value === k) {
    activeModule.value = enabled.value[0] || 'targetInfo'
  }
}
const orderIndex = (k: ResumeModuleKey) => store.state.current.moduleOrder.indexOf(k)
const orderCount = computed(() => store.state.current.moduleOrder.length)
function moveOrd(k: ResumeModuleKey, dir: number) {
  const order = [...store.state.current.moduleOrder]
  const i = order.indexOf(k)
  const t = i + dir
  if (i < 0 || t < 0 || t >= order.length) return
  ;[order[i], order[t]] = [order[t], order[i]]
  store.state.current.moduleOrder = order
}

// 风格与配色
const showStyle = ref(false)
const colorPresets = ACCENT_PRESETS
function setTemplate(id: string) { store.state.current.meta.templateId = id; store.cacheCurrent() }
function setAccent(c: string) { store.state.current.meta.accentColor = c; store.cacheCurrent() }
function setFont(id: string) { store.state.current.meta.font = id; loadFontLink(id); store.cacheCurrent() }
watch(font, (id) => loadFontLink(id || 'default'), { immediate: true })

// 导出
const showExport = ref(false)
const exportActions = [
  { name: '导出 / 打印 PDF', key: 'pdf' },
  { name: '导出 HTML 文件', key: 'html' }
]
function downloadBlob(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
function onExport(action: { key: 'pdf' | 'html' }) {
  const html = buildFullHtml(store.state.current)
  if (action.key === 'html') downloadBlob(html, `${store.state.current.meta.title || '简历'}.html`, 'text/html;charset=utf-8')
  else {
    const win = window.open('', '_blank')
    if (!win) return showToast('请允许弹出窗口后重试')
    win.document.open()
    win.document.write(html)
    win.document.close()
    setTimeout(() => { win.focus(); win.print() }, 500)
  }
}

// 保存
function handleSave() {
  const t = store.state.current.meta.title || '我的简历'
  if (store.state.currentId) {
    store.saveCurrent(t)
    showToast('已保存')
  } else {
    const v = window.prompt('为这份简历取个标题吧', t)
    if (v === null) return
    store.saveCurrent(v.trim() || t)
    showToast('已保存，可在首页查看')
  }
}

// 自动缓存
let saveTimer: number | undefined
const stopWatch = watch(
  () => store.state.current,
  () => {
    clearTimeout(saveTimer)
    saveTimer = window.setTimeout(() => store.cacheCurrent(), 400)
  },
  { deep: true }
)
onBeforeUnmount(() => {
  stopWatch()
  clearTimeout(saveTimer)
})
</script>

<style scoped>
.medit { min-height: 100vh; background: var(--rf-paper); padding-bottom: env(safe-area-inset-bottom); }
.m-nav { --van-nav-bar-icon-color: var(--rf-ink); --van-nav-bar-title-font-size: 16px; --van-nav-bar-background: var(--rf-paper); }
.m-save { font-size: 14px; color: var(--rf-accent); font-weight: 600; display: inline-flex; align-items: center; gap: 4px; }
.m-save.saved { color: var(--rf-ink-2); }

.m-toolbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 14px; background: var(--rf-paper); border-bottom: 1px solid var(--rf-line-soft); flex-shrink: 0;
}
.m-pill { display: flex; background: var(--rf-paper-2); border: 1px solid var(--rf-line-soft); border-radius: 8px; padding: 3px; }
.m-pill-item { display: inline-flex; align-items: center; gap: 5px; padding: 6px 16px; font-size: 13px; color: var(--rf-ink-2); border-radius: 6px; cursor: pointer; }
.m-pill-item.on { background: var(--rf-ink); color: #fff; font-weight: 600; }
.m-tools { display: flex; gap: 18px; font-size: 20px; color: var(--rf-ink-2); }

.m-content { flex-shrink: 0; }
.m-modpick {
  display: flex; align-items: center; gap: 10px; padding: 12px 16px; margin: 10px; border-radius: 12px;
  background: var(--rf-card); border: 1px solid var(--rf-line-soft); cursor: pointer;
}
.mmo-icon { font-size: 20px; }
.mmo-label { font-weight: 600; font-size: 15px; font-family: var(--rf-font-serif); }
.mmo-hint { flex: 1; color: var(--rf-faint); font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: inline-block; min-width: 0; }
.mmo-arrow { color: #cbd5e1; }

.mm-wrap { padding: 18px 16px 30px; height: 100%; display: flex; flex-direction: column; }
.mm-title { font-size: 17px; font-weight: 700; }
.mm-tip { color: #94a3b8; font-size: 12px; margin: 4px 0 12px; }
.mm-list { flex: 1; overflow-y: auto; }
.mm-item { display: flex; align-items: center; gap: 12px; padding: 12px 6px; border-bottom: 1px solid #f1f5f9; }
.mm-item.off { opacity: .45; }
.mm-item-icon { font-size: 18px; }
.mm-item-info { flex: 1; min-width: 0; }
.mm-item-name { font-size: 14px; font-weight: 600; }
.mm-item-hint { font-size: 11px; color: #94a3b8; margin-top: 2px; }
.mm-ord { display: flex; flex-direction: column; gap: 6px; font-size: 16px; color: #94a3b8; }

.st-wrap { padding: 20px 16px 30px; }
.st-title { font-size: 15px; font-weight: 700; margin-bottom: 10px; }
.st-tpls { display: flex; flex-direction: column; gap: 8px; margin-bottom: 18px; }
.st-tpl { border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px 14px; cursor: pointer; }
.st-tpl.on { border-color: #2563eb; background: #eff6ff; }
.st-tpl-name { font-weight: 600; font-size: 15px; display: inline-flex; align-items: center; gap: 6px; }
.st-tpl-name :deep(.van-icon) { color: #2563eb; }
.st-tpl-desc { font-size: 12px; color: #94a3b8; margin-top: 3px; }
.st-colors { display: flex; flex-wrap: wrap; gap: 12px; }
.st-color { width: 34px; height: 34px; border-radius: 50%; cursor: pointer; }
.st-color.on { outline: 3px solid #1f2937; outline-offset: 2px; }
.st-fonts { display: flex; flex-wrap: wrap; gap: 8px; }
.st-font { flex: 1 1 40%; min-width: 40%; box-sizing: border-box; display: inline-flex; align-items: center; gap: 6px; padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 13px; cursor: pointer; }
.st-font.on { border-color: #2563eb; background: #eff6ff; }
.st-font :deep(.van-icon) { color: #2563eb; }
</style>