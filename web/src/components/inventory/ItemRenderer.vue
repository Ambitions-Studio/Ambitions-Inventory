<script setup lang="ts">
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import type { InventorySlot } from '@/services/InventoryService'
import type { ItemDefinition } from '@/types/item'

const props = defineProps<{
  slotData: InventorySlot
  definition: ItemDefinition | undefined
  slotIndex: number
}>()

const settingsStore = useSettingsStore()

defineEmits<{
  click: [slotIndex: number, slotData: InventorySlot]
  rightClick: [slotIndex: number, slotData: InventorySlot]
  hover: [slotIndex: number | null, slotData: InventorySlot]
}>()

const displayLabel = computed(() => {
  const customLabel = props.slotData?.metadata?.customLabel as string | undefined
  if (customLabel && customLabel.trim().length > 0) {
    return customLabel
  }
  return props.definition?.label ?? ''
})
</script>

<template>
  <div
    class="relative w-full h-full flex items-center justify-center"
    @click="$emit('click', slotIndex, slotData)"
    @contextmenu.prevent="$emit('rightClick', slotIndex, slotData)"
    @mouseenter="$emit('hover', slotIndex, slotData)"
    @mouseleave="$emit('hover', null, slotData)"
  >
    <template v-if="slotData && !definition">
      <div class="w-8 h-8 rounded bg-slate-600/50 flex items-center justify-center">
        <span class="text-slate-400 text-xs">?</span>
      </div>
    </template>

    <template v-if="slotData && definition">
      <img
        v-if="definition.image"
        :src="`/images/${definition.image}`"
        :alt="definition.label"
        class="w-14 h-14 object-contain drop-shadow-lg pointer-events-none select-none"
        draggable="false"
      />
      <div
        v-else
        class="w-10 h-10 rounded bg-slate-600/50 flex items-center justify-center"
      >
        <span class="text-slate-300 text-xs uppercase">{{ definition.name.slice(0, 3) }}</span>
      </div>

      <span
        class="absolute top-1 left-1.5 text-[10px] font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
        :style="{ color: settingsStore.settings.textColor }"
      >
        {{ (definition.weight / 1000).toFixed(1) }}kg
      </span>

      <span
        class="absolute top-1 right-1.5 text-[10px] font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
        :style="{ color: settingsStore.settings.textColor }"
      >
        {{ slotData.quantity }}
      </span>

      <span
        class="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] truncate max-w-[90%] text-center"
        :style="{ color: settingsStore.settings.textColor }"
      >
        {{ displayLabel }}
      </span>
    </template>
  </div>
</template>
