<template>
  <div class="rf-field">
    <label class="rf-label">{{ label }}</label>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string }>()
</script>

<style scoped>
.rf-field { display: flex; flex-direction: column; gap: 6px; }
.rf-label { font-size: 12px; color: #64748b; font-weight: 500; }
</style>