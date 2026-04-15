'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Sidebar } from './sidebar'

interface TopBarProps {
  email: string
}

export function TopBar({ email }: TopBarProps) {
  const [open, setOpen] = useState(false)

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
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative z-50 w-64">
            <Sidebar email={email} />
          </div>
        </div>
      )}
    </>
  )
}
