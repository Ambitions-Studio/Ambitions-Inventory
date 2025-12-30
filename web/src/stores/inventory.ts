import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { ItemDefinition } from '@/types/item'
import type { InventorySlot } from '@/services/InventoryService'
import * as WeightService from '@/services/WeightService'
import { isUnique, canStack, getStackLimit } from '@/services/ItemService'
import { useHotbarStore } from './hotbar'
import { useItemDefinitionsStore } from './itemDefinitions'

export const useInventoryStore = defineStore('inventory', () => {
  const slots = ref<Record<number, InventorySlot>>({})
  const maxSlots = ref(0)
  const maxWeight = ref(40000)
  const selectedSlotIndex = ref<number | null>(null)
  const hoveredSlotIndex = ref<number | null>(null)

  const slotsArray = computed((): InventorySlot[] => {
    const arr: InventorySlot[] = []
    for (let i = 1; i <= maxSlots.value; i++) {
      arr.push(slots.value[i] ?? null)
    }
    return arr
  })

  const slotIndices = computed(() => {
    return Array.from({ length: maxSlots.value }, (_, i) => i + 1)
  })

  const filledSlotsCount = computed(() => {
    return Object.values(slots.value).filter((slot) => slot !== null).length
  })

  const emptySlotsCount = computed(() => {
    return maxSlots.value - filledSlotsCount.value
  })

  function initSlots(count: number, weight?: number): void {
    maxSlots.value = count
    if (weight) maxWeight.value = weight
    slots.value = {}
  }

  function clear(): void {
    slots.value = {}
    selectedSlotIndex.value = null
    hoveredSlotIndex.value = null
  }

  function hasItem(itemName: string): boolean {
    for (const slot of Object.values(slots.value)) {
      if (slot && slot.name === itemName) return true
    }
    return false
  }

  function addItem(
    definition: ItemDefinition,
    quantity: number,
    metadata?: Record<string, unknown>
  ): boolean {
    if (isUnique(definition)) {
      const hotbarStore = useHotbarStore()
      if (hasItem(definition.name) || hotbarStore.hasItem(definition.name)) {
        return false
      }
    }

    let remaining = quantity
    const stackLimit = getStackLimit(definition)

    if (canStack(definition) && !metadata) {
      for (let slot = 1; slot <= maxSlots.value && remaining > 0; slot++) {
        const existingSlot = slots.value[slot]
        if (existingSlot && existingSlot.name === definition.name && !existingSlot.metadata) {
          const canAdd = stackLimit ? Math.min(remaining, stackLimit - existingSlot.quantity) : remaining
          if (canAdd > 0) {
            existingSlot.quantity += canAdd
            remaining -= canAdd
          }
        }
      }
    }

    while (remaining > 0) {
      let emptySlot: number | null = null
      for (let slot = 1; slot <= maxSlots.value; slot++) {
        if (!slots.value[slot]) {
          emptySlot = slot
          break
        }
      }

      if (emptySlot === null) break

      const toAdd = stackLimit ? Math.min(remaining, stackLimit) : remaining
      slots.value[emptySlot] = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        name: definition.name,
        quantity: toAdd,
        metadata: metadata
      }
      remaining -= toAdd
    }

    return remaining === 0
  }

  function removeItem(slot: number, quantity: number): void {
    const existingSlot = slots.value[slot]
    if (!existingSlot) return

    if (existingSlot.quantity <= quantity) {
      delete slots.value[slot]
    } else {
      existingSlot.quantity -= quantity
    }
  }

  function swapSlots(fromSlot: number, toSlot: number): void {
    const temp = slots.value[fromSlot] ?? null
    const toData = slots.value[toSlot] ?? null

    if (toData) {
      slots.value[fromSlot] = toData
    } else {
      delete slots.value[fromSlot]
    }

    if (temp) {
      slots.value[toSlot] = temp
    } else {
      delete slots.value[toSlot]
    }
  }

  function splitStack(slot: number, quantity: number): void {
    const existingSlot = slots.value[slot]
    if (!existingSlot || existingSlot.quantity <= quantity) return

    let emptySlot: number | null = null
    for (let s = 1; s <= maxSlots.value; s++) {
      if (!slots.value[s]) {
        emptySlot = s
        break
      }
    }

    if (emptySlot === null) return

    existingSlot.quantity -= quantity
    slots.value[emptySlot] = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      name: existingSlot.name,
      quantity: quantity,
      metadata: existingSlot.metadata ? { ...existingSlot.metadata } : undefined
    }
  }

  function mergeStacks(fromSlot: number, toSlot: number): void {
    const fromData = slots.value[fromSlot]
    const toData = slots.value[toSlot]

    if (!fromData || !toData || fromData.name !== toData.name) return

    toData.quantity += fromData.quantity
    delete slots.value[fromSlot]
  }

  function selectSlot(slot: number | null): void {
    selectedSlotIndex.value = slot
  }

  function hoverSlot(slot: number | null): void {
    hoveredSlotIndex.value = slot
  }

  function getSlot(slot: number): InventorySlot {
    return slots.value[slot] ?? null
  }

  function findEmptySlot(): number | null {
    for (let i = 1; i <= maxSlots.value; i++) {
      if (!slots.value[i]) return i
    }
    return null
  }

  function setSlot(slot: number, item: { name: string; count: number; metadata?: Record<string, unknown> } | null): void {
    if (slot < 1 || slot > maxSlots.value) return

    if (item === null) {
      delete slots.value[slot]
    } else {
      slots.value[slot] = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        name: item.name,
        quantity: item.count,
        metadata: item.metadata
      }
    }
  }

  function updateSlot(slot: number, item: { name: string; count: number; metadata?: Record<string, unknown> }): void {
    if (slot < 1 || slot > maxSlots.value) return

    const existingSlot = slots.value[slot]
    if (existingSlot) {
      existingSlot.quantity = item.count
      if (item.metadata) {
        existingSlot.metadata = item.metadata
      }
    }
  }

  function setMaxSlots(count: number): boolean {
    const currentMax = maxSlots.value

    if (count < currentMax) {
      for (let i = count + 1; i <= currentMax; i++) {
        if (slots.value[i]) {
          return false
        }
      }
      for (let i = count + 1; i <= currentMax; i++) {
        delete slots.value[i]
      }
    }

    maxSlots.value = count
    return true
  }

  function setMaxWeight(weight: number): boolean {
    const itemDefinitionsStore = useItemDefinitionsStore()
    const totalWeight = WeightService.getTotalWeight(
      slotsArray.value,
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
    slotsArray,
    slotIndices,
    maxSlots,
    maxWeight,
    selectedSlotIndex,
    hoveredSlotIndex,
    filledSlotsCount,
    emptySlotsCount,
    initSlots,
    clear,
    hasItem,
    addItem,
    removeItem,
    swapSlots,
    splitStack,
    mergeStacks,
    selectSlot,
    hoverSlot,
    getSlot,
    findEmptySlot,
    setSlot,
    updateSlot,
    setMaxSlots,
    setMaxWeight
  }
})
