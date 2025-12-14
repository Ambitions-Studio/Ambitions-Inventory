import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { ItemDefinition } from '@/types/item'
import type { InventorySlot } from '@/services/InventoryService'
import * as InventoryService from '@/services/InventoryService'

const DEFAULT_GROUND_SLOTS = 30

export const useGroundStore = defineStore('ground', () => {
  const slots = ref<InventorySlot[]>([])
  const maxSlots = ref(DEFAULT_GROUND_SLOTS)

  const filledSlotsCount = computed(() => {
    return slots.value.filter((slot) => slot !== null).length
  })

  const emptySlotsCount = computed(() => {
    return slots.value.filter((slot) => slot === null).length
  })

  function initSlots(count: number = DEFAULT_GROUND_SLOTS): void {
    maxSlots.value = count
    slots.value = Array(count).fill(null)
  }

  function setSlots(newSlots: InventorySlot[]): void {
    slots.value = newSlots
  }

  function clear(): void {
    slots.value = Array(maxSlots.value).fill(null)
  }

  function addItem(
    definition: ItemDefinition,
    quantity: number,
    metadata?: Record<string, unknown>
  ): void {
    slots.value = InventoryService.addItem(slots.value, definition, quantity, metadata)
  }

  function removeItem(slotIndex: number, quantity: number): void {
    slots.value = InventoryService.removeItem(slots.value, slotIndex, quantity)
  }

  function swapSlots(fromIndex: number, toIndex: number): void {
    slots.value = InventoryService.swapSlots(slots.value, fromIndex, toIndex)
  }

  function getSlot(index: number): InventorySlot {
    return slots.value[index] ?? null
  }

  return {
    slots,
    maxSlots,
    filledSlotsCount,
    emptySlotsCount,
    initSlots,
    setSlots,
    clear,
    addItem,
    removeItem,
    swapSlots,
    getSlot
  }
})
