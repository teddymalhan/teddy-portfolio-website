/**
 * Tech Mascots Store
 * Manages state for animated tech mascot emojis
 */

import { createStore } from './use-store'

export interface Mascot {
  id: number
  emoji: string
  size: number
  path: string
  duration: number
  delay: number
  initialPosition: number
}

interface TechMascotsState {
  mascots: Mascot[]
  
  // Actions
  setMascots: (mascots: Mascot[]) => void
  initializeMascots: () => void
}

// Generate random curved paths for mascots
const generateRandomPath = () => {
  if (typeof window === 'undefined') {
    return 'M 0 0'
  }
  
  const width = window.innerWidth
  const height = window.innerHeight
  
  // Generate different types of paths for variety
  const pathType = Math.random()
  
  if (pathType < 0.3) {
    // Horizontal wavy path
    const startX = Math.random() * width * 0.1
    const startY = Math.random() * height * 0.6 + height * 0.2
    const cp1X = width * 0.25 + Math.random() * width * 0.2
    const cp1Y = startY + (Math.random() - 0.5) * height * 0.3
    const cp2X = width * 0.5 + Math.random() * width * 0.2
    const cp2Y = startY + (Math.random() - 0.5) * height * 0.3
    const endX = width * 0.75 + Math.random() * width * 0.2
    const endY = Math.random() * height * 0.6 + height * 0.2
    return `M ${startX} ${startY} C ${cp1X} ${cp1Y} ${cp2X} ${cp2Y} ${endX} ${endY}`
  } else if (pathType < 0.6) {
    // Vertical looping path
    const startX = Math.random() * width * 0.6 + width * 0.2
    const startY = Math.random() * height * 0.1
    const cp1X = startX + (Math.random() - 0.5) * width * 0.4
    const cp1Y = height * 0.25 + Math.random() * height * 0.2
    const cp2X = startX + (Math.random() - 0.5) * width * 0.4
    const cp2Y = height * 0.5 + Math.random() * height * 0.2
    const endX = Math.random() * width * 0.6 + width * 0.2
    const endY = height * 0.75 + Math.random() * height * 0.2
    return `M ${startX} ${startY} C ${cp1X} ${cp1Y} ${cp2X} ${cp2Y} ${endX} ${endY}`
  } else {
    // Diagonal curved path
    const startCorner = Math.random() < 0.5
    const startX = startCorner
      ? Math.random() * width * 0.2
      : width * 0.8 + Math.random() * width * 0.2
    const startY = startCorner
      ? Math.random() * height * 0.2
      : height * 0.8 + Math.random() * height * 0.2
    const cp1X = Math.random() * width * 0.6 + width * 0.2
    const cp1Y = Math.random() * height * 0.4 + height * 0.1
    const cp2X = Math.random() * width * 0.6 + width * 0.2
    const cp2Y = Math.random() * height * 0.4 + height * 0.4
    const endX = startCorner
      ? width * 0.8 + Math.random() * width * 0.2
      : Math.random() * width * 0.2
    const endY = startCorner
      ? height * 0.8 + Math.random() * height * 0.2
      : Math.random() * height * 0.2
    return `M ${startX} ${startY} C ${cp1X} ${cp1Y} ${cp2X} ${cp2Y} ${endX} ${endY}`
  }
}

export const useTechMascotsStore = createStore<TechMascotsState>(
  'TechMascotsStore',
  (set) => ({
    mascots: [],

    setMascots: (mascots) => set({ mascots }),

    initializeMascots: () => {
      const emojis = ['🤖', '👾', '🚀', '⚡', '💻', '🔧', '⚙️', '🎯']

      const newMascots: Mascot[] = []

      for (let i = 0; i < 8; i++) {
        newMascots.push({
          id: i,
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
          size: Math.random() * 20 + 40,
          path: generateRandomPath(),
          duration: 300, // 5 minutes (300 seconds)
          delay: 0, // No delay, we'll use initial position instead
          initialPosition: Math.random() * 100, // Random starting position along each path (0-100%)
        })
      }

      set({ mascots: newMascots })
    },
  }),
  {
    persist: false, // Don't persist animation state
  }
)
