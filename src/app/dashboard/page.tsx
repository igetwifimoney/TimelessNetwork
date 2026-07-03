'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import {
  Flame, CheckSquare, Square, ChevronRight,
  TrendingUp, Users, Star, Zap, ArrowRight, Play, CheckCircle, X
} from 'lucide-react'

const MISSIONS = [
  { id: 1, text: 'Upload one product video', xp: 50, done: false },
  { id: 2, text: 'Watch Module 8', xp: 100, done: false },
  { id: 3, text: 'Message one creator in community', xp: 25, done: false },
  { id: 4, text: 'Complete daily check-in', xp: 20, done: true },
]

const WINS = [
  { avatar: 'MK', name: 'Marcus K.', msg: '+$3,200 today — new daily record 🔥', time: '8m ago', type: 'money' },
  { avatar: 'JR', name: 'Jade R.', msg: 'First $1k month achieved', time: '41m ago', type: 'money' },
  { avatar: 'SK', name: 'Sofia K.', msg: 'Viral video — 1.7M views overnight', time: '2h ago', type: 'viral' },
  { avatar: 'TC', name: 'Tyler C.', msg: '30-day streak maintained ✅', time: '3h ago', type: 'streak' },
]

const ONLINE_NOW = 487

export default function DashboardPage() {
  const [missions, setMissions] = useState(MISSIONS)
  const [toast, setToast]       = useState<'success' | 'canceled' | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const payment = searchParams.get('payment')
    if (payment === 'success') {
      setToast('success')
      // Remove query param from URL without reload
      window.history.replaceState({}, '', '/dashboard')
      setTimeout(() => setToast(null), 6000)
    } else if (payment === 'canceled') {
      setToast('canceled')
      window.history.replaceState({}, '', '/dashboard')
      setTimeout(() => setToast(null), 4000)
    }
  }, [searchParams])

  const toggle = (id: number) =>
    setMissions(prev => prev.map(m => m.id === id ? { ...m, done: !m.done } : m))

  const done = missions.filter(m => m.done).length
  const total = missions.length
  const pct = Math.round((done / total) * 100)

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />

      {/* ── Payment toast ───────────────────────────────────── */}
      {toast && (
        <div
          className="fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-medium shadow-2xl"
          style={toast === 'success'
            ? { background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.25)', color: '#34D399' }
            : { background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.2)', color: '#F87171' }
          }
          role="status"
          aria-live="polite"
        >
          {toast === 'success'
            ? <CheckCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            : <X className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          }
          {toast === 'success'
            ? "Payment successful — welcome to Timeless! 🎉"
            : "Payment canceled. No charge was made."
          }
          <button
            onClick={() => setToast(null)}
            className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <main className="flex-1 overflow-y-auto" id="main-content">
        <div className="max-w-5xl mx-auto px-6 py-8">

          {/* Header */}
          <header className="mb-10">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1.5 glass px-3 py-1 rounded-full" role="status" aria-label={`${ONLINE_NOW} members currently online`}>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                <span className="text-emerald-400 text-xs font-medium">{ONLINE_NOW} members online</span>
              </div>
            </div>
            <h1 className="text-4xl font-black mb-1">Welcome back, Ty 👋</h1>
            <p className="text-gray-500">Here&apos;s what&apos;s on your plate today.</p>
          </header>

          <div className="grid lg:grid-cols-3 gap-5">

            {/* ── TODAY'S MISSIONS ── */}
            <div className="lg:col-span-2 space-y-5">
              <section className="card rounded-2xl overflow-hidden" aria-labelledby="missions-heading">
                {/* Mission header */}
                <div className="px-6 pt-6 pb-4 border-b border-white/[0.04]">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 id="missions-heading" className="font-bold text-lg">Today&apos;s Missions</h2>
                      <p className="text-xs text-gray-500 mt-0.5" aria-live="polite">{done} of {total} complete · {pct}%</p>
                    </div>
                    <div className="text-right" aria-label="Daily XP progress">
                      <div className="text-xs text-gray-600 mb-1">Daily XP</div>
                      <div className="text-sm font-bold text-[#4F8EF7]" aria-live="polite">
                        {missions.filter(m => m.done).reduce((a, m) => a + m.xp, 0)} / {missions.reduce((a, m) => a + m.xp, 0)}
                      </div>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div
                    className="w-full h-1 bg-white/5 rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Mission progress: ${pct}%`}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #4F8EF7, #60A5FA)' }}
                    />
                  </div>
                </div>

                {/* Mission list */}
                <ul className="divide-y divide-white/[0.03]" aria-label="Daily missions">
                  {missions.map(m => (
                    <li key={m.id}>
                      <button
                        onClick={() => toggle(m.id)}
                        className="w-full flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors text-left"
                        aria-pressed={m.done}
                        aria-label={`${m.done ? 'Unmark' : 'Complete'} mission: ${m.text} — ${m.xp} XP`}
                      >
                        <div className={`flex-shrink-0 transition-colors ${m.done ? 'text-[#4F8EF7]' : 'text-gray-700'}`} aria-hidden="true">
                          {m.done
                            ? <CheckSquare className="w-5 h-5" />
                            : <Square className="w-5 h-5" />
                          }
                        </div>
                        <span className={`flex-1 text-sm font-medium transition-colors ${m.done ? 'line-through text-gray-600' : 'text-gray-200'}`}>
                          {m.text}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-semibold text-[#4F8EF7] flex-shrink-0" aria-label={`${m.xp} XP`}>
                          <Zap className="w-3 h-3" aria-hidden="true" />
                          {m.xp}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Continue Course */}
              <section className="card rounded-2xl p-6" aria-labelledby="course-heading">
                <div className="flex items-center justify-between mb-4">
                  <h2 id="course-heading" className="font-bold">Continue Course</h2>
                  <a href="/courses" className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1">
                    All modules <ChevronRight className="w-3 h-3" aria-hidden="true" />
                  </a>
                </div>
                <div className="glass rounded-xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl glass-blue flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <Play className="w-5 h-5 text-[#4F8EF7]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-[#4F8EF7] font-semibold mb-1">Module 8 · Lesson 3</div>
                    <div className="text-sm font-bold mb-2">Scaling Your Content System</div>
                    <div
                      className="w-full h-1 bg-white/5 rounded-full overflow-hidden"
                      role="progressbar"
                      aria-valuenow={62}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Course progress: 62%"
                    >
                      <div className="h-full rounded-full" style={{ width: '62%', background: 'linear-gradient(90deg, #4F8EF7, #60A5FA)' }} />
                    </div>
                    <div className="text-xs text-gray-600 mt-1">62% complete</div>
                  </div>
                  <a href="/courses" className="btn-blue px-4 py-2.5 rounded-lg text-sm flex-shrink-0" aria-label="Resume Module 8, Lesson 3">
                    <span>Resume</span>
                  </a>
                </div>
              </section>
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="space-y-5">

              {/* Stats */}
              <section className="card rounded-2xl p-5" aria-labelledby="stats-heading">
                <h2 id="stats-heading" className="font-bold text-sm mb-5">Your Stats</h2>
                <dl className="space-y-4">
                  {[
                    { icon: Flame, iconColor: 'text-orange-400', label: 'Current Streak', value: '31 Days 🔥' },
                    { icon: Zap,   iconColor: 'text-[#4F8EF7]', label: 'Total XP',        value: '3,240 XP' },
                    { icon: TrendingUp, iconColor: 'text-emerald-400', label: 'Leaderboard', value: '#124 this week' },
                    { icon: Users, iconColor: 'text-purple-400', label: 'Community Online', value: `${ONLINE_NOW} members`, green: true },
                  ].map(({ icon: Icon, iconColor, label, value, green }) => (
                    <div key={label} className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg glass-blue flex items-center justify-center flex-shrink-0" aria-hidden="true">
                        <Icon className={`w-4 h-4 ${iconColor}`} />
                      </div>
                      <div>
                        <dt className="text-xs text-gray-500">{label}</dt>
                        <dd className={`text-sm font-bold ${green ? 'text-emerald-400' : ''}`}>{green ? `● ${value}` : value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </section>

              {/* Latest Wins */}
              <section className="card rounded-2xl p-5" aria-labelledby="wins-heading">
                <div className="flex items-center justify-between mb-4">
                  <h2 id="wins-heading" className="font-bold text-sm flex items-center gap-2">
                    <Star className="w-3.5 h-3.5 text-[#4F8EF7]" aria-hidden="true" />
                    Latest Wins
                  </h2>
                  <a href="/community" className="text-xs text-gray-600 hover:text-white transition-colors" aria-label="See all community posts">
                    All →
                  </a>
                </div>
                <ul className="space-y-3" aria-label="Recent member wins">
                  {WINS.map((w, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #4F8EF7, #2563EB)' }}
                        aria-hidden="true"
                      >
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
                <a
                  href="/community"
                  className="mt-4 w-full glass rounded-lg py-2.5 text-xs text-center text-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-1.5"
                >
                  View community feed <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </a>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
