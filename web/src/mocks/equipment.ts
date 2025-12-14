import type { EquipmentSlot, ClothingMetadata, EquippedItem, EquipmentState } from '@/types/equipment'
import { createEmptyEquipmentState } from '@/types/equipment'

export interface MockClothingItem {
  id: string
  name: string
  label: string
  metadata: ClothingMetadata
}

export const MOCK_CLOTHING_ITEMS: MockClothingItem[] = [
  {
    id: 'mock-hat-1',
    name: 'baseball_cap',
    label: 'Casquette Baseball',
    metadata: {
      equipmentSlot: 'hat',
      componentType: 'prop',
      propId: 0,
      drawable: 12,
      texture: 0,
      gender: 'male',
    },
  },
  {
    id: 'mock-glasses-1',
    name: 'aviator_glasses',
    label: 'Lunettes Aviateur',
    metadata: {
      equipmentSlot: 'glasses',
      componentType: 'prop',
      propId: 1,
      drawable: 5,
      texture: 0,
      gender: 'male',
    },
  },
  {
    id: 'mock-mask-1',
    name: 'ski_mask',
    label: 'Cagoule',
    metadata: {
      equipmentSlot: 'mask',
      componentType: 'component',
      componentId: 1,
      drawable: 32,
      texture: 0,
      gender: 'male',
    },
  },
  {
    id: 'mock-tshirt-1',
    name: 'white_tshirt',
    label: 'T-Shirt Blanc',
    metadata: {
      equipmentSlot: 'tshirt',
      componentType: 'component',
      componentId: 8,
      drawable: 15,
      texture: 0,
      gender: 'male',
    },
  },
  {
    id: 'mock-jacket-1',
    name: 'leather_jacket',
    label: 'Veste en Cuir',
    metadata: {
      equipmentSlot: 'jacket',
      componentType: 'component',
      componentId: 11,
      drawable: 24,
      texture: 0,
      gender: 'male',
    },
  },
  {
    id: 'mock-pants-1',
    name: 'jeans_blue',
    label: 'Jean Bleu',
    metadata: {
      equipmentSlot: 'pants',
      componentType: 'component',
      componentId: 4,
      drawable: 10,
      texture: 0,
      gender: 'male',
    },
  },
  {
    id: 'mock-shoes-1',
    name: 'sneakers_white',
    label: 'Baskets Blanches',
    metadata: {
      equipmentSlot: 'shoes',
      componentType: 'component',
      componentId: 6,
      drawable: 1,
      texture: 0,
      gender: 'male',
    },
  },
  {
    id: 'mock-watch-1',
    name: 'gold_watch',
    label: 'Montre Dorée',
    metadata: {
      equipmentSlot: 'watch',
      componentType: 'prop',
      propId: 6,
      drawable: 3,
      texture: 0,
      gender: 'male',
    },
  },
  {
    id: 'mock-armor-1',
    name: 'kevlar_vest',
    label: 'Gilet Kevlar',
    metadata: {
      equipmentSlot: 'armor',
      componentType: 'component',
      componentId: 9,
      drawable: 2,
      texture: 0,
      gender: 'male',
    },
  },
  {
    id: 'mock-bag-1',
    name: 'backpack_black',
    label: 'Sac à Dos Noir',
    metadata: {
      equipmentSlot: 'bag',
      componentType: 'component',
      componentId: 5,
      drawable: 45,
      texture: 0,
      gender: 'male',
    },
  },
  {
    id: 'mock-gloves-1',
    name: 'leather_gloves',
    label: 'Gants en Cuir',
    metadata: {
      equipmentSlot: 'gloves',
      componentType: 'component',
      componentId: 3,
      drawable: 7,
      texture: 0,
      gender: 'male',
    },
  },
  {
    id: 'mock-necklace-1',
    name: 'gold_chain',
    label: 'Chaîne en Or',
    metadata: {
      equipmentSlot: 'necklace',
      componentType: 'component',
      componentId: 7,
      drawable: 5,
      texture: 0,
      gender: 'male',
    },
  },
  {
    id: 'mock-bracelet-1',
    name: 'silver_bracelet',
    label: 'Bracelet Argent',
    metadata: {
      equipmentSlot: 'bracelet',
      componentType: 'prop',
      propId: 7,
      drawable: 2,
      texture: 0,
      gender: 'male',
    },
  },
  {
    id: 'mock-earring-1',
    name: 'diamond_earring',
    label: 'Boucle Diamant',
    metadata: {
      equipmentSlot: 'earring',
      componentType: 'prop',
      propId: 2,
      drawable: 3,
      texture: 0,
      gender: 'male',
    },
  },
  {
    id: 'mock-helmet-1',
    name: 'motorcycle_helmet',
    label: 'Casque Moto',
    metadata: {
      equipmentSlot: 'helmet',
      componentType: 'prop',
      propId: 0,
      drawable: 18,
      texture: 0,
      gender: 'male',
    },
  },
]

export function getMockClothingItem(slot: EquipmentSlot): MockClothingItem | undefined {
  return MOCK_CLOTHING_ITEMS.find((item) => item.metadata.equipmentSlot === slot)
}

export function getMockClothingItemsBySlot(slot: EquipmentSlot): MockClothingItem[] {
  return MOCK_CLOTHING_ITEMS.filter((item) => item.metadata.equipmentSlot === slot)
}

export function createMockEquippedItem(mockItem: MockClothingItem): EquippedItem {
  return {
    id: mockItem.id,
    name: mockItem.name,
    quantity: 1,
    metadata: mockItem.metadata,
  }
}

export function createMockEquipmentState(equippedSlots: EquipmentSlot[]): EquipmentState {
  const state = createEmptyEquipmentState()

  for (const slot of equippedSlots) {
    const mockItem = getMockClothingItem(slot)
    if (mockItem) {
      state[slot] = createMockEquippedItem(mockItem)
    }
  }

  return state
}

export function createFullyEquippedState(): EquipmentState {
  const state = createEmptyEquipmentState()

  for (const mockItem of MOCK_CLOTHING_ITEMS) {
    state[mockItem.metadata.equipmentSlot] = createMockEquippedItem(mockItem)
  }

  return state
}

export function createPartialEquippedState(): EquipmentState {
  return createMockEquipmentState(['hat', 'tshirt', 'pants', 'shoes'])
}

export const MOCK_INVENTORY_CLOTHING_ITEMS = MOCK_CLOTHING_ITEMS.map((item) => ({
  id: `inv-${item.id}`,
  name: item.name,
  quantity: 1,
  metadata: item.metadata,
}))

export const MOCK_CLOTHING_DEFINITIONS = MOCK_CLOTHING_ITEMS.map((item) => ({
  name: item.name,
  label: item.label,
  weight: 0.5,
  type: 'item' as const,
  isUnique: true,
  isUseable: true,
  description: `Vêtement: ${item.label}`,
}))
