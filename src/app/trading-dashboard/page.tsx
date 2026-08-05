'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import TradingSidebar from '@/components/TradingSidebar'
import { createClient, isSupabaseConfigured } from '@/lib/supabase'
import {
  Loader2, Flame, Zap, TrendingUp, MessageSquare, ChevronRight,
  Star, Calendar, ExternalLink, GraduationCap, Rocket
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface SubscriptionRow {
  id: string
  status: string
  product_key: string
  current_period_end: string | null
  cancel_at_period_end: boolean
  created_at: string
}

interface UserStats {
  xp: number
  streakCount: number
  leaderboardRank: number | null
  totalMembers: number
}

const TRADING_PLAN_NAMES: Record<string, string> = {
  TRADING_STARTER: 'Starter',
  TRADING_VIP: 'V.I.P.',
}

const ACTIVE_STATUSES = new Set(['active', 'trialing', 'past_due'])

const RESULTS = [
  {
    quote: 'Ty and EMNT are so helpful and knowledgeable — wins are consistent and you can make your money back within 2-4 weeks. Community is tight knit and real, truly underrated.',
    name: 'Timothy A.',
    role: '@ayerstimr · V.I.P Member',
  },
  {
    quote: 'This group is legit and extremely helpful, made my money back within 3 weeks of joining. Real deal 🙌🙌',
    name: 'Jared A.',
    role: '@jayayersd · V.I.P Member',
  },
  {
    quote: 'Really successful group of traders. The coach, Everest, has live trading calls Monday–Thursday and the courses are amazing — very informative and well structured.',
    name: 'Noah',
    role: '@noahtrades · V.I.P Member',
  },
]

// Trading launch — Aug 7, 2026
function useLaunchCountdown() {
  const [label, setLabel] = useState('—')
  const [isLive, setIsLive] = useState(false)
  useEffect(() => {
    const LAUNCH = new Date('2026-08-07T00:00:00').getTime()
    const calc = () => {
      const diff = LAUNCH - Date.now()
      if (diff <= 0) { setLabel('Live now'); setIsLive(true); return }
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setLabel(`${d}d ${h}h ${m}m ${s}s`)
    }
    calc()
    const t = setInterval(calc, 1000)
    return () => clearInterval(t)
  }, [])
  return { label, isLive }
}

export default function TradingDashboardPage() {
  const router = useRouter()
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [firstName, setFirstName] = useState('')
  const [memberSince, setMemberSince] = useState<string | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [subs, setSubs] = useState<SubscriptionRow[]>([])
  const [subsLoading, setSubsLoading] = useState(true)
  const countdown = useLaunchCountdown()

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      router.push('/auth/login?next=/trading-dashboard')
      return
    }
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/auth/login?next=/trading-dashboard')
        return
      }
      const fullName: string = data.user.user_metadata?.full_name ?? data.user.email ?? ''
      setFirstName(fullName.split(' ')[0])
      if (data.user.created_at) {
        setMemberSince(new Date(data.user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }))
      }
      setCheckingAuth(false)
    }).catch(() => {
      router.push('/auth/login?next=/trading-dashboard')
    })

    fetch('/api/user-stats').then(r => r.json()).then(setStats).catch(() => {}).finally(() => setStatsLoading(false))
    fetch('/api/stripe/billing-data').then(r => r.json()).then(data => {
      setSubs(data.subscriptions ?? [])
    }).catch(() => {}).finally(() => setSubsLoading(false))
  }, [router])

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#a855f7]" aria-hidden="true" />
      </div>
    )
  }

  const activeTradingSub = subs.find(s => ACTIVE_STATUSES.has(s.status) && TRADING_PLAN_NAMES[s.product_key])
  const planName = activeTradingSub ? TRADING_PLAN_NAMES[activeTradingSub.product_key] : 'Free'
  const renewsOn = activeTradingSub?.current_period_end
    ? new Date(activeTradingSub.current_period_end).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null

  const xp = stats?.xp ?? 0
  const streak = stats?.streakCount ?? 0

  return (
    <div className="flex min-h-screen bg-black">
      <TradingSidebar />

      <main className="flex-1 overflow-y-auto" id="main-content">
        <div className="max-w-5xl mx-auto px-4 py-6 lg:px-6 lg:py-8 pb-28 lg:pb-8">

          {/* ── HERO HEADER ── */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="px-3 py-1 rounded-full text-xs font-medium text-[#a855f7]"
                style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.15)' }}>
                Timeless Trading Member
              </div>
              {memberSince && (
                <div className="px-3 py-1 rounded-full text-xs font-medium text-gray-500"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  Member since {memberSince}
                </div>
              )}
            </div>
            <h1 className="text-3xl lg:text-4xl font-black mb-1">
              Welcome{firstName ? `, ${firstName}` : ''} 👋
            </h1>
            <p className="text-gray-500 text-sm">Your Timeless Trading account, plan, and community access — all in one place.</p>
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
                label: 'Plan', value: subsLoading ? '—' : planName,
              },
              {
                icon: Star, color: 'text-yellow-400', bg: 'rgba(250,204,21,0.08)', border: 'rgba(250,204,21,0.15)',
                label: 'Whop Rating', value: '5.0★',
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

              {/* Your Plan */}
              <section className="card rounded-2xl p-5" aria-labelledby="plan-heading">
                <div className="flex items-center justify-between mb-4">
                  <h2 id="plan-heading" className="font-bold">Your Plan</h2>
                  <Link href="/trading#pricing" className="text-xs text-gray-500 hover:text-white flex items-center gap-1 transition-colors">
                    View plans <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="glass rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <div className="text-xs text-[#a855f7] font-semibold mb-1">{planName}</div>
                    <div className="text-sm text-gray-400">
                      {renewsOn
                        ? (activeTradingSub?.cancel_at_period_end ? `Cancels ${renewsOn}` : `Renews ${renewsOn}`)
                        : 'Upgrade to Starter or V.I.P for signals, live calls & full access.'}
                    </div>
                  </div>
                  {!activeTradingSub && (
                    <Link href="/trading#pricing" className="btn-premium px-5 py-2.5 rounded-xl text-sm font-bold flex-shrink-0">
                      Upgrade
                    </Link>
                  )}
                </div>
              </section>

              {/* Mentorship */}
              <section className="card rounded-2xl p-5" aria-labelledby="mentorship-heading">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.15)' }} aria-hidden="true">
                    <GraduationCap className="w-5 h-5 text-[#a855f7]" />
                  </div>
                  <div>
                    <h2 id="mentorship-heading" className="font-bold text-sm">1-on-1 Mentorship</h2>
                    <div className="text-xs text-gray-500">Direct access to Tyler & Jason · $1,080</div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  Personalized trading plan, direct feedback on your trades, and lifetime V.I.P community access.
                </p>
                <Link href="/trading#mentorship" className="btn-blue w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                  Apply for Mentorship
                </Link>
              </section>

              {/* Community Results */}
              <section className="card rounded-2xl p-5" aria-labelledby="results-heading">
                <div className="flex items-center justify-between mb-4">
                  <h2 id="results-heading" className="font-bold flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" aria-hidden="true" />
                    Community Results
                  </h2>
                  <Link href="/trading#testimonials" className="text-xs text-gray-500 hover:text-white transition-colors">
                    All reviews →
                  </Link>
                </div>
                <div className="space-y-3">
                  {RESULTS.map(r => (
                    <div key={r.name} className="glass rounded-xl p-4">
                      <div className="flex items-center gap-0.5 mb-2" role="img" aria-label="5 stars">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-[#a855f7] text-[#a855f7]" aria-hidden="true" />
                        ))}
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed mb-2 italic">&ldquo;{r.quote}&rdquo;</p>
                      <div className="text-xs text-gray-500">{r.name} · {r.role}</div>
                    </div>
                  ))}
                </div>
              </section>
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
                <div className="relative">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(88,101,242,0.2)', border: '1px solid rgba(88,101,242,0.3)' }}>
                      <MessageSquare className="w-4 h-4 text-indigo-400" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 id="discord-heading" className="font-bold text-sm leading-tight">Join the Discord</h2>
                      <div className="text-xs text-gray-500">Members-only trading community</div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4">
                    Live trading calls Monday–Thursday, market breakdowns, and a community that shows up daily.
                  </p>
                  <a
                    href="https://discord.gg/mQPVspGbaG"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-200 hover:opacity-90"
                    style={{ background: '#5865F2', color: '#fff' }}
                    aria-label="Join Timeless Trading Discord server"
                  >
                    <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                    Join Discord
                  </a>
                </div>
              </section>

              {/* Launch Countdown */}
              <section className="card rounded-2xl p-5" aria-labelledby="launch-heading">
                <h2 id="launch-heading" className="font-bold text-sm mb-4 flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-[#a855f7]" aria-hidden="true" />
                  {countdown.isLive ? 'We’re Live' : 'Launching Soon'}
                </h2>
                <div className="text-center py-2">
                  <div className="text-sm font-bold mb-1">Timeless Trading</div>
                  <div className="text-xs text-gray-500 mb-3">Full launch · August 7, 2026</div>
                  <div className="text-xl font-black gradient-text-blue mb-3" aria-live="polite">{countdown.label}</div>
                  <Link href="/trading"
                    className="w-full btn-premium py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    View Trading Home
                  </Link>
                </div>
              </section>

              {/* Manage Billing */}
              <section className="card rounded-2xl p-5" aria-labelledby="billing-heading">
                <h2 id="billing-heading" className="font-bold text-sm mb-3">Manage Billing</h2>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  Update payment method, switch plans, or view invoices through the secure billing portal.
                </p>
                <Link href="/billing"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold glass hover:bg-white/5 transition-all">
                  <ExternalLink className="w-3.5 h-3.5" />
                  Go to Billing
                </Link>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
