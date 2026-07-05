import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { content } = (await req.json()) as { content: string }
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const fullName: string = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Member'
    const avatar = fullName.split(' ').map((n: string) => n[0] ?? '').join('').toUpperCase().slice(0, 2) || 'M'

    const { data: reply, error } = await supabase
      .from('community_replies')
      .insert({
        post_id: params.postId,
        user_id: user.id,
        avatar,
        name: fullName,
        content,
        likes: 0,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ reply })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
