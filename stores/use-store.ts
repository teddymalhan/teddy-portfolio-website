/**
 * Zustand store utilities and types
 */

import { create, StateCreator } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

/**
 * Helper function to create a store with devtools and optional persistence
 */
export function createStore<T>(
  name: string,
  initializer: StateCreator<T, [], [], T>,
  options?: {
    persist?: boolean
    storageKey?: string
  }
) {
  if (options?.persist) {
    return create<T>()(
      devtools(
        persist(initializer, {
          name: options.storageKey || name,
        }),
        { name }
      )
    )
  }

  return create<T>()(devtools(initializer, { name }))
}
