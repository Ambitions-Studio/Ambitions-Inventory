import type { ItemDefinition } from '@/types/item'

export function isUnique(definition: ItemDefinition): boolean {
  return definition.isUnique === true
}

export function canStack(definition: ItemDefinition): boolean {
  return !isUnique(definition)
}

export function getStackLimit(definition: ItemDefinition): number | false {
  if (isUnique(definition)) {
    return 1
  }

  return definition.stackLimits ?? false
}

export function isUsable(definition: ItemDefinition): boolean {
  return definition.isUseable === true
}

export function shouldCloseInventoryOnUse(definition: ItemDefinition): boolean {
  return definition.closeInventory === true
}

export function isRestrictedByJob(definition: ItemDefinition): boolean {
  return Array.isArray(definition.job) && definition.job.length > 0
}

export function canPlayerUseItem(definition: ItemDefinition, playerJob: string | null): boolean {
  if (!isRestrictedByJob(definition)) {
    return true
  }

  if (!playerJob) {
    return false
  }

  return (definition.job as string[]).includes(playerJob)
}

export function hasImage(definition: ItemDefinition): boolean {
  return typeof definition.image === 'string' && definition.image.length > 0
}

export function getWeight(definition: ItemDefinition): number {
  return definition.weight
}

export function isWeapon(definition: ItemDefinition): boolean {
  return definition.type === 'weapon'
}

export function hasDescription(definition: ItemDefinition): boolean {
  return typeof definition.description === 'string' && definition.description.length > 0
}
