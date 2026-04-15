import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const adjectives = [
  'brave', 'bold', 'swift', 'keen', 'firm', 'sharp', 'true', 'calm',
  'fair', 'bright', 'prime', 'grand', 'pure', 'rare', 'wise', 'cool',
]

const nouns = [
  'ship', 'peak', 'goal', 'task', 'mark', 'push', 'leap', 'dash',
  'rise', 'edge', 'flux', 'grit', 'spark', 'drive', 'quest', 'forge',
]

export function generateSlug(): string {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const num = Math.floor(1000 + Math.random() * 9000)
  return `${adj}-${noun}-${num}`
}

export function formatCents(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}

export function formatCountdown(deadline: string): string {
  const now = new Date().getTime()
  const end = new Date(deadline).getTime()
  const diff = end - now

  if (diff <= 0) return 'Expired'

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  if (days > 0) return `${days}d ${hours}h ${minutes}m`
  return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
