import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <Link href="/" className="mb-8 text-2xl font-heading font-bold">
        Staked
      </Link>
      {children}
    </div>
  )
}
