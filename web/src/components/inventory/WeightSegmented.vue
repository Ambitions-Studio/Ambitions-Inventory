<script setup lang="ts">
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'

const settingsStore = useSettingsStore()

const props = withDefaults(
  defineProps<{
    currentWeight: number
    maxWeight: number
    percentage: number
    segments?: number
    state?: 'normal' | 'warning' | 'danger'
  }>(),
  {
    segments: 12,
    state: 'normal'
  }
)

const filledSegments = computed(() => {
  return Math.round((props.percentage / 100) * props.segments)
})

const segmentStyle = computed(() => {
  switch (props.state) {
    case 'warning':
      return { backgroundColor: '#fbbf24', boxShadow: '0 0 6px rgba(251,191,36,0.5)' }
    case 'danger':
      return { backgroundColor: '#ef4444', boxShadow: '0 0 6px rgba(239,68,68,0.5)' }
    default:
      return { backgroundColor: settingsStore.settings.weightColor, boxShadow: `0 0 6px ${settingsStore.settings.weightColor}66` }
  }
})

const formatWeight = (grams: number): string => {
  return `${(grams / 1000).toFixed(1)}kg`
}
</script>

<template>
  <div class="flex items-center gap-2">
    <span class="text-[11px] font-medium" :style="{ color: settingsStore.settings.weightColor }">
      {{ formatWeight(currentWeight) }} / {{ formatWeight(maxWeight) }}
    </span>

    <div class="flex items-center gap-1">
      <div
        v-for="i in segments"
        :key="i"
        class="h-3 w-5 rounded-full transition-all duration-200"
        :class="[
          i <= filledSegments
            ? ''
            : 'bg-slate-700/50 border border-slate-600/50'
        ]"
        :style="i <= filledSegments ? segmentStyle : {}"
      ></div>
    </div>
  </div>
</template>
