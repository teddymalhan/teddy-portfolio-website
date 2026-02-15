import { connection } from 'next/server'
import { isAuthorizedAdmin } from '@/lib/auth'
import { createErrorResponse, createSuccessResponse, logError } from '@/lib/api-response'
import { capturePostHogEvent } from '@/lib/posthog-server'

export async function GET() {
  await connection()
  try {
    const authorized = await isAuthorizedAdmin()

    await capturePostHogEvent('api_auth_check_admin', {
      endpoint: '/api/auth/check-admin',
      method: 'GET',
      authorized,
    })

    // Only return authorization status, no user details
    return createSuccessResponse({ authorized })
  } catch (error) {
    logError('GET /api/auth/check-admin', error)
    await capturePostHogEvent('api_auth_check_admin_error', {
      endpoint: '/api/auth/check-admin',
      method: 'GET',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    return createErrorResponse('Error checking authorization', 500, 'AUTH_CHECK_ERROR')
  }
}
