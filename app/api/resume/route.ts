import { NextRequest } from 'next/server'
import { put } from '@vercel/blob'
import { isAuthorizedAdmin, getCurrentUserId } from '@/lib/auth'
import { resumeService } from '@/lib/services/resume-service'
import { createErrorResponse, createSuccessResponse, logError } from '@/lib/api-response'
import { validateFile } from '@/lib/validations/resume'

// Use ISR with revalidation every 5 minutes
export const revalidate = 300

// GET - Get current active resume
export async function GET() {
  try {
    const resume = await resumeService.getActiveResume()

    if (!resume) {
      return createSuccessResponse({
        id: null,
        filename: null,
        path: null,
        blob_url: null,
        isActive: false,
        uploadedAt: null,
      })
    }

    const response = createSuccessResponse(resume)
    // Stale-while-revalidate: serve cached for 5 min, revalidate in background
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    return response
  } catch (error) {
    logError('GET /api/resume', error)
    return createErrorResponse('Failed to fetch resume', 500, 'FETCH_ERROR')
  }
}

// POST - Upload new resume (admin only)
export async function POST(request: NextRequest) {
  const isAdmin = await isAuthorizedAdmin()
  if (!isAdmin) {
    return createErrorResponse('Unauthorized', 403, 'UNAUTHORIZED')
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    // Validate file
    const fileValidation = validateFile(file)
    if (!fileValidation.valid) {
      return createErrorResponse(fileValidation.error!, 400, 'INVALID_FILE')
    }

    // Generate unique blob key
    const timestamp = Date.now()
    const blobKey = `resumes/resume-${timestamp}.pdf`

    // Upload to Vercel Blob
    const blob = await put(blobKey, file!, {
      access: 'public',
      contentType: 'application/pdf',
    })

    const userId = await getCurrentUserId()

    // Save metadata to database
    const resumeRow = await resumeService.createResume({
      filename: file!.name,
      blob_url: blob.url,
      blob_key: blobKey,
      uploaded_by: userId || 'unknown',
      file_size: file!.size,
      mime_type: file!.type,
    })

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
    return createErrorResponse('Failed to upload resume', 500, 'UPLOAD_ERROR')
  }
}

