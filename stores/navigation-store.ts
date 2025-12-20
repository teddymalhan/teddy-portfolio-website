/**
 * Navigation Store
 * Manages all navigation-related state including scroll, UI, and menu state
 */

import { createStore } from './use-store'

interface CanvasDimensions {
  width: number
  height: number
}

interface NavigationState {
  // Resume state
  resumePath: string

  // Scroll state
  activeSection: string
  isVisible: boolean
  lastScrollY: number
  scrollProgress: number
  isMorphed: boolean
  isNavContentVisible: boolean

  // UI state
  isMobileMenuOpen: boolean
  commandOpen: boolean
  canvasDimensions: CanvasDimensions

  // Actions - Resume
  setResumePath: (path: string) => void
  fetchResumePath: (isResumeVisible: boolean) => Promise<void>

  // Actions - Scroll
  setActiveSection: (section: string) => void
  setIsVisible: (visible: boolean) => void
  setLastScrollY: (y: number) => void
  setScrollProgress: (progress: number) => void
  setIsMorphed: (morphed: boolean) => void
  setIsNavContentVisible: (visible: boolean) => void
  handleScroll: (
    prefersReducedMotion: boolean,
    navItems: Array<{ href: string }>,
  ) => void

  // Actions - UI
  setIsMobileMenuOpen: (open: boolean) => void
  toggleMobileMenu: () => void
  setCommandOpen: (open: boolean) => void
  toggleCommand: () => void
  setCanvasDimensions: (dimensions: CanvasDimensions) => void
  updateCanvasDimensions: () => void
}

export const useNavigationStore = createStore<NavigationState>(
  'NavigationStore',
  (set, get) => ({
    // Initial state
    resumePath: '/Teddy_Malhan_Resume.pdf',
    activeSection: '',
    isVisible: true,
    lastScrollY: 0,
    scrollProgress: 1, // Always keep at 1 for morphed state
    isMorphed: true, // Always morphed (centered navbar)
    isNavContentVisible: true,
    isMobileMenuOpen: false,
    commandOpen: false,
    canvasDimensions: {
      width: typeof window !== 'undefined' ? window.innerWidth : 800,
      height: typeof window !== 'undefined' ? window.innerHeight : 600,
    },

    // Resume actions
    setResumePath: (path) => set({ resumePath: path }),

    fetchResumePath: async (isResumeVisible: boolean) => {
      if (!isResumeVisible) return

      try {
        const res = await fetch('/api/resume', {
          next: { revalidate: 300 }, // Revalidate every 5 minutes
        })
        if (res.ok) {
          const data = await res.json()
          // Use resume ID + timestamp as cache-buster
          const timestamp = Date.now()
          set({
            resumePath: `/Teddy_Malhan_Resume.pdf?v=${data.id}&t=${timestamp}`,
          })
        }
      } catch (error) {
        console.error('Failed to fetch resume info:', error)
        // Fallback to timestamp-based cache-busting
        set({ resumePath: `/Teddy_Malhan_Resume.pdf?t=${Date.now()}` })
      }
    },

    // Scroll actions
    setActiveSection: (section) => set({ activeSection: section }),
    setIsVisible: (visible) => set({ isVisible: visible }),
    setLastScrollY: (y) => set({ lastScrollY: y }),
    setScrollProgress: (progress) => set({ scrollProgress: progress }),
    setIsMorphed: (morphed) => set({ isMorphed: morphed }),
    setIsNavContentVisible: (visible) =>
      set({ isNavContentVisible: visible }),

    handleScroll: (prefersReducedMotion, navItems) => {
      if (typeof window === 'undefined') return

      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight

      // Navigation always visible
      set({ isVisible: true, lastScrollY: scrollPosition })

      // If near top, mark home as active
      if (scrollPosition < windowHeight / 2) {
        set({ activeSection: 'home' })
        return
      }

      // Check which section we're currently in
      let currentSection = ''
      for (const item of navItems) {
        const sectionId = item.href.slice(1)
        const element = document.getElementById(sectionId)
        if (element) {
          const rect = element.getBoundingClientRect()
          const elementTop = rect.top + scrollPosition
          const elementHeight = rect.height
          const navOffset = 100

          if (
            scrollPosition + navOffset >= elementTop &&
            scrollPosition + navOffset < elementTop + elementHeight
          ) {
            currentSection = sectionId
          }
        }
      }

      if (currentSection) {
        set({ activeSection: currentSection })
      }
    },

    // UI actions
    setIsMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
    toggleMobileMenu: () =>
      set((state: NavigationState) => ({
        isMobileMenuOpen: !state.isMobileMenuOpen,
      })),
    setCommandOpen: (open) => set({ commandOpen: open }),
    toggleCommand: () =>
      set((state: NavigationState) => ({
        commandOpen: !state.commandOpen,
      })),
    setCanvasDimensions: (dimensions) => set({ canvasDimensions: dimensions }),
    updateCanvasDimensions: () => {
      if (typeof window === 'undefined') return
      set({
        canvasDimensions: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      })
    },
  }),
  {
    persist: false, // Don't persist navigation state
  }
)
