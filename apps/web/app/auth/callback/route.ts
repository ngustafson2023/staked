import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Check if this is a new user (profile created in last 60 seconds)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('created_at')
          .eq('id', user.id)
          .single()

        if (profile) {
          const createdAt = new Date(profile.created_at).getTime()
          const isNewUser = Date.now() - createdAt < 60_000
          if (isNewUser && user.email) {
            // Fire and forget — don't block redirect
            fetch(`${origin}/api/welcome-email`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: user.email }),
            }).catch(() => {})
          }
        }
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
