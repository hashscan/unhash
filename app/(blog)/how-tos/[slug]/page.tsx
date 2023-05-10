import { notFound } from 'next/navigation'
import posts from 'content'

export async function generateStaticParams() {
  return Object.keys(posts)
}

export default async function Post({ params }: { params: { slug: string } }) {
  const { default: Content } = posts[params.slug]

  if (!Content) {
    notFound()
  }

  return <Content />
}
