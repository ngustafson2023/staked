'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const PRESETS = [25, 50, 100, 250]

interface StakeInputProps {
  value: number
  onChange: (cents: number) => void
}

export function StakeInput({ value, onChange }: StakeInputProps) {
  const dollars = value / 100

  return (
    <div className="space-y-3">
      <Label>How much are you staking?</Label>
      <div className="flex gap-2">
        {PRESETS.map((amount) => (
          <Button
            key={amount}
            type="button"
            variant={dollars === amount ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(amount * 100)}
          >
            ${amount}
          </Button>
        ))}
      </div>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">$</span>
        <Input
          type="number"
          min={10}
          step={5}
          value={dollars || ''}
          onChange={(e) => onChange(Number(e.target.value) * 100)}
          className="pl-8"
          placeholder="Custom amount (min $10)"
        />
      </div>
    </div>
  )
}
