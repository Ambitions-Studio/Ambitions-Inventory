import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { EquipmentSlot, EquipmentState, EquippedItem, EquipResult } from '@/types/equipment'
import { createEmptyEquipmentState } from '@/types/equipment'
import type { InventoryItem } from '@/services/EquipmentService'
import * as EquipmentService from '@/services/EquipmentService'

export const useEquipmentStore = defineStore('equipment', () => {
  const state = ref<EquipmentState>(createEmptyEquipmentState())

  const equippedCount = computed(() => EquipmentService.countEquippedItems(state.value))

  const occupiedSlots = computed(() => EquipmentService.getOccupiedSlots(state.value))

  const emptySlots = computed(() => EquipmentService.getEmptySlots(state.value))

  function init(): void {
    state.value = createEmptyEquipmentState()
  }

  function setState(newState: EquipmentState): void {
    state.value = newState
  }

  function equip(
    item: InventoryItem,
    slot: EquipmentSlot,
    force: boolean = false
  ): { result: EquipResult; replacedItem: EquippedItem | null } {
    const { newState, result, replacedItem } = EquipmentService.equipItem(state.value, item, slot, force)
    if (result.success) {
      state.value = newState
    }
    return { result, replacedItem }
  }

  function unequip(slot: EquipmentSlot): { result: EquipResult; unequippedItem: EquippedItem | null } {
    const { newState, result, unequippedItem } = EquipmentService.unequipItem(state.value, slot)
    if (result.success) {
      state.value = newState
    }
    return { result, unequippedItem }
  }

  function getItem(slot: EquipmentSlot): EquippedItem | null {
    return EquipmentService.getEquippedItem(state.value, slot)
  }

  function isOccupied(slot: EquipmentSlot): boolean {
    return EquipmentService.isSlotOccupied(state.value, slot)
  }

  function canEquipItem(item: InventoryItem, slot: EquipmentSlot): EquipResult {
    return EquipmentService.canEquip(item, slot)
  }

  function canEquipItemToAnySlot(item: InventoryItem): { canEquip: boolean; slot: EquipmentSlot | null } {
    return EquipmentService.canEquipToAnySlot(item)
  }

  function clearAll(): EquippedItem[] {
    const { newState, clearedItems } = EquipmentService.clearAllEquipment(state.value)
    state.value = newState
    return clearedItems
  }

  return {
    state,
    equippedCount,
    occupiedSlots,
    emptySlots,
    init,
    setState,
    equip,
    unequip,
    getItem,
    isOccupied,
    canEquipItem,
    canEquipItemToAnySlot,
    clearAll,
  }
})
