import type { MetadataRoute } from 'next'
import { getAllCompetitorSlugs } from '@/lib/competitors'

const base = 'https://staked.bootstrapquant.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const comparisons = getAllCompetitorSlugs().map((slug) => ({
    url: `${base}/compare/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    ...comparisons,
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/refund-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]
}
