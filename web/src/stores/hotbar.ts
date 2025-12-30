import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { InventorySlot } from '@/services/InventoryService'
import * as HotbarService from '@/services/HotbarService'
import { useInventoryStore } from './inventory'
import { useItemDefinitionsStore } from './itemDefinitions'

const HOTBAR_SLOTS = 5

export const useHotbarStore = defineStore('hotbar', () => {
  const slots = ref<Record<number, InventorySlot>>({})
  const selectedSlotIndex = ref<number | null>(null)

  const maxSlots = computed(() => HOTBAR_SLOTS)

  const slotIndices = computed(() => {
    return Array.from({ length: HOTBAR_SLOTS }, (_, i) => i + 1)
  })

  const slotsArray = computed((): InventorySlot[] => {
    const arr: InventorySlot[] = []
    for (let i = 1; i <= HOTBAR_SLOTS; i++) {
      arr.push(slots.value[i] ?? null)
    }
    return arr
  })

  const filledSlotsCount = computed(() => {
    let count = 0
    for (let i = 1; i <= HOTBAR_SLOTS; i++) {
      if (slots.value[i]) count++
    }
    return count
  })

  function hasItem(itemName: string): boolean {
    for (let i = 1; i <= HOTBAR_SLOTS; i++) {
      const slot = slots.value[i]
      if (slot && slot.name === itemName) return true
    }
    return false
  }

  function initSlots(): void {
    slots.value = {}
  }

  function setSlots(newSlots: InventorySlot[]): void {
    slots.value = {}
    for (let i = 0; i < Math.min(newSlots.length, HOTBAR_SLOTS); i++) {
      const item = newSlots[i]
      if (item) {
        slots.value[i + 1] = item
      }
    }
  }

  function setSlot(slot: number, item: InventorySlot): void {
    if (slot < 1 || slot > HOTBAR_SLOTS) return
    if (item === null) {
      delete slots.value[slot]
    } else {
      slots.value[slot] = item
    }
  }

  function clear(): void {
    slots.value = {}
    selectedSlotIndex.value = null
  }

  function findEmptySlot(): number | null {
    for (let i = 1; i <= HOTBAR_SLOTS; i++) {
      if (!slots.value[i]) return i
    }
    return null
  }

  function assignFromInventory(
    inventorySlot: number,
    hotbarSlotIndex: number,
    quantity: number
  ): boolean {
    const inventoryStore = useInventoryStore()
    const itemDefinitionsStore = useItemDefinitionsStore()

    const sourceSlot = inventoryStore.getSlot(inventorySlot)
    if (!sourceSlot) return false

    const definition = itemDefinitionsStore.getDefinition(sourceSlot.name)
    if (!definition) return false

    const result = HotbarService.assignFromInventory(
      inventoryStore.slotsArray,
      inventorySlot - 1,
      slotsArray.value,
      hotbarSlotIndex - 1,
      quantity,
      definition
    )

    if (result.success) {
      for (let i = 0; i < result.inventorySlots.length; i++) {
        const slot = result.inventorySlots[i]
        inventoryStore.setSlot(i + 1, slot ? { name: slot.name, count: slot.quantity, metadata: slot.metadata } : null)
      }
      for (let i = 0; i < result.hotbarSlots.length; i++) {
        setSlot(i + 1, result.hotbarSlots[i] ?? null)
      }
    }

    return result.success
  }

  function returnToInventory(hotbarSlotIndex: number, quantity: number): boolean {
    const inventoryStore = useInventoryStore()
    const itemDefinitionsStore = useItemDefinitionsStore()

    const sourceSlot = slots.value[hotbarSlotIndex]
    if (!sourceSlot) return false

    const definition = itemDefinitionsStore.getDefinition(sourceSlot.name)
    if (!definition) return false

    const result = HotbarService.returnToInventory(
      slotsArray.value,
      hotbarSlotIndex - 1,
      inventoryStore.slotsArray,
      quantity,
      definition
    )

    if (result.success) {
      for (let i = 0; i < result.inventorySlots.length; i++) {
        const slot = result.inventorySlots[i]
        inventoryStore.setSlot(i + 1, slot ? { name: slot.name, count: slot.quantity, metadata: slot.metadata } : null)
      }
      for (let i = 0; i < result.hotbarSlots.length; i++) {
        setSlot(i + 1, result.hotbarSlots[i] ?? null)
      }
    }

    return result.success
  }

  function consume(hotbarSlotIndex: number, quantity: number): boolean {
    const result = HotbarService.consumeFromHotbar(slotsArray.value, hotbarSlotIndex - 1, quantity)

    if (result.success) {
      for (let i = 0; i < result.hotbarSlots.length; i++) {
        setSlot(i + 1, result.hotbarSlots[i] ?? null)
      }
    }

    return result.success
  }

  function swapSlots(fromIndex: number, toIndex: number): void {
    const fromSlot = slots.value[fromIndex] ?? null
    const toSlot = slots.value[toIndex] ?? null
    setSlot(fromIndex, toSlot)
    setSlot(toIndex, fromSlot)
  }

  function clearSlot(hotbarSlotIndex: number): boolean {
    const inventoryStore = useInventoryStore()
    const itemDefinitionsStore = useItemDefinitionsStore()

    const sourceSlot = slots.value[hotbarSlotIndex]
    if (!sourceSlot) {
      return true
    }

    const definition = itemDefinitionsStore.getDefinition(sourceSlot.name)
    if (!definition) return false

    const result = HotbarService.clearHotbarSlot(
      slotsArray.value,
      hotbarSlotIndex - 1,
      inventoryStore.slotsArray,
      definition
    )

    if (result.success) {
      for (let i = 0; i < result.inventorySlots.length; i++) {
        const slot = result.inventorySlots[i]
        inventoryStore.setSlot(i + 1, slot ? { name: slot.name, count: slot.quantity, metadata: slot.metadata } : null)
      }
      for (let i = 0; i < result.hotbarSlots.length; i++) {
        setSlot(i + 1, result.hotbarSlots[i] ?? null)
      }
    }

    return result.success
  }

  function selectSlot(index: number | null): void {
    selectedSlotIndex.value = index
  }

  function getSlot(index: number): InventorySlot {
    return slots.value[index] ?? null
  }

  return {
    slots,
    maxSlots,
    slotIndices,
    slotsArray,
    selectedSlotIndex,
    filledSlotsCount,
    hasItem,
    initSlots,
    setSlots,
    setSlot,
    clear,
    findEmptySlot,
    assignFromInventory,
    returnToInventory,
    consume,
    swapSlots,
    clearSlot,
    selectSlot,
    getSlot
  }
})
