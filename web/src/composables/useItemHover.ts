import { ref, computed } from 'vue'
import type { InventorySlot } from '@/services/InventoryService'
import { useItemDefinitionsStore } from '@/stores/itemDefinitions'
import { useDragAndDrop } from './useDragAndDrop'

const hoveredSlotData = ref<InventorySlot | null>(null)
const hoveredItemName = ref<string | null>(null)
const mousePosition = ref({ x: 0, y: 0 })
const isHoveringSlot = ref(false)

export function useItemHover() {
  const itemDefinitionsStore = useItemDefinitionsStore()
  const { isHoldingItem } = useDragAndDrop()

  const hoveredDefinition = computed(() => {
    if (!hoveredItemName.value) return undefined
    return itemDefinitionsStore.getDefinition(hoveredItemName.value)
  })

  const isVisible = computed(() => {
    return isHoveringSlot.value && !isHoldingItem.value && hoveredSlotData.value !== null
  })

  const handleSlotHover = (slotIndex: number | null, slotData: InventorySlot | null) => {
    if (slotIndex === null || !slotData) {
      isHoveringSlot.value = false
      hoveredSlotData.value = null
      hoveredItemName.value = null
      return
    }

    hoveredSlotData.value = slotData
    hoveredItemName.value = slotData.name
    isHoveringSlot.value = true
  }

  const handleMouseMove = (event: MouseEvent) => {
    mousePosition.value = { x: event.clientX, y: event.clientY }
  }

  const clearHover = () => {
    isHoveringSlot.value = false
    hoveredSlotData.value = null
    hoveredItemName.value = null
  }

  return {
    hoveredSlotData,
    hoveredDefinition,
    mousePosition,
    isVisible,
    handleSlotHover,
    handleMouseMove,
    clearHover
  }
}
