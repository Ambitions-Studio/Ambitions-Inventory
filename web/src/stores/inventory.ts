import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { ItemDefinition } from '@/types/item'
import type { InventorySlot } from '@/services/InventoryService'
import * as InventoryService from '@/services/InventoryService'
import * as WeightService from '@/services/WeightService'
import { isUnique } from '@/services/ItemService'
import { useHotbarStore } from './hotbar'
import { useItemDefinitionsStore } from './itemDefinitions'

export const useInventoryStore = defineStore('inventory', () => {
  const slots = ref<InventorySlot[]>([])
  const maxSlots = ref(0)
  const maxWeight = ref(40000)
  const selectedSlotIndex = ref<number | null>(null)
  const hoveredSlotIndex = ref<number | null>(null)

  const filledSlotsCount = computed(() => {
    return slots.value.filter((slot) => slot !== null).length
  })

  const emptySlotsCount = computed(() => {
    return slots.value.filter((slot) => slot === null).length
  })

  function initSlots(count: number, weight?: number): void {
    maxSlots.value = count
    if (weight) maxWeight.value = weight
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

  function setSlot(index: number, item: { name: string; count: number; metadata?: Record<string, unknown> } | null): void {
    if (index < 0 || index >= slots.value.length) return

    if (item === null) {
      slots.value[index] = null
    } else {
      slots.value[index] = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        name: item.name,
        quantity: item.count,
        metadata: item.metadata
      }
    }
  }

  function updateSlot(index: number, item: { name: string; count: number; metadata?: Record<string, unknown> }): void {
    if (index < 0 || index >= slots.value.length) return

    const existingSlot = slots.value[index]
    if (existingSlot) {
      existingSlot.quantity = item.count
      if (item.metadata) {
        existingSlot.metadata = item.metadata
      }
    }
  }

  function setMaxSlots(count: number): boolean {
    const currentLength = slots.value.length

    if (count < currentLength) {
      const slotsToRemove = slots.value.slice(count)
      const hasItems = slotsToRemove.some((slot) => slot !== null)

      if (hasItems) {
        return false
      }

      slots.value = slots.value.slice(0, count)
    } else if (count > currentLength) {
      slots.value = [...slots.value, ...Array(count - currentLength).fill(null)]
    }

    maxSlots.value = count
    return true
  }

  function setMaxWeight(weight: number): boolean {
    const itemDefinitionsStore = useItemDefinitionsStore()
    const totalWeight = WeightService.getTotalWeight(
      slots.value,
      (name) => itemDefinitionsStore.getDefinition(name)
    )

    if (weight < totalWeight) {
      return false
    }

    maxWeight.value = weight
    return true
  }

  return {
    slots,
    maxSlots,
    maxWeight,
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
    getSlot,
    setSlot,
    updateSlot,
    setMaxSlots,
    setMaxWeight
  }
})
