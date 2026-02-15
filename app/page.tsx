import { cacheLife } from 'next/cache'
import { cacheTag } from 'next/cache'
import { getResumeVisibility } from '@/lib/resume-visibility'
import { HomeClient } from './home-client'

export default async function Home() {
  'use cache'
  cacheLife('hours')
  cacheTag('home-page')

  // Fetch resume visibility server-side before rendering
  const isResumeVisible = await getResumeVisibility()
  return <HomeClient isResumeVisible={isResumeVisible} />
}
