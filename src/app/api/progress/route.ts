import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

// POST /api/progress — mark a lesson complete and award XP
export async function POST(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    // Verify user is logged in
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { courseSlug, lessonSlug, xp } = await req.json() as {
      courseSlug: string
      lessonSlug: string
      xp: number
    }

    if (!courseSlug || !lessonSlug || typeof xp !== 'number') {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Insert progress record (unique constraint prevents double-awarding XP)
    const { error: progressError } = await supabase
      .from('course_progress')
      .insert({
        user_id: user.id,
        course_slug: courseSlug,
        lesson_slug: lessonSlug,
        xp_awarded: xp,
      })

    if (progressError) {
      // 23505 = unique_violation — lesson already completed
      if (progressError.code === '23505') {
        return NextResponse.json({ alreadyCompleted: true })
      }
      throw progressError
    }

    // Award XP to user profile
    const { error: xpError } = await supabase.rpc('increment_xp', {
      user_id_arg: user.id,
      xp_amount: xp,
    })

    if (xpError) {
      console.error('XP increment error:', xpError)
      // Don't fail the request — progress was still saved
    }

    return NextResponse.json({ success: true, xpAwarded: xp })
  } catch (err) {
    console.error('Progress API error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// GET /api/progress — get all completed lessons for the current user
export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ completedLessons: [] })
    }

    const { data, error } = await supabase
      .from('course_progress')
      .select('course_slug, lesson_slug, completed_at, xp_awarded')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ completedLessons: data ?? [] })
  } catch (err) {
    console.error('Progress GET error:', err)
    return NextResponse.json({ completedLessons: [] })
  }
}
