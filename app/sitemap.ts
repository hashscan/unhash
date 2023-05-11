import posts from 'content'

export default async function sitemap() {
  const hostname = process.env.NEXT_PUBLIC_PRODUCTION_URL ?? 'https://unhash.com'

  const postUrls = Object.values(posts).map((post) => `how-tos/${post.slug}`)

  return ['', 'names', 'profile', ...postUrls].map((route) => ({
    url: `${hostname}/${route}`,
    lastModified: new Date().toISOString().split('T')[0]
  }))
}
