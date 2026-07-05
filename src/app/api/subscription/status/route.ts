import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const ACTIVE_STATUSES = ['active', 'trialing', 'past_due']

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ hasAccess: false, isLoggedIn: false })
    }

    const { data: subs } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .in('status', ACTIVE_STATUSES)
      .limit(1)

    const hasAccess = (subs?.length ?? 0) > 0

    return NextResponse.json({ hasAccess, isLoggedIn: true })
  } catch {
    return NextResponse.json({ hasAccess: false, isLoggedIn: false })
  }
}
