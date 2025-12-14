<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { useItemContextMenu } from '@/composables/useItemContextMenu'

const { isOpen, position, visibleOptions, currentDefinition, closeMenu, selectAction } = useItemContextMenu()

const menuRef = ref<HTMLElement | null>(null)
const menuPosition = ref({ x: 0, y: 0 })

const PADDING = 16

const updatePosition = () => {
  if (!isOpen.value) return

  const menuWidth = 180
  const menuHeight = visibleOptions.value.length * 38 + 70

  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  let x = position.value.x
  let y = position.value.y

  if (x + menuWidth > viewportWidth - PADDING) {
    x = position.value.x - menuWidth
  }

  if (y + menuHeight > viewportHeight - PADDING) {
    y = viewportHeight - menuHeight - PADDING
  }

  if (x < PADDING) x = PADDING
  if (y < PADDING) y = PADDING

  menuPosition.value = { x, y }
}

const handleClickOutside = (event: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    closeMenu()
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeMenu()
  }
}

watch(() => isOpen.value, (open) => {
  if (open) {
    updatePosition()
    setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeydown)
    }, 0)
  } else {
    document.removeEventListener('mousedown', handleClickOutside)
    document.removeEventListener('keydown', handleKeydown)
  }
})

watch(() => position.value, updatePosition)

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="context-menu">
      <div
        v-if="isOpen"
        ref="menuRef"
        class="fixed z-[100] w-[180px] select-none"
        :style="{
          left: `${menuPosition.x}px`,
          top: `${menuPosition.y}px`
        }"
      >
        <div class="relative rounded-xl border-2 border-solid border-slate-400/40 shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)]">
          <div class="absolute inset-0 rounded-xl bg-slate-900/80" />
          <div class="absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.12] to-transparent" />
          <div class="absolute inset-0 rounded-xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wMyIvPjwvc3ZnPg==')] opacity-50" />

          <div class="relative py-2">
            <div v-if="currentDefinition" class="px-3 py-2 mb-1">
              <p class="text-white/80 text-xs font-semibold uppercase tracking-widest text-center">
                {{ currentDefinition.label }}
              </p>
              <div class="mt-2 h-px bg-gradient-to-r from-transparent via-slate-400/30 to-transparent" />
            </div>

            <div class="space-y-0.5 px-1.5 pb-1">
              <button
                v-for="option in visibleOptions"
                :key="option.action"
                class="group w-full px-2.5 py-2 text-center rounded-lg transition-all duration-150 hover:bg-white/[0.06] border border-solid border-transparent hover:border-slate-400/20"
                :class="{ 'opacity-40 cursor-not-allowed': option.disabled }"
                :disabled="option.disabled"
                @click="selectAction(option.action)"
              >
                <span class="text-slate-300/90 text-[13px] group-hover:text-white transition-colors duration-150">
                  {{ option.label }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.context-menu-enter-active {
  transition: opacity 0.2s ease-out, transform 0.2s ease-out;
}

.context-menu-leave-active {
  transition: opacity 0.12s ease-in, transform 0.12s ease-in;
}

.context-menu-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(-4px);
}

.context-menu-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>
