<template>
  <EditorMobile v-if="isMobile" />
  <EditorDesktop v-else />
</template>

<script setup lang="ts">
import EditorDesktop from './desktop/EditorDesktop.vue'
import EditorMobile from './mobile/EditorMobile.vue'
import { useIsMobile } from '@/composables/useViewport'

const isMobile = useIsMobile()
</script>