import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface InventorySettings {
  primaryColor: string
  secondaryColor: string
  borderColor: string
  opacity: number
  borderRadius: number
  textColor: string
  weightColor: string
  titleColor: string
}

const DEFAULT_SETTINGS: InventorySettings = {
  primaryColor: '#334155',
  secondaryColor: '#1e293b',
  borderColor: '#475569',
  opacity: 0.9,
  borderRadius: 0.5,
  textColor: '#ffffff',
  weightColor: '#ffffff',
  titleColor: '#ffffff'
}

export const useSettingsStore = defineStore('settings', () => {
  const customSettings = ref<InventorySettings | null>(null)

  const settings = computed<InventorySettings>(() => {
    return customSettings.value ?? DEFAULT_SETTINGS
  })

  const hasCustomSettings = computed(() => {
    return customSettings.value !== null
  })

  function updateSettings(newSettings: Partial<InventorySettings>): void {
    const current = customSettings.value ?? { ...DEFAULT_SETTINGS }
    customSettings.value = {
      ...current,
      ...newSettings
    }
  }

  function resetSettings(): void {
    customSettings.value = null
  }

  function getDefaultSettings(): InventorySettings {
    return { ...DEFAULT_SETTINGS }
  }

  return {
    customSettings,
    settings,
    hasCustomSettings,
    updateSettings,
    resetSettings,
    getDefaultSettings
  }
})
