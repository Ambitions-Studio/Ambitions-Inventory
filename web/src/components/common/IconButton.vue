<script setup lang="ts">
defineProps<{
  icon: string
  label?: string
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    class="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-b from-slate-700/85 to-slate-800/95 border-solid border-2 border-[#475569] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_2px_6px_rgba(0,0,0,0.35)] cursor-pointer transition-all duration-200 hover:border-[#64748b] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_12px_rgba(0,0,0,0.45)]"
    @click="$emit('click')"
  >
    <span class="text-white text-lg">{{ icon }}</span>
    <span v-if="label" class="text-white text-sm font-semibold">{{ label }}</span>
  </button>
</template>
