import type { ItemDefinition } from '@/types/item'
import { mockItems } from '@/data/mockItems'
import { sendNuiCallback } from '@/utils/nui'

const isDevelopment = import.meta.env.DEV

export async function loadItemDefinitions(): Promise<Record<string, ItemDefinition>> {
  if (isDevelopment) {
    console.info(`[ItemDefinitions] DEV: Loaded ${Object.keys(mockItems).length} mock items`)
    return mockItems
  }

  const items = await sendNuiCallback<undefined, Record<string, ItemDefinition>>('getItemDefinitions')

  if (items) {
    const itemNames = Object.keys(items)
    console.info(`[ItemDefinitions] PROD: Loaded ${itemNames.length} items from Lua`)
    console.table(
      itemNames.map((name) => {
        const item = items[name]
        return {
          name,
          label: item?.label,
          type: item?.type,
          weight: item?.weight
        }
      })
    )
  } else {
    console.warn('[ItemDefinitions] PROD: Failed to load items from Lua')
  }

  return items ?? {}
}
