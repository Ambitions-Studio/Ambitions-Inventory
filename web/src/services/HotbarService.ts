import type { ItemDefinition } from '@/types/item'
import type { InventorySlot } from './InventoryService'
import { isUnique, getStackLimit } from './ItemService'

export type TransferResult = {
  inventorySlots: InventorySlot[]
  hotbarSlots: InventorySlot[]
  success: boolean
  transferred: number
}

export type ConsumeResult = {
  hotbarSlots: InventorySlot[]
  success: boolean
  consumed: number
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

function cloneSlots(slots: InventorySlot[]): InventorySlot[] {
  return slots.map((slot) => (slot ? { ...slot } : null))
}

export function getItemQuantityInSlot(slot: InventorySlot): number {
  return slot?.quantity ?? 0
}

export function canAssignToHotbar(
  inventorySlots: InventorySlot[],
  inventorySlotIndex: number,
  hotbarSlots: InventorySlot[],
  hotbarSlotIndex: number,
  quantity: number
): boolean {
  if (quantity <= 0) return false
  if (inventorySlotIndex < 0 || inventorySlotIndex >= inventorySlots.length) return false
  if (hotbarSlotIndex < 0 || hotbarSlotIndex >= hotbarSlots.length) return false

  const sourceSlot = inventorySlots[inventorySlotIndex]
  if (!sourceSlot) return false
  if (sourceSlot.quantity < quantity) return false

  const targetSlot = hotbarSlots[hotbarSlotIndex] ?? null
  if (targetSlot && targetSlot.name !== sourceSlot.name) return false

  return true
}

export function assignFromInventory(
  inventorySlots: InventorySlot[],
  inventorySlotIndex: number,
  hotbarSlots: InventorySlot[],
  hotbarSlotIndex: number,
  quantity: number,
  definition: ItemDefinition
): TransferResult {
  const result: TransferResult = {
    inventorySlots: cloneSlots(inventorySlots),
    hotbarSlots: cloneSlots(hotbarSlots),
    success: false,
    transferred: 0
  }

  if (!canAssignToHotbar(inventorySlots, inventorySlotIndex, hotbarSlots, hotbarSlotIndex, quantity)) {
    return result
  }

  const sourceSlot = result.inventorySlots[inventorySlotIndex]
  if (!sourceSlot) return result

  const targetSlot = result.hotbarSlots[hotbarSlotIndex] ?? null

  let toTransfer = quantity
  const stackLimit = getStackLimit(definition)

  if (isUnique(definition)) {
    toTransfer = 1
  }

  if (targetSlot) {
    if (stackLimit !== false) {
      const spaceAvailable = stackLimit - targetSlot.quantity
      toTransfer = Math.min(toTransfer, spaceAvailable)
    }

    if (toTransfer <= 0) return result

    result.hotbarSlots[hotbarSlotIndex] = {
      id: targetSlot.id,
      name: targetSlot.name,
      quantity: targetSlot.quantity + toTransfer,
      metadata: targetSlot.metadata
    }
  } else {
    if (stackLimit !== false) {
      toTransfer = Math.min(toTransfer, stackLimit)
    }

    result.hotbarSlots[hotbarSlotIndex] = {
      id: generateId(),
      name: sourceSlot.name,
      quantity: toTransfer,
      metadata: sourceSlot.metadata
    }
  }

  const remainingInSource = sourceSlot.quantity - toTransfer
  if (remainingInSource <= 0) {
    result.inventorySlots[inventorySlotIndex] = null
  } else {
    result.inventorySlots[inventorySlotIndex] = {
      id: sourceSlot.id,
      name: sourceSlot.name,
      quantity: remainingInSource,
      metadata: sourceSlot.metadata
    }
  }

  result.success = true
  result.transferred = toTransfer

  return result
}

export function returnToInventory(
  hotbarSlots: InventorySlot[],
  hotbarSlotIndex: number,
  inventorySlots: InventorySlot[],
  quantity: number,
  definition: ItemDefinition
): TransferResult {
  const result: TransferResult = {
    inventorySlots: cloneSlots(inventorySlots),
    hotbarSlots: cloneSlots(hotbarSlots),
    success: false,
    transferred: 0
  }

  if (hotbarSlotIndex < 0 || hotbarSlotIndex >= hotbarSlots.length) return result

  const sourceSlot = result.hotbarSlots[hotbarSlotIndex]
  if (!sourceSlot) return result
  if (quantity <= 0 || quantity > sourceSlot.quantity) return result

  let remaining = quantity
  const stackLimit = getStackLimit(definition)

  for (let i = 0; i < result.inventorySlots.length && remaining > 0; i++) {
    const slot = result.inventorySlots[i]

    if (slot && slot.name === sourceSlot.name) {
      if (stackLimit === false) {
        result.inventorySlots[i] = { id: slot.id, name: slot.name, quantity: slot.quantity + remaining, metadata: slot.metadata }
        remaining = 0
      } else {
        const spaceAvailable = stackLimit - slot.quantity
        if (spaceAvailable > 0) {
          const toAdd = Math.min(spaceAvailable, remaining)
          result.inventorySlots[i] = { id: slot.id, name: slot.name, quantity: slot.quantity + toAdd, metadata: slot.metadata }
          remaining -= toAdd
        }
      }
    }
  }

  for (let i = 0; i < result.inventorySlots.length && remaining > 0; i++) {
    if (result.inventorySlots[i] === null) {
      const toAdd = stackLimit === false ? remaining : Math.min(stackLimit, remaining)
      result.inventorySlots[i] = {
        id: generateId(),
        name: sourceSlot.name,
        quantity: toAdd,
        metadata: sourceSlot.metadata
      }
      remaining -= toAdd
    }
  }

  const transferred = quantity - remaining

  if (transferred <= 0) return result

  const remainingInHotbar = sourceSlot.quantity - transferred
  if (remainingInHotbar <= 0) {
    result.hotbarSlots[hotbarSlotIndex] = null
  } else {
    result.hotbarSlots[hotbarSlotIndex] = {
      id: sourceSlot.id,
      name: sourceSlot.name,
      quantity: remainingInHotbar,
      metadata: sourceSlot.metadata
    }
  }

  result.success = true
  result.transferred = transferred

  return result
}

export function consumeFromHotbar(
  hotbarSlots: InventorySlot[],
  hotbarSlotIndex: number,
  quantity: number
): ConsumeResult {
  const result: ConsumeResult = {
    hotbarSlots: cloneSlots(hotbarSlots),
    success: false,
    consumed: 0
  }

  if (hotbarSlotIndex < 0 || hotbarSlotIndex >= hotbarSlots.length) return result
  if (quantity <= 0) return result

  const slot = result.hotbarSlots[hotbarSlotIndex]
  if (!slot) return result

  const toConsume = Math.min(quantity, slot.quantity)
  const remaining = slot.quantity - toConsume

  if (remaining <= 0) {
    result.hotbarSlots[hotbarSlotIndex] = null
  } else {
    result.hotbarSlots[hotbarSlotIndex] = {
      id: slot.id,
      name: slot.name,
      quantity: remaining,
      metadata: slot.metadata
    }
  }

  result.success = true
  result.consumed = toConsume

  return result
}

export function swapHotbarSlots(
  hotbarSlots: InventorySlot[],
  fromIndex: number,
  toIndex: number
): InventorySlot[] {
  if (fromIndex === toIndex) return cloneSlots(hotbarSlots)
  if (fromIndex < 0 || toIndex < 0) return cloneSlots(hotbarSlots)
  if (fromIndex >= hotbarSlots.length || toIndex >= hotbarSlots.length) return cloneSlots(hotbarSlots)

  const result = cloneSlots(hotbarSlots)
  const temp = result[fromIndex] ?? null
  result[fromIndex] = result[toIndex] ?? null
  result[toIndex] = temp

  return result
}

export function clearHotbarSlot(
  hotbarSlots: InventorySlot[],
  hotbarSlotIndex: number,
  inventorySlots: InventorySlot[],
  definition: ItemDefinition
): TransferResult {
  const slot = hotbarSlots[hotbarSlotIndex]
  if (!slot) {
    return {
      inventorySlots: cloneSlots(inventorySlots),
      hotbarSlots: cloneSlots(hotbarSlots),
      success: true,
      transferred: 0
    }
  }

  return returnToInventory(hotbarSlots, hotbarSlotIndex, inventorySlots, slot.quantity, definition)
}
