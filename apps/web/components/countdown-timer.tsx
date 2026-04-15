'use client'

import { useEffect, useState } from 'react'
import { formatCountdown } from '@/lib/utils'

interface CountdownTimerProps {
  deadline: string
  className?: string
}

export function CountdownTimer({ deadline, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(formatCountdown(deadline))

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(formatCountdown(deadline))
    }, 1000)

    return () => clearInterval(interval)
  }, [deadline])

  return <span className={className}>{timeLeft}</span>
}
