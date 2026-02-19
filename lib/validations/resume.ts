import { z } from 'zod'

// Resume validation schemas
export const resumeUpdateSchema = z.object({
  notes: z.string().max(5000).nullable().optional(),
  filename: z.string().min(1).max(255).optional(),
}).refine(
  (data) => data.notes !== undefined || data.filename !== undefined,
  {
    message: 'At least one field (notes or filename) must be provided',
  }
)

export const setActiveResumeSchema = z.object({
  resumeId: z.number().int().positive(),
})

export const resumeVisibilitySchema = z.object({
  isVisible: z.boolean(),
})

// File upload validation (handled separately as FormData)
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_MIME_TYPES = ['application/pdf'] as const

export function validateFile(file: File | null): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file provided' }
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type as typeof ALLOWED_MIME_TYPES[number])) {
    return { valid: false, error: 'Only PDF files are allowed' }
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size must be less than 10MB' }
  }

  if (file.name.length > 255) {
    return { valid: false, error: 'Filename must be less than 255 characters' }
  }

  return { valid: true }
}

