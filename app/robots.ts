export default function robots() {
  const isProduction = !!process.env.NEXT_PUBLIC_PRODUCTION_URL
  const hostname = process.env.NEXT_PUBLIC_PRODUCTION_URL ?? 'https://unhash.com'

  if (!isProduction) {
    return {
      rules: [
        {
          userAgent: '*',
          disallow: '/'
        }
      ]
    }
  }

  return {
    rules: [
      {
        userAgent: '*'
      }
    ],
    sitemap: `${hostname}/sitemap.xml`,
    host: hostname
  }
}
