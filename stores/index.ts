/**
 * Central export for all stores
 */

export { useUIStore } from './ui-store'
export { useResumeStore } from './resume-store'
export { useResumeManagerStore } from './resume-manager-store'
export {
  useFloatingElementsStore,
  animateFloatingElements,
  type FloatingElement,
} from './floating-elements-store'
export {
  useTechMascotsStore,
  type Mascot,
} from './tech-mascots-store'
export { useNavigationStore } from './navigation-store'
export { createStore } from './use-store'
