import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/settings/', '/billing/', '/api/'],
    },
    sitemap: 'https://staked.so/sitemap.xml',
  }
}
