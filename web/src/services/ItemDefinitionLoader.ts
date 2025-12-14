import type { ItemDefinition } from '@/types/item'
import { mockItems } from '@/data/mockItems'
import { sendNuiCallback } from '@/utils/nui'

const isDevelopment = import.meta.env.DEV

export async function loadItemDefinitions(): Promise<Record<string, ItemDefinition>> {
  if (isDevelopment) {
    console.info(`[ItemDefinitions] Loaded ${Object.keys(mockItems).length} mock items`)
    return mockItems
  }

  const items = await sendNuiCallback<undefined, Record<string, ItemDefinition>>('getItemDefinitions')
  return items ?? {}
}
