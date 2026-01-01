<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { sendNuiEvent, sendNuiCallback } from '@/utils/nui'
import InventoryGrid from '@/components/inventory/InventoryGrid.vue'
import InventoryHotbar from '@/components/inventory/InventoryHotbar.vue'
import GroundGrid from '@/components/inventory/GroundGrid.vue'
import InventoryActions from '@/components/inventory/InventoryActions.vue'
import DragGhost from '@/components/inventory/DragGhost.vue'
import ItemContextMenu from '@/components/inventory/ItemContextMenu.vue'
import RenameModal from '@/components/inventory/RenameModal.vue'
import GiveModal from '@/components/inventory/GiveModal.vue'
import SplitModal from '@/components/inventory/SplitModal.vue'
import InspectCard from '@/components/inventory/InspectCard.vue'
import SettingsPanel from '@/components/inventory/SettingsPanel.vue'
import WardrobePanel from '@/components/inventory/WardrobePanel.vue'
import { useItemDefinitionsStore } from '@/stores/itemDefinitions'
import { useInventoryStore } from '@/stores/inventory'
import { useHotbarStore } from '@/stores/hotbar'
import { useGroundStore } from '@/stores/ground'
import { useEquipmentStore } from '@/stores/equipment'
import { useDragAndDrop, type DropResult } from '@/composables/useDragAndDrop'
import type { InventorySlot } from '@/services/InventoryService'
import { useItemContextMenu } from '@/composables/useItemContextMenu'
import { MOCK_CLOTHING_ITEMS } from '@/mocks/equipment'
import { isClothingMetadata } from '@/types/equipment'
import type { EquipmentSlot } from '@/types/equipment'

const isDevelopment = import.meta.env.DEV
const isVisible = ref(false)

const props = defineProps<{
  forceVisible?: boolean
}>()

const shouldShow = computed(() => props.forceVisible || isVisible.value)

const itemDefinitionsStore = useItemDefinitionsStore()
const inventoryStore = useInventoryStore()
const hotbarStore = useHotbarStore()
const groundStore = useGroundStore()
const equipmentStore = useEquipmentStore()
const { onDrop } = useDragAndDrop()

const INDEX_TO_SLOT: EquipmentSlot[] = [
  'hat', 'glasses', 'mask', 'earring', 'helmet',
  'jacket', 'tshirt', 'pants', 'shoes', 'gloves',
  'armor', 'bag', 'necklace', 'watch', 'bracelet'
]
const {
  itemLabel,
  currentQuantity,
  currentSlotData,
  currentDefinition,
  nearbyPlayers,
  isRenameModalOpen,
  isGiveModalOpen,
  isSplitModalOpen,
  isInspectCardOpen,
  inspectAnchorPosition,
  cancelAction,
  confirmRename,
  confirmGive,
  confirmSplit
} = useItemContextMenu()

const isSettingsOpen = ref(false)
const isWardrobeOpen = ref(false)

const handleOpenSettings = () => {
  isSettingsOpen.value = true
  isWardrobeOpen.value = false
}

const handleCloseSettings = () => {
  isSettingsOpen.value = false
}

const handleOpenWardrobe = () => {
  isWardrobeOpen.value = true
  isSettingsOpen.value = false
}

const handleCloseWardrobe = () => {
  isWardrobeOpen.value = false
}

const backgroundStyle = computed(() => {
  if (isWardrobeOpen.value) {
    return {
      background: `linear-gradient(
        to right,
        rgba(15, 23, 42, 1) 0%,
        rgba(15, 23, 42, 0.7) 10%,
        rgba(15, 23, 42, 0.2) 25%,
        transparent 40%,
        transparent 100%
      )`
    }
  }
  return {
    background: `linear-gradient(
      to right,
      rgba(15, 23, 42, 1) 0%,
      rgba(15, 23, 42, 0.7) 10%,
      rgba(15, 23, 42, 0.2) 25%,
      transparent 40%,
      transparent 60%,
      rgba(15, 23, 42, 0.2) 75%,
      rgba(15, 23, 42, 0.7) 90%,
      rgba(15, 23, 42, 1) 100%
    )`
  }
})

const getSlotData = (source: string, slot: number): InventorySlot => {
  switch (source) {
    case 'inventory': return inventoryStore.getSlot(slot)
    case 'hotbar': return hotbarStore.getSlot(slot)
    case 'ground': return groundStore.getSlot(slot)
    default: return null
  }
}

const handleDrop = (result: DropResult) => {
  if (result.toSource === 'equipment') {
    handleDropToEquipment(result)
    return
  }

  if (result.fromSource === 'equipment') {
    handleDropFromEquipment(result)
    return
  }

  const fromSlot = getSlotData(result.fromSource, result.fromIndex)
  const toSlot = getSlotData(result.toSource, result.toIndex)

  if (fromSlot && toSlot && fromSlot.name === toSlot.name) {
    if (result.toSource === 'inventory') {
      const existing = inventoryStore.getSlot(result.toIndex)
      if (existing) {
        inventoryStore.setSlot(result.toIndex, { name: existing.name, count: existing.quantity + fromSlot.quantity, metadata: existing.metadata })
      }
    } else if (result.toSource === 'hotbar') {
      const existing = hotbarStore.getSlot(result.toIndex)
      if (existing) hotbarStore.setSlot(result.toIndex, { ...existing, quantity: existing.quantity + fromSlot.quantity })
    } else if (result.toSource === 'ground') {
      const existing = groundStore.getSlot(result.toIndex)
      if (existing) groundStore.setSlot(result.toIndex, { ...existing, quantity: existing.quantity + fromSlot.quantity })
    }

    if (result.fromSource === 'inventory') {
      inventoryStore.setSlot(result.fromIndex, null)
      sendNuiCallback('inventoryMergeItems', { fromSlot: result.fromIndex, toSlot: result.toIndex })
    } else if (result.fromSource === 'hotbar') {
      hotbarStore.setSlot(result.fromIndex, null)
    } else if (result.fromSource === 'ground') {
      groundStore.setSlot(result.fromIndex, null)
    }
    return
  }

  if (result.fromSource === result.toSource) {
    if (result.fromSource === 'inventory') {
      inventoryStore.swapSlots(result.fromIndex, result.toIndex)
      sendNuiCallback('inventorySwapSlots', { fromSlot: result.fromIndex, toSlot: result.toIndex })
    } else if (result.fromSource === 'hotbar') {
      hotbarStore.swapSlots(result.fromIndex, result.toIndex)
    } else if (result.fromSource === 'ground') {
      groundStore.swapSlots(result.fromIndex, result.toIndex)
    }
  } else {
    if (result.fromSource === 'inventory') {
      inventoryStore.setSlot(result.fromIndex, toSlot ? { name: toSlot.name, count: toSlot.quantity, metadata: toSlot.metadata } : null)
    } else if (result.fromSource === 'hotbar') {
      hotbarStore.setSlot(result.fromIndex, toSlot ?? null)
    } else if (result.fromSource === 'ground') {
      groundStore.setSlot(result.fromIndex, toSlot ?? null)
    }

    if (result.toSource === 'inventory') {
      inventoryStore.setSlot(result.toIndex, fromSlot ? { name: fromSlot.name, count: fromSlot.quantity, metadata: fromSlot.metadata } : null)
    } else if (result.toSource === 'hotbar') {
      hotbarStore.setSlot(result.toIndex, fromSlot ?? null)
    } else if (result.toSource === 'ground') {
      groundStore.setSlot(result.toIndex, fromSlot ?? null)
    }
  }
}

const handleDropToEquipment = (result: DropResult) => {
  const fromSlot = getSlotData(result.fromSource, result.fromIndex)
  if (!fromSlot || !fromSlot.metadata) return

  if (!isClothingMetadata(fromSlot.metadata)) return

  const targetSlotId = INDEX_TO_SLOT[result.toIndex]
  if (!targetSlotId) return

  if (fromSlot.metadata.equipmentSlot !== targetSlotId) return

  const currentEquipped = equipmentStore.getItem(targetSlotId)

  const item = {
    id: fromSlot.id,
    name: fromSlot.name,
    quantity: fromSlot.quantity,
    metadata: fromSlot.metadata,
  }

  const { result: equipResult } = equipmentStore.equip(item, targetSlotId, true)

  if (equipResult.success) {
    if (result.fromSource === 'inventory') {
      inventoryStore.setSlot(result.fromIndex, null)
    } else if (result.fromSource === 'hotbar') {
      hotbarStore.setSlot(result.fromIndex, null)
    } else if (result.fromSource === 'ground') {
      groundStore.setSlot(result.fromIndex, null)
    }

    if (currentEquipped) {
      const definition = {
        name: currentEquipped.name,
        label: currentEquipped.metadata.customLabel ?? currentEquipped.name,
        weight: 500,
        type: 'item' as const,
        isUnique: true,
        isUseable: true,
      }
      inventoryStore.addItem(definition, 1, currentEquipped.metadata as unknown as Record<string, unknown>)
    }
  }
}

const handleDropFromEquipment = (result: DropResult) => {
  const fromSlotId = INDEX_TO_SLOT[result.fromIndex]
  if (!fromSlotId) return

  const equippedItem = equipmentStore.getItem(fromSlotId)
  if (!equippedItem) return

  const { result: unequipResult } = equipmentStore.unequip(fromSlotId)

  if (unequipResult.success) {
    const toSlot = getSlotData(result.toSource, result.toIndex)
    const itemData = {
      name: equippedItem.name,
      count: 1,
      metadata: equippedItem.metadata as unknown as Record<string, unknown>,
    }

    const slotItem = {
      id: equippedItem.id,
      name: equippedItem.name,
      quantity: 1,
      metadata: equippedItem.metadata as unknown as Record<string, unknown>,
    }

    if (toSlot) {
      if (result.toSource === 'inventory') {
        const emptySlot = inventoryStore.findEmptySlot()
        if (emptySlot !== null) {
          inventoryStore.setSlot(emptySlot, itemData)
        }
      } else if (result.toSource === 'hotbar') {
        const emptySlot = hotbarStore.findEmptySlot()
        if (emptySlot !== null) {
          hotbarStore.setSlot(emptySlot, slotItem)
        }
      } else if (result.toSource === 'ground') {
        const emptySlot = groundStore.findEmptySlot()
        if (emptySlot !== null) {
          groundStore.setSlot(emptySlot, slotItem)
        }
      }
    } else {
      if (result.toSource === 'inventory') {
        inventoryStore.setSlot(result.toIndex, itemData)
      } else if (result.toSource === 'hotbar') {
        hotbarStore.setSlot(result.toIndex, slotItem)
      } else if (result.toSource === 'ground') {
        groundStore.setSlot(result.toIndex, slotItem)
      }
    }
  }
}

onDrop(handleDrop)

onMounted(async () => {
  window.addEventListener('message', (event) => {
    if (event.data.action === 'toggleInventory') {
      isVisible.value = event.data.isOpen
    }
    if (event.data.action === 'updateMaxSlots') {
      const success = inventoryStore.setMaxSlots(event.data.slots)
      if (!success) {
        sendNuiEvent('slotReductionBlocked')
      }
    }
    if (event.data.action === 'updateMaxWeight') {
      const success = inventoryStore.setMaxWeight(event.data.weight)
      if (!success) {
        sendNuiEvent('weightReductionBlocked')
      }
    }
    if (event.data.action === 'addItem') {
      inventoryStore.setSlot(event.data.slot, event.data.item)
    }
    if (event.data.action === 'updateItem') {
      inventoryStore.updateSlot(event.data.slot, event.data.item)
    }
    if (event.data.action === 'removeItem') {
      inventoryStore.setSlot(event.data.slot, null)
    }
    if (event.data.action === 'loadInventory') {
      const { maxSlots, maxWeight, items } = event.data
      inventoryStore.initSlots(maxSlots, maxWeight)
      const isArray = Array.isArray(items)
      for (const [index, item] of Object.entries(items)) {
        const slotNumber = isArray ? parseInt(index) + 1 : parseInt(index)
        if (item) {
          inventoryStore.setSlot(slotNumber, item as { name: string; count: number; metadata?: Record<string, unknown> })
        }
      }
    }
  })

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isVisible.value) {
      isVisible.value = false
      sendNuiEvent('closeInventory')
    }
  })

  await itemDefinitionsStore.load()

  const config = await sendNuiCallback<undefined, { slotsNumber?: number; maxWeight?: number }>('getInventoryConfig')
  const slotsNumber = config?.slotsNumber ?? 40
  const maxWeight = config?.maxWeight ?? 40000

  inventoryStore.initSlots(slotsNumber, maxWeight)
  hotbarStore.initSlots()
  groundStore.initSlots(30)

  if (isDevelopment) {
    const allDefinitions = itemDefinitionsStore.getAllDefinitions()

    for (const definition of allDefinitions) {
      const quantity = definition.isUnique ? 1 : 10

      if (definition.name === 'pistol') {
        inventoryStore.addItem(definition, quantity, {
          serial: 'AK847291',
          ammo: 12
        })
      } else {
        inventoryStore.addItem(definition, quantity)
      }
    }

    for (const clothingItem of MOCK_CLOTHING_ITEMS) {
      const definition = {
        name: clothingItem.name,
        label: clothingItem.label,
        weight: 500,
        type: 'item' as const,
        isUnique: true,
        isUseable: true,
      }
      itemDefinitionsStore.addDefinition(definition)
      inventoryStore.addItem(definition, 1, clothingItem.metadata as unknown as Record<string, unknown>)
    }

    console.info(`[Inventory] DEV: Loaded ${allDefinitions.length} items + ${MOCK_CLOTHING_ITEMS.length} clothing items`)
  }
})
</script>

<template>
  <Transition name="inventory">
    <div
      v-if="shouldShow"
      class="fixed inset-0 w-full h-full z-10 flex items-center justify-between transition-all duration-300"
      :style="backgroundStyle"
    >
      <div class="ml-32 flex flex-col gap-3 inventory-left">
        <InventoryGrid />
        <InventoryHotbar />
      </div>
      <div class="flex-1 flex items-center justify-center inventory-right pointer-events-none">
        <Transition name="panel-switch" mode="out-in">
          <div v-if="!isSettingsOpen && !isWardrobeOpen" key="ground" class="flex flex-col gap-3 mr-32 pointer-events-auto">
            <InventoryActions @open-settings="handleOpenSettings" @open-wardrobe="handleOpenWardrobe" />
            <GroundGrid />
          </div>
          <SettingsPanel v-else-if="isSettingsOpen" key="settings" :is-open="isSettingsOpen" @close="handleCloseSettings" />
          <WardrobePanel v-else key="wardrobe" @close="handleCloseWardrobe" />
        </Transition>
      </div>

      <DragGhost />
      <ItemContextMenu />
      <RenameModal
        :is-open="isRenameModalOpen"
        :item-label="itemLabel"
        @confirm="confirmRename"
        @cancel="cancelAction"
      />
      <GiveModal
        :is-open="isGiveModalOpen"
        :item-label="itemLabel"
        :players="nearbyPlayers"
        :max-quantity="currentQuantity"
        @confirm="confirmGive"
        @cancel="cancelAction"
      />
      <SplitModal
        :is-open="isSplitModalOpen"
        :item-label="itemLabel"
        :max-quantity="currentQuantity"
        @confirm="confirmSplit"
        @cancel="cancelAction"
      />
      <InspectCard
        :is-open="isInspectCardOpen"
        :slot-data="currentSlotData"
        :definition="currentDefinition"
        :anchor-x="inspectAnchorPosition.x"
        :anchor-y="inspectAnchorPosition.y"
        @close="cancelAction"
      />
    </div>
  </Transition>
</template>

<style scoped>
.inventory-enter-active {
  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.inventory-enter-active .inventory-left {
  animation: slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.inventory-enter-active .inventory-right {
  animation: slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.inventory-leave-active {
  transition: opacity 0.25s ease-in;
}

.inventory-leave-active .inventory-left {
  animation: slideOutLeft 0.25s ease-in forwards;
}

.inventory-leave-active .inventory-right {
  animation: slideOutRight 0.25s ease-in forwards;
}

.inventory-enter-from,
.inventory-leave-to {
  opacity: 0;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideOutLeft {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-20px);
  }
}

@keyframes slideOutRight {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(20px);
  }
}

.panel-switch-enter-active {
  animation: panelEnter 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.panel-switch-leave-active {
  animation: panelLeave 0.25s cubic-bezier(0.4, 0, 1, 1) forwards;
}

@keyframes panelEnter {
  from {
    opacity: 0;
    transform: translateY(15px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes panelLeave {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-10px) scale(0.98);
  }
}
</style>
