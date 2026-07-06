import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

/**
 * GET /api/missions/status
 * Returns which mission types the current user has completed today.
 * Used by the dashboard to auto-verify missions.
 */
export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ lessonToday: false, communityToday: false, trackerToday: false })
    }

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const iso = todayStart.toISOString()

    // Check if user completed any lesson today
    const { data: lessons } = await supabase
      .from('course_progress')
      .select('id')
      .eq('user_id', user.id)
      .gte('completed_at', iso)
      .limit(1)

    // Check if user posted in community today
    const { data: posts } = await supabase
      .from('community_posts')
      .select('id')
      .eq('user_id', user.id)
      .gte('created_at', iso)
      .limit(1)

    // Check if user added to product tracker today
    const { data: tracked } = await supabase
      .from('product_tracker')
      .select('id')
      .eq('user_id', user.id)
      .gte('created_at', iso)
      .limit(1)

    return NextResponse.json({
      lessonToday:    (lessons   ?? []).length > 0,
      communityToday: (posts     ?? []).length > 0,
      trackerToday:   (tracked   ?? []).length > 0,
    })
  } catch (err) {
    console.error('[missions/status]', err)
    return NextResponse.json({ lessonToday: false, communityToday: false, trackerToday: false })
  }
}
