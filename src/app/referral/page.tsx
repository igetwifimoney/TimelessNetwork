'use client'

import { useState, useEffect } from 'react'
import { Copy, Check, Gift, Users, Zap, Share2 } from 'lucide-react'

interface ReferralStats {
  code: string
  referrals: number
  xpEarned: number
}

export default function ReferralPage() {
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch('/api/referral')
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const link = stats ? `https://jointimeless.network/ref/${stats.code}` : ''

  function copy() {
    if (!link) return
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const HOW_IT_WORKS = [
    { emoji: '🔗', title: 'Share your link', desc: 'Send your unique referral link to friends, followers, or your audience.' },
    { emoji: '✅', title: 'They join Timeless', desc: 'When they sign up and subscribe using your link, it\'s tracked automatically.' },
    { emoji: '⚡', title: 'You earn XP', desc: 'Get 500 XP per referral — permanently. Stack referrals, climb the leaderboard.' },
  ]

  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      <div className="max-w-2xl mx-auto px-4 lg:px-6 py-6 lg:py-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🎁</div>
          <h1 className="text-2xl font-black mb-2">Refer & Earn</h1>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            Invite creators to Timeless. Every referral earns you 500 XP and helps grow the community.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="card rounded-2xl p-5 text-center">
            <Users className="w-5 h-5 text-[#a855f7] mx-auto mb-2" />
            <div className="text-3xl font-black">{loading ? '—' : stats?.referrals ?? 0}</div>
            <div className="text-xs text-gray-500 mt-0.5">Referrals</div>
          </div>
          <div className="card rounded-2xl p-5 text-center">
            <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
            <div className="text-3xl font-black text-yellow-400">{loading ? '—' : (stats?.xpEarned ?? 0).toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-0.5">XP Earned</div>
          </div>
        </div>

        {/* Referral link */}
        <div className="card rounded-2xl p-5 mb-6">
          <div className="text-xs text-gray-500 font-medium mb-2">Your referral link</div>
          {loading ? (
            <div className="h-10 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
          ) : (
            <div className="flex gap-2">
              <div className="flex-1 px-3 py-2.5 rounded-xl text-sm text-gray-300 truncate"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                {link || 'Loading...'}
              </div>
              <button onClick={copy}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold flex-shrink-0 transition-all"
                style={copied
                  ? { background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#34D399' }
                  : { background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)', color: '#c084fc' }
                }>
                {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy</>}
              </button>
            </div>
          )}

          {/* Share buttons */}
          <div className="flex gap-2 mt-3">
            {[
              {
                label: 'Share to Instagram',
                onClick: () => navigator.clipboard.writeText(`Join me on Timeless — the TikTok Shop community that actually makes money 💰 ${link}`),
              },
              {
                label: 'Share to TikTok Bio',
                onClick: () => navigator.clipboard.writeText(link),
              },
            ].map(btn => (
              <button key={btn.label} onClick={btn.onClick}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs text-gray-400 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Share2 className="w-3.5 h-3.5" />
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="card rounded-2xl p-5 mb-6">
          <h2 className="font-bold text-sm mb-4">How it works</h2>
          <div className="space-y-4">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="text-2xl flex-shrink-0">{step.emoji}</div>
                <div>
                  <div className="font-semibold text-sm">{step.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rewards */}
        <div className="rounded-2xl p-5 text-center" style={{ background: 'rgba(168,85,247,0.04)', border: '1px solid rgba(168,85,247,0.12)' }}>
          <Gift className="w-5 h-5 text-[#a855f7] mx-auto mb-2" />
          <div className="font-bold text-sm mb-1">500 XP per referral</div>
          <div className="text-xs text-gray-500">
            XP is added to your account as soon as your referral subscribes.
            There&apos;s no cap — refer as many people as you want.
          </div>
        </div>

      </div>
    </div>
  )
}
