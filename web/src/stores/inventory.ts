import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { ItemDefinition } from '@/types/item'
import type { InventorySlot } from '@/services/InventoryService'
import * as InventoryService from '@/services/InventoryService'
import { isUnique } from '@/services/ItemService'
import { useHotbarStore } from './hotbar'

export const useInventoryStore = defineStore('inventory', () => {
  const slots = ref<InventorySlot[]>([])
  const maxSlots = ref(0)
  const selectedSlotIndex = ref<number | null>(null)
  const hoveredSlotIndex = ref<number | null>(null)

  const filledSlotsCount = computed(() => {
    return slots.value.filter((slot) => slot !== null).length
  })

  const emptySlotsCount = computed(() => {
    return slots.value.filter((slot) => slot === null).length
  })

  function initSlots(count: number): void {
    maxSlots.value = count
    slots.value = Array(count).fill(null)
  }

  function setSlots(newSlots: InventorySlot[]): void {
    slots.value = newSlots
  }

  function clear(): void {
    slots.value = Array(maxSlots.value).fill(null)
    selectedSlotIndex.value = null
    hoveredSlotIndex.value = null
  }

  function addItem(
    definition: ItemDefinition,
    quantity: number,
    metadata?: Record<string, unknown>
  ): boolean {
    if (isUnique(definition)) {
      const hotbarStore = useHotbarStore()
      if (InventoryService.hasItem(hotbarStore.slots, definition.name)) {
        return false
      }
    }

    slots.value = InventoryService.addItem(slots.value, definition, quantity, metadata)
    return true
  }

  function removeItem(slotIndex: number, quantity: number): void {
    slots.value = InventoryService.removeItem(slots.value, slotIndex, quantity)
  }

  function swapSlots(fromIndex: number, toIndex: number): void {
    slots.value = InventoryService.swapSlots(slots.value, fromIndex, toIndex)
  }

  function splitStack(slotIndex: number, quantity: number): void {
    slots.value = InventoryService.splitStack(slots.value, slotIndex, quantity)
  }

  function mergeStacks(fromIndex: number, toIndex: number, definition: ItemDefinition): void {
    slots.value = InventoryService.mergeStacks(slots.value, fromIndex, toIndex, definition)
  }

  function selectSlot(index: number | null): void {
    selectedSlotIndex.value = index
  }

  function hoverSlot(index: number | null): void {
    hoveredSlotIndex.value = index
  }

  function getSlot(index: number): InventorySlot {
    return slots.value[index] ?? null
  }

  return {
    slots,
    maxSlots,
    selectedSlotIndex,
    hoveredSlotIndex,
    filledSlotsCount,
    emptySlotsCount,
    initSlots,
    setSlots,
    clear,
    addItem,
    removeItem,
    swapSlots,
    splitStack,
    mergeStacks,
    selectSlot,
    hoverSlot,
    getSlot
  }
})
