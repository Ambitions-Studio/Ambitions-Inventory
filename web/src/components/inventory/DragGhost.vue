<script setup lang="ts">
import { computed } from 'vue'
import { useDragAndDrop } from '@/composables/useDragAndDrop'
import { useItemDefinitionsStore } from '@/stores/itemDefinitions'

const { isDragging, draggedItem, dragPosition } = useDragAndDrop()
const itemDefinitionsStore = useItemDefinitionsStore()

const definition = computed(() => {
  if (!draggedItem.value) return undefined
  return itemDefinitionsStore.getDefinition(draggedItem.value.name)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isDragging && draggedItem && definition"
      class="fixed pointer-events-none z-[100] w-20 h-20 -translate-x-1/2 -translate-y-1/2"
      :style="{
        left: `${dragPosition.x}px`,
        top: `${dragPosition.y}px`
      }"
    >
      <div class="w-full h-full rounded-lg bg-gradient-to-b from-slate-700/90 to-slate-800/90 border-2 border-solid border-slate-300 shadow-[0_0_20px_rgba(148,163,184,0.3)] flex items-center justify-center">
        <img
          v-if="definition.image"
          :src="`/images/${definition.image}`"
          :alt="definition.label"
          class="w-14 h-14 object-contain drop-shadow-lg"
        />
        <span v-else class="text-slate-400 text-sm uppercase">
          {{ definition.name.slice(0, 3) }}
        </span>
      </div>
      <div class="absolute -bottom-1 -right-1 bg-slate-900 border border-slate-600 rounded px-1.5 py-0.5 text-xs text-white font-medium">
        x{{ draggedItem.quantity }}
      </div>
    </div>
  </Teleport>
</template>
