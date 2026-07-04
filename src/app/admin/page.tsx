import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Users, TrendingUp, BookOpen, Star, Shield } from 'lucide-react'
import AdminAnnouncement from './AdminAnnouncement'

const TY_EMAIL = 'tygirbaughn@gmail.com'

async function getAdminData() {
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
  if (!user || user.email !== TY_EMAIL) return null

  const [{ data: profiles }, { data: progressRows }] = await Promise.all([
    supabase
      .from('user_profiles')
      .select('id, full_name, email, xp, streak_count, created_at')
      .order('xp', { ascending: false }),
    supabase
      .from('course_progress')
      .select('user_id, course_slug, lesson_slug'),
  ])

  const totalMembers = profiles?.length ?? 0
  const totalXP = profiles?.reduce((s, p) => s + (p.xp ?? 0), 0) ?? 0
  const avgXP = totalMembers > 0 ? Math.round(totalXP / totalMembers) : 0

  // Learners who have completed at least one lesson
  const activeUserIds = new Set((progressRows ?? []).map(r => r.user_id))
  const activeCount = activeUserIds.size

  // Course engagement: unique learners per course
  const courseMap: Record<string, Set<string>> = {}
  for (const row of progressRows ?? []) {
    if (!courseMap[row.course_slug]) courseMap[row.course_slug] = new Set()
    courseMap[row.course_slug].add(row.user_id)
  }
  const topCourses = Object.entries(courseMap)
    .map(([slug, users]) => ({ slug, count: users.size }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  return { profiles: profiles ?? [], totalMembers, activeCount, avgXP, topCourses }
}

export default async function AdminPage() {
  const data = await getAdminData()
  if (!data) redirect('/dashboard')

  const { profiles, totalMembers, activeCount, avgXP, topCourses } = data

  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6 lg:py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.15)' }}>
            <Shield className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Admin Dashboard</h1>
            <p className="text-xs text-gray-500">Ty-only · Real-time platform data</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total Members', value: totalMembers, icon: <Users className="w-4 h-4 text-gray-400" />, color: 'text-white' },
            { label: 'Active Learners', value: activeCount, icon: <TrendingUp className="w-4 h-4 text-green-400" />, color: 'text-green-400' },
            { label: 'Avg XP / Member', value: avgXP, icon: <Star className="w-4 h-4 text-yellow-400" />, color: 'text-yellow-400' },
            { label: 'Courses w/ Data', value: topCourses.length, icon: <BookOpen className="w-4 h-4 text-[#4F8EF7]" />, color: 'text-[#4F8EF7]' },
          ].map(s => (
            <div key={s.label} className="card rounded-2xl p-4">
              <div className="mb-2">{s.icon}</div>
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Course engagement */}
          <div className="card rounded-2xl p-5">
            <h2 className="font-bold text-sm mb-4">Course Engagement</h2>
            {topCourses.length === 0 ? (
              <p className="text-gray-600 text-sm">No lesson completions yet.</p>
            ) : (
              <div className="space-y-3">
                {topCourses.map((course, i) => {
                  const pct = topCourses[0].count > 0
                    ? Math.round((course.count / topCourses[0].count) * 100)
                    : 0
                  return (
                    <div key={course.slug}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-300 truncate mr-2 font-medium">{course.slug}</span>
                        <span className="text-gray-500 flex-shrink-0">{course.count} learners</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            background: i === 0
                              ? 'linear-gradient(90deg,#4F8EF7,#60A5FA)'
                              : 'rgba(255,255,255,0.18)'
                          }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Announcement */}
          <AdminAnnouncement />
        </div>

        {/* Member leaderboard */}
        <div className="card rounded-2xl p-5">
          <h2 className="font-bold text-sm mb-4">XP Leaderboard — All Members</h2>
          {profiles.length === 0 ? (
            <p className="text-gray-600 text-sm">No members yet.</p>
          ) : (
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-sm min-w-[500px]">
                <thead>
                  <tr className="text-left border-b border-white/5">
                    <th className="pb-2 pr-3 text-xs text-gray-600 font-medium">#</th>
                    <th className="pb-2 pr-3 text-xs text-gray-600 font-medium">Member</th>
                    <th className="pb-2 pr-3 text-xs text-gray-600 font-medium">XP</th>
                    <th className="pb-2 pr-3 text-xs text-gray-600 font-medium">Streak</th>
                    <th className="pb-2 text-xs text-gray-600 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.slice(0, 50).map((p, i) => (
                    <tr key={p.id} className="border-b border-white/4 hover:bg-white/2 transition-colors">
                      <td className="py-2.5 pr-3 text-gray-600 font-mono text-xs">{i + 1}</td>
                      <td className="py-2.5 pr-3">
                        <div className="font-medium text-sm">{p.full_name || 'Member'}</div>
                        {p.email && <div className="text-xs text-gray-600">{p.email}</div>}
                      </td>
                      <td className="py-2.5 pr-3 font-bold text-[#60A5FA]">{(p.xp ?? 0).toLocaleString()}</td>
                      <td className="py-2.5 pr-3 text-gray-400 text-sm">{p.streak_count ?? 0} 🔥</td>
                      <td className="py-2.5 text-gray-600 text-xs">
                        {new Date(p.created_at).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {profiles.length > 50 && (
                <p className="text-center text-xs text-gray-600 mt-3">
                  Showing top 50 of {profiles.length} members
                </p>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
