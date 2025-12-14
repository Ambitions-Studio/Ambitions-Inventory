<script setup lang="ts">
import { ref, watch, onUnmounted, nextTick } from 'vue'

const props = defineProps<{
  isOpen: boolean
  itemLabel: string
}>()

const emit = defineEmits<{
  confirm: [newLabel: string]
  cancel: []
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const inputValue = ref('')

const MAX_LABEL_LENGTH = 32

const handleConfirm = () => {
  const trimmed = inputValue.value.trim()
  if (trimmed.length === 0) return

  const sanitized = trimmed.slice(0, MAX_LABEL_LENGTH)
  emit('confirm', sanitized)
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

watch(() => props.isOpen, (open) => {
  if (open) {
    inputValue.value = ''
    document.addEventListener('keydown', handleKeydown)
    nextTick(() => {
      inputRef.value?.focus()
    })
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
                Renommer {{ itemLabel }}
              </h2>

              <input
                ref="inputRef"
                v-model="inputValue"
                type="text"
                :maxlength="MAX_LABEL_LENGTH"
                placeholder="Nouveau nom..."
                class="w-full px-4 py-3 rounded-lg bg-slate-800/60 border-2 border-solid border-white/30 text-white text-sm placeholder-slate-500 outline-none focus:border-white/50 transition-colors duration-150"
              />

              <div class="flex gap-3 mt-5">
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
