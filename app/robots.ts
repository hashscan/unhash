export default function robots() {
  const hostname = process.env.NEXT_PUBLIC_PRODUCTION_URL ?? 'https://unhash.com'

  return {
    rules: [
      {
        userAgent: '*'
      }
    ],
    sitemap: '${hostname}/sitemap.xml',
    host: hostname
  }
}
