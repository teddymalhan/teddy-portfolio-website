import { sql } from '@/lib/db'
import { unstable_cache } from 'next/cache'
import type { SettingsRow } from '@/types/database'

// Cached version of getResumeVisibility - cache for 5 minutes
const getCachedResumeVisibility = unstable_cache(
  async (): Promise<boolean> => {
    try {
      const result = await sql`
        SELECT value FROM settings 
        WHERE key = 'resume_visible'
        LIMIT 1
      ` as SettingsRow[]

      return result.length > 0 ? result[0].value === 'true' : true
    } catch (error: unknown) {
      // If table doesn't exist, default to visible
      const errorMessage = error instanceof Error ? error.message : String(error)
      if (
        errorMessage.includes('does not exist') ||
        errorMessage.includes('relation') ||
        (error as { code?: string }).code === '42P01'
      ) {
        return true
      }
      throw error
    }
  },
  ['resume-visibility'],
  {
    revalidate: 300, // 5 minutes
  }
)

export const settingsService = {
  async getResumeVisibility(): Promise<boolean> {
    return getCachedResumeVisibility()
  },

  async setResumeVisibility(isVisible: boolean): Promise<void> {
    const valueString = isVisible.toString()

    await sql`
      INSERT INTO settings (key, value, updated_at)
      VALUES ('resume_visible', ${valueString}, NOW())
      ON CONFLICT (key) 
      DO UPDATE SET value = ${valueString}, updated_at = NOW()
    `
  },
}

