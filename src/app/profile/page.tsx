'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { Zap, Flame, Award, TrendingUp, Edit3, Check, Camera, Save } from 'lucide-react'

const BADGES = [
  { icon: '🔥', label: 'First Sale',    earned: true  },
  { icon: '💰', label: '$1k Month',     earned: true  },
  { icon: '📈', label: '7-Day Streak',  earned: true  },
  { icon: '🏆', label: 'Top 50',        earned: false },
  { icon: '⚡', label: '100 XP Day',   earned: false },
  { icon: '🎯', label: '$10k Month',    earned: false },
]

const RECENT_XP = [
  { action: 'Completed lesson: Hook Formula', xp: 50,  time: 'Today' },
  { action: 'Daily check-in streak bonus',    xp: 25,  time: 'Today' },
  { action: 'Posted in community',            xp: 15,  time: 'Yesterday' },
  { action: 'Completed Module 1',             xp: 200, time: '3 days ago' },
]

export default function ProfilePage() {
  const [editing, setEditing] = useState(false)
  const [bio, setBio] = useState('Building my TikTok Shop brand in the home goods niche. Day 1 of my journey to $10k/month.')
  const [niche, setNiche] = useState('Home Goods')
  const [handle, setHandle] = useState('')
  const [email, setEmail] = useState('your@email.com')

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />

      <main className="flex-1 overflow-y-auto" id="main-content">
        <div className="max-w-3xl mx-auto px-6 py-8">

          <div className="mb-8">
            <h1 className="text-3xl font-black mb-1">Profile</h1>
            <p className="text-gray-500">Your progress, achievements, and account settings.</p>
          </div>

          {/* ── Profile card ── */}
          <div className="card-premium p-6 mb-5">
            <div className="flex items-start gap-5">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black text-white"
                  style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}>
                  Y
                </div>
                <button
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: '#111', border: '1px solid rgba(168,85,247,0.2)' }}
                  aria-label="Change profile photo"
                >
                  <Camera className="w-3.5 h-3.5 text-[#a855f7]" aria-hidden="true" />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black">Your Name</h2>
                    <div className="text-sm text-gray-500 mt-0.5">Member since June 2023</div>
                    <div className="text-xs mt-1 font-medium" style={{ color: '#a855f7' }}>
                      Niche: {niche}
                    </div>
                  </div>
                  <button
                    onClick={() => setEditing(v => !v)}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                    style={editing
                      ? { background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)', color: '#a855f7' }
                      : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#6B7280' }}
                  >
                    {editing ? <><Check className="w-3.5 h-3.5" />Save</> : <><Edit3 className="w-3.5 h-3.5" />Edit</>}
                  </button>
                </div>

                {editing ? (
                  <>
                    <label htmlFor="profile-bio" className="sr-only">Bio</label>
                    <textarea
                      id="profile-bio"
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      className="w-full mt-3 text-sm text-gray-300 rounded-xl px-3 py-2.5 resize-none outline-none leading-relaxed"
                      rows={3}
                      style={{ background: 'rgba(168,85,247,0.04)', border: '1px solid rgba(168,85,247,0.2)' }}
                    />
                  </>
                ) : (
                  <p className="text-sm text-gray-400 mt-3 leading-relaxed">{bio}</p>
                )}
              </div>
            </div>
          </div>

          {/* ── Stats ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { label: 'Total XP',     value: '1,240', icon: Zap,        color: '#a855f7' },
              { label: 'Day Streak',   value: '1',     icon: Flame,      color: '#FB923C' },
              { label: 'Badges',       value: '3/6',   icon: Award,      color: '#C084FC' },
              { label: 'Leaderboard',  value: '#847',  icon: TrendingUp, color: '#34D399' },
            ].map(stat => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="card-premium p-4 text-center group">
                  <div className="w-8 h-8 rounded-lg mx-auto mb-2.5 flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ background: `${stat.color}12`, border: `1px solid ${stat.color}22` }}>
                    <Icon className="w-4 h-4" style={{ color: stat.color }} />
                  </div>
                  <div className="text-2xl font-black mb-0.5">{stat.value}</div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                </div>
              )
            })}
          </div>

          {/* ── XP Progress ── */}
          <div className="card-premium p-5 mb-5">
            <div className="flex items-center justify-between mb-1">
              <div>
                <span className="font-bold text-sm">Level 2</span>
                <span className="text-gray-600 text-sm"> → </span>
                <span className="font-bold text-sm text-[#a855f7]">Level 3</span>
              </div>
              <div className="text-xs font-bold text-[#a855f7]">1,240 / 2,000 XP</div>
            </div>
            <div
              className="w-full h-2.5 rounded-full overflow-hidden my-2.5"
              style={{ background: 'rgba(255,255,255,0.04)' }}
              role="progressbar"
              aria-valuenow={62}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="XP progress to Level 3: 62%"
            >
              <div className="h-2.5 rounded-full transition-all duration-700"
                style={{ width: '62%', background: 'linear-gradient(90deg, #a855f7, #c084fc)' }} />
            </div>
            <div className="flex justify-between text-xs text-gray-700">
              <span>Level 2</span>
              <span>760 XP to Level 3</span>
              <span>Level 3</span>
            </div>

            {/* Recent XP events */}
            <div className="mt-4 pt-4 space-y-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">Recent XP</div>
              {RECENT_XP.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{item.action}</span>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    <span className="text-xs text-gray-700">{item.time}</span>
                    <span className="text-xs font-bold flex items-center gap-1" style={{ color: '#a855f7' }}>
                      <Zap className="w-3 h-3" />+{item.xp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Badges ── */}
          <div className="card-premium p-5 mb-5">
            <h3 className="font-bold mb-4 text-sm">Achievements</h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {BADGES.map(badge => (
                <div
                  key={badge.label}
                  className="flex flex-col items-center gap-2 p-3.5 rounded-xl transition-all group cursor-default"
                  style={badge.earned
                    ? { background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.15)' }
                    : { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', opacity: 0.4, filter: 'grayscale(1)' }}
                >
                  <span className={`text-2xl transition-transform ${badge.earned ? 'group-hover:scale-110' : ''}`}>
                    {badge.icon}
                  </span>
                  <span className="text-[10px] text-center leading-tight text-gray-500">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Account settings ── */}
          <div className="card-premium p-5">
            <h3 className="font-bold mb-5 text-sm">Account Settings</h3>
            <div className="space-y-4">
              {[
                { label: 'Email', id: 'profile-email', type: 'email', value: email, setter: setEmail, placeholder: 'your@email.com', autoComplete: 'email' },
                { label: 'TikTok Handle', id: 'profile-handle', type: 'text', value: handle, setter: setHandle, placeholder: '@yourhandle', autoComplete: 'off' },
                { label: 'Niche', id: 'profile-niche', type: 'text', value: niche, setter: setNiche, placeholder: 'e.g. Home Goods', autoComplete: 'off' },
              ].map(field => (
                <div key={field.label}>
                  <label htmlFor={field.id} className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    type={field.type}
                    value={field.value}
                    onChange={e => field.setter(e.target.value)}
                    placeholder={field.placeholder}
                    autoComplete={field.autoComplete}
                  />
                </div>
              ))}
              <div className="pt-2">
                <button className="btn-premium flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
