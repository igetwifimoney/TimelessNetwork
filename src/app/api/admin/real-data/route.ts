import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET() {
  try {
    const db = serviceClient()

    // Fetch all users via admin API
    const { data: { users }, error } = await db.auth.admin.listUsers({ perPage: 1000 })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const totalUsers = users.length

    const recent = users
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 20)
      .map(u => ({
        id: u.id,
        name: (u.user_metadata?.full_name as string | undefined) ?? u.email?.split('@')[0] ?? 'Member',
        email: u.email ?? '',
        created_at: u.created_at,
        last_sign_in: u.last_sign_in_at ?? null,
        confirmed: !!u.confirmed_at,
      }))

    // Signups in last 7 days
    const weekAgo = Date.now() - 7 * 86400000
    const newThisWeek = users.filter(u => new Date(u.created_at).getTime() > weekAgo).length

    // Signups in last 30 days
    const monthAgo = Date.now() - 30 * 86400000
    const newThisMonth = users.filter(u => new Date(u.created_at).getTime() > monthAgo).length

    return NextResponse.json({ totalUsers, newThisWeek, newThisMonth, recent })
  } catch (err) {
    console.error('[admin/real-data]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
