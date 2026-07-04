import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const TY_EMAIL = 'tygirbaughn@gmail.com'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll() {},
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.email !== TY_EMAIL) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { message, channel } = await request.json()
    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 })
    }

    const { error } = await supabase.from('community_posts').insert({
      user_id: user.id,
      channel: channel ?? 'announcements',
      content: message.trim(),
    })

    if (error) {
      console.error('Announce error:', error)
      return NextResponse.json({ error: 'Failed to post' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Announce error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
