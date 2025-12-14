export type ItemDefinition = {
  name: string
  label: string
  weight: number
  type: 'item' | 'weapon'
  image?: string
  isUnique?: boolean
  stackLimits?: number | false
  isUseable?: boolean
  closeInventory?: boolean
  description?: string
  job?: string[] | false
}

export type InventoryItem = {
  id: string
  name: string
  quantity: number
  metadata?: Record<string, unknown>
}
