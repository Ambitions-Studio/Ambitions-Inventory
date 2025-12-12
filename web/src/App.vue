<script setup lang="ts">
import BoilerplateView from './views/BoilerplateView.vue'
import InventoryView from './views/InventoryView.vue'

const isDevelopment = import.meta.env.DEV
</script>

<template>
  <VApp>
    <BoilerplateView v-if="isDevelopment" />
    <InventoryView v-else />
  </VApp>
</template>
