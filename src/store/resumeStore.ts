import { computed, reactive, ref } from 'vue'
import type { ResumeData } from '@/types/resume'
import { createEmptyResume, createResumeFromPreset, presetById, type ProfessionPreset } from '@/data/presets'

export interface SavedResumeMeta {
  id: string
  title: string
  professionId: string
  professionName: string
  updatedAt: string
  data: ResumeData
}

const SAVED_KEY = 'resumeforge.saved'
const CURRENT_KEY = 'resumeforge.current'

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function readSaved(): SavedResumeMeta[] {
  try {
    const raw = localStorage.getItem(SAVED_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function readCurrent(): ResumeData | null {
  try {
    const raw = localStorage.getItem(CURRENT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const state = reactive({
  saved: readSaved() as SavedResumeMeta[],
  currentId: ref<string | null>(null),
  current: (readCurrent() ?? createEmptyResume()) as ResumeData
})

function persistCurrent() {
  localStorage.setItem(CURRENT_KEY, JSON.stringify(state.current))
}

function persistSaved() {
  localStorage.setItem(SAVED_KEY, JSON.stringify(state.saved))
}

// 已保存的简历数量（用于首页展示）
export const savedCount = computed(() => state.saved.length)

// 当前正在编辑的简历（深拷贝给编辑器传入时保持独立修改）
export const currentData = computed(() => state.current)

export function useResumeStore() {
  function newFromProfession(preset: ProfessionPreset) {
    state.current = createResumeFromPreset(preset)
    state.currentId = null
    // 保持编辑时自动保存到缓存
    persistCurrent()
    return state.current
  }

  function resetEmpty() {
    state.current = createResumeFromPreset(presetById('audit')!)
    state.currentId = null
    persistCurrent()
    return state.current
  }

  function getSavedList() {
    return state.saved
  }

  function openSaved(id: string) {
    const found = state.saved.find((s) => s.id === id)
    if (found) {
      state.current = JSON.parse(JSON.stringify(found.data)) as ResumeData
      state.currentId = found.id
      persistCurrent()
    }
    return state.current
  }

  function saveCurrent(titleOverride?: string) {
    if (titleOverride) state.current.meta.title = titleOverride
    const idx = state.saved.findIndex((s) => s.id === state.currentId)
    const meta: SavedResumeMeta = {
      id: state.currentId ?? uid(),
      title: state.current.meta.title || '未命名简历',
      professionId: state.current.meta.professionId,
      professionName: presetById(state.current.meta.professionId)?.name ?? '通用',
      updatedAt: new Date().toLocaleString('zh-CN', { hour12: false }),
      data: JSON.parse(JSON.stringify(state.current))
    }
    if (idx >= 0) {
      state.saved[idx] = meta
      state.currentId = meta.id
    } else {
      state.saved.unshift(meta)
      state.currentId = meta.id
    }
    persistSaved()
    persistCurrent()
    return meta
  }

  function deleteSaved(id: string) {
    state.saved = state.saved.filter((s) => s.id !== id)
    if (state.currentId === id) {
      state.currentId = null
    }
    persistSaved()
  }

  function setCurrent(data: ResumeData, id?: string | null) {
    state.current = data
    state.currentId = id ?? null
    persistCurrent()
  }

  // 编辑过程中即时代缓存（刷新不丢失）
  function cacheCurrent() {
    persistCurrent()
  }

  return {
    state,
    savedCount,
    currentData,
    newFromProfession,
    resetEmpty,
    getSavedList,
    openSaved,
    saveCurrent,
    deleteSaved,
    setCurrent,
    cacheCurrent
  }
}