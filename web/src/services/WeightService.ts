import type { ItemDefinition } from '@/types/item'
import type { InventorySlot } from './InventoryService'

export function getSlotWeight(slot: InventorySlot, definition: ItemDefinition | undefined): number {
  if (!slot || !definition) return 0
  return definition.weight * slot.quantity
}

export function getTotalWeight(
  slots: InventorySlot[],
  getDefinition: (name: string) => ItemDefinition | undefined
): number {
  return slots.reduce((total, slot) => {
    if (!slot) return total
    const definition = getDefinition(slot.name)
    return total + getSlotWeight(slot, definition)
  }, 0)
}

export function getWeightPercentage(currentWeight: number, maxWeight: number): number {
  if (maxWeight <= 0) return 0
  return Math.min((currentWeight / maxWeight) * 100, 100)
}

export function isOverweight(currentWeight: number, maxWeight: number): boolean {
  return currentWeight > maxWeight
}

export function getRemainingCapacity(currentWeight: number, maxWeight: number): number {
  return Math.max(maxWeight - currentWeight, 0)
}

export function canAddWeight(currentWeight: number, maxWeight: number, additionalWeight: number): boolean {
  return currentWeight + additionalWeight <= maxWeight
}

export function formatWeight(weightInGrams: number): string {
  const kg = weightInGrams / 1000
  return `${kg.toFixed(1)}kg`
}

export function formatWeightRange(currentWeight: number, maxWeight: number): string {
  return `${formatWeight(currentWeight)} / ${formatWeight(maxWeight)}`
}
