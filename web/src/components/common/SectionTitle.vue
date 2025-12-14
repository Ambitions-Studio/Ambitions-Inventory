<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'

defineProps<{
  title: string
  size?: string
  font?: string
}>()

const settingsStore = useSettingsStore()
</script>

<template>
  <span
    :class="[
      size || 'text-sm',
      font || 'font-semibold'
    ]"
    :style="{ color: settingsStore.settings.titleColor }"
  >
    {{ title }}
  </span>
</template>
