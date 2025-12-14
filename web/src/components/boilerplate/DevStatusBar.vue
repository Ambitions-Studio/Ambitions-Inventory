<script setup lang="ts">
import { mdiNodejs, mdiVuejs } from '@/icons'
</script>

<template>
  <div class="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
    <div
      class="bg-charcoal-elegant border border-gray-400/30 rounded-full px-6 py-2 2k:px-32 2k:py-10"
    >
      <div
        class="flex items-center justify-center gap-4 2k:gap-16 text-xs 2k:text-2xl text-gray-300"
      >
        <div class="flex items-center justify-center gap-1 2k:gap-4">
          <div class="w-2 h-2 2k:w-8 2k:h-8 bg-green-400 rounded-full animate-pulse"></div>
          <span>Dev Mode Active</span>
        </div>
        <div class="w-px h-4 2k:h-12 bg-gray-600"></div>
        <div class="flex items-center justify-center gap-1 2k:gap-4">
          <VIcon :icon="mdiNodejs" class="text-green-500 text-sm 2k:text-3xl" />
          <span>Vite HMR</span>
        </div>
        <div class="w-px h-4 2k:h-12 bg-gray-600"></div>
        <div class="flex items-center justify-center gap-1 2k:gap-4">
          <VIcon :icon="mdiVuejs" class="text-green-500 text-sm 2k:text-3xl" />
          <span>Vue 3</span>
        </div>
      </div>
    </div>
  </div>
</template>
