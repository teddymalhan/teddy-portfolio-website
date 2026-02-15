import { NextRequest, connection } from 'next/server'
import { put } from '@vercel/blob'
import { isAuthorizedAdmin, getCurrentUserId } from '@/lib/auth'
import { resumeService } from '@/lib/services/resume-service'
import { createErrorResponse, createSuccessResponse, logError } from '@/lib/api-response'
import { revalidateTag } from 'next/cache'
import { validateFile } from '@/lib/validations/resume'
import { capturePostHogEvent } from '@/lib/posthog-server'

// GET - Get current active resume
export async function GET() {
  await connection()
  try {
    const resume = await resumeService.getActiveResume()

    if (!resume) {
      await capturePostHogEvent('api_resume_get_no_active', {
        endpoint: '/api/resume',
        method: 'GET',
      })
      return createSuccessResponse({
        id: null,
        filename: null,
        path: null,
        blob_url: null,
        isActive: false,
        uploadedAt: null,
      })
    }

    await capturePostHogEvent('api_resume_get_success', {
      endpoint: '/api/resume',
      method: 'GET',
      resumeId: resume.id,
      filename: resume.filename,
    })

    const response = createSuccessResponse(resume)
    // Stale-while-revalidate: serve cached for 5 min, revalidate in background
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    return response
  } catch (error) {
    logError('GET /api/resume', error)
    await capturePostHogEvent('api_resume_get_error', {
      endpoint: '/api/resume',
      method: 'GET',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    return createErrorResponse('Failed to fetch resume', 500, 'FETCH_ERROR')
  }
}

// POST - Upload new resume (admin only)
export async function POST(request: NextRequest) {
  await connection()
  const isAdmin = await isAuthorizedAdmin()
  if (!isAdmin) {
    await capturePostHogEvent('api_resume_upload_unauthorized', {
      endpoint: '/api/resume',
      method: 'POST',
    })
    return createErrorResponse('Unauthorized', 403, 'UNAUTHORIZED')
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    // Validate file
    const fileValidation = validateFile(file)
    if (!fileValidation.valid) {
      await capturePostHogEvent('api_resume_upload_invalid_file', {
        endpoint: '/api/resume',
        method: 'POST',
        error: fileValidation.error,
      })
      return createErrorResponse(fileValidation.error!, 400, 'INVALID_FILE')
    }

    // Generate unique blob key
    const timestamp = Date.now()
    const blobKey = `resumes/resume-${timestamp}.pdf`

    // Start both operations in parallel (CLAUDE.md 1.3 - Prevent Waterfall Chains)
    const blobPromise = put(blobKey, file!, {
      access: 'public',
      contentType: 'application/pdf',
    })
    const userIdPromise = getCurrentUserId()
    const [blob, userId] = await Promise.all([blobPromise, userIdPromise])

    // Save metadata to database
    const resumeRow = await resumeService.createResume({
      filename: file!.name,
      blob_url: blob.url,
      blob_key: blobKey,
      uploaded_by: userId || 'unknown',
      file_size: file!.size,
      mime_type: file!.type,
    })

    await capturePostHogEvent('api_resume_uploaded', {
      endpoint: '/api/resume',
      method: 'POST',
      resumeId: resumeRow.id,
      filename: resumeRow.filename,
      fileSize: file!.size,
      uploadedBy: userId || 'unknown',
    })

    revalidateTag('active-resume', 'resume-data')

    return createSuccessResponse({
      id: resumeRow.id,
      filename: resumeRow.filename,
      blob_url: resumeRow.blob_url,
      uploadedAt: typeof resumeRow.uploaded_at === 'string'
        ? resumeRow.uploaded_at
        : resumeRow.uploaded_at.toISOString(),
    })
  } catch (error) {
    logError('POST /api/resume', error)
    await capturePostHogEvent('api_resume_upload_error', {
      endpoint: '/api/resume',
      method: 'POST',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    return createErrorResponse('Failed to upload resume', 500, 'UPLOAD_ERROR')
  }
}

