'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Sidebar } from './sidebar'

interface TopBarProps {
  email: string
}

export function TopBar({ email }: TopBarProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [open])

  return (
    <>
      <header className="flex items-center justify-between border-b border-border p-4 lg:hidden">
        <Link href="/dashboard" className="text-xl font-heading font-bold">
          Staked
        </Link>
        <button onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 transition-opacity duration-200"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-50 w-64 transition-transform duration-200 translate-x-0">
            <Sidebar email={email} />
          </div>
        </div>
      )}
    </>
  )
}
