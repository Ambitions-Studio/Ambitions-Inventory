import { computed } from 'vue'
import type { EquipmentSlot, EquippedItem } from '@/types/equipment'
import { EQUIPMENT_SLOT_MAP, isClothingMetadata } from '@/types/equipment'
import type { InventoryItem } from '@/services/EquipmentService'
import { useEquipmentStore } from '@/stores/equipment'
import { useInventoryStore } from '@/stores/inventory'
import { sendNuiCallback } from '@/utils/nui'

export interface EquipActionResult {
  success: boolean
  error?: string
  replacedItem?: EquippedItem | null
}

export interface UnequipActionResult {
  success: boolean
  error?: string
  unequippedItem?: EquippedItem | null
}

const isDevelopment = import.meta.env.DEV

// NOTE: weight is set to 0 for equipped items restored to inventory
// Real weight should come from item definitions in production
const DEFAULT_CLOTHING_WEIGHT = 0

export function useEquipmentActions() {
  const equipmentStore = useEquipmentStore()
  const inventoryStore = useInventoryStore()

  const equipmentState = computed(() => equipmentStore.state)

  const restoreToInventory = (item: EquippedItem) => {
    const definition = {
      name: item.name,
      label: item.metadata.customLabel ?? item.name,
      weight: DEFAULT_CLOTHING_WEIGHT,
      type: 'item' as const,
      isUnique: true,
    }
    inventoryStore.addItem(definition, 1, item.metadata as unknown as Record<string, unknown>)
  }

  const getSlotDefinition = (slot: EquipmentSlot) => {
    return EQUIPMENT_SLOT_MAP[slot]
  }

  const getEquippedItem = (slot: EquipmentSlot): EquippedItem | null => {
    return equipmentStore.getItem(slot)
  }

  const isSlotOccupied = (slot: EquipmentSlot): boolean => {
    return equipmentStore.isOccupied(slot)
  }

  const canEquipFromInventory = (inventorySlotIndex: number): { canEquip: boolean; slot: EquipmentSlot | null } => {
    const slot = inventoryStore.getSlot(inventorySlotIndex)
    if (!slot || !slot.metadata || !isClothingMetadata(slot.metadata)) {
      return { canEquip: false, slot: null }
    }

    const item: InventoryItem = {
      id: slot.id,
      name: slot.name,
      quantity: slot.quantity,
      metadata: slot.metadata,
    }

    return equipmentStore.canEquipItemToAnySlot(item)
  }

  const equipFromInventory = async (
    inventorySlotIndex: number,
    targetSlot: EquipmentSlot,
    force: boolean = false
  ): Promise<EquipActionResult> => {
    const slot = inventoryStore.getSlot(inventorySlotIndex)
    if (!slot) {
      return { success: false, error: 'INVALID_INVENTORY_SLOT' }
    }

    if (!slot.metadata || !isClothingMetadata(slot.metadata)) {
      return { success: false, error: 'NOT_CLOTHING_ITEM' }
    }

    const item: InventoryItem = {
      id: slot.id,
      name: slot.name,
      quantity: slot.quantity,
      metadata: slot.metadata,
    }

    const checkResult = equipmentStore.canEquipItem(item, targetSlot)
    if (!checkResult.success) {
      return { success: false, error: checkResult.error }
    }

    if (isDevelopment) {
      const { result, replacedItem } = equipmentStore.equip(item, targetSlot, force)

      if (result.success) {
        inventoryStore.removeItem(inventorySlotIndex, 1)

        if (replacedItem) {
          restoreToInventory(replacedItem)
        }
      }

      return { success: result.success, error: result.error, replacedItem }
    }

    const response = await sendNuiCallback<
      { slotIndex: number; targetSlot: EquipmentSlot; force: boolean },
      { success: boolean; error?: string; replacedItem?: EquippedItem }
    >('equipItem', { slotIndex: inventorySlotIndex, targetSlot, force })

    if (response?.success) {
      const { result, replacedItem } = equipmentStore.equip(item, targetSlot, force)
      return { success: result.success, error: result.error, replacedItem }
    }

    return { success: false, error: response?.error ?? 'UNKNOWN_ERROR' }
  }

  const unequipToInventory = async (slot: EquipmentSlot): Promise<UnequipActionResult> => {
    const equippedItem = equipmentStore.getItem(slot)
    if (!equippedItem) {
      return { success: false, error: 'SLOT_EMPTY' }
    }

    if (isDevelopment) {
      const { result, unequippedItem } = equipmentStore.unequip(slot)

      if (result.success && unequippedItem) {
        restoreToInventory(unequippedItem)
      }

      return { success: result.success, error: result.error, unequippedItem }
    }

    const response = await sendNuiCallback<
      { slot: EquipmentSlot },
      { success: boolean; error?: string; unequippedItem?: EquippedItem }
    >('unequipItem', { slot })

    if (response?.success) {
      const { result, unequippedItem } = equipmentStore.unequip(slot)
      return { success: result.success, error: result.error, unequippedItem }
    }

    return { success: false, error: response?.error ?? 'UNKNOWN_ERROR' }
  }

  const swapEquipmentWithInventory = async (
    equipmentSlot: EquipmentSlot,
    inventorySlotIndex: number
  ): Promise<EquipActionResult> => {
    return await equipFromInventory(inventorySlotIndex, equipmentSlot, true)
  }

  const clearAllEquipment = async (): Promise<{ success: boolean; clearedItems: EquippedItem[] }> => {
    if (isDevelopment) {
      const clearedItems = equipmentStore.clearAll()

      for (const item of clearedItems) {
        restoreToInventory(item)
      }

      return { success: true, clearedItems }
    }

    const response = await sendNuiCallback<void, { success: boolean; clearedItems: EquippedItem[] }>('clearAllEquipment')

    if (response?.success) {
      const clearedItems = equipmentStore.clearAll()
      return { success: true, clearedItems }
    }

    return { success: false, clearedItems: [] }
  }

  return {
    equipmentState,
    getSlotDefinition,
    getEquippedItem,
    isSlotOccupied,
    canEquipFromInventory,
    equipFromInventory,
    unequipToInventory,
    swapEquipmentWithInventory,
    clearAllEquipment,
  }
}
