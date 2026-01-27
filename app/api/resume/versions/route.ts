import { isAuthorizedAdmin } from '@/lib/auth'
import { resumeService } from '@/lib/services/resume-service'
import { createErrorResponse, createSuccessResponse, logError } from '@/lib/api-response'
import { capturePostHogEvent } from '@/lib/posthog-server'

export async function GET() {
  const isAdmin = await isAuthorizedAdmin()
  if (!isAdmin) {
    await capturePostHogEvent('api_resume_versions_unauthorized', {
      endpoint: '/api/resume/versions',
      method: 'GET',
    })
    return createErrorResponse('Unauthorized', 403, 'UNAUTHORIZED')
  }

  try {
    const resumes = await resumeService.getAllResumes()
    await capturePostHogEvent('api_resume_versions_fetched', {
      endpoint: '/api/resume/versions',
      method: 'GET',
      count: resumes.length,
    })
    return createSuccessResponse(resumes)
  } catch (error) {
    logError('GET /api/resume/versions', error)
    await capturePostHogEvent('api_resume_versions_error', {
      endpoint: '/api/resume/versions',
      method: 'GET',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    return createErrorResponse('Failed to fetch resumes', 500, 'FETCH_ERROR')
  }
}

