<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    :width="size"
    :height="size"
    :stroke-width="strokeWidth"
    v-html="inner"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { iconSvg } from '@/vecIcons'

const props = withDefaults(defineProps<{ name?: string; size?: number; strokeWidth?: number }>(), {
  size: 20,
  strokeWidth: 2
})

const inner = computed(() => iconSvg(props.name))
</script>