export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    // ── Auth ────────────────────────────────────────────────────
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      }
    )
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ── Fetch billing data with service role ────────────────────
    const db = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const [{ data: subscriptions }, { data: purchases }] = await Promise.all([
      db
        .from('subscriptions')
        .select('id, status, product_key, current_period_end, cancel_at_period_end, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      db
        .from('purchases')
        .select('id, product_key, amount_total, currency, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
    ])

    return NextResponse.json({
      subscriptions: subscriptions ?? [],
      purchases:     purchases     ?? [],
    })
  } catch (err) {
    console.error('[billing-data]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
