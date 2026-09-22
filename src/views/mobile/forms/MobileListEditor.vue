<template>
  <div class="mle">
    <div v-for="(item, idx) in model" :key="idx" class="mle-item">
      <div class="mle-head">
        <span class="mle-title">{{ titleOf(item) || `条目 ${idx + 1}` }}</span>
        <span class="mle-actions">
          <van-icon name="arrow-up" :color="idx === 0 ? '#d1d5db' : '#94a3b8'" @click="move(idx, -1)" />
          <van-icon name="arrow-down" :color="idx === model.length - 1 ? '#d1d5db' : '#94a3b8'" @click="move(idx, 1)" />
          <van-icon name="delete-o" color="#ef4444" @click="remove(idx)" />
        </span>
      </div>
      <div class="mle-fields">
        <van-field
          v-for="f in schema"
          :key="f.key"
          v-model="item[f.key]"
          :label="f.label"
          :type="f.type === 'textarea' ? 'textarea' : 'text'"
          :rows="f.rows || 3"
          :autosize="f.type === 'textarea'"
          :placeholder="f.placeholder || `请输入${f.label}`"
          clearable
        />
        <div v-if="hasLevel" class="mle-level">
          <span class="mle-label">熟练度</span>
          <van-slider
            :model-value="(item as any).level || 0"
            :min="1" :max="5" :step="1" :active-color="accent"
            @update:model-value="(v:number)=>item.level = v"
          />
          <span class="mle-level-text">{{ levelLabel((item as any).level) }}</span>
        </div>
        <MobileTags
          v-if="hasTags"
          v-model="item[fTags!]"
          :label="fTagsLabel"
        />
      </div>
    </div>

    <van-button plain type="primary" icon="plus" block hairline round class="mle-add" @click="add">
      添加{{ moduleLabel }}
    </van-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MobileTags from './MobileTags.vue'

export interface FieldSchema {
  key: string
  label: string
  type: 'text' | 'textarea' | 'month' | 'tags' | 'level'
  placeholder?: string
  rows?: number
}

const props = withDefaults(defineProps<{
  model: Record<string, any>[]
  schema: FieldSchema[]
  moduleLabel?: string
  titleKey?: string
  accent?: string
}>(), { moduleLabel: '一条', titleKey: '', accent: '#2563eb' })

const emit = defineEmits<{ (e: 'update', list: Record<string, any>[]): void }>()

const hasLevel = computed(() => props.schema.some((f) => f.type === 'level'))
const hasTags = computed(() => props.schema.some((f) => f.type === 'tags'))
const fTags = computed(() => props.schema.find((f) => f.type === 'tags')?.key)
const fTagsLabel = computed(() => props.schema.find((f) => f.type === 'tags')?.label || '标签')

const levelLabel = (v: number) => ['', '了解', '基础', '熟练', '精通', '专家'][v] || ''

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
function add() { emit('update', [...props.model, cloneItem()]) }
function remove(i: number) { emit('update', props.model.filter((_, idx) => idx !== i)) }
function move(i: number, dir: number) {
  const arr = [...props.model]
  const t = i + dir
  if (t < 0 || t >= arr.length) return
  ;[arr[i], arr[t]] = [arr[t], arr[i]]
  emit('update', arr)
}
</script>

<style scoped>
.mle { display: flex; flex-direction: column; gap: 12px; margin-top: 6px; }
.mle-item { background: #fff; border-radius: 12px; overflow: hidden; }
.mle-head { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: #f6f8fb; }
.mle-title { font-size: 14px; font-weight: 600; color: #334155; }
.mle-actions { display: flex; gap: 14px; font-size: 16px; }
.mle-fields { padding: 4px 12px 8px; }
.mle-level { display: flex; align-items: center; gap: 12px; padding: 12px 0; }
.mle-label { font-size: 14px; color: #323233; flex-shrink: 0; width: 56px; }
.mle-level :deep(.van-slider) { flex: 1; }
.mle-level-text { font-size: 12px; color: #94a3b8; width: 32px; text-align: right; flex-shrink: 0; }
.mle-add { margin-top: 4px; }
</style>