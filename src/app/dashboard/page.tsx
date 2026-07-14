'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import { getTodaysPlan, getGreeting, getDayName } from '@/data/missions'
import { ACHIEVEMENTS, getUnlockedAchievements, type AchievementStats } from '@/data/achievements'
import { COURSES } from '@/data/courses'
import { createClient, isSupabaseConfigured } from '@/lib/supabase'
import {
  CheckSquare, Square, Zap, ArrowRight, Play,
  CheckCircle, X, Loader2, Flame, TrendingUp,
  Star, Trophy, ChevronRight, Users, Calendar, BookOpen, MessageSquare
} from 'lucide-react'
import type { UserStats } from '@/app/api/user-stats/route'

const WINS = [
  { avatar: 'MK', name: 'Marcus K.', msg: '+$3,200 today — new daily record 🔥', time: '8m ago' },
  { avatar: 'JR', name: 'Jade R.',   msg: 'First $1k month achieved 🎉',        time: '41m ago' },
  { avatar: 'SK', name: 'Sofia K.',  msg: 'Viral video — 1.7M views overnight', time: '2h ago'  },
  { avatar: 'TC', name: 'Tyler C.',  msg: '30-day streak maintained ✅',         time: '3h ago'  },
]

// Next live call — update this to your real schedule
const NEXT_LIVE = {
  title: 'Weekly Live Q&A',
  date: (() => {
    // Next Sunday at 7pm ET
    const d = new Date()
    const daysUntilSunday = (7 - d.getDay()) % 7 || 7
    d.setDate(d.getDate() + daysUntilSunday)
    d.setHours(19, 0, 0, 0)
    return d
  })(),
}

function useCountdown(target: Date) {
  const [timeLeft, setTimeLeft] = useState('')
  useEffect(() => {
    const calc = () => {
      const diff = target.getTime() - Date.now()
      if (diff <= 0) { setTimeLeft('Live now!'); return }
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      setTimeLeft(d > 0 ? `${d}d ${h}h ${m}m` : `${h}h ${m}m`)
    }
    calc()
    const t = setInterval(calc, 60000)
    return () => clearInterval(t)
  }, [target])
  return timeLeft
}

function PaymentToast() {
  const [toast, setToast] = useState<'success' | 'canceled' | null>(null)
  const searchParams = useSearchParams()
  useEffect(() => {
    const p = searchParams.get('payment')
    if (p === 'success') { setToast('success'); window.history.replaceState({}, '', '/dashboard'); setTimeout(() => setToast(null), 6000) }
    else if (p === 'canceled') { setToast('canceled'); window.history.replaceState({}, '', '/dashboard'); setTimeout(() => setToast(null), 4000) }
  }, [searchParams])
  if (!toast) return null
  return (
    <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-medium shadow-2xl"
      style={toast === 'success'
        ? { background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.25)', color: '#34D399' }
        : { background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.2)', color: '#F87171' }}
      role="status" aria-live="polite">
      {toast === 'success' ? <CheckCircle className="w-4 h-4" /> : <X className="w-4 h-4" />}
      {toast === 'success' ? 'Payment successful — welcome to Timeless! 🎉' : 'Payment canceled. No charge was made.'}
      <button onClick={() => setToast(null)} className="ml-2 opacity-60 hover:opacity-100" aria-label="Dismiss"><X className="w-3.5 h-3.5" /></button>
    </div>
  )
}

export default function DashboardPage() {
  const plan = getTodaysPlan()
  const [missions, setMissions] = useState(plan.missions.map(m => ({ ...m, done: false })))
  const [stats, setStats] = useState<UserStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [firstName, setFirstName] = useState('')
  const countdown = useCountdown(NEXT_LIVE.date)

  useEffect(() => {
    // Fetch real stats
    fetch('/api/user-stats').then(r => r.json()).then(setStats).catch(() => {}).finally(() => setStatsLoading(false))
    // Get user's first name from Supabase session
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      supabase.auth.getUser().then(({ data }) => {
        const fullName: string = data.user?.user_metadata?.full_name ?? data.user?.email ?? ''
        setFirstName(fullName.split(' ')[0])
      }).catch(() => {})
    }
    // Load completed lessons from localStorage
    const completed: string[] = []
    COURSES.forEach(course => {
      course.lessons.forEach(lesson => {
        if (localStorage.getItem(`completed:${course.slug}:${lesson.slug}`)) {
          completed.push(`${course.slug}:${lesson.slug}`)
        }
      })
    })
    setCompletedLessons(completed)
    // Fetch mission verification status from API (auto-checks based on real actions)
    fetch('/api/missions/status')
      .then(r => r.json())
      .then(({ lessonToday, communityToday, trackerToday }) => {
        setMissions(plan.missions.map(m => ({
          ...m,
          done: m.verify === 'lesson'    ? lessonToday
              : m.verify === 'community' ? communityToday
              : m.verify === 'tracker'   ? trackerToday
              : false,
        })))
      })
      .catch(() => {})
  }, [])

  const verifiableMissions = missions.filter(m => m.verify !== null)
  const done = verifiableMissions.filter(m => m.done).length
  const pct = verifiableMissions.length > 0 ? Math.round((done / verifiableMissions.length) * 100) : 0
  const xp = stats?.xp ?? 0
  const streak = stats?.streakCount ?? 0
  const rank = stats?.leaderboardRank
  const totalMembers = stats?.totalMembers ?? 1200

  // Achievement stats from local + real data
  const achievementStats: AchievementStats = {
    xp,
    streakCount: streak,
    lessonsCompleted: completedLessons.length,
    coursesCompleted: 0,
    postsCount: 0,
  }
  const unlocked = getUnlockedAchievements(achievementStats)

  // Find the last lesson completed + next lesson to suggest
  const lastCompleted = completedLessons[completedLessons.length - 1]
  let suggestedCourse = COURSES[0]
  let suggestedLesson = COURSES[0].lessons[0]
  if (lastCompleted) {
    const [cSlug, lSlug] = lastCompleted.split(':')
    const cIdx = COURSES.findIndex(c => c.slug === cSlug)
    if (cIdx !== -1) {
      const course = COURSES[cIdx]
      const lIdx = course.lessons.findIndex(l => l.slug === lSlug)
      if (lIdx !== -1 && lIdx + 1 < course.lessons.length) {
        suggestedCourse = course
        suggestedLesson = course.lessons[lIdx + 1]
      } else if (cIdx + 1 < COURSES.length) {
        suggestedCourse = COURSES[cIdx + 1]
        suggestedLesson = COURSES[cIdx + 1].lessons[0]
      }
    }
  }

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <Suspense fallback={null}><PaymentToast /></Suspense>

      <main className="flex-1 overflow-y-auto" id="main-content">
        <div className="max-w-5xl mx-auto px-4 py-6 lg:px-6 lg:py-8 pb-28 lg:pb-8">

          {/* ── HERO HEADER ── */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-emerald-400"
                style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.15)' }}
                role="status">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                487 members online
              </div>
              <div className="px-3 py-1 rounded-full text-xs font-medium text-[#a855f7]"
                style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.15)' }}>
                {getDayName()} — {plan.theme}
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black mb-1">
              {getGreeting()}{firstName ? `, ${firstName}` : ''} 👋
            </h1>
            <p className="text-gray-500 text-sm">{plan.tagline}</p>
          </header>

          {/* ── STATS ROW ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {[
              {
                icon: Flame, color: 'text-orange-400', bg: 'rgba(251,146,60,0.08)', border: 'rgba(251,146,60,0.15)',
                label: 'Streak', value: statsLoading ? '—' : streak > 0 ? `${streak} Days 🔥` : 'Start today',
              },
              {
                icon: Zap, color: 'text-[#a855f7]', bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.15)',
                label: 'Total XP', value: statsLoading ? '—' : `${xp.toLocaleString()} XP`,
              },
              {
                icon: TrendingUp, color: 'text-emerald-400', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.15)',
                label: 'Rank', value: statsLoading ? '—' : rank ? `#${rank.toLocaleString()} of ${totalMembers.toLocaleString()}` : 'Unranked',
              },
              {
                icon: Trophy, color: 'text-yellow-400', bg: 'rgba(250,204,21,0.08)', border: 'rgba(250,204,21,0.15)',
                label: 'Badges', value: `${unlocked.length} / ${ACHIEVEMENTS.length}`,
              },
            ].map(({ icon: Icon, color, bg, border, label, value }) => (
              <div key={label} className="card rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: bg, border: `1px solid ${border}` }} aria-hidden="true">
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <div className="text-xs text-gray-500">{label}</div>
                  <div className="text-sm font-bold">{value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            {/* ── LEFT 2/3 ── */}
            <div className="lg:col-span-2 space-y-5">

              {/* Today's Missions */}
              <section className="card rounded-2xl overflow-hidden" aria-labelledby="missions-heading">
                <div className="px-6 pt-5 pb-4 border-b border-white/[0.04]">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h2 id="missions-heading" className="font-bold text-base">Today&apos;s Missions</h2>
                      <p className="text-xs text-gray-500 mt-0.5">{done} of {verifiableMissions.length} complete · {pct}%</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-600">XP Available</div>
                      <div className="text-sm font-bold text-[#a855f7]">
                        {missions.reduce((a, m) => a + m.xp, 0)} XP
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}
                    role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #a855f7, #c084fc)' }} />
                  </div>
                </div>
                <ul className="divide-y divide-white/[0.03]">
                  {missions.map(m => {
                    // Verifiable mission — shows real check state, no manual clicking
                    if (m.verify !== null) {
                      return (
                        <li key={m.id} className="flex items-center gap-0">
                          <div className="flex-1 flex items-center gap-4 px-6 py-4">
                            <div className={`flex-shrink-0 ${m.done ? 'text-[#a855f7]' : 'text-gray-700'}`} aria-hidden="true">
                              {m.done ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                            </div>
                            <span className="text-lg flex-shrink-0" aria-hidden="true">{m.emoji}</span>
                            <span className={`flex-1 text-sm font-medium ${m.done ? 'line-through text-gray-600' : 'text-gray-200'}`}>
                              {m.text}
                            </span>
                            <span className="flex items-center gap-1 text-xs font-semibold text-[#a855f7] flex-shrink-0">
                              <Zap className="w-3 h-3" />{m.xp}
                            </span>
                          </div>
                          {m.link && !m.done && (
                            <Link href={m.link} className="px-3 py-4 text-gray-700 hover:text-[#a855f7] transition-colors flex-shrink-0"
                              aria-label={`Go to ${m.text}`}>
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                          )}
                        </li>
                      )
                    }
                    // Unverifiable mission (TikTok/IRL) — task reminder only, no checkbox
                    return (
                      <li key={m.id} className="flex items-center gap-0 opacity-70">
                        <div className="flex-1 flex items-center gap-4 px-6 py-4">
                          <div className="flex-shrink-0 text-gray-700 w-5 h-5 flex items-center justify-center" aria-hidden="true">
                            <span className="w-2 h-2 rounded-full bg-gray-700 block" />
                          </div>
                          <span className="text-lg flex-shrink-0" aria-hidden="true">{m.emoji}</span>
                          <span className="flex-1 text-sm font-medium text-gray-500">{m.text}</span>
                          <span className="text-[10px] text-gray-700 font-medium flex-shrink-0">TikTok</span>
                        </div>
                        {m.link && (
                          <Link href={m.link} className="px-3 py-4 text-gray-700 hover:text-[#a855f7] transition-colors flex-shrink-0"
                            aria-label={`Go to ${m.text}`}>
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </section>

              {/* Continue Learning */}
              <section className="card rounded-2xl p-5" aria-labelledby="continue-heading">
                <div className="flex items-center justify-between mb-4">
                  <h2 id="continue-heading" className="font-bold">Continue Learning</h2>
                  <Link href="/courses" className="text-xs text-gray-500 hover:text-white flex items-center gap-1 transition-colors">
                    All courses <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                <Link href={`/courses/${suggestedCourse.slug}/${suggestedLesson.slug}`}
                  className="glass rounded-xl p-4 flex items-center gap-4 group hover:border-[#a855f7]/20 transition-all block"
                  style={{ border: '1px solid rgba(255,255,255,0.04)' }}
                  aria-label={`Continue: ${suggestedLesson.title}`}>
                  <div className="w-12 h-12 rounded-xl glass-blue flex items-center justify-center flex-shrink-0 text-xl" aria-hidden="true">
                    {suggestedCourse.badge}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-[#a855f7] font-semibold mb-0.5 truncate">{suggestedCourse.title}</div>
                    <div className="text-sm font-bold mb-1 truncate">{suggestedLesson.title}</div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <BookOpen className="w-3 h-3" />{suggestedLesson.duration}
                      <Zap className="w-3 h-3 text-[#a855f7]" /><span className="text-[#a855f7]">{suggestedLesson.xp} XP</span>
                    </div>
                  </div>
                  <div className="btn-blue px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 flex-shrink-0 group-hover:gap-3 transition-all">
                    <Play className="w-3.5 h-3.5" />Start
                  </div>
                </Link>
              </section>

              {/* Recent Achievements */}
              {unlocked.length > 0 && (
                <section className="card rounded-2xl p-5" aria-labelledby="achievements-heading">
                  <div className="flex items-center justify-between mb-4">
                    <h2 id="achievements-heading" className="font-bold flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-400" aria-hidden="true" />
                      Recent Achievements
                    </h2>
                    <Link href="/profile" className="text-xs text-gray-500 hover:text-white transition-colors">
                      View all →
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {unlocked.slice(0, 8).map(a => (
                      <div key={a.id} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium"
                        style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.12)' }}
                        title={a.description}>
                        <span aria-hidden="true">{a.emoji}</span>
                        <span className="text-gray-300">{a.title}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* ── RIGHT 1/3 ── */}
            <div className="space-y-5">

              {/* Discord Community */}
              <section
                className="rounded-2xl p-5 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(88,101,242,0.12), rgba(88,101,242,0.04))',
                  border: '1px solid rgba(88,101,242,0.25)',
                }}
                aria-labelledby="discord-heading"
              >
                <div className="absolute top-0 right-0 w-28 h-28 pointer-events-none" style={{ background: 'radial-gradient(circle at top right, rgba(88,101,242,0.15), transparent 70%)' }} aria-hidden="true" />
                <div className="relative">
                  <div className="flex items-center gap-2.5 mb-3">
                    {/* Discord logo mark */}
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(88,101,242,0.2)', border: '1px solid rgba(88,101,242,0.3)' }}>
                      <MessageSquare className="w-4.5 h-4.5 text-indigo-400" style={{ width: '18px', height: '18px' }} aria-hidden="true" />
                    </div>
                    <div>
                      <h2 id="discord-heading" className="font-bold text-sm leading-tight">Join the Discord</h2>
                      <div className="text-xs text-gray-500">Members-only community</div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4">
                    Connect with the crew, share wins, get feedback on your content, and stay plugged in between live calls.
                  </p>
                  <a
                    href="https://discord.gg/TcuZ5u6TMw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-200 hover:opacity-90"
                    style={{ background: '#5865F2', color: '#fff' }}
                    aria-label="Join Timeless Discord server"
                  >
                    <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                    Join Discord
                  </a>
                </div>
              </section>

              {/* Upcoming Live Call */}
              <section className="card rounded-2xl p-5" aria-labelledby="live-heading">
                <h2 id="live-heading" className="font-bold text-sm mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
                  Upcoming Live Call
                </h2>
                <div className="text-center py-2">
                  <div className="text-sm font-bold mb-1">{NEXT_LIVE.title}</div>
                  <div className="text-xs text-gray-500 mb-3">
                    {NEXT_LIVE.date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} @ 7pm ET
                  </div>
                  <div className="text-2xl font-black gradient-text-blue mb-3" aria-live="polite">{countdown}</div>
                  <Link href="/community"
                    className="w-full btn-premium py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    Add to Calendar
                  </Link>
                </div>
              </section>

              {/* Latest Wins */}
              <section className="card rounded-2xl p-5" aria-labelledby="wins-heading">
                <div className="flex items-center justify-between mb-4">
                  <h2 id="wins-heading" className="font-bold text-sm flex items-center gap-2">
                    <Star className="w-3.5 h-3.5 text-[#a855f7]" aria-hidden="true" />
                    Latest Wins
                  </h2>
                  <Link href="/community" className="text-xs text-gray-600 hover:text-white transition-colors">All →</Link>
                </div>
                <ul className="space-y-3">
                  {WINS.map((w, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }} aria-hidden="true">
                        {w.avatar}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-gray-300 truncate">{w.name}</div>
                        <div className="text-xs text-gray-500 leading-snug mt-0.5">{w.msg}</div>
                        <time className="text-xs text-gray-700 mt-0.5 block">{w.time}</time>
                      </div>
                    </li>
                  ))}
                </ul>
                <Link href="/community"
                  className="mt-4 w-full glass rounded-lg py-2.5 text-xs text-center text-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-1.5">
                  View community feed <ArrowRight className="w-3 h-3" />
                </Link>
              </section>

              {/* Quick Links */}
              <section className="card rounded-2xl p-5" aria-labelledby="quicklinks-heading">
                <h2 id="quicklinks-heading" className="font-bold text-sm mb-4">Quick Links</h2>
                <div className="space-y-1.5">
                  {[
                    { href: '/courses',    icon: BookOpen,    label: 'Browse Courses',   color: 'text-[#a855f7]' },
                    { href: '/resources',  icon: Star,        label: 'Resources Library', color: 'text-yellow-400' },
                    { href: '/tracker',    icon: TrendingUp,  label: 'Product Tracker',   color: 'text-emerald-400' },
                    { href: '/coach',      icon: Zap,         label: 'AI Coach',          color: 'text-purple-400' },
                    { href: '/community',  icon: Users,       label: 'Community',         color: 'text-pink-400' },
                  ].map(({ href, icon: Icon, label, color }) => (
                    <Link key={href} href={href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/[0.03] transition-all group"
                      style={{ border: '1px solid transparent' }}>
                      <Icon className={`w-4 h-4 ${color} flex-shrink-0`} aria-hidden="true" />
                      {label}
                      <ChevronRight className="w-3.5 h-3.5 ml-auto text-gray-700 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
