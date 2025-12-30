import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { ItemDefinition } from '@/types/item'
import type { InventorySlot } from '@/services/InventoryService'
import * as InventoryService from '@/services/InventoryService'

const DEFAULT_GROUND_SLOTS = 30

export const useGroundStore = defineStore('ground', () => {
  const slots = ref<Record<number, InventorySlot>>({})
  const maxSlots = ref(DEFAULT_GROUND_SLOTS)

  const slotIndices = computed(() => {
    return Array.from({ length: maxSlots.value }, (_, i) => i + 1)
  })

  const slotsArray = computed((): InventorySlot[] => {
    const arr: InventorySlot[] = []
    for (let i = 1; i <= maxSlots.value; i++) {
      arr.push(slots.value[i] ?? null)
    }
    return arr
  })

  const filledSlotsCount = computed(() => {
    let count = 0
    for (let i = 1; i <= maxSlots.value; i++) {
      if (slots.value[i]) count++
    }
    return count
  })

  const emptySlotsCount = computed(() => {
    return maxSlots.value - filledSlotsCount.value
  })

  function initSlots(count: number = DEFAULT_GROUND_SLOTS): void {
    maxSlots.value = count
    slots.value = {}
  }

  function setSlots(newSlots: InventorySlot[]): void {
    slots.value = {}
    for (let i = 0; i < newSlots.length; i++) {
      const item = newSlots[i]
      if (item) {
        slots.value[i + 1] = item
      }
    }
  }

  function setSlot(slot: number, item: InventorySlot): void {
    if (slot < 1 || slot > maxSlots.value) return
    if (item === null) {
      delete slots.value[slot]
    } else {
      slots.value[slot] = item
    }
  }

  function clear(): void {
    slots.value = {}
  }

  function findEmptySlot(): number | null {
    for (let i = 1; i <= maxSlots.value; i++) {
      if (!slots.value[i]) return i
    }
    return null
  }

  function addItem(
    definition: ItemDefinition,
    quantity: number,
    metadata?: Record<string, unknown>
  ): void {
    const result = InventoryService.addItem(slotsArray.value, definition, quantity, metadata)
    for (let i = 0; i < result.length; i++) {
      setSlot(i + 1, result[i] ?? null)
    }
  }

  function removeItem(slotIndex: number, quantity: number): void {
    const result = InventoryService.removeItem(slotsArray.value, slotIndex - 1, quantity)
    for (let i = 0; i < result.length; i++) {
      setSlot(i + 1, result[i] ?? null)
    }
  }

  function swapSlots(fromIndex: number, toIndex: number): void {
    const fromSlot = slots.value[fromIndex] ?? null
    const toSlot = slots.value[toIndex] ?? null
    setSlot(fromIndex, toSlot)
    setSlot(toIndex, fromSlot)
  }

  function getSlot(index: number): InventorySlot {
    return slots.value[index] ?? null
  }

  return {
    slots,
    maxSlots,
    slotIndices,
    slotsArray,
    filledSlotsCount,
    emptySlotsCount,
    initSlots,
    setSlots,
    setSlot,
    clear,
    findEmptySlot,
    addItem,
    removeItem,
    swapSlots,
    getSlot
  }
})
