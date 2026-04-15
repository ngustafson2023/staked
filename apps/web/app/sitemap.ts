import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://staked.so', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://staked.so/pricing', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://staked.so/privacy', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: 'https://staked.so/terms', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: 'https://staked.so/refund-policy', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]
}
