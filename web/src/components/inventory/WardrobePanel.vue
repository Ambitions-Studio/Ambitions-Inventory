<script setup lang="ts">
import { computed, onMounted } from 'vue'
import EquipmentSlot from './EquipmentSlot.vue'
import { useEquipmentStore } from '@/stores/equipment'
import type { EquipmentSlot as EquipmentSlotType } from '@/types/equipment'

defineEmits<{
  close: []
}>()

const equipmentStore = useEquipmentStore()

const SLOT_INDEX_MAP: Record<EquipmentSlotType, number> = {
  hat: 0,
  glasses: 1,
  mask: 2,
  earring: 3,
  helmet: 4,
  jacket: 5,
  tshirt: 6,
  pants: 7,
  shoes: 8,
  gloves: 9,
  armor: 10,
  bag: 11,
  necklace: 12,
  watch: 13,
  bracelet: 14,
}

const CATEGORY_SLOTS: Record<'head' | 'body' | 'accessory', EquipmentSlotType[]> = {
  head: ['hat', 'glasses', 'mask', 'earring', 'helmet'],
  body: ['jacket', 'tshirt', 'pants', 'shoes', 'gloves'],
  accessory: ['armor', 'bag', 'necklace', 'watch', 'bracelet'],
}

const getSlotsByCategory = (category: 'head' | 'body' | 'accessory'): EquipmentSlotType[] => {
  return CATEGORY_SLOTS[category]
}

const headSlots = computed(() => getSlotsByCategory('head'))
const bodySlots = computed(() => getSlotsByCategory('body'))
const accessorySlots = computed(() => getSlotsByCategory('accessory'))

const getSlotIndex = (slotId: EquipmentSlotType): number => SLOT_INDEX_MAP[slotId]

onMounted(() => {
  equipmentStore.init()
})
</script>

<template>
  <div class="flex flex-col gap-6 pointer-events-auto">
    <div class="flex flex-col gap-2">
      <span class="text-white text-2xl font-black uppercase tracking-wider">Tête</span>
      <div class="grid grid-cols-3 gap-2.5">
        <EquipmentSlot
          v-for="slotId in headSlots"
          :key="slotId"
          :slot-id="slotId"
          :slot-index="getSlotIndex(slotId)"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-white text-2xl font-black uppercase tracking-wider">Corps</span>
      <div class="grid grid-cols-3 gap-2.5">
        <EquipmentSlot
          v-for="slotId in bodySlots"
          :key="slotId"
          :slot-id="slotId"
          :slot-index="getSlotIndex(slotId)"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-white text-2xl font-black uppercase tracking-wider">Accessoires</span>
      <div class="grid grid-cols-3 gap-2.5">
        <EquipmentSlot
          v-for="slotId in accessorySlots"
          :key="slotId"
          :slot-id="slotId"
          :slot-index="getSlotIndex(slotId)"
        />
      </div>
    </div>
  </div>
</template>
