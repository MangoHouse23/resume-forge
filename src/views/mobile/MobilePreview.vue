<template>
  <div class="mp-render" v-html="html"></div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { PREVIEW_CSS, renderResume } from '@/render/resumeHtml'
import type { ResumeData } from '@/types/resume'

const props = defineProps<{ data: ResumeData }>()
const html = computed(() => renderResume(props.data).html)

const styleTagId = 'rf-preview-style'
onMounted(() => {
  if (!document.getElementById(styleTagId)) {
    const s = document.createElement('style')
    s.id = styleTagId
    s.textContent = PREVIEW_CSS
    document.head.appendChild(s)
  }
})
</script>

<style scoped>
.mp-render {
  width: 100%;
  background: #fff;
}
.mp-render :deep(.rfp) {
  box-shadow: none;
}
</style>