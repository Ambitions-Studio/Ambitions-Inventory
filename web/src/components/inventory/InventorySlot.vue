<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ItemRenderer from './ItemRenderer.vue'
import { useDragAndDrop, type DragSource } from '@/composables/useDragAndDrop'
import { useItemContextMenu } from '@/composables/useItemContextMenu'
import { useSettingsStore } from '@/stores/settings'
import * as SettingsService from '@/services/SettingsService'
import type { InventorySlot } from '@/services/InventoryService'
import type { ItemDefinition } from '@/types/item'

const props = withDefaults(defineProps<{
  slotIndex: number
  slotData: InventorySlot
  definition: ItemDefinition | undefined
  source?: DragSource
}>(), {
  source: 'inventory'
})

defineEmits<{
  click: [slotIndex: number, slotData: InventorySlot]
  rightClick: [slotIndex: number, slotData: InventorySlot]
  hover: [slotIndex: number | null, slotData: InventorySlot]
}>()

const { registerSlot, unregisterSlot, startDrag, nearestSlot, isHoldingItem } = useDragAndDrop()
const { openMenu: openContextMenu, isInspecting, inspectProgress, inspectSlotIndex } = useItemContextMenu()
const settingsStore = useSettingsStore()

const isCurrentlyInspecting = computed(() => {
  return isInspecting.value && inspectSlotIndex.value === props.slotIndex && props.source === 'ground'
})

const slotStyle = computed(() => {
  const settings = settingsStore.settings
  return {
    background: `linear-gradient(to bottom, ${SettingsService.hexToRgba(settings.primaryColor, settings.opacity)}, ${SettingsService.hexToRgba(settings.secondaryColor, settings.opacity)})`,
    borderColor: settings.borderColor,
    borderRadius: `${settings.borderRadius * 16}px`
  }
})

const slotElement = ref<HTMLElement | null>(null)
const isHovered = ref(false)
const isEmpty = computed(() => !props.slotData)

const isNearestTarget = computed(() => {
  if (!nearestSlot.value) return false
  return nearestSlot.value.index === props.slotIndex && nearestSlot.value.source === props.source
})

const handleMouseDown = (event: MouseEvent) => {
  if (props.slotData) {
    startDrag(props.slotIndex, props.source, props.slotData, event)
  }
}

const handleContextMenu = (event: MouseEvent) => {
  if (props.slotData) {
    openContextMenu(props.slotIndex, props.source, props.slotData, event)
  }
}

onMounted(() => {
  if (slotElement.value) {
    registerSlot(props.slotIndex, props.source, slotElement.value)
  }
})

onUnmounted(() => {
  unregisterSlot(props.slotIndex, props.source)
})
</script>

<template>
  <div
    ref="slotElement"
    class="aspect-square border-solid border-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_2px_6px_rgba(0,0,0,0.35)] cursor-pointer transition-all duration-200 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_12px_rgba(0,0,0,0.45)] relative overflow-hidden select-none"
    :class="[
      isNearestTarget ? 'shadow-[0_0_12px_rgba(148,163,184,0.4)]' : 'hover:brightness-110'
    ]"
    :style="slotStyle"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @mousedown.prevent="handleMouseDown"
    @contextmenu.prevent="handleContextMenu"
  >
    <div
      v-if="isEmpty && isHovered && !isHoldingItem"
      class="absolute inset-0 bg-gradient-to-br from-slate-500/20 to-transparent animate-pulse"
    />
    <div
      v-if="isEmpty && isHovered && !isHoldingItem"
      class="absolute inset-0 border-2 border-slate-400/30"
      :style="{ borderRadius: slotStyle.borderRadius }"
    />
    <div
      v-if="isNearestTarget"
      class="absolute inset-0 bg-slate-300/10"
    />
    <div
      v-if="isCurrentlyInspecting"
      class="absolute inset-0 z-10 overflow-hidden"
      :style="{ borderRadius: slotStyle.borderRadius }"
    >
      <div class="absolute inset-0 bg-slate-900/60" />
      <div
        class="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500/40 via-emerald-400/30 to-transparent transition-all duration-100"
        :style="{ width: `${inspectProgress}%` }"
      />
      <div
        class="absolute inset-y-0 bg-emerald-300/50 w-1 blur-sm transition-all duration-100"
        :style="{ left: `${inspectProgress}%` }"
      />
    </div>
    <ItemRenderer
      :slot-data="slotData"
      :definition="definition"
      :slot-index="slotIndex"
      @click="$emit('click', $event, slotData)"
      @right-click="$emit('rightClick', $event, slotData)"
      @hover="$emit('hover', $event, slotData)"
    />
  </div>
</template>
