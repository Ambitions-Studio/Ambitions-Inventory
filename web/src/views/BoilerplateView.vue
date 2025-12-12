<script setup lang="ts">
import { ref } from 'vue'
import DevInfoMenu from '@/components/boilerplate/DevInfoMenu.vue'
import DevStatusBar from '@/components/boilerplate/DevStatusBar.vue'
import InventoryView from '@/views/InventoryView.vue'

const currentView = ref('inventory')
</script>

<template>
  <div
    class="fixed inset-0 w-full h-full bg-contain bg-center bg-no-repeat bg-gray-900 sm:bg-contain md:bg-cover lg:bg-cover xl:bg-cover 2xl:bg-cover bg-[url('/boilerplate-background.jpg')] transition-all duration-300"
  >
    <div class="absolute inset-0 bg-black/20"></div>

    <DevInfoMenu :current-view="currentView" />

    <DevStatusBar />

    <div class="relative z-10 w-full h-full">
      <InventoryView :force-visible="true" />
    </div>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
