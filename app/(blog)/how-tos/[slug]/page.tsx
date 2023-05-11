import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import posts from 'content'

// generate static pages for blog
export function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }))
}

type PostParams = { params: { slug: string } }

export function generateMetadata({ params }: PostParams) {
  const isProduction = !!process.env.NEXT_PUBLIC_PRODUCTION_URL
  const hostname = process.env.NEXT_PUBLIC_PRODUCTION_URL ?? 'https://unhash.com'
  const post = posts[params.slug]

  const metadata: Metadata = {
    title: post.title,
    description: post.description,
    keywords: [],

    robots: isProduction ? 'index, follow' : 'noindex, nofollow',
    
    referrer: 'origin',
    icons: '/favicon.svg',

    openGraph: {
      type: 'website',
      url: `${hostname}/how-tos/${post.slug}`,
      title: post.title,
      description: post.description,
      images: [
        {
          url: 'og-preview.jpg'
        }
      ]
    },

    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: 'og-preview.jpg'
    }
  }

  return metadata
}

export default function Post({ params }: PostParams) {
  const post = posts[params.slug]

  if (!post) {
    notFound()
  }

  return <post.default />
}
