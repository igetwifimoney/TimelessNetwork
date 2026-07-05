import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { delta } = (await req.json()) as { delta: 1 | -1 }
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    )

    const { data: post } = await supabase
      .from('community_posts')
      .select('likes')
      .eq('id', params.postId)
      .single()

    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const newLikes = Math.max(0, (post.likes ?? 0) + delta)
    await supabase
      .from('community_posts')
      .update({ likes: newLikes })
      .eq('id', params.postId)

    return NextResponse.json({ likes: newLikes })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
