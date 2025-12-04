/**
 * Resume State Store
 * Manages resume-related state
 */

import { createStore } from './use-store'

interface ResumeVersion {
  id: number
  filename: string
  uploadedAt: string
  isActive: boolean
  notes?: string
  size: number
  isVisible?: boolean
}

interface ResumeState {
  // Resume data
  resumes: ResumeVersion[]
  activeResume: ResumeVersion | null
  resumePath: string
  isVisible: boolean

  // Loading states
  loading: boolean
  uploading: boolean

  // Actions
  setResumes: (resumes: ResumeVersion[]) => void
  setActiveResume: (resume: ResumeVersion | null) => void
  setResumePath: (path: string) => void
  setIsVisible: (visible: boolean) => void
  setLoading: (loading: boolean) => void
  setUploading: (uploading: boolean) => void

  // Computed values
  getResumeById: (id: number) => ResumeVersion | undefined
}

export const useResumeStore = createStore<ResumeState>(
  'ResumeStore',
  (set, get) => ({
    // Initial state
    resumes: [],
    activeResume: null,
    resumePath: '/Teddy_Malhan_Resume.pdf',
    isVisible: true,
    loading: false,
    uploading: false,

    // Actions
    setResumes: (resumes) => set({ resumes }),
    setActiveResume: (resume) => set({ activeResume: resume }),
    setResumePath: (path) => set({ resumePath: path }),
    setIsVisible: (visible) => set({ isVisible: visible }),
    setLoading: (loading) => set({ loading }),
    setUploading: (uploading) => set({ uploading }),

    // Computed
    getResumeById: (id) => get().resumes.find((r: ResumeVersion) => r.id === id),
  }),
  {
    persist: false, // Don't persist resume state (fetched from API)
  }
)
