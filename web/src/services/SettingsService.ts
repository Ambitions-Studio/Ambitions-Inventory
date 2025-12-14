import type { InventorySettings } from '@/stores/settings'

export function hexToRgba(hex: string, opacity: number): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result || !result[1] || !result[2] || !result[3]) return hex

  const r = parseInt(result[1], 16)
  const g = parseInt(result[2], 16)
  const b = parseInt(result[3], 16)

  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

export function generateSlotStyle(settings: InventorySettings): Record<string, string> {
  const borderRadiusValue = `${settings.borderRadius * 16}px`

  return {
    '--slot-primary': hexToRgba(settings.primaryColor, settings.opacity),
    '--slot-secondary': hexToRgba(settings.secondaryColor, settings.opacity),
    '--slot-border': settings.borderColor,
    '--slot-radius': borderRadiusValue
  }
}

export function generateContainerStyle(settings: InventorySettings): Record<string, string> {
  return {
    '--slot-primary': hexToRgba(settings.primaryColor, settings.opacity),
    '--slot-secondary': hexToRgba(settings.secondaryColor, settings.opacity),
    '--slot-border': settings.borderColor,
    '--slot-radius': `${settings.borderRadius * 16}px`
  }
}
