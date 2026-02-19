import { cacheLife } from 'next/cache'
import { cacheTag } from 'next/cache'
import { getResumeVisibility } from '@/lib/resume-visibility'
import { HomeClient } from './home-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Software Engineer with experience at EA and Dialpad. Computer Science student at Simon Fraser University.',
}

export default async function Home() {
  'use cache'
  cacheLife('hours')
  cacheTag('home-page')

  // Fetch resume visibility server-side before rendering
  const isResumeVisible = await getResumeVisibility()
  return <HomeClient isResumeVisible={isResumeVisible} />
}
