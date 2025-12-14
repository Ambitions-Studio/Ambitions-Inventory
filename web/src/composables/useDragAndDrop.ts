import { ref, computed } from 'vue'
import type { InventorySlot } from '@/services/InventoryService'

export type DragSource = 'inventory' | 'hotbar' | 'ground' | 'equipment'

// ⚠️ Global singleton drag & drop state - shared across all components

export type SlotPosition = {
  index: number
  source: DragSource
  element: HTMLElement
  centerX: number
  centerY: number
}

export type DragState = {
  sourceIndex: number
  sourceType: DragSource
  slotData: InventorySlot
  startX: number
  startY: number
  currentX: number
  currentY: number
}

export type DropResult = {
  fromIndex: number
  fromSource: DragSource
  toIndex: number
  toSource: DragSource
}

export type DropHandler = (result: DropResult) => void

const isMouseDown = ref(false)
const isDraggingState = ref(false)
const dragState = ref<DragState | null>(null)
const registeredSlots = ref<SlotPosition[]>([])
const nearestSlot = ref<SlotPosition | null>(null)
const dragThreshold = 5
const dropHandlers = new Set<DropHandler>()

const findNearestSlot = (x: number, y: number): SlotPosition | null => {
  if (registeredSlots.value.length === 0) return null

  let nearest: SlotPosition | null = null
  let minDistanceSquared = Infinity

  for (const slot of registeredSlots.value) {
    if (
      dragState.value &&
      slot.index === dragState.value.sourceIndex &&
      slot.source === dragState.value.sourceType
    ) {
      continue
    }

    const dx = x - slot.centerX
    const dy = y - slot.centerY
    const distanceSquared = dx * dx + dy * dy

    if (distanceSquared < minDistanceSquared) {
      minDistanceSquared = distanceSquared
      nearest = slot
    }
  }

  return nearest
}

const updateSlotPositions = () => {
  registeredSlots.value = registeredSlots.value.map((slot) => {
    const rect = slot.element.getBoundingClientRect()
    return {
      ...slot,
      centerX: rect.left + rect.width / 2,
      centerY: rect.top + rect.height / 2
    }
  })
}

const onMouseMove = (event: MouseEvent) => {
  if (!dragState.value || !isMouseDown.value) return

  const dx = event.clientX - dragState.value.startX
  const dy = event.clientY - dragState.value.startY
  const distance = Math.sqrt(dx * dx + dy * dy)

  if (!isDraggingState.value && distance > dragThreshold) {
    isDraggingState.value = true
  }

  dragState.value.currentX = event.clientX
  dragState.value.currentY = event.clientY

  if (isDraggingState.value) {
    nearestSlot.value = findNearestSlot(event.clientX, event.clientY)
  }
}

const onMouseUp = () => {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)

  if (isDraggingState.value && nearestSlot.value && dragState.value) {
    const result: DropResult = {
      fromIndex: dragState.value.sourceIndex,
      fromSource: dragState.value.sourceType,
      toIndex: nearestSlot.value.index,
      toSource: nearestSlot.value.source
    }

    dropHandlers.forEach((handler) => handler(result))
  }

  isMouseDown.value = false
  isDraggingState.value = false
  dragState.value = null
  nearestSlot.value = null
}

export function useDragAndDrop() {
  const isDragging = computed(() => isDraggingState.value)
  const isHoldingItem = computed(() => isMouseDown.value)
  const draggedItem = computed(() => dragState.value?.slotData ?? null)
  const dragPosition = computed(() => {
    if (!dragState.value) return { x: 0, y: 0 }
    return { x: dragState.value.currentX, y: dragState.value.currentY }
  })

  const registerSlot = (index: number, source: DragSource, element: HTMLElement) => {
    const existing = registeredSlots.value.findIndex(
      (s) => s.index === index && s.source === source
    )

    const rect = element.getBoundingClientRect()
    const slotPosition: SlotPosition = {
      index,
      source,
      element,
      centerX: rect.left + rect.width / 2,
      centerY: rect.top + rect.height / 2
    }

    if (existing !== -1) {
      registeredSlots.value[existing] = slotPosition
    } else {
      registeredSlots.value.push(slotPosition)
    }
  }

  const unregisterSlot = (index: number, source: DragSource) => {
    registeredSlots.value = registeredSlots.value.filter(
      (s) => !(s.index === index && s.source === source)
    )
  }

  const startDrag = (
    index: number,
    source: DragSource,
    slotData: InventorySlot,
    event: MouseEvent
  ) => {
    if (!slotData) return

    event.preventDefault()
    updateSlotPositions()

    isMouseDown.value = true
    isDraggingState.value = false

    dragState.value = {
      sourceIndex: index,
      sourceType: source,
      slotData,
      startX: event.clientX,
      startY: event.clientY,
      currentX: event.clientX,
      currentY: event.clientY
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  const onDrop = (handler: DropHandler) => {
    dropHandlers.add(handler)
    return () => dropHandlers.delete(handler)
  }

  const cancelDrag = () => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    isMouseDown.value = false
    isDraggingState.value = false
    dragState.value = null
    nearestSlot.value = null
  }

  return {
    isDragging,
    isHoldingItem,
    draggedItem,
    dragPosition,
    dragState,
    nearestSlot,
    registerSlot,
    unregisterSlot,
    startDrag,
    onDrop,
    cancelDrag,
    updateSlotPositions
  }
}
