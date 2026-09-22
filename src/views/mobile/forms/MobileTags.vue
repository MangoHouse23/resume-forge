<template>
  <div class="mtags">
    <div class="mtags-head">
      <span class="mtags-label">{{ label }}</span>
      <span class="mtags-count">{{ modelValue.length }}</span>
    </div>
    <div class="mtags-body">
      <van-tag
        v-for="(t, i) in modelValue"
        :key="i"
        round
        closable
        size="medium"
        color="#eef2ff"
        text-color="#2563eb"
        @close="remove(i)"
      >{{ t }}</van-tag>
      <van-field
        :model-value="draft"
        class="mtags-input"
        placeholder="输入后回车添加"
        :border="false"
        @update:model-value="(v:string)=>draft=v"
        @keyup.enter="add"
        @blur="add"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ label: string; modelValue: string[] }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string[]): void }>()
const draft = ref('')

function add() {
  const v = draft.value.trim()
  if (!v) return
  if (!props.modelValue.includes(v)) emit('update:modelValue', [...props.modelValue, v])
  draft.value = ''
}
function remove(i: number) {
  emit('update:modelValue', props.modelValue.filter((_, idx) => idx !== i))
}
</script>

<style scoped>
.mtags { display: flex; flex-direction: column; gap: 8px; padding: 10px 0; }
.mtags-head { display: flex; align-items: center; gap: 8px; }
.mtags-label { font-size: 14px; color: #334155; font-weight: 600; }
.mtags-count { font-size: 12px; color: #94a3b8; }
.mtags-body { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.mtags-input { flex: 1; min-width: 140px; padding: 0; }
.mtags-input :deep(.van-field__control) { font-size: 13px; }
</style>