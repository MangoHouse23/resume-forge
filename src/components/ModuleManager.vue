<template>
  <el-drawer :model-value="modelValue" title="模块管理" size="380px" @update:model-value="(v)=>emit('update:modelValue', v)">
    <div class="mm">
      <p class="mm-tip">勾选显示某个模块，拖动或使用按钮调整它们在简历中的顺序。</p>

      <div class="mm-pinned">
        <div class="mm-row pinned">
          <el-checkbox :model-value="true" disabled>求职意向 + 基本信息</el-checkbox>
          <span class="mm-badge">必含</span>
        </div>
      </div>

      <div
        v-for="(mod, idx) in orderedModules"
        :key="mod.key"
        class="mm-row"
        draggable="true"
        @dragstart="dragIdx = idx"
        @dragover.prevent
        @drop="onDrop(idx)"
      >
        <span class="mm-grip"><el-icon><Rank /></el-icon></span>
        <el-checkbox
          :model-value="isEnabled(mod.key)"
          @update:model-value="(v)=>toggle(mod.key, v as boolean)"
        />
        <div class="mm-info">
          <div class="mm-name">{{ mod.label }}</div>
          <div class="mm-hint">{{ mod.hint }}</div>
        </div>
        <span class="mm-arrows">
          <el-button text circle size="small" :disabled="idx === 0" @click="move(idx, -1)"><el-icon><Top /></el-icon></el-button>
          <el-button text circle size="small" :disabled="idx === orderedModules.length - 1" @click="move(idx, 1)"><el-icon><Bottom /></el-icon></el-button>
        </span>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { MODULE_CATALOG, type ModuleMeta } from '@/data/meta'
import type { ResumeModuleKey } from '@/types/resume'

const props = defineProps<{
  modelValue: boolean
  moduleOrder: ResumeModuleKey[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'update:moduleOrder', order: ResumeModuleKey[]): void
}>()

const ALWAYS: ResumeModuleKey[] = ['targetInfo', 'basicInfo']

const orderedModules = computed<ModuleMeta[]>(() => {
  const order = [...ALWAYS.filter((k) => !props.moduleOrder.includes(k)), ...props.moduleOrder]
  return MODULE_CATALOG.filter((m) => order.includes(m.key))
})

function isEnabled(key: ResumeModuleKey) {
  return ALWAYS.includes(key) || props.moduleOrder.includes(key)
}

function toggle(key: ResumeModuleKey, on: boolean) {
  const order = [...props.moduleOrder]
  if (on) {
    if (!order.includes(key)) order.push(key)
  } else {
    const i = order.indexOf(key)
    if (i > -1) order.splice(i, 1)
  }
  emit('update:moduleOrder', order)
}

function move(idx: number, dir: number) {
  const arr = [...orderedModules.value]
  const t = idx + dir
  if (t < 0 || t >= arr.length) return
  const moved = arr[idx]
  arr[idx] = arr[t]
  arr[t] = moved
  // 只更新非固定模块的顺序
  const order = arr.filter((m) => !ALWAYS.includes(m.key)).map((m) => m.key)
  // 保证原先在顺序里但不在拖拽列表里的模块保留
  for (const k of props.moduleOrder) {
    if (!order.includes(k)) order.push(k)
  }
  emit('update:moduleOrder', order)
}

const dragIdx = ref(-1)
function onDrop(idx: number) {
  const arr = orderedModules.value
  const from = dragIdx.value
  if (from < 0 || from === idx) return
  const moved = arr[from]
  arr.splice(from, 1)
  arr.splice(idx, 0, moved)
  const order = arr.filter((m) => !ALWAYS.includes(m.key)).map((m) => m.key)
  for (const k of props.moduleOrder) {
    if (!order.includes(k)) order.push(k)
  }
  emit('update:moduleOrder', order)
  dragIdx.value = -1
}
</script>

<style scoped>
.mm { display: flex; flex-direction: column; gap: 8px; }
.mm-tip { font-size: 13px; color: #64748b; margin: 0 0 6px; line-height: 1.6; }
.mm-pinned { border-bottom: 1px dashed #e2e8f0; padding-bottom: 10px; }
.mm-row {
  display: flex; align-items: center; gap: 10px;
  background: #fff; border: 1px solid #eef2f7; border-radius: 10px; padding: 10px 12px;
}
.mm-row.pinned { background: #f8fafc; }
.mm-row.dragging { opacity: .5; }
.mm-grip { color: #cbd5e1; cursor: grab; display: flex; flex: 0 0 20px; }
.mm-info { flex: 1; min-width: 0; }
.mm-name { font-size: 14px; font-weight: 600; }
.mm-hint { font-size: 12px; color: #94a3b8; margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mm-arrows { display: flex; flex-direction: column; }
.mm-badge { font-size: 11px; color: var(--rf-accent); border: 1px solid #bfdbfe; border-radius: 999px; padding: 1px 8px; }
:deep(.mm-row .el-checkbox__label) { display: none; }
</style>