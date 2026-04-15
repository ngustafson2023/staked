import type { AntiCharity } from '@staked/core'

export const ANTI_CHARITIES: AntiCharity[] = [
  {
    id: 'nra',
    name: 'NRA Foundation',
    description: 'National Rifle Association',
    icon: '🔫',
  },
  {
    id: 'planned_parenthood',
    name: 'Planned Parenthood',
    description: 'Reproductive health organization',
    icon: '🏥',
  },
  {
    id: 'trump_campaign',
    name: 'Trump 2028 Campaign',
    description: 'Political campaign fund',
    icon: '🏛️',
  },
  {
    id: 'aclu',
    name: 'ACLU',
    description: 'American Civil Liberties Union',
    icon: '⚖️',
  },
  {
    id: 'heritage_foundation',
    name: 'Heritage Foundation',
    description: 'Conservative think tank',
    icon: '🦅',
  },
]
