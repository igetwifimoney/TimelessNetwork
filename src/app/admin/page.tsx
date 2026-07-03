'use client'

import Sidebar from '@/components/Sidebar'
import { Users, DollarSign, TrendingUp, BookOpen, MoreHorizontal, Shield, ChevronRight } from 'lucide-react'

const RECENT_SIGNUPS = [
  { name: 'Alex M.',     email: 'alex@email.com', plan: 'Monthly', joined: '2h ago',  status: 'active'  },
  { name: 'Brittany K.', email: 'brit@email.com', plan: 'Annual',  joined: '5h ago',  status: 'active'  },
  { name: 'Carlos V.',   email: 'carv@email.com', plan: 'Monthly', joined: '1d ago',  status: 'trial'   },
  { name: 'Dana P.',     email: 'dana@email.com', plan: 'Monthly', joined: '2d ago',  status: 'churned' },
  { name: 'Evan R.',     email: 'evan@email.com', plan: 'Annual',  joined: '3d ago',  status: 'active'  },
]

const STATS = [
  { label: 'Total Members',   value: '1,204',  change: '+12 this week', icon: Users,      color: '#4F8EF7' },
  { label: 'MRR',             value: '$52,400', change: '+8.2% MoM',   icon: DollarSign, color: '#34D399' },
  { label: 'Avg. Retention',  value: '94%',     change: '↑ from 91%', icon: TrendingUp, color: '#C084FC' },
  { label: 'Active Courses',  value: '6',       change: '1 in draft',  icon: BookOpen,   color: '#FB923C' },
]

const QUICK_ACTIONS = [
  'Create new course module',
  'Send announcement to all members',
  'Export member list (CSV)',
  'View Stripe dashboard',
  'Moderate community posts',
]

const REVENUE_BARS = [40, 55, 45, 60, 70, 65, 80, 75, 90, 85, 95, 88, 100, 95]

export default function AdminPage() {
  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />

      <main className="flex-1 overflow-y-auto" id="main-content">
        <div className="max-w-6xl mx-auto px-6 py-8">

          {/* Header */}
          <header className="mb-8">
            <div
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2"
              style={{ color: '#4F8EF7' }}
              aria-hidden="true"
            >
              <Shield className="w-3.5 h-3.5" />
              Admin Dashboard
            </div>
            <h1 className="text-3xl font-black mb-1">Overview</h1>
            <p className="text-gray-500">Platform health, members, and revenue at a glance.</p>
          </header>

          {/* Stats */}
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {STATS.map(stat => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="card-premium p-5 group">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                      aria-hidden="true"
                      style={{ background: `${stat.color}12`, border: `1px solid ${stat.color}22` }}
                    >
                      <Icon style={{ color: stat.color, width: '18px', height: '18px' }} />
                    </div>
                    <span className="text-xs font-semibold text-emerald-400" aria-label={`Change: ${stat.change}`}>
                      {stat.change}
                    </span>
                  </div>
                  <dd className="text-2xl font-black mb-0.5">{stat.value}</dd>
                  <dt className="text-xs text-gray-600">{stat.label}</dt>
                </div>
              )
            })}
          </dl>

          <div className="grid lg:grid-cols-3 gap-5">
            {/* Recent members table */}
            <section
              className="lg:col-span-2 rounded-2xl overflow-hidden"
              style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.05)' }}
              aria-labelledby="members-heading"
            >
              <div
                className="px-5 py-4 flex items-center justify-between"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
              >
                <h2 id="members-heading" className="font-bold text-sm">Recent Members</h2>
                <button
                  className="text-xs text-gray-600 hover:text-[#4F8EF7] transition-colors flex items-center gap-1"
                  aria-label="View all members"
                >
                  View all <ChevronRight className="w-3 h-3" aria-hidden="true" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full" aria-label="Recent member signups">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <th scope="col" className="text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider px-5 py-3">Member</th>
                      <th scope="col" className="text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider px-5 py-3">Plan</th>
                      <th scope="col" className="text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider px-5 py-3">Joined</th>
                      <th scope="col" className="text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider px-5 py-3">Status</th>
                      <th scope="col" className="text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider px-5 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {RECENT_SIGNUPS.map((member, i) => (
                      <tr
                        key={i}
                        className="group transition-colors"
                        style={{ borderBottom: i < RECENT_SIGNUPS.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.015)')}
                        onMouseLeave={e => (e.currentTarget.style.background = '')}
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                              style={{ background: 'linear-gradient(135deg, #4F8EF7, #2563EB)' }}
                              aria-hidden="true"
                            >
                              {member.name[0]}
                            </div>
                            <div>
                              <div className="text-sm font-semibold">{member.name}</div>
                              <div className="text-xs text-gray-600">{member.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className="text-xs font-medium px-2 py-0.5 rounded-full"
                            style={member.plan === 'Annual'
                              ? { background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.15)', color: '#60A5FA' }
                              : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#6B7280' }
                            }
                          >
                            {member.plan}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-gray-600">
                          <time>{member.joined}</time>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className="text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize"
                            style={member.status === 'active'
                              ? { background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.15)', color: '#34D399' }
                              : member.status === 'trial'
                              ? { background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.15)', color: '#60A5FA' }
                              : { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#F87171' }
                            }
                          >
                            {member.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <button
                            className="text-gray-700 hover:text-gray-300 transition-colors opacity-0 group-hover:opacity-100"
                            aria-label={`More actions for ${member.name}`}
                          >
                            <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Right column */}
            <div className="space-y-5">
              {/* Quick actions */}
              <section className="card-premium p-5" aria-labelledby="quick-actions-heading">
                <h2 id="quick-actions-heading" className="font-bold text-sm mb-4">Quick Actions</h2>
                <ul className="space-y-1">
                  {QUICK_ACTIONS.map(action => (
                    <li key={action}>
                      <button
                        className="w-full text-left text-xs text-gray-500 px-3 py-2.5 rounded-xl transition-all flex items-center justify-between group hover:bg-[rgba(79,142,247,0.05)] hover:text-white"
                      >
                        <span>{action}</span>
                        <ChevronRight
                          className="w-3.5 h-3.5 text-[#4F8EF7] opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-hidden="true"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Revenue chart */}
              <section className="card-premium p-5" aria-labelledby="revenue-heading">
                <div className="flex items-center justify-between mb-5">
                  <h2 id="revenue-heading" className="font-bold text-sm">Revenue (30d)</h2>
                  <span className="text-xs font-bold text-emerald-400" aria-label="Revenue growth: +8.2%">+8.2%</span>
                </div>
                <div
                  className="flex items-end gap-1.5 h-28"
                  role="img"
                  aria-label="Bar chart: 30-day revenue trend, trending upward"
                >
                  {REVENUE_BARS.map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm transition-all duration-300 cursor-default hover:[background:linear-gradient(to_top,#4F8EF7,#60A5FA)]"
                      style={{
                        height: `${h}%`,
                        background: h === 100
                          ? 'linear-gradient(to top, #4F8EF7, #60A5FA)'
                          : 'linear-gradient(to top, rgba(79,142,247,0.4), rgba(96,165,250,0.3))',
                      }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-gray-700 mt-3" aria-hidden="true">
                  <span>Jun 1</span>
                  <span>Jun 14</span>
                  <span>Jun 28</span>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
