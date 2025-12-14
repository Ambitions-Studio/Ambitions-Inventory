<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import type { NearbyPlayer } from '@/composables/useItemContextMenu'

const props = defineProps<{
  isOpen: boolean
  itemLabel: string
  players: NearbyPlayer[]
  maxQuantity: number
}>()

const emit = defineEmits<{
  confirm: [playerId: number, quantity: number]
  cancel: []
}>()

const selectedPlayerId = ref<number | null>(null)
const giveQuantity = ref(1)

const handleConfirm = () => {
  if (selectedPlayerId.value === null) return
  emit('confirm', selectedPlayerId.value, giveQuantity.value)
}

const handleCancel = () => {
  emit('cancel')
}

const selectPlayer = (playerId: number) => {
  selectedPlayerId.value = playerId
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    handleCancel()
  } else if (event.key === 'Enter' && selectedPlayerId.value !== null) {
    handleConfirm()
  }
}

watch(() => props.isOpen, (open) => {
  if (open) {
    selectedPlayerId.value = null
    giveQuantity.value = 1
    document.addEventListener('keydown', handleKeydown)
  } else {
    document.removeEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[150] flex items-center justify-center"
      >
        <div
          class="absolute inset-0 bg-black/50"
          @click="handleCancel"
        />

        <div class="relative w-[320px] select-none">
          <div class="relative rounded-xl border-2 border-solid border-slate-400/40 shadow-[0_16px_48px_rgba(0,0,0,0.6)]">
            <div class="absolute inset-0 rounded-xl bg-slate-900/90" />
            <div class="absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.1] to-transparent" />
            <div class="absolute inset-0 rounded-xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wMyIvPjwvc3ZnPg==')] opacity-50" />

            <div class="relative p-5">
              <h2 class="text-white text-base font-semibold text-center mb-4">
                Donner {{ itemLabel }}
              </h2>

              <div class="mb-4">
                <div class="flex justify-between text-sm text-slate-400 mb-2">
                  <span>Quantité</span>
                  <span class="text-white font-medium">{{ giveQuantity }}</span>
                </div>

                <input
                  v-model.number="giveQuantity"
                  type="range"
                  :min="1"
                  :max="maxQuantity"
                  class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-300"
                />

                <div class="flex justify-between text-xs text-slate-500 mt-1">
                  <span>1</span>
                  <span>{{ maxQuantity }}</span>
                </div>
              </div>

              <div v-if="players.length === 0" class="py-6 text-center">
                <p class="text-slate-400 text-sm">Aucun joueur à proximité</p>
              </div>

              <div v-else class="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
                <button
                  v-for="player in players"
                  :key="player.id"
                  class="w-full px-4 py-3 rounded-lg text-center transition-all duration-150 border-2 border-solid"
                  :class="[
                    selectedPlayerId === player.id
                      ? 'bg-slate-600/50 border-slate-400/60 text-white'
                      : 'bg-slate-800/40 border-slate-600/30 text-slate-300 hover:bg-slate-700/40 hover:border-slate-500/40'
                  ]"
                  @click="selectPlayer(player.id)"
                >
                  <span class="text-sm font-medium">{{ player.firstName }} {{ player.lastName }}</span>
                </button>
              </div>

              <div class="flex gap-3 mt-5">
                <button
                  class="flex-1 py-2.5 rounded-lg bg-red-500/20 border-2 border-solid border-red-500/40 text-red-400 text-sm font-medium hover:bg-red-500/30 hover:text-red-300 transition-all duration-150"
                  @click="handleCancel"
                >
                  Annuler
                </button>
                <button
                  class="flex-1 py-2.5 rounded-lg border-2 border-solid text-sm font-medium transition-all duration-150"
                  :class="[
                    selectedPlayerId !== null
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30 hover:text-emerald-300'
                      : 'bg-slate-700/30 border-slate-600/30 text-slate-500 cursor-not-allowed'
                  ]"
                  :disabled="selectedPlayerId === null"
                  @click="handleConfirm"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active {
  transition: opacity 0.2s ease-out;
}

.modal-enter-active > div:last-child {
  transition: opacity 0.2s ease-out, transform 0.2s ease-out;
}

.modal-leave-active {
  transition: opacity 0.15s ease-in;
}

.modal-leave-active > div:last-child {
  transition: opacity 0.15s ease-in, transform 0.15s ease-in;
}

.modal-enter-from {
  opacity: 0;
}

.modal-enter-from > div:last-child {
  opacity: 0;
  transform: scale(0.95);
}

.modal-leave-to {
  opacity: 0;
}

.modal-leave-to > div:last-child {
  opacity: 0;
  transform: scale(0.98);
}

</style>
