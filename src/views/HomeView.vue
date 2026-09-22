<template>
  <HomeMobile v-if="isMobile" />
  <HomeDesktop v-else />
</template>

<script setup lang="ts">
import HomeDesktop from './desktop/HomeDesktop.vue'
import HomeMobile from './mobile/HomeMobile.vue'
import { useIsMobile } from '@/composables/useViewport'

const isMobile = useIsMobile()
</script>