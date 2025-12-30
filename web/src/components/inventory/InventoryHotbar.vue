<script setup lang="ts">
import InventorySlot from './InventorySlot.vue'
import SectionTitle from '@/components/common/SectionTitle.vue'
import { useHotbarStore } from '@/stores/hotbar'
import { useItemDefinitionsStore } from '@/stores/itemDefinitions'

const hotbarStore = useHotbarStore()
const itemDefinitionsStore = useItemDefinitionsStore()

const getDefinition = (slotIndex: number) => {
  const slot = hotbarStore.getSlot(slotIndex)
  if (!slot) return undefined
  return itemDefinitionsStore.getDefinition(slot.name)
}
</script>

<template>
  <div class="flex gap-3">
    <div class="w-[680px] p-5">
      <SectionTitle title="HOTBAR" size="text-3xl" font="font-black" class="mb-3 block tracking-wider" />
      <div class="grid grid-cols-5 gap-2.5">
        <div v-for="slot in hotbarStore.slotIndices" :key="slot" class="relative">
          <span class="absolute top-1.5 left-2 text-[10px] text-white font-bold z-10">{{ slot }}</span>
          <InventorySlot
            :slot-index="slot"
            :slot-data="hotbarStore.getSlot(slot)"
            :definition="getDefinition(slot)"
            source="hotbar"
          />
        </div>
      </div>
    </div>
    <div class="w-1.5"></div>
  </div>
</template>
