import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/nav/sidebar'
import { TopBar } from '@/components/nav/top-bar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="dark flex min-h-screen bg-background">
      <div className="hidden lg:block">
        <Sidebar email={user.email || ''} />
      </div>
      <div className="flex-1 flex flex-col">
        <TopBar email={user.email || ''} />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
