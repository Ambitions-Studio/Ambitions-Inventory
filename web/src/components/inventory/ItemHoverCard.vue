<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { InventorySlot } from '@/services/InventoryService'
import type { ItemDefinition } from '@/types/item'

const props = defineProps<{
  slotData: InventorySlot
  definition: ItemDefinition | undefined
  anchorX: number
  anchorY: number
  visible: boolean
}>()

const cardRef = ref<HTMLElement | null>(null)
const cardWidth = ref(280)
const cardHeight = ref(200)
const position = ref({ x: 0, y: 0 })

const PADDING = 12

const updatePosition = () => {
  if (!props.visible) return

  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  let x = props.anchorX + PADDING
  let y = props.anchorY

  if (x + cardWidth.value > viewportWidth - PADDING) {
    x = props.anchorX - cardWidth.value - PADDING
  }

  if (y + cardHeight.value > viewportHeight - PADDING) {
    y = viewportHeight - cardHeight.value - PADDING
  }

  if (y < PADDING) {
    y = PADDING
  }

  if (x < PADDING) {
    x = PADDING
  }

  position.value = { x, y }
}

const updateCardDimensions = () => {
  if (cardRef.value) {
    cardWidth.value = cardRef.value.offsetWidth
    cardHeight.value = cardRef.value.offsetHeight
  }
}

watch(() => [props.anchorX, props.anchorY, props.visible], () => {
  updatePosition()
})

onMounted(() => {
  updateCardDimensions()
  updatePosition()
  window.addEventListener('resize', updatePosition)
})

onUnmounted(() => {
  window.removeEventListener('resize', updatePosition)
})

const formattedWeight = computed(() => {
  if (!props.definition) return '0kg'
  return `${(props.definition.weight / 1000).toFixed(1)}kg`
})

const displayLabel = computed(() => {
  const customLabel = props.slotData?.metadata?.customLabel as string | undefined
  if (customLabel && customLabel.trim().length > 0) {
    return customLabel
  }
  return props.definition?.label ?? ''
})

const filteredMetadata = computed(() => {
  if (!props.slotData?.metadata) return null
  const metadata = { ...props.slotData.metadata } as Record<string, unknown>
  delete metadata.customLabel
  if (Object.keys(metadata).length === 0) return null
  return metadata
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="visible && slotData && definition"
        ref="cardRef"
        class="fixed z-50 w-[280px] pointer-events-none"
        :style="{
          left: `${position.x}px`,
          top: `${position.y}px`
        }"
      >
        <div class="relative rounded-xl border-2 border-solid border-slate-500/50 shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-slate-800/95 via-slate-900/95 to-slate-950/95" />
          <div class="absolute inset-0 bg-gradient-to-t from-transparent via-white/[0.03] to-white/[0.06]" />
          <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNCIvPjwvc3ZnPg==')] opacity-50" />
          <div class="relative p-4 flex gap-4">
            <div class="w-20 h-20 flex-shrink-0 rounded-lg bg-slate-700/50 flex items-center justify-center">
              <img
                v-if="definition.image"
                :src="`images/${definition.image}`"
                :alt="definition.label"
                class="w-16 h-16 object-contain drop-shadow-lg"
              />
              <span v-else class="text-slate-400 text-base uppercase">
                {{ definition.name.slice(0, 3) }}
              </span>
            </div>

            <div class="flex flex-col justify-center min-w-0">
              <h3 class="text-white font-bold text-base truncate">
                {{ displayLabel }}
              </h3>
              <div class="flex items-center gap-2 text-xs text-slate-400">
                <span>{{ formattedWeight }}</span>
                <span>•</span>
                <span>x{{ slotData.quantity }}</span>
              </div>
            </div>
          </div>

          <div v-if="definition.description" class="relative px-4 pb-4">
            <p class="text-sm text-slate-300 leading-relaxed text-center">
              {{ definition.description }}
            </p>
            <div v-if="filteredMetadata" class="mt-3 mx-auto w-3/4 h-[2px] bg-gradient-to-r from-transparent via-slate-400 to-transparent" />
          </div>

          <div v-if="filteredMetadata" class="relative px-4 pb-4">
            <div class="flex flex-col gap-1">
              <div
                v-for="(value, key) in filteredMetadata"
                :key="key"
                class="text-sm text-slate-300 text-center"
              >
                <span class="text-slate-400">{{ key }}:</span> {{ value }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
