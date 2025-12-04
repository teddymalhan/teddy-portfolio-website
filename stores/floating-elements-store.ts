/**
 * Floating Elements Store
 * Manages state for animated floating background elements
 */

import { createStore } from './use-store'

export interface FloatingElement {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
  scale: number
  scaleDirection: number
  type: 'cube' | 'star' | 'circle' | 'triangle'
  color: string
  size: number
}

interface FloatingElementsState {
  elements: FloatingElement[]
  isActive: boolean
  
  // Actions
  setElements: (elements: FloatingElement[]) => void
  updateElement: (id: number, updates: Partial<FloatingElement>) => void
  updateAllElements: (updater: (element: FloatingElement) => FloatingElement) => void
  setIsActive: (active: boolean) => void
  initializeElements: () => void
}

const getContentExclusionZones = () => {
  if (typeof window === 'undefined') return []
  
  return [
    // Hero section - center area
    {
      x: window.innerWidth * 0.2,
      y: window.innerHeight * 0.15,
      width: window.innerWidth * 0.6,
      height: window.innerHeight * 0.7,
    },
    // About section - assume it's below hero
    {
      x: window.innerWidth * 0.1,
      y: window.innerHeight * 0.9,
      width: window.innerWidth * 0.8,
      height: window.innerHeight * 0.6,
    },
    // Experience section
    {
      x: window.innerWidth * 0.1,
      y: window.innerHeight * 1.6,
      width: window.innerWidth * 0.8,
      height: window.innerHeight * 0.8,
    },
    // Projects section
    {
      x: window.innerWidth * 0.1,
      y: window.innerHeight * 2.5,
      width: window.innerWidth * 0.8,
      height: window.innerHeight * 0.8,
    },
    // Contact section
    {
      x: window.innerWidth * 0.1,
      y: window.innerHeight * 3.4,
      width: window.innerWidth * 0.8,
      height: window.innerHeight * 0.6,
    },
  ]
}

const isInExclusionZone = (x: number, y: number, size: number) => {
  const zones = getContentExclusionZones()
  return zones.some(
    (zone) =>
      x + size > zone.x &&
      x < zone.x + zone.width &&
      y + size > zone.y &&
      y < zone.y + zone.height,
  )
}

export const useFloatingElementsStore = createStore<FloatingElementsState>(
  'FloatingElementsStore',
  (set, get) => ({
    elements: [],
    isActive: true,

    setElements: (elements) => set({ elements }),

    updateElement: (id, updates) => {
      set((state: FloatingElementsState) => ({
        elements: state.elements.map((el) =>
          el.id === id ? { ...el, ...updates } : el,
        ),
      }))
    },

    updateAllElements: (updater) => {
      set((state: FloatingElementsState) => ({
        elements: state.elements.map(updater),
      }))
    },

    setIsActive: (active) => set({ isActive: active }),

    initializeElements: () => {
      const colors = [
        '#4F8EF7',
        '#7C3AED',
        '#F59E0B',
        '#EF4444',
        '#3B82F6',
        '#EC4899',
        '#06B6D4',
      ]
      const types: FloatingElement['type'][] = [
        'cube',
        'star',
        'circle',
        'triangle',
      ]

      const newElements: FloatingElement[] = []

      if (typeof window === 'undefined') {
        set({ elements: newElements })
        return
      }

      for (let i = 0; i < 15; i++) {
        let x, y
        let attempts = 0

        do {
          const isLeftSide = Math.random() > 0.5
          x = isLeftSide
            ? Math.random() * (window.innerWidth * 0.2) // Left 20% of screen
            : window.innerWidth * 0.8 +
              Math.random() * (window.innerWidth * 0.2) // Right 20% of screen

          y = Math.random() * window.innerHeight * 4 // Account for full page height
          attempts++
        } while (isInExclusionZone(x, y, 40) && attempts < 50)

        newElements.push({
          id: i,
          x,
          y,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 1,
          scale: Math.random() * 0.3 + 0.3,
          scaleDirection: Math.random() > 0.5 ? 1 : -1,
          type: types[Math.floor(Math.random() * types.length)],
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 20 + 10,
        })
      }

      set({ elements: newElements })
    },
  }),
  {
    persist: false, // Don't persist animation state
  }
)

// Export animation logic helper
export const animateFloatingElements = (
  updateAllElements: (updater: (element: FloatingElement) => FloatingElement) => void,
  isActive: boolean,
) => {
  if (!isActive || typeof window === 'undefined') return

  updateAllElements((element) => {
    let newX = element.x + element.vx
    let newY = element.y + element.vy

    if (isInExclusionZone(newX, newY, element.size)) {
      element.vx *= -1
      element.vy *= -1
      newX = element.x + element.vx
      newY = element.y + element.vy
    }

    const leftBoundary = window.innerWidth * 0.2
    const rightBoundary = window.innerWidth * 0.8

    if (newX <= 0 || (newX <= leftBoundary && element.x <= leftBoundary)) {
      element.vx = Math.abs(element.vx)
    } else if (
      newX >= window.innerWidth - element.size ||
      (newX >= rightBoundary && element.x >= rightBoundary)
    ) {
      element.vx = -Math.abs(element.vx)
    }

    if (newY <= 0 || newY >= window.innerHeight * 4 - element.size) {
      element.vy *= -1
      newY = Math.max(0, Math.min(window.innerHeight * 4 - element.size, newY))
    }

    const newScale = element.scale + element.scaleDirection * 0.001
    if (newScale <= 0.2 || newScale >= 0.6) {
      element.scaleDirection *= -1
    }

    return {
      ...element,
      x: newX,
      y: newY,
      rotation: element.rotation + element.rotationSpeed,
      scale: newScale,
    }
  })
}
