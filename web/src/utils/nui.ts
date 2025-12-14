import axios, { type AxiosInstance, type AxiosResponse } from 'axios'

const RESOURCE_NAME = 'Ambitions-Inventory'

const nuiClient: AxiosInstance = axios.create({
  baseURL: `https://${RESOURCE_NAME}`,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

nuiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.warn(`[NUI] Request failed:`, error.config?.url, error.message)
    }
    return Promise.reject(error)
  }
)

export type { NuiCallbackResponse } from '@/types/nui'

/**
 * Send a NUI callback and wait for a response from Lua
 *
 * @param eventName - The name of the NUI callback registered in Lua with RegisterNUICallback
 * @param data - Optional data to send with the callback
 * @returns The response data from Lua or null if the request failed
 *
 * @example
 * const result = await sendNuiCallback<{ slotId: number }, { success: boolean }>('moveItem', { slotId: 1 })
 * if (result?.success) {
 *   console.log('Item moved successfully')
 * }
 */
export async function sendNuiCallback<T = unknown, R = unknown>(
  eventName: string,
  data?: T
): Promise<R | null> {
  try {
    const response = await nuiClient.post<R>(eventName, data || {})
    return response.data
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error(`[NUI] Failed to send callback "${eventName}":`, error)
    }
    return null
  }
}

/**
 * Send a NUI event without waiting for a response (fire and forget)
 *
 * @param eventName - The name of the NUI callback registered in Lua with RegisterNUICallback
 * @param data - Optional data to send with the event
 * @returns True if the event was sent successfully, false otherwise
 *
 * @example
 * sendNuiEvent('closeInventory')
 * sendNuiEvent('dropItem', { slotIndex: 1, quantity: 5 })
 */
export async function sendNuiEvent<T = unknown>(eventName: string, data?: T): Promise<boolean> {
  try {
    await nuiClient.post(eventName, data || {})
    return true
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error(`[NUI] Failed to send event "${eventName}":`, error)
    }
    return false
  }
}

export default {
  sendNuiCallback,
  sendNuiEvent,
}
