import { getResumeVisibility } from '@/lib/resume-visibility'
import { HomeClient } from './home-client'

// Use ISR with revalidation every 1 hour (moderate caching for better performance)
export const revalidate = 3600

export default async function Home() {
  // Fetch resume visibility server-side before rendering
  const isResumeVisible = await getResumeVisibility()
  return <HomeClient isResumeVisible={isResumeVisible} />
}
