import type {
  EquipmentSlot,
  EquipmentState,
  EquippedItem,
  EquipResult,
  ClothingMetadata,
} from '@/types/equipment'
import {
  EQUIPMENT_SLOT_MAP,
  isClothingMetadata,
  createEmptyEquipmentState,
} from '@/types/equipment'

export interface InventoryItem {
  id: string
  name: string
  quantity: number
  metadata?: Record<string, unknown>
}

function getClothingMetadata(item: InventoryItem): ClothingMetadata | null {
  if (!item.metadata || !isClothingMetadata(item.metadata)) {
    return null
  }
  return item.metadata
}

function validateSlot(slot: string): slot is EquipmentSlot {
  return slot in EQUIPMENT_SLOT_MAP
}

export function canEquip(item: InventoryItem, targetSlot: EquipmentSlot): EquipResult {
  if (!item || !item.id) {
    return { success: false, error: 'INVALID_ITEM' }
  }

  if (!validateSlot(targetSlot)) {
    return { success: false, error: 'INVALID_SLOT' }
  }

  const clothingMeta = getClothingMetadata(item)
  if (!clothingMeta) {
    return { success: false, error: 'NOT_CLOTHING_ITEM' }
  }

  if (clothingMeta.equipmentSlot !== targetSlot) {
    return { success: false, error: 'SLOT_MISMATCH' }
  }

  return { success: true }
}

export function canEquipToAnySlot(item: InventoryItem): { canEquip: boolean; slot: EquipmentSlot | null } {
  const clothingMeta = getClothingMetadata(item)
  if (!clothingMeta) {
    return { canEquip: false, slot: null }
  }

  return { canEquip: true, slot: clothingMeta.equipmentSlot }
}

export function equipItem(
  state: EquipmentState,
  item: InventoryItem,
  targetSlot: EquipmentSlot,
  force: boolean = false
): { newState: EquipmentState; result: EquipResult; replacedItem: EquippedItem | null } {
  const canEquipResult = canEquip(item, targetSlot)

  if (!canEquipResult.success) {
    return { newState: state, result: canEquipResult, replacedItem: null }
  }

  const currentItem = state[targetSlot]
  if (currentItem && !force) {
    return { newState: state, result: { success: false, error: 'SLOT_OCCUPIED' }, replacedItem: null }
  }

  const clothingMeta = getClothingMetadata(item)
  if (!clothingMeta) {
    return { newState: state, result: { success: false, error: 'NOT_CLOTHING_ITEM' }, replacedItem: null }
  }

  const equippedItem: EquippedItem = {
    id: item.id,
    name: item.name,
    quantity: 1,
    metadata: clothingMeta,
  }

  const newState: EquipmentState = {
    ...state,
    [targetSlot]: equippedItem,
  }

  return { newState, result: { success: true }, replacedItem: currentItem }
}

export function unequipItem(
  state: EquipmentState,
  targetSlot: EquipmentSlot
): { newState: EquipmentState; result: EquipResult; unequippedItem: EquippedItem | null } {
  if (!validateSlot(targetSlot)) {
    return { newState: state, result: { success: false, error: 'INVALID_SLOT' }, unequippedItem: null }
  }

  const currentItem = state[targetSlot]
  if (!currentItem) {
    return { newState: state, result: { success: false, error: 'ITEM_NOT_FOUND' }, unequippedItem: null }
  }

  const newState: EquipmentState = {
    ...state,
    [targetSlot]: null,
  }

  return { newState, result: { success: true }, unequippedItem: currentItem }
}

export function getEquippedItem(state: EquipmentState, slot: EquipmentSlot): EquippedItem | null {
  if (!validateSlot(slot)) {
    return null
  }
  return state[slot]
}

export function isSlotOccupied(state: EquipmentState, slot: EquipmentSlot): boolean {
  return state[slot] !== null
}

export function getOccupiedSlots(state: EquipmentState): EquipmentSlot[] {
  return (Object.keys(state) as EquipmentSlot[]).filter((slot) => state[slot] !== null)
}

export function getEmptySlots(state: EquipmentState): EquipmentSlot[] {
  return (Object.keys(state) as EquipmentSlot[]).filter((slot) => state[slot] === null)
}

export function swapEquipment(
  state: EquipmentState,
  slotA: EquipmentSlot,
  slotB: EquipmentSlot
): { newState: EquipmentState; result: EquipResult } {
  if (!validateSlot(slotA) || !validateSlot(slotB)) {
    return { newState: state, result: { success: false, error: 'INVALID_SLOT' } }
  }

  const itemA = state[slotA]
  const itemB = state[slotB]

  if (itemA && itemA.metadata.equipmentSlot !== slotB) {
    return { newState: state, result: { success: false, error: 'SLOT_MISMATCH' } }
  }

  if (itemB && itemB.metadata.equipmentSlot !== slotA) {
    return { newState: state, result: { success: false, error: 'SLOT_MISMATCH' } }
  }

  const newState: EquipmentState = {
    ...state,
    [slotA]: itemB,
    [slotB]: itemA,
  }

  return { newState, result: { success: true } }
}

export function clearAllEquipment(state: EquipmentState): {
  newState: EquipmentState
  clearedItems: EquippedItem[]
} {
  const clearedItems = getOccupiedSlots(state)
    .map((slot) => state[slot])
    .filter((item): item is EquippedItem => item !== null)

  return { newState: createEmptyEquipmentState(), clearedItems }
}

export function countEquippedItems(state: EquipmentState): number {
  return getOccupiedSlots(state).length
}

export { createEmptyEquipmentState }
