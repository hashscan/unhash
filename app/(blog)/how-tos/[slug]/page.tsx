import { notFound } from 'next/navigation'
import posts from 'content'

// generate static pages for blog
export function generateStaticParams() {
  return Object.keys(posts)
}

export const dynamic = 'force-static'

export default function Post({ params }: { params: { slug: string } }) {
  const { default: Content } = posts[params.slug] ?? { default: null }

  if (!Content) {
    notFound()
  }

  return <Content />
}
