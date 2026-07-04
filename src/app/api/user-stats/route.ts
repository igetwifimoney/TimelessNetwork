import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export interface UserStats {
  xp: number
  streakCount: number
  leaderboardRank: number | null
  totalMembers: number
}

// GET /api/user-stats — returns XP, streak, leaderboard rank for the current user
// Also updates the login streak (call this on dashboard load)
export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json<UserStats>({
        xp: 0,
        streakCount: 0,
        leaderboardRank: null,
        totalMembers: 0,
      })
    }

    // Get current profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('xp, streak_count, last_login_date')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json<UserStats>({ xp: 0, streakCount: 0, leaderboardRank: null, totalMembers: 0 })
    }

    // Update streak
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    const lastLogin = profile.last_login_date

    let newStreak = profile.streak_count
    if (lastLogin !== today) {
      if (lastLogin === yesterday) {
        // Consecutive day — extend streak
        newStreak = profile.streak_count + 1
      } else if (!lastLogin) {
        // First ever login
        newStreak = 1
      } else {
        // Missed a day — reset
        newStreak = 1
      }

      // Update in DB
      await supabase
        .from('user_profiles')
        .update({ streak_count: newStreak, last_login_date: today })
        .eq('id', user.id)
    }

    // Get leaderboard rank — query the leaderboard view
    const { data: rankData } = await supabase
      .from('leaderboard')
      .select('rank')
      .eq('id', user.id)
      .single()

    // Total members count
    const { count: totalMembers } = await supabase
      .from('user_profiles')
      .select('id', { count: 'exact', head: true })

    return NextResponse.json<UserStats>({
      xp: profile.xp,
      streakCount: newStreak,
      leaderboardRank: rankData?.rank ?? null,
      totalMembers: totalMembers ?? 0,
    })
  } catch (err) {
    console.error('User stats error:', err)
    return NextResponse.json<UserStats>({ xp: 0, streakCount: 0, leaderboardRank: null, totalMembers: 0 })
  }
}
