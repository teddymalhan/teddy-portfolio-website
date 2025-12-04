import { NextRequest } from 'next/server'
import { isAuthorizedAdmin } from '@/lib/auth'
import { resumeService } from '@/lib/services/resume-service'
import { createErrorResponse, createSuccessResponse, logError } from '@/lib/api-response'
import { setActiveResumeSchema } from '@/lib/validations/resume'

export async function PUT(request: NextRequest) {
  const isAdmin = await isAuthorizedAdmin()
  if (!isAdmin) {
    return createErrorResponse('Unauthorized', 403, 'UNAUTHORIZED')
  }

  try {
    const body = await request.json()
    const validationResult = setActiveResumeSchema.safeParse(body)

    if (!validationResult.success) {
      return createErrorResponse(
        validationResult.error.issues[0]?.message || 'Invalid request',
        400,
        'VALIDATION_ERROR'
      )
    }

    const { resumeId } = validationResult.data
    const resumeRow = await resumeService.setActiveResume(resumeId)

    return createSuccessResponse({
      id: resumeRow.id,
      filename: resumeRow.filename,
      blob_url: resumeRow.blob_url,
      is_active: resumeRow.is_active,
      uploaded_at: typeof resumeRow.uploaded_at === 'string' 
        ? resumeRow.uploaded_at 
        : resumeRow.uploaded_at.toISOString(),
    })
  } catch (error) {
    logError('PUT /api/resume/active', error)
    
    if (error instanceof Error && error.message === 'Resume not found') {
      return createErrorResponse('Resume not found', 404, 'RESUME_NOT_FOUND')
    }
    
    return createErrorResponse('Failed to set active resume', 500, 'UPDATE_ERROR')
  }
}

