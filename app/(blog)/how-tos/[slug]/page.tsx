import { notFound } from 'next/navigation'

import post$1 from 'content/first-post.mdx'
import post$2 from 'content/second-post.mdx'

const getPosts = async () =>
  ({
    'first-post': post$1,
    'second-post': post$2
  } as Record<string, typeof post$1>)

export async function generateStaticParams() {
  return Object.keys(await getPosts())
}

export default async function Post({ params }: { params: { slug: string } }) {
  const Content = (await getPosts())[params.slug]

  if (!Content) {
    notFound()
  }

  return <Content />
}
