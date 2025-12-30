import { ref, computed } from 'vue'
import type { InventorySlot } from '@/services/InventoryService'
import type { DragSource } from './useDragAndDrop'
import { useItemDefinitionsStore } from '@/stores/itemDefinitions'
import { useInventoryStore } from '@/stores/inventory'
import { useHotbarStore } from '@/stores/hotbar'
import { useGroundStore } from '@/stores/ground'
import { sendNuiCallback } from '@/utils/nui'

export type ContextMenuAction = 'use' | 'give' | 'drop' | 'rename' | 'split' | 'inspect'

export type ContextMenuOption = {
  action: ContextMenuAction
  label: string
  icon?: string
  visible: boolean
  disabled?: boolean
}

export type ActiveModal = 'none' | 'rename' | 'give' | 'split' | 'inspect'

export type NearbyPlayer = {
  id: number
  firstName: string
  lastName: string
}

const MOCK_NEARBY_PLAYERS: NearbyPlayer[] = [
  { id: 1, firstName: 'Jean', lastName: 'Dupont' },
  { id: 2, firstName: 'Marie', lastName: 'Martin' },
  { id: 3, firstName: 'Lucas', lastName: 'Bernard' }
]

const isOpen = ref(false)
const position = ref({ x: 0, y: 0 })
const currentSlotIndex = ref<number | null>(null)
const currentSource = ref<DragSource | null>(null)
const currentSlotData = ref<InventorySlot | null>(null)
const currentItemName = ref<string | null>(null)

const activeModal = ref<ActiveModal>('none')
const nearbyPlayers = ref<NearbyPlayer[]>([])
const isInspecting = ref(false)
const inspectProgress = ref(0)
const inspectSlotIndex = ref<number | null>(null)
const inspectAnchorPosition = ref({ x: 0, y: 0 })
const inspectTimerId = ref<ReturnType<typeof setInterval> | null>(null)

export function useItemContextMenu() {
  const itemDefinitionsStore = useItemDefinitionsStore()
  const inventoryStore = useInventoryStore()
  const hotbarStore = useHotbarStore()
  const groundStore = useGroundStore()
  const isDevelopment = import.meta.env.DEV

  const currentDefinition = computed(() => {
    if (!currentItemName.value) return undefined
    return itemDefinitionsStore.getDefinition(currentItemName.value)
  })

  const itemLabel = computed(() => {
    return currentDefinition.value?.label ?? ''
  })

  const menuOptions = computed<ContextMenuOption[]>(() => {
    const definition = currentDefinition.value
    const slotData = currentSlotData.value
    const source = currentSource.value

    if (!definition || !slotData) return []

    const isGround = source === 'ground'
    const canUse = !isGround && definition.isUseable === true
    const canSplit = !isGround && slotData.quantity > 1

    return [
      { action: 'use', label: 'Utiliser', visible: canUse },
      { action: 'give', label: 'Donner', visible: !isGround },
      { action: 'drop', label: 'Mettre au sol', visible: !isGround },
      { action: 'rename', label: 'Renommer', visible: !isGround },
      { action: 'split', label: 'Séparer', visible: canSplit },
      { action: 'inspect', label: 'Inspecter', visible: isGround }
    ]
  })

  const visibleOptions = computed(() => {
    return menuOptions.value.filter(opt => opt.visible)
  })

  const isRenameModalOpen = computed(() => activeModal.value === 'rename')
  const isGiveModalOpen = computed(() => activeModal.value === 'give')
  const isSplitModalOpen = computed(() => activeModal.value === 'split')
  const isInspectCardOpen = computed(() => activeModal.value === 'inspect')

  const openMenu = (
    slotIndex: number,
    source: DragSource,
    slotData: InventorySlot,
    event: MouseEvent
  ) => {
    if (!slotData) return

    event.preventDefault()

    currentSlotIndex.value = slotIndex
    currentSource.value = source
    currentSlotData.value = slotData
    currentItemName.value = slotData.name
    position.value = { x: event.clientX, y: event.clientY }
    isOpen.value = true
  }

  const closeMenu = () => {
    isOpen.value = false
  }

  const clearContext = () => {
    currentSlotIndex.value = null
    currentSource.value = null
    currentSlotData.value = null
    currentItemName.value = null
    nearbyPlayers.value = []
  }

  const selectAction = (action: ContextMenuAction) => {
    if (currentSlotIndex.value === null || !currentSource.value || !currentSlotData.value) {
      closeMenu()
      return
    }

    closeMenu()

    switch (action) {
      case 'rename':
        activeModal.value = 'rename'
        break
      case 'give':
        if (isDevelopment) {
          nearbyPlayers.value = MOCK_NEARBY_PLAYERS
        } else {
          sendNuiCallback<void, NearbyPlayer[]>('getNearbyPlayers').then(response => {
            nearbyPlayers.value = response ?? []
          })
        }
        activeModal.value = 'give'
        break
      case 'split':
        activeModal.value = 'split'
        break
      case 'use':
        sendNuiCallback('useItem', {
          slotIndex: currentSlotIndex.value,
          source: currentSource.value
        })
        clearContext()
        break
      case 'drop': {
        const slotIndex = currentSlotIndex.value
        const source = currentSource.value
        const slotData = currentSlotData.value

        if (isDevelopment && slotData) {
          const emptyGroundSlot = groundStore.findEmptySlot()

          if (emptyGroundSlot !== null) {
            groundStore.setSlot(emptyGroundSlot, slotData)
            if (source === 'inventory') {
              inventoryStore.setSlot(slotIndex, null)
            } else if (source === 'hotbar') {
              hotbarStore.setSlot(slotIndex, null)
            }
          }
        } else {
          sendNuiCallback('dropItem', { slotIndex, source })
        }

        clearContext()
        break
      }
      case 'inspect': {
        const slotIdx = currentSlotIndex.value
        inspectSlotIndex.value = slotIdx
        inspectAnchorPosition.value = { x: position.value.x, y: position.value.y }
        isInspecting.value = true
        inspectProgress.value = 0

        const duration = 2500
        const interval = 50
        const increment = (interval / duration) * 100

        inspectTimerId.value = setInterval(() => {
          inspectProgress.value += increment
          if (inspectProgress.value >= 100) {
            if (inspectTimerId.value) {
              clearInterval(inspectTimerId.value)
              inspectTimerId.value = null
            }
            isInspecting.value = false
            inspectProgress.value = 0
            inspectSlotIndex.value = null
            activeModal.value = 'inspect'
          }
        }, interval)
        break
      }
    }
  }

  const cancelAction = () => {
    if (inspectTimerId.value) {
      clearInterval(inspectTimerId.value)
      inspectTimerId.value = null
    }
    isInspecting.value = false
    inspectProgress.value = 0
    inspectSlotIndex.value = null
    activeModal.value = 'none'
    clearContext()
  }

  const confirmRename = async (newLabel: string) => {
    if (currentSlotIndex.value === null || !currentSource.value) {
      cancelAction()
      return
    }

    const slotIndex = currentSlotIndex.value
    const source = currentSource.value

    activeModal.value = 'none'

    if (isDevelopment) {
      if (source === 'inventory') {
        const slot = inventoryStore.getSlot(slotIndex)
        if (slot) {
          inventoryStore.setSlot(slotIndex, { name: slot.name, count: slot.quantity, metadata: { ...slot.metadata, customLabel: newLabel } })
        }
      } else if (source === 'hotbar') {
        const slot = hotbarStore.getSlot(slotIndex)
        if (slot) {
          hotbarStore.setSlot(slotIndex, { ...slot, metadata: { ...slot.metadata, customLabel: newLabel } })
        }
      } else if (source === 'ground') {
        const slot = groundStore.getSlot(slotIndex)
        if (slot) {
          groundStore.setSlot(slotIndex, { ...slot, metadata: { ...slot.metadata, customLabel: newLabel } })
        }
      }
    } else {
      await sendNuiCallback('renameItem', { slotIndex, source, newLabel })
    }

    clearContext()
  }

  const confirmGive = async (targetPlayerId: number, quantity: number) => {
    if (currentSlotIndex.value === null || !currentSource.value || !currentSlotData.value) {
      cancelAction()
      return
    }

    const slotIndex = currentSlotIndex.value
    const source = currentSource.value
    const slotData = currentSlotData.value
    const player = nearbyPlayers.value.find(p => p.id === targetPlayerId)

    activeModal.value = 'none'

    if (isDevelopment) {
      if (source === 'inventory') {
        const slot = inventoryStore.getSlot(slotIndex)
        if (slot) {
          if (quantity >= slot.quantity) {
            inventoryStore.setSlot(slotIndex, null)
          } else {
            inventoryStore.setSlot(slotIndex, { name: slot.name, count: slot.quantity - quantity, metadata: slot.metadata })
          }
        }
      } else if (source === 'hotbar') {
        const slot = hotbarStore.getSlot(slotIndex)
        if (slot) {
          if (quantity >= slot.quantity) {
            hotbarStore.setSlot(slotIndex, null)
          } else {
            hotbarStore.setSlot(slotIndex, { ...slot, quantity: slot.quantity - quantity })
          }
        }
      } else if (source === 'ground') {
        const slot = groundStore.getSlot(slotIndex)
        if (slot) {
          if (quantity >= slot.quantity) {
            groundStore.setSlot(slotIndex, null)
          } else {
            groundStore.setSlot(slotIndex, { ...slot, quantity: slot.quantity - quantity })
          }
        }
      }

      console.info(`[DEV] Give ${quantity}x ${slotData.name} at slot ${slotIndex} to ${player?.firstName} ${player?.lastName}`)
    } else {
      await sendNuiCallback('giveItem', { slotIndex, source, targetPlayerId, quantity })
    }

    clearContext()
  }

  const currentQuantity = computed(() => {
    return currentSlotData.value?.quantity ?? 0
  })

  const confirmSplit = async (quantity: number) => {
    if (currentSlotIndex.value === null || !currentSource.value || !currentSlotData.value) {
      cancelAction()
      return
    }

    const slotIndex = currentSlotIndex.value
    const source = currentSource.value
    const slotData = currentSlotData.value

    activeModal.value = 'none'

    if (isDevelopment) {
      if (source === 'inventory') {
        inventoryStore.splitStack(slotIndex, quantity)
      } else if (source === 'hotbar') {
        const slot = hotbarStore.getSlot(slotIndex)
        if (slot && slot.quantity > quantity) {
          const emptySlot = hotbarStore.findEmptySlot()
          if (emptySlot !== null) {
            hotbarStore.setSlot(slotIndex, { ...slot, quantity: slot.quantity - quantity })
            hotbarStore.setSlot(emptySlot, {
              id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
              name: slotData.name,
              quantity: quantity,
              metadata: slotData.metadata ? { ...slotData.metadata } : undefined
            })
          }
        }
      } else if (source === 'ground') {
        const slot = groundStore.getSlot(slotIndex)
        if (slot && slot.quantity > quantity) {
          const emptySlot = groundStore.findEmptySlot()
          if (emptySlot !== null) {
            groundStore.setSlot(slotIndex, { ...slot, quantity: slot.quantity - quantity })
            groundStore.setSlot(emptySlot, {
              id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
              name: slotData.name,
              quantity: quantity,
              metadata: slotData.metadata ? { ...slotData.metadata } : undefined
            })
          }
        }
      }
    } else {
      await sendNuiCallback('splitItem', { slotIndex, source, quantity })
    }

    clearContext()
  }

  return {
    isOpen,
    position,
    currentSlotData,
    currentDefinition,
    itemLabel,
    currentQuantity,
    visibleOptions,
    nearbyPlayers,
    isRenameModalOpen,
    isGiveModalOpen,
    isSplitModalOpen,
    isInspectCardOpen,
    isInspecting,
    inspectProgress,
    inspectSlotIndex,
    inspectAnchorPosition,
    openMenu,
    closeMenu,
    selectAction,
    cancelAction,
    confirmRename,
    confirmGive,
    confirmSplit
  }
}
