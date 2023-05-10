import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import posts from 'content'

// generate static pages for blog
export function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }))
}

type PostParams = { params: { slug: string } }

export function generateMetadata({ params }: PostParams) {
  const post = posts[params.slug]

  const metadata: Metadata = {
    title: post.title,
    description: post.description,

    robots: 'index, follow'
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
