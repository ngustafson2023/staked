import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://staked.bootstrapquant.com', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://staked.bootstrapquant.com/pricing', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://staked.bootstrapquant.com/privacy', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: 'https://staked.bootstrapquant.com/terms', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: 'https://staked.bootstrapquant.com/refund-policy', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]
}
