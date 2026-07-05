import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

function makeSupabase() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )
}

export async function GET() {
  try {
    const supabase = makeSupabase()
    const { data: posts, error } = await supabase
      .from('community_posts')
      .select('*, community_replies(*)')
      .order('created_at', { ascending: false })
      .limit(200)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ posts: posts ?? [] })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { channel, content, is_win } = (await req.json()) as {
      channel: string; content: string; is_win?: boolean
    }

    const supabase = makeSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const fullName: string = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Member'
    const avatar = fullName.split(' ').map((n: string) => n[0] ?? '').join('').toUpperCase().slice(0, 2) || 'M'

    const { data: post, error } = await supabase
      .from('community_posts')
      .insert({
        user_id: user.id,
        avatar,
        name: fullName,
        role: 'Member',
        channel,
        content,
        is_win: is_win ?? false,
        likes: 0,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ post })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
