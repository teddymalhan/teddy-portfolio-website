import { getResumeVisibility } from '@/lib/resume-visibility'
import { HomeClient } from './home-client'

// Force dynamic rendering to always fetch fresh visibility state
export const dynamic = 'force-dynamic'

export default async function Home() {
  // Fetch resume visibility server-side before rendering
  const isResumeVisible = await getResumeVisibility()
  return <HomeClient isResumeVisible={isResumeVisible} />
}
