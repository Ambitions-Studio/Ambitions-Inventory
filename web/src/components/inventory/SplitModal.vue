<script setup lang="ts">
import { ref, watch, onUnmounted, computed } from 'vue'

const props = defineProps<{
  isOpen: boolean
  itemLabel: string
  maxQuantity: number
}>()

const emit = defineEmits<{
  confirm: [quantity: number]
  cancel: []
}>()

const splitQuantity = ref(1)

const handleConfirm = () => {
  if (splitQuantity.value < 1 || splitQuantity.value >= props.maxQuantity) return
  emit('confirm', splitQuantity.value)
}

const handleCancel = () => {
  emit('cancel')
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    handleCancel()
  } else if (event.key === 'Enter') {
    handleConfirm()
  }
}

const remainingQuantity = computed(() => {
  return props.maxQuantity - splitQuantity.value
})

watch(() => props.isOpen, (open) => {
  if (open) {
    splitQuantity.value = 1
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
                Séparer {{ itemLabel }}
              </h2>

              <div class="flex justify-between text-sm text-slate-400 mb-2">
                <span>Quantité à séparer</span>
                <span class="text-white font-medium">{{ splitQuantity }}</span>
              </div>

              <input
                v-model.number="splitQuantity"
                type="range"
                :min="1"
                :max="maxQuantity - 1"
                class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-300"
              />

              <div class="flex justify-between text-xs text-slate-500 mt-1 mb-4">
                <span>1</span>
                <span>{{ maxQuantity - 1 }}</span>
              </div>

              <div class="flex justify-center gap-6 text-sm text-slate-300 mb-4">
                <div class="text-center">
                  <p class="text-slate-500 text-xs mb-1">Reste</p>
                  <p class="text-white font-medium">{{ remainingQuantity }}</p>
                </div>
                <div class="text-center">
                  <p class="text-slate-500 text-xs mb-1">Séparé</p>
                  <p class="text-white font-medium">{{ splitQuantity }}</p>
                </div>
              </div>

              <div class="flex gap-3">
                <button
                  class="flex-1 py-2.5 rounded-lg bg-red-500/20 border-2 border-solid border-red-500/40 text-red-400 text-sm font-medium hover:bg-red-500/30 hover:text-red-300 transition-all duration-150"
                  @click="handleCancel"
                >
                  Annuler
                </button>
                <button
                  class="flex-1 py-2.5 rounded-lg bg-emerald-500/20 border-2 border-solid border-emerald-500/40 text-emerald-400 text-sm font-medium hover:bg-emerald-500/30 hover:text-emerald-300 transition-all duration-150"
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
