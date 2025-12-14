import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { InventorySlot } from '@/services/InventoryService'
import * as HotbarService from '@/services/HotbarService'
import { useInventoryStore } from './inventory'
import { useItemDefinitionsStore } from './itemDefinitions'

const HOTBAR_SLOTS = 5

export const useHotbarStore = defineStore('hotbar', () => {
  const slots = ref<InventorySlot[]>(Array(HOTBAR_SLOTS).fill(null))
  const selectedSlotIndex = ref<number | null>(null)

  const maxSlots = computed(() => HOTBAR_SLOTS)

  const filledSlotsCount = computed(() => {
    return slots.value.filter((slot) => slot !== null).length
  })

  function initSlots(): void {
    slots.value = Array(HOTBAR_SLOTS).fill(null)
  }

  function setSlots(newSlots: InventorySlot[]): void {
    slots.value = newSlots.slice(0, HOTBAR_SLOTS)
  }

  function clear(): void {
    slots.value = Array(HOTBAR_SLOTS).fill(null)
    selectedSlotIndex.value = null
  }

  function assignFromInventory(
    inventorySlotIndex: number,
    hotbarSlotIndex: number,
    quantity: number
  ): boolean {
    const inventoryStore = useInventoryStore()
    const itemDefinitionsStore = useItemDefinitionsStore()

    const sourceSlot = inventoryStore.slots[inventorySlotIndex]
    if (!sourceSlot) return false

    const definition = itemDefinitionsStore.getDefinition(sourceSlot.name)
    if (!definition) return false

    const result = HotbarService.assignFromInventory(
      inventoryStore.slots,
      inventorySlotIndex,
      slots.value,
      hotbarSlotIndex,
      quantity,
      definition
    )

    if (result.success) {
      inventoryStore.setSlots(result.inventorySlots)
      slots.value = result.hotbarSlots
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
      slots.value,
      hotbarSlotIndex,
      inventoryStore.slots,
      quantity,
      definition
    )

    if (result.success) {
      inventoryStore.setSlots(result.inventorySlots)
      slots.value = result.hotbarSlots
    }

    return result.success
  }

  function consume(hotbarSlotIndex: number, quantity: number): boolean {
    const result = HotbarService.consumeFromHotbar(slots.value, hotbarSlotIndex, quantity)

    if (result.success) {
      slots.value = result.hotbarSlots
    }

    return result.success
  }

  function swapSlots(fromIndex: number, toIndex: number): void {
    slots.value = HotbarService.swapHotbarSlots(slots.value, fromIndex, toIndex)
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
      slots.value,
      hotbarSlotIndex,
      inventoryStore.slots,
      definition
    )

    if (result.success) {
      inventoryStore.setSlots(result.inventorySlots)
      slots.value = result.hotbarSlots
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
    selectedSlotIndex,
    filledSlotsCount,
    initSlots,
    setSlots,
    clear,
    assignFromInventory,
    returnToInventory,
    consume,
    swapSlots,
    clearSlot,
    selectSlot,
    getSlot
  }
})
