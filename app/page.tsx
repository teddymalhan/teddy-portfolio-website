import { getResumeVisibility } from '@/lib/resume-visibility'
import { HomeClient } from './home-client'

// Use ISR with revalidation every 5 minutes
export const revalidate = 300

export default async function Home() {
  // Fetch resume visibility server-side before rendering
  const isResumeVisible = await getResumeVisibility()
  return <HomeClient isResumeVisible={isResumeVisible} />
}
