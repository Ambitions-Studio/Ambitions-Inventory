import type { ItemDefinition } from '@/types/item'

export const mockItems: Record<string, ItemDefinition> = {
  cash: {
    name: 'cash',
    label: 'Argent',
    weight: 0,
    type: 'item',
    image: 'cash.png',
    description: "De l'argent liquide"
  },

  bread: {
    name: 'bread',
    label: 'Pain',
    weight: 100,
    type: 'item',
    image: 'bread.png',
    stackLimits: 10,
    isUseable: true,
    description: 'Un bon pain frais'
  },

  water: {
    name: 'water',
    label: 'Bouteille d\'eau',
    weight: 500,
    type: 'item',
    image: 'water.png',
    stackLimits: 5,
    isUseable: true,
    closeInventory: true,
    description: 'Une bouteille d\'eau fraîche'
  },

  phone: {
    name: 'phone',
    label: 'Téléphone',
    weight: 200,
    type: 'item',
    image: 'phone.png',
    isUnique: true,
    isUseable: true,
    description: 'Un smartphone dernier cri'
  },

  medkit: {
    name: 'medkit',
    label: 'Kit médical',
    weight: 1000,
    type: 'item',
    image: 'medkit.png',
    stackLimits: false,
    isUseable: true,
    closeInventory: true,
    job: ['ambulance', 'doctor'],
    description: 'Kit de premiers secours professionnel'
  },

  handcuffs: {
    name: 'handcuffs',
    label: 'Menottes',
    weight: 300,
    type: 'item',
    image: 'handcuffs.png',
    isUseable: true,
    job: ['police', 'sheriff'],
    description: 'Menottes de police standard'
  },

  pistol: {
    name: 'pistol',
    label: 'Pistolet',
    weight: 1500,
    type: 'weapon',
    image: 'pistol.png',
    isUnique: true,
    description: 'Arme de poing 9mm'
  },

  lockpick: {
    name: 'lockpick',
    label: 'Crochet',
    weight: 50,
    type: 'item',
    image: 'lockpick.png',
    stackLimits: 20,
    isUseable: true,
    description: 'Outil pour crocheter les serrures'
  }
}
