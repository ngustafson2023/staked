'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button onClick={() => setOpen(!open)} aria-label="Toggle menu">
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
      <div
        className={`absolute left-0 right-0 top-full border-b border-border bg-background px-6 pb-4 pt-2 transition-all duration-200 ${
          open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col gap-3">
          <Link
            href="/pricing"
            onClick={() => setOpen(false)}
            className="text-sm text-muted hover:text-foreground transition-colors py-2"
          >
            Pricing
          </Link>
          <Link href="/login" onClick={() => setOpen(false)}>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              Log in
            </Button>
          </Link>
          <Link href="/signup" onClick={() => setOpen(false)}>
            <Button size="sm" className="w-full">Get Started</Button>
          </Link>
        </nav>
      </div>
    </div>
  )
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm relative">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-heading font-bold tracking-tight">
            Staked
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/pricing" className="text-sm text-muted hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </nav>
          <MobileNav />
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border bg-background">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid gap-8 grid-cols-2 sm:grid-cols-4">
            <div>
              <p className="font-heading font-bold mb-3">Staked</p>
              <p className="text-sm text-muted">
                Deadline accountability with real money on the line.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium mb-3">Product</p>
              <div className="space-y-2">
                <Link href="/pricing" className="block text-sm text-muted hover:text-foreground">Pricing</Link>
                <Link href="/signup" className="block text-sm text-muted hover:text-foreground">Get Started</Link>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-3">Legal</p>
              <div className="space-y-2">
                <Link href="/privacy" className="block text-sm text-muted hover:text-foreground">Privacy Policy</Link>
                <Link href="/terms" className="block text-sm text-muted hover:text-foreground">Terms of Service</Link>
                <Link href="/refund-policy" className="block text-sm text-muted hover:text-foreground">Refund Policy</Link>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-3">Contact</p>
              <p className="text-sm text-muted">support@bootstrapquant.com</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted">
            &copy; {new Date().getFullYear()} Staked. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
