import { NextRequest, NextResponse } from 'next/server'
import { resumeService } from '@/lib/services/resume-service'
import { settingsService } from '@/lib/services/settings-service'
import { logError } from '@/lib/api-response'

// Use ISR with revalidation every 5 minutes
export const revalidate = 300

export async function GET(request: NextRequest) {
  try {
    // Check if resume is visible
    const isVisible = await settingsService.getResumeVisibility()

    if (!isVisible) {
      return new NextResponse('Resume not available', { status: 404 })
    }

    // Fetch the active resume from database
    const activeResume = await resumeService.getActiveResume()

    if (!activeResume) {
      return new NextResponse('No active resume found', { status: 404 })
    }

    // Security: Validate version parameter if provided
    // Only allow access to the active resume - ignore or reject version parameters
    const versionParam = request.nextUrl.searchParams.get('v')
    if (versionParam) {
      const requestedVersionId = Number.parseInt(versionParam, 10)
      // If version parameter doesn't match active resume ID, return 404
      // This prevents accessing older/inactive resume versions
      if (!Number.isNaN(requestedVersionId) && requestedVersionId !== activeResume.id) {
        return new NextResponse('Resume not found', { status: 404 })
      }
    }

    // Fetch the PDF from blob storage
    if (activeResume.blob_url) {
      try {
        const blobResponse = await fetch(activeResume.blob_url)
        if (blobResponse.ok) {
          const pdfBuffer = await blobResponse.arrayBuffer()
          return new NextResponse(pdfBuffer as any, {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': 'inline; filename="Teddy_Malhan_Resume.pdf"',
              // Cache PDF for 5 minutes, allow stale for 10 minutes
              'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
            },
          })
        } else {
          return new NextResponse('Error fetching resume file from storage', { status: 500 })
        }
      } catch (fetchError) {
        logError('GET /api/resume/file - Fetch error', fetchError)
        return new NextResponse('Error fetching resume file', { status: 500 })
      }
    }

    return new NextResponse('No active resume found', { status: 404 })
  } catch (error) {
    logError('GET /api/resume/file', error)
    return new NextResponse('Error fetching resume', { status: 500 })
  }
}

