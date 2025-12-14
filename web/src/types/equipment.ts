export type EquipmentSlot =
  | 'hat'
  | 'glasses'
  | 'mask'
  | 'earring'
  | 'tshirt'
  | 'jacket'
  | 'pants'
  | 'shoes'
  | 'bag'
  | 'armor'
  | 'watch'
  | 'bracelet'
  | 'necklace'
  | 'gloves'
  | 'helmet'

export type ClothingComponentType = 'component' | 'prop'

export type ClothingGender = 'male' | 'female'

export interface ClothingMetadata {
  equipmentSlot: EquipmentSlot
  componentType: ClothingComponentType
  componentId?: number
  propId?: number
  drawable: number
  texture: number
  palette?: number
  gender?: ClothingGender
  customLabel?: string
}

export interface EquippedItem {
  id: string
  name: string
  quantity: number
  metadata: ClothingMetadata
}

export type EquipmentState = Record<EquipmentSlot, EquippedItem | null>

export interface EquipResult {
  success: boolean
  error?: EquipmentError
}

export type EquipmentError =
  | 'INVALID_ITEM'
  | 'INVALID_SLOT'
  | 'SLOT_MISMATCH'
  | 'SLOT_OCCUPIED'
  | 'ITEM_NOT_FOUND'
  | 'NOT_CLOTHING_ITEM'

export interface EquipmentSlotDefinition {
  id: EquipmentSlot
  label: string
  icon: string
  componentType: ClothingComponentType
  componentId?: number
  propId?: number
}

export const EQUIPMENT_SLOTS: EquipmentSlotDefinition[] = [
  { id: 'hat', label: 'Chapeau', icon: 'M12 3c-2.5 0-5 1.5-5 4v1H4l1 12h14l1-12h-3V7c0-2.5-2.5-4-5-4z M7 8h10', componentType: 'prop', propId: 0 },
  { id: 'glasses', label: 'Lunettes', icon: 'M3 12h2 M19 12h2 M5 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0 M13 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0 M11 12h2', componentType: 'prop', propId: 1 },
  { id: 'mask', label: 'Masque', icon: 'M12 3C7 3 3 7 3 11c0 3 2 5.5 5 6.5V21l4-3 4 3v-3.5c3-1 5-3.5 5-6.5 0-4-4-8-9-8z', componentType: 'component', componentId: 1 },
  { id: 'earring', label: 'Boucle', icon: 'M12 6a2 2 0 1 0 0 0.01 M12 8v3 M12 14a3 3 0 1 0 0 0.01 M12 17v2', componentType: 'prop', propId: 2 },
  { id: 'helmet', label: 'Casque', icon: 'M12 4c-4 0-8 2-8 5v3h16V9c0-3-4-5-8-5z M4 12a8 3 0 0 0 16 0 M8 15c0 3 2 5 4 5s4-2 4-5', componentType: 'prop', propId: 0 },
  { id: 'necklace', label: 'Collier', icon: 'M6 12a8 4 0 0 1 12 0 M12 16v2 M12 20a2 2 0 1 0 0 0.01', componentType: 'component', componentId: 7 },
  { id: 'jacket', label: 'Veste', icon: 'M12 3L6 6v4H3v11h7v-5h4v5h7V10h-3V6l-6-3z M9 10h6', componentType: 'component', componentId: 11 },
  { id: 'tshirt', label: 'T-Shirt', icon: 'M12 3L8 5v2H4v4h2v9h12v-9h2V7h-4V5l-4-2z M8 5l4 2 4-2', componentType: 'component', componentId: 8 },
  { id: 'armor', label: 'Gilet', icon: 'M12 3L5 7v10l7 4 7-4V7l-7-4z M12 7l5 3v6l-5 3-5-3v-6l5-3z', componentType: 'component', componentId: 9 },
  { id: 'gloves', label: 'Gants', icon: 'M6 4v6c0 1 0 2 1 3l2 2v6h6v-6l2-2c1-1 1-2 1-3V4 M6 4c0-1 2-2 6-2s6 1 6 2', componentType: 'component', componentId: 3 },
  { id: 'watch', label: 'Montre', icon: 'M12 12m-7 0a7 7 0 1 0 14 0a7 7 0 1 0-14 0 M12 9v3l2 1', componentType: 'prop', propId: 6 },
  { id: 'bracelet', label: 'Bracelet', icon: 'M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0-16 0 M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0-10 0', componentType: 'prop', propId: 7 },
  { id: 'bag', label: 'Sac', icon: 'M4 5h16v3H4z M5 8v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8 M9 5V3 M15 5V3', componentType: 'component', componentId: 5 },
  { id: 'pants', label: 'Pantalon', icon: 'M6 3h4l1 3h2l1-3h4v10H6V3z M6 13l-2 8h5l1-5h4l1 5h5l-2-8', componentType: 'component', componentId: 4 },
  { id: 'shoes', label: 'Chaussures', icon: 'M4 15l2-4h4l2 4v5H4v-5z M12 15l2-4h4l2 4v5h-8v-5z', componentType: 'component', componentId: 6 },
]

export const EQUIPMENT_SLOT_MAP: Record<EquipmentSlot, EquipmentSlotDefinition> = EQUIPMENT_SLOTS.reduce(
  (acc, slot) => {
    acc[slot.id] = slot
    return acc
  },
  {} as Record<EquipmentSlot, EquipmentSlotDefinition>
)

export function isClothingMetadata(metadata: unknown): metadata is ClothingMetadata {
  if (typeof metadata !== 'object' || metadata === null) return false
  const m = metadata as Record<string, unknown>
  return (
    typeof m.equipmentSlot === 'string' &&
    typeof m.componentType === 'string' &&
    typeof m.drawable === 'number' &&
    typeof m.texture === 'number'
  )
}

export function createEmptyEquipmentState(): EquipmentState {
  return {
    hat: null,
    glasses: null,
    mask: null,
    earring: null,
    tshirt: null,
    jacket: null,
    pants: null,
    shoes: null,
    bag: null,
    armor: null,
    watch: null,
    bracelet: null,
    necklace: null,
    gloves: null,
    helmet: null,
  }
}
