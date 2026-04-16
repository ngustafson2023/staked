export interface Competitor {
  slug: string
  name: string
  tagline: string
  pricing: string
  weaknesses: string[]
  stakedAdvantages: string[]
  features: { name: string; competitor: boolean | string; staked: boolean | string }[]
}

export const competitors: Record<string, Competitor> = {
  beeminder: {
    slug: 'beeminder',
    name: 'Beeminder',
    tagline: 'Beeminder is a quantified-self habit tracker with financial stakes.',
    pricing: '$0 free tier, keeps your money when you fail (their revenue model)',
    weaknesses: [
      'Complex goal setup with graphs and "yellow brick road" system',
      'Profits from your failures — misaligned incentives',
      'Built for habits and quantified self, not work deadlines',
      'Steep learning curve with unique terminology',
      'No anti-charity option — money goes to Beeminder',
    ],
    stakedAdvantages: [
      'Simple deadline-based commitments (set date, stake money, prove completion)',
      'Money goes to anti-charity, not to us — aligned incentives',
      'Built specifically for work deliverables and project deadlines',
      'Set up in 30 seconds, not 30 minutes',
      'Flat $15/mo subscription — we never profit from your failures',
    ],
    features: [
      { name: 'Work deadline commitments', competitor: false, staked: true },
      { name: 'Habit tracking', competitor: true, staked: false },
      { name: 'Anti-charity stakes', competitor: false, staked: true },
      { name: 'Keeps your forfeited money', competitor: true, staked: false },
      { name: 'URL/text proof submission', competitor: false, staked: true },
      { name: 'Photo proof', competitor: false, staked: false },
      { name: 'Grace period', competitor: false, staked: '1 hour' },
      { name: 'Public accountability page', competitor: false, staked: true },
      { name: 'Witness verification', competitor: false, staked: true },
      { name: 'Flat-rate pricing', competitor: false, staked: '$15/mo' },
    ],
  },
  stickk: {
    slug: 'stickk',
    name: 'StickK',
    tagline: 'StickK is a commitment platform where you pledge money to achieve goals.',
    pricing: 'Free to use, takes a cut of forfeited stakes',
    weaknesses: [
      'Outdated UI — hasn\'t been significantly updated in years',
      'Requires a "referee" to verify completion (manual process)',
      'No distinction between habits and work deadlines',
      'Mobile experience is poor',
      'Limited payment options',
    ],
    stakedAdvantages: [
      'Modern, clean interface designed for professionals',
      'Automated proof submission (URL or text — no referee needed)',
      'Purpose-built for work deadlines, not general goals',
      'Stripe-powered payments with card authorization (not charged unless you fail)',
      'Anti-charity selection with real organizations',
    ],
    features: [
      { name: 'Work deadline focus', competitor: false, staked: true },
      { name: 'Anti-charity stakes', competitor: true, staked: true },
      { name: 'Referee/witness system', competitor: 'Required', staked: 'Optional' },
      { name: 'Modern UI', competitor: false, staked: true },
      { name: 'Card authorization (not pre-charged)', competitor: false, staked: true },
      { name: 'Grace period', competitor: false, staked: '1 hour' },
      { name: 'Public accountability page', competitor: false, staked: true },
      { name: 'Recurring commitments', competitor: true, staked: true },
    ],
  },
  forfeit: {
    slug: 'forfeit',
    name: 'Forfeit',
    tagline: 'Forfeit is a habit accountability app with photo-verified daily check-ins.',
    pricing: 'From $10/mo, per-habit pricing',
    weaknesses: [
      'Photo verification only — doesn\'t work for knowledge work',
      'Built entirely around daily habits, not project deadlines',
      'Per-habit pricing adds up quickly',
      'Human reviewers check photos (privacy concern for some)',
      'No way to prove "I shipped code" or "I sent the proposal"',
    ],
    stakedAdvantages: [
      'URL and text proof — works for any type of work deliverable',
      'Deadline-based, not daily check-in based',
      'Flat pricing — unlimited commitments on Pro',
      'Automated verification (no human reviewing your photos)',
      'Anti-charity stakes (Forfeit keeps your money)',
    ],
    features: [
      { name: 'Work deadline commitments', competitor: false, staked: true },
      { name: 'Daily habit check-ins', competitor: true, staked: false },
      { name: 'Photo proof', competitor: true, staked: false },
      { name: 'URL/text proof', competitor: false, staked: true },
      { name: 'Human verification', competitor: true, staked: false },
      { name: 'Anti-charity stakes', competitor: false, staked: true },
      { name: 'Flat-rate pricing', competitor: false, staked: '$15/mo' },
      { name: 'Per-habit pricing', competitor: 'From $10/habit', staked: false },
    ],
  },
}

export function getCompetitor(slug: string): Competitor | undefined {
  return competitors[slug]
}

export function getAllCompetitorSlugs(): string[] {
  return Object.keys(competitors)
}
