'use client'

import { useEffect, useState } from 'react'
import { Users, DollarSign, TrendingUp, BookOpen, Shield, ChevronRight, UserCheck, RefreshCw, Calendar, Zap } from 'lucide-react'

// ─── Mock / larp data ────────────────────────────────────
const MOCK_STATS = [
  { label: 'MRR',            value: '$52,400', change: '+8.2% MoM',       icon: DollarSign, color: '#34D399' },
  { label: 'Avg. Retention', value: '94%',     change: '↑ from 91%',      icon: TrendingUp, color: '#C084FC' },
  { label: 'Active Courses', value: '20',      change: 'Updated July 2026', icon: BookOpen,  color: '#FB923C' },
]

const MOCK_SIGNUPS = [
  { name: 'Alex M.',     email: 'alex@email.com', plan: 'Monthly', joined: '2h ago',  status: 'active'  },
  { name: 'Brittany K.', email: 'brit@email.com', plan: 'Annual',  joined: '5h ago',  status: 'active'  },
  { name: 'Carlos V.',   email: 'carv@email.com', plan: 'Monthly', joined: '1d ago',  status: 'trial'   },
  { name: 'Dana P.',     email: 'dana@email.com', plan: 'Monthly', joined: '2d ago',  status: 'churned' },
  { name: 'Evan R.',     email: 'evan@email.com', plan: 'Annual',  joined: '3d ago',  status: 'active'  },
]

const STATUS_COLORS: Record<string, string> = {
  active:  '#34D399',
  trial:   '#c084fc',
  churned: '#F87171',
}

const REVENUE_BARS = [40, 55, 45, 60, 70, 65, 80, 75, 90, 85, 95, 88, 100, 95]

// ─── Real data types ──────────────────────────────────────
interface RealUser {
  id: string
  name: string
  email: string
  created_at: string
  last_sign_in: string | null
  confirmed: boolean
}

interface RealData {
  totalUsers: number
  newThisWeek: number
  newThisMonth: number
  recent: RealUser[]
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function AdminPage() {
  const [realData, setRealData] = useState<RealData | null>(null)
  const [realLoading, setRealLoading] = useState(true)
  const [realError, setRealError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'real' | 'demo'>('real')

  function fetchReal() {
    setRealLoading(true)
    setRealError(null)
    fetch('/api/admin/real-data')
      .then(r => r.json())
      .then(data => {
        if (data.error) setRealError(data.error)
        else setRealData(data)
      })
      .catch(() => setRealError('Failed to load real data'))
      .finally(() => setRealLoading(false))
  }

  useEffect(() => { fetchReal() }, [])

  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6 lg:py-8">

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#a855f7' }}>
            <Shield className="w-3.5 h-3.5" />
            Admin Dashboard
          </div>
          <h1 className="text-3xl font-black mb-1">Overview</h1>
          <p className="text-gray-500">Platform analytics and member insights.</p>
        </header>

        {/* Tab switcher */}
        <div className="flex gap-2 mb-8">
          {(['real', 'demo'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-2 rounded-xl text-sm font-bold transition-all"
              style={activeTab === tab
                ? { background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.3)', color: '#c084fc' }
                : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#6B7280' }
              }
            >
              {tab === 'real' ? 'Overview' : 'Larp'}
            </button>
          ))}
        </div>

        {/* ══ REAL DATA TAB ══════════════════════════════════════════ */}
        {activeTab === 'real' && (
          <div className="space-y-6">

            {/* Real stats row */}
            <dl className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {realLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="card-premium p-5 animate-pulse">
                    <div className="h-8 bg-white/5 rounded mb-2" />
                    <div className="h-4 bg-white/5 rounded w-2/3" />
                  </div>
                ))
              ) : realError ? (
                <div className="col-span-4 text-sm text-red-400 card-premium p-4">{realError}</div>
              ) : realData ? (
                <>
                  <div className="card-premium p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
                        <Users className="w-4 h-4 text-[#a855f7]" />
                      </div>
                    </div>
                    <dd className="text-2xl font-black mb-0.5">{realData.totalUsers.toLocaleString()}</dd>
                    <dt className="text-xs text-gray-600">Total Signups</dt>
                  </div>
                  <div className="card-premium p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}>
                        <Zap className="w-4 h-4 text-emerald-400" />
                      </div>
                    </div>
                    <dd className="text-2xl font-black mb-0.5">{realData.newThisWeek}</dd>
                    <dt className="text-xs text-gray-600">New This Week</dt>
                  </div>
                  <div className="card-premium p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(192,132,252,0.1)', border: '1px solid rgba(192,132,252,0.2)' }}>
                        <Calendar className="w-4 h-4 text-purple-400" />
                      </div>
                    </div>
                    <dd className="text-2xl font-black mb-0.5">{realData.newThisMonth}</dd>
                    <dt className="text-xs text-gray-600">New This Month</dt>
                  </div>
                  <div className="card-premium p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.2)' }}>
                        <UserCheck className="w-4 h-4 text-orange-400" />
                      </div>
                    </div>
                    <dd className="text-2xl font-black mb-0.5">
                      {realData.recent.filter(u => u.confirmed).length}/{Math.min(20, realData.totalUsers)}
                    </dd>
                    <dt className="text-xs text-gray-600">Verified (recent 20)</dt>
                  </div>
                </>
              ) : null}
            </dl>

            {/* Real member table */}
            <section className="rounded-2xl overflow-hidden" style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <h2 className="font-bold text-sm">Real Members</h2>
                <button
                  onClick={fetchReal}
                  className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#a855f7] transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Refresh
                </button>
              </div>

              {realLoading ? (
                <div className="p-8 text-center text-gray-600 text-sm">Loading...</div>
              ) : realError ? (
                <div className="p-8 text-center text-red-400 text-sm">{realError}</div>
              ) : realData && realData.recent.length === 0 ? (
                <div className="p-8 text-center text-gray-600 text-sm">No signups yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        {['Name', 'Email', 'Joined', 'Last Active', 'Verified'].map(h => (
                          <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(realData?.recent ?? []).map((user, i) => (
                        <tr key={user.id} style={{ borderBottom: i < (realData?.recent.length ?? 0) - 1 ? '1px solid rgba(255,255,255,0.03)' : undefined }}>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                                style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}>
                                {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                              </div>
                              <span className="text-sm font-medium">{user.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-xs text-gray-500">{user.email}</td>
                          <td className="px-5 py-3 text-xs text-gray-500">{timeAgo(user.created_at)}</td>
                          <td className="px-5 py-3 text-xs text-gray-500">{user.last_sign_in ? timeAgo(user.last_sign_in) : '—'}</td>
                          <td className="px-5 py-3">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                              style={user.confirmed
                                ? { background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', color: '#34D399' }
                                : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#6B7280' }
                              }>
                              {user.confirmed ? 'Yes' : 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        )}

        {/* ══ DEMO / LARP TAB ════════════════════════════════════════ */}
        {activeTab === 'demo' && (
          <div className="space-y-6">
            {/* Stats */}
            <dl className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {MOCK_STATS.map(stat => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="card-premium p-5 group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                        style={{ background: `${stat.color}12`, border: `1px solid ${stat.color}22` }}>
                        <Icon style={{ color: stat.color, width: '18px', height: '18px' }} />
                      </div>
                      <span className="text-xs font-semibold text-emerald-400">{stat.change}</span>
                    </div>
                    <dd className="text-2xl font-black mb-0.5">{stat.value}</dd>
                    <dt className="text-xs text-gray-600">{stat.label}</dt>
                  </div>
                )
              })}
            </dl>

            {/* Revenue bar chart */}
            <section className="card-premium p-5">
              <h2 className="font-bold text-sm mb-4">Revenue</h2>
              <div className="flex items-end gap-1.5 h-24">
                {REVENUE_BARS.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm transition-all hover:opacity-80"
                    style={{
                      height: `${h}%`,
                      background: i === REVENUE_BARS.length - 1
                        ? 'linear-gradient(to top, #ec4899, #a855f7)'
                        : 'rgba(168,85,247,0.2)',
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-gray-700 mt-2">
                <span>Jun 1</span><span>Jun 14</span><span>Jun 28</span>
              </div>
            </section>

            {/* Mock member table */}
            <section className="rounded-2xl overflow-hidden" style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <h2 className="font-bold text-sm">Members</h2>
                <button className="text-xs text-gray-600 hover:text-[#a855f7] transition-colors flex items-center gap-1">
                  View all <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      {['Member', 'Plan', 'Joined', 'Status'].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_SIGNUPS.map((m, i) => (
                      <tr key={m.email} style={{ borderBottom: i < MOCK_SIGNUPS.length - 1 ? '1px solid rgba(255,255,255,0.03)' : undefined }}>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white"
                              style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}>
                              {m.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="text-sm font-medium">{m.name}</div>
                              <div className="text-[10px] text-gray-600">{m.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-xs text-gray-400">{m.plan}</td>
                        <td className="px-5 py-3 text-xs text-gray-500">{m.joined}</td>
                        <td className="px-5 py-3">
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize"
                            style={{
                              color: STATUS_COLORS[m.status] ?? '#6B7280',
                              background: `${STATUS_COLORS[m.status] ?? '#6B7280'}15`,
                              border: `1px solid ${STATUS_COLORS[m.status] ?? '#6B7280'}30`,
                            }}>
                            {m.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

      </div>
    </div>
  )
}
