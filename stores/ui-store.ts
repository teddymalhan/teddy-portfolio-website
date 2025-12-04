/**
 * UI State Store
 * Manages UI-related state like modals, sidebars, etc.
 */

import { createStore } from './use-store'

interface UIState {
  // Sidebar state
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void

  // Modal states
  modals: Record<string, boolean>
  openModal: (modalId: string) => void
  closeModal: (modalId: string) => void
  isModalOpen: (modalId: string) => boolean

  // Loading states
  loading: Record<string, boolean>
  setLoading: (key: string, isLoading: boolean) => void
  isLoading: (key: string) => boolean
}

export const useUIStore = createStore<UIState>(
  'UIStore',
  (set, get) => ({
    // Sidebar
    sidebarOpen: false,
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    toggleSidebar: () => set((state: UIState) => ({ sidebarOpen: !state.sidebarOpen })),

    // Modals
    modals: {},
    openModal: (modalId) =>
      set((state: UIState) => ({
        modals: { ...state.modals, [modalId]: true },
      })),
    closeModal: (modalId) =>
      set((state: UIState) => ({
        modals: { ...state.modals, [modalId]: false },
      })),
    isModalOpen: (modalId) => get().modals[modalId] ?? false,

    // Loading states
    loading: {},
    setLoading: (key, isLoading) =>
      set((state: UIState) => ({
        loading: { ...state.loading, [key]: isLoading },
      })),
    isLoading: (key) => get().loading[key] ?? false,
  }),
  {
    persist: false, // Don't persist UI state
  }
)
