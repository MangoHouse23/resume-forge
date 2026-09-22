<template>
  <div ref="wrapRef" class="tp-wrap">
    <div class="tp-scaler" :style="scaleStyle">
      <div class="tp-paper" ref="paperRef" v-html="html"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { PREVIEW_CSS, renderResume } from '@/render/resumeHtml'
import type { ResumeData } from '@/types/resume'

const props = defineProps<{ data: ResumeData }>()

const html = computed(() => renderResume(props.data).html)

const DESIGN_WIDTH = 794
const wrapRef = ref<HTMLDivElement>()
const paperRef = ref<HTMLDivElement>()
const scale = ref(1)
let ro: ResizeObserver | null = null

function computeScale() {
  const wrap = wrapRef.value
  if (!wrap) return
  scale.value = Math.min(1, (wrap.clientWidth - 8) / (DESIGN_WIDTH + 24))
}

// 注入预览样式到全局
const styleTagId = 'rf-preview-style'
function ensureStyle() {
  if (!document.getElementById(styleTagId)) {
    const s = document.createElement('style')
    s.id = styleTagId
    s.textContent = PREVIEW_CSS
    document.head.appendChild(s)
  }
}

onMounted(() => {
  ensureStyle()
  computeScale()
  ro = new ResizeObserver(computeScale)
  if (wrapRef.value) ro.observe(wrapRef.value)
})

onBeforeUnmount(() => ro?.disconnect())

watch(
  () => props.data.meta?.templateId,
  () => {
    requestAnimationFrame(computeScale)
  }
)

const scaleStyle = computed(() => ({
  width: `${DESIGN_WIDTH + 24}px`,
  transform: `scale(${scale.value})`,
  transformOrigin: 'top center',
  transition: 'transform .18s ease'
}))
</script>

<style scoped>
.tp-wrap {
  width: 100%; min-height: 60vh; overflow-y: auto;
  display: flex; justify-content: center; align-items: flex-start; padding: 20px 10px;
  background: #e2e7f0;
}
.tp-scaler { height: 100%; }
.tp-paper { box-shadow: 0 6px 30px rgba(15,23,42,.18); }
</style>