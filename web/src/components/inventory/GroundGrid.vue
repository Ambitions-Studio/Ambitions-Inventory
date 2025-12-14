<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import InventorySlot from './InventorySlot.vue'
import SectionTitle from '@/components/common/SectionTitle.vue'
import { useGroundStore } from '@/stores/ground'
import { useItemDefinitionsStore } from '@/stores/itemDefinitions'
import * as WeightService from '@/services/WeightService'

const groundStore = useGroundStore()
const itemDefinitionsStore = useItemDefinitionsStore()

const scrollContainer = ref<HTMLElement | null>(null)
const scrollTop = ref(0)
const scrollHeight = ref(1)
const clientHeight = ref(1)

const currentWeight = computed(() => {
  return WeightService.getTotalWeight(
    groundStore.slots,
    (name) => itemDefinitionsStore.getDefinition(name)
  )
})

const formattedWeight = computed(() => {
  return WeightService.formatWeight(currentWeight.value)
})

const thumbHeight = computed(() => {
  if (scrollHeight.value <= clientHeight.value) return 100
  return Math.max((clientHeight.value / scrollHeight.value) * 100, 15)
})

const thumbTop = computed(() => {
  if (scrollHeight.value <= clientHeight.value) return 0
  const maxScroll = scrollHeight.value - clientHeight.value
  const maxThumbTop = 100 - thumbHeight.value
  return (scrollTop.value / maxScroll) * maxThumbTop
})

const updateScroll = () => {
  if (!scrollContainer.value) return
  scrollTop.value = scrollContainer.value.scrollTop
  scrollHeight.value = scrollContainer.value.scrollHeight
  clientHeight.value = scrollContainer.value.clientHeight
}

const getDefinition = (slotIndex: number) => {
  const slot = groundStore.slots[slotIndex]
  if (!slot) return undefined
  return itemDefinitionsStore.getDefinition(slot.name)
}

onMounted(() => {
  setTimeout(() => {
    updateScroll()
  }, 100)
})
</script>

<template>
  <div class="flex gap-3">
    <div class="w-[680px] h-[700px] relative">
      <div
        ref="scrollContainer"
        class="absolute inset-0 overflow-auto p-5"
        @scroll="updateScroll"
      >
        <div class="flex items-end justify-between mb-3">
          <SectionTitle title="GROUND" size="text-3xl" font="font-black" class="tracking-wider" />
          <span class="text-sm font-medium text-slate-300 mb-1">
            {{ formattedWeight }} / ∞
          </span>
        </div>
        <div class="grid grid-cols-5 gap-2.5">
          <InventorySlot
            v-for="(slotData, index) in groundStore.slots"
            :key="index"
            :slot-index="index"
            :slot-data="slotData"
            :definition="getDefinition(index)"
            source="ground"
          />
        </div>
      </div>
    </div>

    <div class="w-1.5 h-[600px] mt-20 bg-slate-800/50 rounded-full border border-solid border-[#475569] relative overflow-hidden">
      <div
        class="absolute left-0 right-0 bg-gradient-to-b from-slate-300 to-slate-400 rounded-full shadow-[0_0_10px_rgba(148,163,184,0.4)]"
        :style="{
          height: `${thumbHeight}%`,
          top: `${thumbTop}%`
        }"
      ></div>
    </div>
  </div>
</template>
