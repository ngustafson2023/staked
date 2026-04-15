export type CommitmentStatus = 'active' | 'completed' | 'failed' | 'cancelled'

export type AntiCharityId =
  | 'nra'
  | 'planned_parenthood'
  | 'trump_campaign'
  | 'aclu'
  | 'heritage_foundation'

export type Plan = 'free' | 'pro'

export interface Profile {
  id: string
  email: string
  stripe_customer_id: string | null
  plan: Plan
  created_at: string
}

export interface Commitment {
  id: string
  user_id: string
  title: string
  description: string | null
  deadline: string
  stake_cents: number
  anti_charity: AntiCharityId
  status: CommitmentStatus
  proof_url: string | null
  proof_note: string | null
  stripe_payment_method_id: string | null
  stripe_setup_intent_id: string | null
  stripe_payment_intent_id: string | null
  is_public: boolean
  public_slug: string | null
  completed_at: string | null
  charged_at: string | null
  grace_period_ends_at: string | null
  created_at: string
}

export interface AntiCharity {
  id: AntiCharityId
  name: string
  description: string
  icon: string
}
