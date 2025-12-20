import { sql } from '@/lib/db'
import { unstable_cache } from 'next/cache'
import type { ResumeRow } from '@/types/database'
import type { ResumeResponse } from '@/types/api'

// Helper to map database row to API response
function mapResumeRowToResponse(row: ResumeRow): ResumeResponse {
  return {
    id: row.id,
    filename: row.filename,
    path: row.blob_url,
    blob_url: row.blob_url,
    isActive: row.is_active,
    uploadedAt: typeof row.uploaded_at === 'string' ? row.uploaded_at : row.uploaded_at.toISOString(),
    fileSize: row.file_size ?? undefined,
    notes: row.notes ?? undefined,
  }
}

// Cached version of getActiveResume - cache for 5 minutes
const getCachedActiveResume = unstable_cache(
  async (): Promise<ResumeResponse | null> => {
    const result = await sql`
      SELECT * FROM resumes 
      WHERE is_active = TRUE 
      ORDER BY uploaded_at DESC 
      LIMIT 1
    ` as ResumeRow[]

    if (result.length === 0) {
      return null
    }

    return mapResumeRowToResponse(result[0])
  },
  ['active-resume'],
  {
    revalidate: 300, // 5 minutes
  }
)

export const resumeService = {
  async getActiveResume(): Promise<ResumeResponse | null> {
    return getCachedActiveResume()
  },

  async getAllResumes(): Promise<ResumeResponse[]> {
    const result = await sql`
      SELECT * FROM resumes 
      ORDER BY uploaded_at DESC
    ` as ResumeRow[]

    return result.map(mapResumeRowToResponse)
  },

  async getResumeById(id: number): Promise<ResumeRow | null> {
    const result = await sql`
      SELECT * FROM resumes WHERE id = ${id} LIMIT 1
    ` as ResumeRow[]

    return result.length > 0 ? result[0] : null
  },

  async createResume(data: {
    filename: string
    blob_url: string
    blob_key: string
    uploaded_by: string | null
    file_size: number
    mime_type: string
  }): Promise<ResumeRow> {
    const result = await sql`
      INSERT INTO resumes (filename, blob_url, blob_key, uploaded_by, file_size, mime_type)
      VALUES (${data.filename}, ${data.blob_url}, ${data.blob_key}, ${data.uploaded_by}, ${data.file_size}, ${data.mime_type})
      RETURNING *
    ` as ResumeRow[]

    if (result.length === 0) {
      throw new Error('Failed to create resume')
    }

    return result[0]
  },

  async updateResume(
    id: number,
    updates: { notes?: string | null; filename?: string }
  ): Promise<ResumeRow> {
    let result: ResumeRow[]

    if (updates.notes !== undefined && updates.filename !== undefined) {
      result = await sql`
        UPDATE resumes 
        SET notes = ${updates.notes ?? null}, filename = ${updates.filename.trim()}
        WHERE id = ${id}
        RETURNING *
      ` as ResumeRow[]
    } else if (updates.notes !== undefined) {
      result = await sql`
        UPDATE resumes 
        SET notes = ${updates.notes ?? null}
        WHERE id = ${id}
        RETURNING *
      ` as ResumeRow[]
    } else if (updates.filename !== undefined) {
      result = await sql`
        UPDATE resumes 
        SET filename = ${updates.filename.trim()}
        WHERE id = ${id}
        RETURNING *
      ` as ResumeRow[]
    } else {
      throw new Error('No fields to update')
    }

    if (result.length === 0) {
      throw new Error('Resume not found')
    }

    return result[0]
  },

  async deleteResume(id: number): Promise<void> {
    await sql`DELETE FROM resumes WHERE id = ${id}`
  },

  async setActiveResume(id: number): Promise<ResumeRow> {
    // Use a single atomic SQL statement to ensure only one resume is active
    // First verify the resume exists, then update atomically
    const resume = await this.getResumeById(id)
    if (!resume) {
      throw new Error('Resume not found')
    }

    // Atomic operation: set all to inactive, then set target to active in one statement
    // Using a CTE to ensure atomicity
    const result = await sql`
      WITH deactivate_all AS (
        UPDATE resumes SET is_active = FALSE WHERE is_active = TRUE
      )
      UPDATE resumes 
      SET is_active = TRUE 
      WHERE id = ${id}
      RETURNING *
    ` as ResumeRow[]

    if (result.length === 0) {
      throw new Error('Resume not found')
    }

    return result[0]
  },
}

