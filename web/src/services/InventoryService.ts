import type { ItemDefinition, InventoryItem } from '@/types/item'
import { isUnique, canStack, getStackLimit } from './ItemService'

export type InventorySlot = InventoryItem | null

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

function cloneSlots(slots: InventorySlot[]): InventorySlot[] {
  return slots.map((slot) => (slot ? { ...slot } : null))
}

export function findFirstEmptySlot(slots: InventorySlot[]): number {
  return slots.findIndex((slot) => slot === null)
}

export function findSlotByItemName(slots: InventorySlot[], name: string): number {
  return slots.findIndex((slot) => slot !== null && slot.name === name)
}

export function hasItem(slots: InventorySlot[], name: string): boolean {
  return slots.some((slot) => slot !== null && slot.name === name)
}

export function countItem(slots: InventorySlot[], name: string): number {
  return slots.reduce((total, slot) => {
    if (slot !== null && slot.name === name) {
      return total + slot.quantity
    }
    return total
  }, 0)
}

export function addItem(
  slots: InventorySlot[],
  definition: ItemDefinition,
  quantity: number,
  metadata?: Record<string, unknown>
): InventorySlot[] {
  if (quantity <= 0) return cloneSlots(slots)

  const result = cloneSlots(slots)

  if (isUnique(definition)) {
    if (hasItem(result, definition.name)) {
      return result
    }

    const emptyIndex = findFirstEmptySlot(result)
    if (emptyIndex === -1) {
      return result
    }

    result[emptyIndex] = {
      id: generateId(),
      name: definition.name,
      quantity: 1,
      metadata
    }

    return result
  }

  let remaining = quantity
  const stackLimit = getStackLimit(definition)

  if (canStack(definition)) {
    for (let i = 0; i < result.length && remaining > 0; i++) {
      const slot = result[i]
      if (slot && slot.name === definition.name) {
        if (stackLimit === false) {
          result[i] = { id: slot.id, name: slot.name, quantity: slot.quantity + remaining, metadata: slot.metadata }
          remaining = 0
        } else {
          const spaceAvailable = stackLimit - slot.quantity
          if (spaceAvailable > 0) {
            const toAdd = Math.min(spaceAvailable, remaining)
            result[i] = { id: slot.id, name: slot.name, quantity: slot.quantity + toAdd, metadata: slot.metadata }
            remaining -= toAdd
          }
        }
      }
    }
  }

  while (remaining > 0) {
    const emptyIndex = findFirstEmptySlot(result)
    if (emptyIndex === -1) {
      break
    }

    const toAdd = stackLimit === false ? remaining : Math.min(stackLimit, remaining)
    result[emptyIndex] = {
      id: generateId(),
      name: definition.name,
      quantity: toAdd,
      metadata
    }
    remaining -= toAdd
  }

  return result
}

export function removeItem(
  slots: InventorySlot[],
  slotIndex: number,
  quantity: number
): InventorySlot[] {
  if (quantity <= 0) return cloneSlots(slots)
  if (slotIndex < 0 || slotIndex >= slots.length) return cloneSlots(slots)

  const slot = slots[slotIndex]
  if (!slot) return cloneSlots(slots)

  const result = cloneSlots(slots)
  const newQuantity = slot.quantity - quantity

  if (newQuantity <= 0) {
    result[slotIndex] = null
  } else {
    result[slotIndex] = { id: slot.id, name: slot.name, quantity: newQuantity, metadata: slot.metadata }
  }

  return result
}

export function swapSlots(
  slots: InventorySlot[],
  fromIndex: number,
  toIndex: number
): InventorySlot[] {
  if (fromIndex === toIndex) return cloneSlots(slots)
  if (fromIndex < 0 || toIndex < 0) return cloneSlots(slots)
  if (fromIndex >= slots.length || toIndex >= slots.length) return cloneSlots(slots)

  const result = cloneSlots(slots)
  const fromSlot = result[fromIndex] ?? null
  const toSlot = result[toIndex] ?? null

  result[fromIndex] = toSlot
  result[toIndex] = fromSlot

  return result
}

export function splitStack(
  slots: InventorySlot[],
  slotIndex: number,
  quantity: number
): InventorySlot[] {
  if (quantity <= 0) return cloneSlots(slots)
  if (slotIndex < 0 || slotIndex >= slots.length) return cloneSlots(slots)

  const slot = slots[slotIndex]
  if (!slot) return cloneSlots(slots)
  if (quantity >= slot.quantity) return cloneSlots(slots)

  const emptyIndex = findFirstEmptySlot(slots)
  if (emptyIndex === -1) return cloneSlots(slots)

  const result = cloneSlots(slots)

  result[slotIndex] = { id: slot.id, name: slot.name, quantity: slot.quantity - quantity, metadata: slot.metadata }
  result[emptyIndex] = {
    id: generateId(),
    name: slot.name,
    quantity,
    metadata: slot.metadata
  }

  return result
}

export function mergeStacks(
  slots: InventorySlot[],
  fromIndex: number,
  toIndex: number,
  definition: ItemDefinition
): InventorySlot[] {
  if (fromIndex === toIndex) return cloneSlots(slots)
  if (fromIndex < 0 || toIndex < 0) return cloneSlots(slots)
  if (fromIndex >= slots.length || toIndex >= slots.length) return cloneSlots(slots)

  const fromSlot = slots[fromIndex]
  const toSlot = slots[toIndex]

  if (!fromSlot || !toSlot) return cloneSlots(slots)
  if (fromSlot.name !== toSlot.name) return cloneSlots(slots)
  if (!canStack(definition)) return cloneSlots(slots)

  const stackLimit = getStackLimit(definition)
  const totalQuantity = fromSlot.quantity + toSlot.quantity

  const result = cloneSlots(slots)

  if (stackLimit === false) {
    result[toIndex] = { id: toSlot.id, name: toSlot.name, quantity: totalQuantity, metadata: toSlot.metadata }
    result[fromIndex] = null
    return result
  }

  if (totalQuantity <= stackLimit) {
    result[toIndex] = { id: toSlot.id, name: toSlot.name, quantity: totalQuantity, metadata: toSlot.metadata }
    result[fromIndex] = null
    return result
  }

  result[toIndex] = { id: toSlot.id, name: toSlot.name, quantity: stackLimit, metadata: toSlot.metadata }
  result[fromIndex] = { id: fromSlot.id, name: fromSlot.name, quantity: totalQuantity - stackLimit, metadata: fromSlot.metadata }

  return result
}
