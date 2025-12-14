import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { ItemDefinition } from '@/types/item'
import { loadItemDefinitions } from '@/services/ItemDefinitionLoader'

export const useItemDefinitionsStore = defineStore('itemDefinitions', () => {
  const definitions = ref<Record<string, ItemDefinition>>({})
  const isLoaded = ref(false)
  const isLoading = ref(false)

  const count = computed(() => Object.keys(definitions.value).length)

  const getDefinition = (name: string): ItemDefinition | undefined => {
    return definitions.value[name]
  }

  const hasDefinition = (name: string): boolean => {
    return name in definitions.value
  }

  const getAllDefinitions = (): ItemDefinition[] => {
    return Object.values(definitions.value)
  }

  const addDefinition = (definition: ItemDefinition): void => {
    definitions.value[definition.name] = definition
  }

  const getDefinitionsByType = (type: 'item' | 'weapon'): ItemDefinition[] => {
    return getAllDefinitions().filter((def) => def.type === type)
  }

  const load = async (): Promise<void> => {
    if (isLoaded.value || isLoading.value) return

    isLoading.value = true

    try {
      const items = await loadItemDefinitions()
      definitions.value = items ?? {}
      isLoaded.value = true
    } finally {
      isLoading.value = false
    }
  }

  const reload = async (): Promise<void> => {
    isLoaded.value = false
    isLoading.value = false
    await load()
  }

  return {
    definitions,
    isLoaded,
    isLoading,
    count,
    getDefinition,
    hasDefinition,
    getAllDefinitions,
    addDefinition,
    getDefinitionsByType,
    load,
    reload
  }
})
