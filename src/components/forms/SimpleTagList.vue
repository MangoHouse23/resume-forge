<template>
  <div class="simple-tag">
    <div class="st-head">
      <label class="st-label">{{ title }}</label>
      <span class="st-count">{{ model.length }} 项</span>
    </div>
    <div class="st-tags">
      <el-tag
        v-for="(t, i) in model"
        :key="i"
        closable
        effect="plain"
        class="st-tag"
        @close="remove(i)"
      >{{ t }}</el-tag>
      <el-input
        v-model="draft"
        class="st-input"
        size="small"
        :placeholder="placeholder"
        @keyup.enter="add"
        @blur="add"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  title: string
  model: string[]
  placeholder?: string
}>(), { placeholder: '输入内容后回车添加' })

const emit = defineEmits<{ (e: 'update', list: string[]): void }>()
const draft = ref('')

function add() {
  const v = draft.value.trim()
  if (!v) return
  if (!props.model.includes(v)) {
    emit('update', [...props.model, v])
  }
  draft.value = ''
}
function remove(i: number) {
  emit('update', props.model.filter((_, idx) => idx !== i))
}
</script>

<style scoped>
.simple-tag { display: flex; flex-direction: column; gap: 12px; }
.st-head { display: flex; align-items: center; justify-content: space-between; }
.st-label { font-size: 13px; color: #334155; font-weight: 600; }
.st-count { font-size: 12px; color: #94a3b8; }
.st-tags { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.st-tag { border-radius: 999px; }
.st-input { width: 160px; }
</style>