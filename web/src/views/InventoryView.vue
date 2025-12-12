<script setup lang="ts">
defineProps<{
  forceVisible?: boolean
}>()
</script>

<template>
  <div v-if="forceVisible" class="inventory-container">
  </div>
</template>
