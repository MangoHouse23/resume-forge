<template>
  <div class="list-editor">
    <div
      v-for="(item, idx) in model"
      :key="idx"
      class="le-item"
      draggable="true"
      @dragstart="onDragStart(idx)"
      @dragover.prevent
      @drop="onDrop(idx)"
    >
      <div class="le-item-head">
        <span class="le-grip"><el-icon><Rank /></el-icon></span>
        <span class="le-title">{{ titleOf(item) || `条目 ${idx + 1}` }}</span>
        <span class="le-actions">
          <el-button text circle size="small" :disabled="idx === 0" @click.stop="move(idx, -1)"><el-icon><Top /></el-icon></el-button>
          <el-button text circle size="small" :disabled="idx === model.length - 1" @click.stop="move(idx, 1)"><el-icon><Bottom /></el-icon></el-button>
          <el-button text circle size="small" type="danger" @click.stop="remove(idx)"><el-icon><Delete /></el-icon></el-button>
        </span>
      </div>
      <div class="le-item-body">
        <div v-for="f in schema" :key="f.key" :style="{ gridColumn: `span ${f.span || 1}` }" class="le-field">
          <label>{{ f.label }}</label>
          <el-input
            v-if="f.type === 'text'"
            :model-value="(item as any)[f.key]"
            :placeholder="f.placeholder"
            @update:model-value="(v: string) => patch(idx, f.key as string, v)"
            clearable
          />
          <el-input
            v-else-if="f.type === 'textarea'"
            type="textarea"
            :rows="f.rows || 3"
            :model-value="(item as any)[f.key]"
            :placeholder="f.placeholder"
            @update:model-value="(v: string) => patch(idx, f.key as string, v)"
          />
          <el-date-picker
            v-else-if="f.type === 'month'"
            type="month"
            value-format="YYYY.MM"
            format="YYYY.MM"
            :model-value="(item as any)[f.key] || null"
            :placeholder="f.placeholder || '选择月份'"
            style="width:100%"
            @update:model-value="(v: any) => patch(idx, f.key as string, v || '')"
          />
          <div v-else-if="f.type === 'tags'" class="tags-field">
            <el-select
              :model-value="(item as any)[f.key] || []"
              multiple
              filterable
              allow-create
              default-first-option
              :reserve-keyword="false"
              placeholder="输入后回车添加，可创建多个"
              style="width:100%"
              @update:model-value="(v: string[]) => patch(idx, f.key as string, v)"
            />
          </div>
          <span v-else-if="f.type === 'level'" class="level-field">
            <el-slider
              :model-value="(item as any)[f.key] || 0"
              :max="5" :min="1" :step="1"
              :show-tooltip="true"
              :format-tooltip="(v: number) => ['','了解','基础','熟练','精通','专家'][v as number]"
              style="flex:1"
              @update:model-value="(v: number) => patch(idx, f.key as string, v)"
            />
            <span class="level-num">{{ levelLabel((item as any)[f.key]) }}</span>
          </span>
        </div>
      </div>
    </div>

    <el-button class="le-add" @click="add" :icon="Plus" style="width:100%">添加{{ moduleLabel }}</el-button>
  </div>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'

export interface FieldSchema {
  key: string
  label: string
  type: 'text' | 'textarea' | 'month' | 'tags' | 'level'
  placeholder?: string
  rows?: number
  span?: number
  titleKey?: string
}

const props = withDefaults(defineProps<{
  model: Record<string, any>[]
  schema: FieldSchema[]
  moduleLabel?: string
  titleKey?: string
}>(), { moduleLabel: '一条', titleKey: '' })

const emit = defineEmits<{
  (e: 'update', list: Record<string, any>[]): void
}>()

function cloneItem() {
  const base: Record<string, any> = {}
  for (const f of props.schema) {
    base[f.key] = f.type === 'tags' ? [] : f.type === 'level' ? 4 : ''
  }
  return base
}

function titleOf(item: Record<string, any>) {
  const key = props.titleKey || props.schema.find((f) => f.type === 'text')?.key
  return key ? item[key] : ''
}

const levelLabel = (v: number) => ['', '了解', '基础', '熟练', '精通', '专家'][v] || ''

function patch(idx: number, key: string, value: any) {
  const list = props.model.map((it, i) => (i === idx ? { ...it, [key]: value } : { ...it }))
  emit('update', list)
}

function add() {
  emit('update', [...props.model, cloneItem()])
}
function remove(idx: number) {
  const list = props.model.filter((_, i) => i !== idx)
  emit('update', list)
}
function move(idx: number, dir: number) {
  const arr = [...props.model]
  const target = idx + dir
  if (target < 0 || target >= arr.length) return
  ;[arr[idx], arr[target]] = [arr[target], arr[idx]]
  emit('update', arr)
}

let dragIdx = -1
function onDragStart(idx: number) {
  dragIdx = idx
}
function onDrop(idx: number) {
  if (dragIdx < 0 || dragIdx === idx) return
  const arr = [...props.model]
  const [moved] = arr.splice(dragIdx, 1)
  arr.splice(idx, 0, moved)
  dragIdx = -1
  emit('update', arr)
}
</script>

<style scoped>
.list-editor { display: flex; flex-direction: column; gap: 12px; }
.le-item {
  background: #fbfcfe; border: 1px solid #e6ebf2; border-radius: 10px; overflow: hidden;
}
.le-item.dragging { opacity: .5; }
.le-item-head {
  display: flex; align-items: center; gap: 8px;
  background: #f1f5f9; padding: 8px 12px;
}
.le-grip { cursor: grab; color: #94a3b8; display: flex; }
.le-title { flex: 1; font-weight: 600; font-size: 13px; color: #334155; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.le-actions { display: flex; }
.le-item-body {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; padding: 14px;
}
.le-field { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.le-field label { font-size: 12px; color: #64748b; }
.tags-field, .level-field { display: flex; align-items: center; gap: 10px; }
.level-num { color: #94a3b8; font-size: 12px; white-space: nowrap; width: 34px; text-align: right; }
.le-add { border-style: dashed; color: var(--rf-accent); }
</style>