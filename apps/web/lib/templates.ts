export interface CommitmentTemplate {
  id: string
  title: string
  description: string
  defaultStakeCents: number
  defaultDaysFromNow: number
  emoji: string
}

export const TEMPLATES: CommitmentTemplate[] = [
  {
    id: 'ship-it',
    title: 'Ship it',
    description: 'Ship my MVP by [deadline]',
    defaultStakeCents: 5000,
    defaultDaysFromNow: 7,
    emoji: '🚀',
  },
  {
    id: 'write-daily',
    title: 'Write daily',
    description: 'Write 500 words every day for 30 days',
    defaultStakeCents: 2500,
    defaultDaysFromNow: 30,
    emoji: '✍️',
  },
  {
    id: 'gym-streak',
    title: 'Gym streak',
    description: 'Go to the gym 3x/week for 4 weeks',
    defaultStakeCents: 5000,
    defaultDaysFromNow: 28,
    emoji: '💪',
  },
  {
    id: 'read-a-book',
    title: 'Read a book',
    description: 'Finish reading [book] by [deadline]',
    defaultStakeCents: 2000,
    defaultDaysFromNow: 14,
    emoji: '📚',
  },
  {
    id: 'no-social-media',
    title: 'No social media',
    description: 'No social media for 7 days',
    defaultStakeCents: 3000,
    defaultDaysFromNow: 7,
    emoji: '📵',
  },
  {
    id: 'cold-outreach',
    title: 'Cold outreach',
    description: 'Send 10 cold emails by Friday',
    defaultStakeCents: 2500,
    defaultDaysFromNow: 5,
    emoji: '📧',
  },
  {
    id: 'side-project',
    title: 'Side project',
    description: 'Complete [feature] by [deadline]',
    defaultStakeCents: 7500,
    defaultDaysFromNow: 14,
    emoji: '🛠️',
  },
  {
    id: 'morning-routine',
    title: 'Morning routine',
    description: 'Wake up at 6am for 14 days straight',
    defaultStakeCents: 4000,
    defaultDaysFromNow: 14,
    emoji: '⏰',
  },
]
