<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useDragAndDrop } from '@/composables/useDragAndDrop'
import { useSettingsStore } from '@/stores/settings'
import { useEquipmentStore } from '@/stores/equipment'
import * as SettingsService from '@/services/SettingsService'
import type { EquipmentSlot, EquipmentSlotDefinition } from '@/types/equipment'
import { EQUIPMENT_SLOT_MAP } from '@/types/equipment'

const props = defineProps<{
  slotId: EquipmentSlot
  slotIndex: number
}>()

const { registerSlot, unregisterSlot, startDrag, nearestSlot, isHoldingItem } = useDragAndDrop()
const settingsStore = useSettingsStore()
const equipmentStore = useEquipmentStore()

const slotElement = ref<HTMLElement | null>(null)
const isHovered = ref(false)

const slotDefinition = computed((): EquipmentSlotDefinition => EQUIPMENT_SLOT_MAP[props.slotId])
const equippedItem = computed(() => equipmentStore.getItem(props.slotId))
const isEmpty = computed(() => !equippedItem.value)

const slotStyle = computed(() => {
  const settings = settingsStore.settings
  return {
    background: `linear-gradient(to bottom, ${SettingsService.hexToRgba(settings.primaryColor, settings.opacity)}, ${SettingsService.hexToRgba(settings.secondaryColor, settings.opacity)})`,
    borderColor: settings.borderColor,
    borderRadius: `${settings.borderRadius * 12}px`
  }
})

const isNearestTarget = computed(() => {
  if (!nearestSlot.value) return false
  return nearestSlot.value.index === props.slotIndex && nearestSlot.value.source === 'equipment'
})

const handleMouseDown = (event: MouseEvent) => {
  if (equippedItem.value) {
    const slotData = {
      id: equippedItem.value.id,
      name: equippedItem.value.name,
      quantity: equippedItem.value.quantity,
      metadata: equippedItem.value.metadata as unknown as Record<string, unknown>,
    }
    startDrag(props.slotIndex, 'equipment', slotData, event)
  }
}

onMounted(() => {
  if (slotElement.value) {
    registerSlot(props.slotIndex, 'equipment', slotElement.value)
  }
})

onUnmounted(() => {
  unregisterSlot(props.slotIndex, 'equipment')
})
</script>

<template>
  <div
    ref="slotElement"
    class="w-[120px] h-[120px] border-solid border-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_2px_6px_rgba(0,0,0,0.35)] cursor-pointer transition-all duration-200 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_12px_rgba(0,0,0,0.45)] hover:brightness-110 flex flex-col items-center justify-center group relative"
    :class="[
      isNearestTarget ? 'shadow-[0_0_12px_rgba(148,163,184,0.4)] ring-2 ring-emerald-400/50' : ''
    ]"
    :style="slotStyle"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @mousedown.prevent="handleMouseDown"
  >
    <div
      v-if="isEmpty && isHovered && !isHoldingItem"
      class="absolute inset-0 bg-gradient-to-br from-slate-500/20 to-transparent animate-pulse"
      :style="{ borderRadius: slotStyle.borderRadius }"
    />
    <div
      v-if="isNearestTarget"
      class="absolute inset-0 bg-emerald-400/10"
      :style="{ borderRadius: slotStyle.borderRadius }"
    />

    <template v-if="equippedItem">
      <div class="w-10 h-10 rounded bg-slate-600/50 flex items-center justify-center">
        <span class="text-slate-300 text-xs uppercase">{{ equippedItem.name.slice(0, 3) }}</span>
      </div>
      <span class="text-[10px] text-white/80 font-medium mt-2">
        {{ equippedItem.metadata.customLabel ?? slotDefinition.label }}
      </span>
    </template>

    <template v-else>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-10 h-10 text-white/40 group-hover:text-white/70 transition-colors duration-200"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path :d="slotDefinition.icon" />
      </svg>
      <span class="text-[10px] text-white/50 group-hover:text-white/80 font-medium mt-2 transition-colors duration-200">
        {{ slotDefinition.label }}
      </span>
    </template>
  </div>
</template>
