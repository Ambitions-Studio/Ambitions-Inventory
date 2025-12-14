<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const settingsStore = useSettingsStore()

const primaryColor = ref(settingsStore.settings.primaryColor)
const secondaryColor = ref(settingsStore.settings.secondaryColor)
const borderColor = ref(settingsStore.settings.borderColor)
const opacity = ref(settingsStore.settings.opacity)
const borderRadius = ref(settingsStore.settings.borderRadius)
const textColor = ref(settingsStore.settings.textColor)
const weightColor = ref(settingsStore.settings.weightColor)
const titleColor = ref(settingsStore.settings.titleColor)

const updatePrimaryColor = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  primaryColor.value = value
  settingsStore.updateSettings({ primaryColor: value })
}

const updateSecondaryColor = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  secondaryColor.value = value
  settingsStore.updateSettings({ secondaryColor: value })
}

const updateBorderColor = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  borderColor.value = value
  settingsStore.updateSettings({ borderColor: value })
}

const updateOpacity = (event: Event) => {
  const value = parseFloat((event.target as HTMLInputElement).value)
  opacity.value = value
  settingsStore.updateSettings({ opacity: value })
}

const updateBorderRadius = (event: Event) => {
  const value = parseFloat((event.target as HTMLInputElement).value)
  borderRadius.value = value
  settingsStore.updateSettings({ borderRadius: value })
}

const updateTextColor = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  textColor.value = value
  settingsStore.updateSettings({ textColor: value })
}

const updateWeightColor = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  weightColor.value = value
  settingsStore.updateSettings({ weightColor: value })
}

const updateTitleColor = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  titleColor.value = value
  settingsStore.updateSettings({ titleColor: value })
}

const resetToDefaults = () => {
  settingsStore.resetSettings()
  const defaults = settingsStore.getDefaultSettings()
  primaryColor.value = defaults.primaryColor
  secondaryColor.value = defaults.secondaryColor
  borderColor.value = defaults.borderColor
  opacity.value = defaults.opacity
  borderRadius.value = defaults.borderRadius
  textColor.value = defaults.textColor
  weightColor.value = defaults.weightColor
  titleColor.value = defaults.titleColor
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    emit('close')
  }
}

watch(() => props.isOpen, (open) => {
  if (open) {
    const current = settingsStore.settings
    primaryColor.value = current.primaryColor
    secondaryColor.value = current.secondaryColor
    borderColor.value = current.borderColor
    opacity.value = current.opacity
    borderRadius.value = current.borderRadius
    textColor.value = current.textColor
    weightColor.value = current.weightColor
    titleColor.value = current.titleColor
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
  <div class="w-[500px] relative">
    <div class="relative rounded-xl border-2 border-solid border-slate-400/40 shadow-[0_16px_48px_rgba(0,0,0,0.6)] overflow-hidden">
      <div class="absolute inset-0 bg-slate-900/95" />
      <div class="absolute inset-0 bg-gradient-to-b from-white/[0.08] to-transparent" />
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wMyIvPjwvc3ZnPg==')] opacity-50" />

      <div class="relative flex flex-col p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-white text-2xl font-bold">Paramètres</h2>
          <button
            class="w-9 h-9 rounded-full bg-slate-700/80 border border-solid border-slate-500/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-600/80 transition-all duration-150"
            @click="$emit('close')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="flex flex-col gap-5">
          <div class="flex items-center justify-between py-2">
            <span class="text-white text-base font-medium">Couleur primaire</span>
            <div class="flex items-center gap-3">
              <span class="text-slate-400 text-sm font-mono uppercase">{{ primaryColor }}</span>
              <input
                type="color"
                :value="primaryColor"
                class="w-20 h-10 rounded-lg cursor-pointer border-2 border-solid border-slate-500/50 bg-transparent"
                @input="updatePrimaryColor"
              />
            </div>
          </div>

          <div class="flex items-center justify-between py-2">
            <span class="text-white text-base font-medium">Couleur secondaire</span>
            <div class="flex items-center gap-3">
              <span class="text-slate-400 text-sm font-mono uppercase">{{ secondaryColor }}</span>
              <input
                type="color"
                :value="secondaryColor"
                class="w-20 h-10 rounded-lg cursor-pointer border-2 border-solid border-slate-500/50 bg-transparent"
                @input="updateSecondaryColor"
              />
            </div>
          </div>

          <div class="flex items-center justify-between py-2">
            <span class="text-white text-base font-medium">Couleur bordures</span>
            <div class="flex items-center gap-3">
              <span class="text-slate-400 text-sm font-mono uppercase">{{ borderColor }}</span>
              <input
                type="color"
                :value="borderColor"
                class="w-20 h-10 rounded-lg cursor-pointer border-2 border-solid border-slate-500/50 bg-transparent"
                @input="updateBorderColor"
              />
            </div>
          </div>

          <div class="h-px bg-slate-600/50 my-2" />

          <div class="flex items-center justify-between py-2">
            <span class="text-white text-base font-medium">Couleur du texte</span>
            <div class="flex items-center gap-3">
              <span class="text-slate-400 text-sm font-mono uppercase">{{ textColor }}</span>
              <input
                type="color"
                :value="textColor"
                class="w-20 h-10 rounded-lg cursor-pointer border-2 border-solid border-slate-500/50 bg-transparent"
                @input="updateTextColor"
              />
            </div>
          </div>

          <div class="flex items-center justify-between py-2">
            <span class="text-white text-base font-medium">Couleur du poids</span>
            <div class="flex items-center gap-3">
              <span class="text-slate-400 text-sm font-mono uppercase">{{ weightColor }}</span>
              <input
                type="color"
                :value="weightColor"
                class="w-20 h-10 rounded-lg cursor-pointer border-2 border-solid border-slate-500/50 bg-transparent"
                @input="updateWeightColor"
              />
            </div>
          </div>

          <div class="flex items-center justify-between py-2">
            <span class="text-white text-base font-medium">Couleur des titres</span>
            <div class="flex items-center gap-3">
              <span class="text-slate-400 text-sm font-mono uppercase">{{ titleColor }}</span>
              <input
                type="color"
                :value="titleColor"
                class="w-20 h-10 rounded-lg cursor-pointer border-2 border-solid border-slate-500/50 bg-transparent"
                @input="updateTitleColor"
              />
            </div>
          </div>

          <div class="h-px bg-slate-600/50 my-2" />

          <div class="flex flex-col gap-3 py-2">
            <div class="flex justify-between items-center">
              <span class="text-white text-base font-medium">Opacité</span>
              <span class="text-white text-base font-semibold bg-slate-700/80 px-3 py-1 rounded-lg">{{ Math.round(opacity * 100) }}%</span>
            </div>
            <input
              type="range"
              :value="opacity"
              min="0"
              max="1"
              step="0.05"
              class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-300"
              @input="updateOpacity"
            />
          </div>

          <div class="flex flex-col gap-3 py-2">
            <div class="flex justify-between items-center">
              <span class="text-white text-base font-medium">Arrondi des angles</span>
              <span class="text-white text-base font-semibold bg-slate-700/80 px-3 py-1 rounded-lg">{{ Math.round(borderRadius * 100) }}%</span>
            </div>
            <input
              type="range"
              :value="borderRadius"
              min="0"
              max="1"
              step="0.05"
              class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-300"
              @input="updateBorderRadius"
            />
          </div>
        </div>

        <div class="mt-6 flex gap-3">
          <button
            class="flex-1 py-3 rounded-lg bg-slate-700/50 border-2 border-solid border-slate-500/40 text-slate-300 text-base font-semibold hover:bg-slate-600/50 hover:text-white transition-all duration-150"
            @click="resetToDefaults"
          >
            Réinitialiser
          </button>
          <button
            class="flex-1 py-3 rounded-lg bg-emerald-500/20 border-2 border-solid border-emerald-500/40 text-emerald-400 text-base font-semibold hover:bg-emerald-500/30 hover:text-emerald-300 transition-all duration-150"
            @click="$emit('close')"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type="color"] {
  -webkit-appearance: none;
  padding: 0;
}

input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 3px;
}

input[type="color"]::-webkit-color-swatch {
  border: none;
  border-radius: 6px;
}
</style>
