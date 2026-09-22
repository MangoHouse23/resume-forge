<template>
  <div class="text-area-wrap">
    <label class="rf-label">{{ title }}</label>
    <el-input
      type="textarea"
      :rows="rows"
      :model-value="modelValue"
      :placeholder="placeholder"
      @update:model-value="(v) => emit('update:modelValue', v)"
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  modelValue: string
  placeholder?: string
  rows?: number
}>(), { placeholder: '', rows: 5 })

const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()
</script>

<style scoped>
.text-area-wrap { display: flex; flex-direction: column; gap: 8px; }
.rf-label { font-size: 13px; color: #334155; font-weight: 600; }
</style>