import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// GET /api/referral — get current user's referral code + stats
export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll() {},
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('referral_code, referral_count, referral_xp')
      .eq('id', user.id)
      .single()

    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    let code = profile.referral_code as string | null
    if (!code) {
      code = user.id.replace(/-/g, '').slice(0, 8).toUpperCase()
      await supabase
        .from('user_profiles')
        .update({ referral_code: code })
        .eq('id', user.id)
    }

    return NextResponse.json({
      code,
      referrals: (profile.referral_count as number) ?? 0,
      xpEarned: (profile.referral_xp as number) ?? 0,
    })
  } catch (err) {
    console.error('Referral GET error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// POST /api/referral — record a referral when someone signs up with a code
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll() {},
        },
      }
    )

    const { code } = await request.json() as { code: string }
    if (!code) return NextResponse.json({ error: 'No code' }, { status: 400 })

    // Find the referrer
    const { data: referrer } = await supabase
      .from('user_profiles')
      .select('id, referral_count, referral_xp')
      .eq('referral_code', code.toUpperCase())
      .single()

    if (!referrer) return NextResponse.json({ error: 'Invalid code' }, { status: 404 })

    const currentCount = (referrer.referral_count as number) ?? 0
    const currentXP = (referrer.referral_xp as number) ?? 0

    // Increment referral count + XP for the referrer
    await supabase
      .from('user_profiles')
      .update({
        referral_count: currentCount + 1,
        referral_xp: currentXP + 500,
        xp: supabase.rpc('increment_xp_inline' as never),
      })
      .eq('id', referrer.id as string)

    // Simpler: just update count and xp directly
    await supabase
      .from('user_profiles')
      .update({
        referral_count: currentCount + 1,
        referral_xp: currentXP + 500,
      })
      .eq('id', referrer.id as string)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Referral POST error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
