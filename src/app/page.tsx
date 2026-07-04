'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import {
  ChevronRight, Check, Star, Menu, X, Play,
  Flame, Users, BookOpen, TrendingUp, Zap, Award,
  ArrowRight, Diamond, Shield, Clock, Twitter,
  Instagram, MessageCircle, Lock, RefreshCw, CreditCard,
  XCircle
} from 'lucide-react'

// ─────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 2000, decimals = 0) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const animate = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(parseFloat((eased * target).toFixed(decimals)))
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration, decimals])

  return { count, ref }
}

function useMouseParallax() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setPos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      })
    }
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [])
  return pos
}

function useScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('.reveal')
    if (!elements.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

// ─────────────────────────────────────────────────────────
// GROWING MEMBER COUNT
// Resets to 2,200 on July 4, 2026 and grows by ~3/day
// Deterministic — every visitor sees the same number
// ─────────────────────────────────────────────────────────

function getMemberCount(): number {
  const BASE = 1200
  const START = new Date('2026-07-04').getTime()
  const GROWTH_PER_DAY = 3
  const days = Math.max(0, Math.floor((Date.now() - START) / 86400000))
  return BASE + days * GROWTH_PER_DAY
}

// ─────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Learn', href: '#learn' },
  { label: 'Results', href: '#results' },
  { label: 'Community', href: '#community' },
  { label: 'Pricing', href: '#pricing' },
]

const RESULT_CARDS = [
  {
    avatar: 'MJ', name: 'Marcus J.', niche: 'Home Goods',
    revenue: 23400, growth: 418, period: 'June 1 – June 30, 2026',
    spark: [30, 45, 38, 60, 72, 58, 85, 91, 88, 100],
    kpi: '18.2M video views', badge: 'Full-Time Seller',
  },
  {
    avatar: 'JK', name: 'Jordan K.', niche: 'Kitchen Gadgets',
    revenue: 8750, growth: 196, period: 'June 1 – June 30, 2026',
    spark: [15, 22, 30, 25, 42, 50, 60, 72, 85, 100],
    kpi: '4.6% conversion rate', badge: 'Creator',
  },
  {
    avatar: 'AD', name: 'Aaliyah D.', niche: 'Fashion Accessories',
    revenue: 5400, growth: 340, period: 'June 1 – June 30, 2026',
    spark: [5, 10, 18, 30, 45, 55, 68, 80, 90, 100],
    kpi: '87 videos posted', badge: 'Mentor Graduate',
  },
  {
    avatar: 'CR', name: 'C. Rivera', niche: 'Beauty & Skincare',
    revenue: 1870, growth: 127, period: 'Past 30 Days · Month 3',
    spark: [8, 12, 15, 20, 18, 30, 38, 50, 72, 100],
    kpi: '12 winning products tested', badge: 'Premium Member',
  },
]

type MsgType = 'question' | 'small_win' | 'first_sale' | 'big_win' | 'live_call' | 'general'
type FeedMessage = { avatar: string; name: string; msg: string; badge: string; ts: number; type: MsgType }

const LIKE_RANGES: Record<MsgType, [number, number]> = {
  question:   [0,  3],
  small_win:  [3,  12],
  first_sale: [8,  25],
  big_win:    [20, 55],
  live_call:  [5,  18],
  general:    [1,  8],
}

function seedLikes(type: MsgType, ageMinutes: number): number {
  const [min, max] = LIKE_RANGES[type]
  const rand = min + Math.random() * (max - min)
  const ageFactor = 0.2 + Math.min(1, ageMinutes / 60) * 0.8
  return Math.round(rand * ageFactor)
}

const MESSAGE_POOL: Omit<FeedMessage, 'ts'>[] = [
  { avatar: 'MK', name: 'Marcus K.', msg: 'First sale came in today. Literally screamed 😭', badge: '🎯', type: 'first_sale' },
  { avatar: 'JR', name: 'Jade R.', msg: 'Posted 3 videos this morning before work. Staying consistent', badge: '📱', type: 'general' },
  { avatar: 'TC', name: 'Tyler C.', msg: 'Hit $87 in commissions this week. Small but real progress', badge: '📈', type: 'small_win' },
  { avatar: 'SK', name: 'Sofia K.', msg: 'Found 12 products to test from the research system. Starting with 3', badge: '🔍', type: 'general' },
  { avatar: 'RN', name: 'Ryan N.', msg: 'Finally got my first sample approved. Took 2 weeks lol', badge: '📦', type: 'small_win' },
  { avatar: 'AB', name: 'Aisha B.', msg: 'Anyone else struggling with their hook? Mine keep getting low retention', badge: '🤔', type: 'question' },
  { avatar: 'DM', name: 'Devon M.', msg: 'Crossed $1k total revenue today. Not huge but feels huge to me', badge: '💰', type: 'big_win' },
  { avatar: 'LW', name: 'Leah W.', msg: 'Module 5 is actually so good. The product research stuff clicked', badge: '📚', type: 'general' },
  { avatar: 'KP', name: 'Kai P.', msg: 'Live call was fire today. Got my account reviewed and had 3 things to fix immediately', badge: '🎙️', type: 'live_call' },
  { avatar: 'NB', name: 'Nia B.', msg: '7-day streak. Trying to keep momentum going into the weekend', badge: '🔥', type: 'small_win' },
  { avatar: 'JT', name: 'James T.', msg: '$340 this month so far. Month 2. Getting there slowly', badge: '📊', type: 'small_win' },
  { avatar: 'MV', name: 'Maya V.', msg: 'Does anyone know if kitchen gadgets are still working or is it saturated?', badge: '❓', type: 'question' },
  { avatar: 'CR', name: 'Carlos R.', msg: 'Just hit $5k total. Started with $0 experience 3 months ago', badge: '🏆', type: 'big_win' },
  { avatar: 'ES', name: 'Elle S.', msg: 'Content feedback thread is so helpful. Fixed my CTA and views jumped', badge: '✨', type: 'general' },
  { avatar: 'BF', name: 'Brandon F.', msg: 'Applied to 4 affiliate programs today. Finally taking this seriously', badge: '📝', type: 'general' },
]

function getInitialMessages(): FeedMessage[] {
  const now = Date.now()
  const offsets = [4, 18, 42, 71]
  return [0, 1, 2, 3].map(i => ({
    ...MESSAGE_POOL[i],
    ts: now - offsets[i] * 60 * 1000,
  }))
}

function formatTs(ts: number): string {
  const mins = Math.floor((Date.now() - ts) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  return `${hrs}h ago`
}

const FEATURES = [
  { icon: BookOpen, title: 'Complete Course Library', desc: 'Step-by-step modules built around what works right now — updated constantly as TikTok Shop evolves.' },
  { icon: Users, title: 'Private Community', desc: 'A focused room of creators building in public. Daily wins, feedback, and real accountability.' },
  { icon: Play, title: 'Weekly Live Calls', desc: 'Real-time Q&A with people generating real revenue. Ask anything, get real answers.' },
  { icon: Flame, title: 'Daily Missions', desc: 'Log in knowing exactly what to do. Streaks, missions, and momentum built in to the platform.' },
  { icon: Shield, title: 'Discord Access', desc: 'Instant access to channels for every niche, content type, and stage of your journey.' },
  { icon: TrendingUp, title: 'Lifetime Updates', desc: "TikTok Shop evolves fast. Your membership evolves with it. No extra charges. Ever." },
]

const TESTIMONIALS = [
  { avatar: 'JL', name: 'James L.', role: 'Full-time TikTok Shop seller', revenue: '$23,700/mo', stars: 5, text: 'Joined with zero TikTok Shop experience. 4 months later I quit my job. The course is great but the community is what kept me going every single week.' },
  { avatar: 'BT', name: 'Brittany T.', role: 'Content creator turned seller', revenue: '$11,340/mo', stars: 5, text: "I tried YouTube, Reddit, other communities. Nothing clicked until Timeless. The structure is different. It actually tells you what to do next — and it works." },
  { avatar: 'CR', name: 'Carlos R.', role: 'Side hustle → main income', revenue: '$7,190/mo', stars: 5, text: "The weekly live calls alone are worth more than the membership fee. I ask a question, get a real answer, implement it, and make money. It really is that simple." },
]

// ─────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────

function StatItem({ prefix = '', value, suffix = '', label, decimals = 0 }: {
  prefix?: string; value: number; suffix?: string; label: string; decimals?: number
}) {
  const { count, ref } = useCountUp(value, 2200, decimals)
  const display = decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString()
  return (
    <div className="text-center">
      <span ref={ref} className="text-3xl md:text-4xl font-black count-up gradient-text-blue" aria-live="polite">
        {prefix}{display}{suffix}
      </span>
      <div className="text-sm text-gray-500 mt-2">{label}</div>
    </div>
  )
}

function Sparkline({ data, uid }: { data: number[]; uid: string }) {
  const w = 120, h = 40
  const min = Math.min(...data), max = Math.max(...data)
  const coords = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - ((v - min) / (max - min)) * (h - 2) - 1,
  }))
  const linePath = 'M ' + coords.map(p => `${p.x} ${p.y}`).join(' L ')
  const areaPath = `M 0 ${h} L ${coords.map(p => `${p.x} ${p.y}`).join(' L ')} L ${w} ${h} Z`
  const gradId = `sg_${uid}`

  const lineRef = useRef<SVGPathElement>(null)
  const [drawn, setDrawn] = useState(false)

  useEffect(() => {
    const el = lineRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setDrawn(true); obs.disconnect() }
    }, { threshold: 0.4 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#4F8EF7" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#4F8EF7" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={areaPath}
        fill={`url(#${gradId})`}
        style={{ opacity: drawn ? 1 : 0, transition: 'opacity 0.6s ease 1s' }}
      />
      <path
        ref={lineRef}
        d={linePath}
        fill="none"
        stroke="#4F8EF7"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset={drawn ? 0 : 1}
        style={{
          transition: drawn ? 'stroke-dashoffset 1.1s cubic-bezier(0.4,0,0.2,1)' : 'none',
        }}
      />
    </svg>
  )
}

function ResultCard({ card, idx }: { card: typeof RESULT_CARDS[0]; idx: number }) {
  const { count, ref } = useCountUp(card.revenue, 1800)
  return (
    <article className="card-premium p-6 group cursor-default">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white relative"
            style={{ background: 'linear-gradient(135deg, #4F8EF7, #2563EB)' }}
            aria-hidden="true"
          >
            {card.avatar}
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-black flex items-center justify-center" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="w-2.5 h-2.5" fill="white"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2H11v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a7 7 0 00-.79-.05 6.72 6.72 0 00-6.72 6.72 6.72 6.72 0 006.72 6.72 6.72 6.72 0 006.72-6.72V9.63a9.58 9.58 0 005.61 1.8V7.35a4.87 4.87 0 01-1.86-.66z" /></svg>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold">{card.name}</span>
            </div>
            <div className="text-xs text-gray-500">{card.niche}</div>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1" aria-label={`Revenue growth: +${card.growth}%`}>
          <TrendingUp className="w-3 h-3 text-emerald-400" aria-hidden="true" />
          <span className="text-xs font-bold text-emerald-400">+{card.growth}%</span>
        </div>
      </div>

      {/* Verified badge */}
      <div className="flex items-center gap-1.5 mb-3">
        <div
          className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-emerald-400"
          style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}
        >
          <svg className="w-2.5 h-2.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
          TikTok Shop Verified
        </div>
      </div>

      <div className="mb-1">
        <div className="text-[10px] text-gray-600 mb-1 font-medium tracking-wide">{card.period}</div>
        <span ref={ref} className="text-3xl font-black count-up" aria-live="polite">${Math.floor(count).toLocaleString()}</span>
      </div>

      <div className="my-4 opacity-80 group-hover:opacity-100 transition-opacity">
        <Sparkline data={card.spark} uid={`card${idx}`} />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-600">{card.kpi}</span>
        <div className="glass-blue rounded-full px-2.5 py-1 text-xs font-medium text-[#4F8EF7]">
          {card.badge}
        </div>
      </div>
    </article>
  )
}

function CommunityFeed() {
  const [messages, setMessages] = useState<FeedMessage[]>(getInitialMessages)
  const [newestId, setNewestId] = useState<string | null>(null)
  const [online, setOnline] = useState(128)
  const [likes, setLikes] = useState<Record<string, number>>({})
  const [poppingId, setPoppingId] = useState<string | null>(null)
  const [litId, setLitId] = useState<string | null>(null)
  const [, forceRender] = useState(0)
  const poolIdx = useRef(4)
  const messagesRef = useRef<FeedMessage[]>([])
  messagesRef.current = messages

  useEffect(() => {
    const now = Date.now()
    const initial: Record<string, number> = {}
    messages.forEach(m => {
      const id = `${m.avatar}-${m.ts}`
      const age = (now - m.ts) / 60000
      initial[id] = seedLikes(m.type, age)
    })
    setLikes(initial)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const popLike = (id: string) => {
    setLikes(prev => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }))
    setPoppingId(id)
    setLitId(id)
    setTimeout(() => setPoppingId(null), 500)
    setTimeout(() => setLitId(null), 600)
  }

  const handleLike = (id: string) => popLike(id)

  useEffect(() => {
    const tsInterval = setInterval(() => forceRender(n => n + 1), 60000)

    function scheduleMsg() {
      const delay = 18000 + Math.random() * 27000
      return setTimeout(() => {
        const raw = MESSAGE_POOL[poolIdx.current % MESSAGE_POOL.length]
        poolIdx.current++
        const newMsg: FeedMessage = { ...raw, ts: Date.now() }
        const id = `${newMsg.avatar}-${newMsg.ts}`
        setMessages(prev => [newMsg, ...prev].slice(0, 5))
        setLikes(prev => ({ ...prev, [id]: Math.floor(Math.random() * 3) }))
        setNewestId(id)
        setTimeout(() => setNewestId(null), 600)
        scheduleMsg()
      }, delay)
    }
    const msgTimer = scheduleMsg()

    function scheduleAutoLike() {
      const delay = 20000 + Math.random() * 70000
      return setTimeout(() => {
        if (Math.random() < 0.55) {
          const msgs = messagesRef.current
          if (msgs.length > 0) {
            const weights = msgs.map((m, i) => {
              const ageMins = (Date.now() - m.ts) / 60000
              const typeWeight = { big_win: 3, first_sale: 2.5, live_call: 1.8, small_win: 1.3, general: 1, question: 0.6 }[m.type]
              return (0.4 + Math.min(1, ageMins / 30)) * typeWeight * (1 + i * 0.3)
            })
            const total = weights.reduce((a, b) => a + b, 0)
            let rand = Math.random() * total
            let chosen = msgs[msgs.length - 1]
            for (let i = 0; i < msgs.length; i++) {
              rand -= weights[i]
              if (rand <= 0) { chosen = msgs[i]; break }
            }
            const id = `${chosen.avatar}-${chosen.ts}`
            setPoppingId(id)
            setLitId(id)
            setLikes(prev => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }))
            setTimeout(() => setPoppingId(null), 500)
            setTimeout(() => setLitId(null), 600)
          }
        }
        scheduleAutoLike()
      }, delay)
    }
    const likeTimer = scheduleAutoLike()

    function scheduleOnline() {
      const delay = 22000 + Math.random() * 18000
      return setTimeout(() => {
        setOnline(prev => Math.max(108, Math.min(148, prev + Math.floor(Math.random() * 7) - 3)))
        scheduleOnline()
      }, delay)
    }
    const onlineTimer = scheduleOnline()

    return () => {
      clearTimeout(msgTimer); clearTimeout(likeTimer); clearTimeout(onlineTimer)
      clearInterval(tsInterval)
    }
  }, [])

  return (
    <div className="space-y-3" role="feed" aria-label="Live community feed">
      <div className="flex items-center justify-between mb-1 px-1">
        <span className="text-xs text-gray-600 font-medium uppercase tracking-wider">Community feed</span>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium" aria-label={`${online} members online`}>
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          {online} online
        </div>
      </div>

      <div className="space-y-2.5">
        {messages.map((p) => {
          const id = `${p.avatar}-${p.ts}`
          const isNew = id === newestId
          const isPopping = id === poppingId
          const isLit = id === litId
          const count = likes[id] ?? 0

          return (
            <div
              key={id}
              className="card-glass p-4 rounded-2xl group"
              style={{ animation: isNew ? 'slideUp 0.35s ease forwards' : 'none' }}
            >
              <div className="flex gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #4F8EF7, #2563EB)' }}
                  aria-hidden="true"
                >
                  {p.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold">{p.name}</span>
                    <span className="text-sm leading-none" aria-hidden="true">{p.badge}</span>
                    <time className="text-xs text-gray-600 ml-auto tabular-nums" dateTime={new Date(p.ts).toISOString()}>{formatTs(p.ts)}</time>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{p.msg}</p>
                  <button
                    onClick={() => handleLike(id)}
                    className="flex items-center gap-1.5 mt-2 text-xs transition-colors group/like"
                    style={{ color: isLit ? '#4F8EF7' : undefined }}
                    aria-label={`Like this post — ${count} likes`}
                  >
                    <span
                      className={isPopping ? 'heart-pop' : 'group-hover/like:scale-110 transition-transform inline-block'}
                      style={{ display: 'inline-block' }}
                      aria-hidden="true"
                    >
                      ❤️
                    </span>
                    <span
                      className="like-count"
                      style={{ color: isLit ? '#4F8EF7' : '#6B7280' }}
                      aria-live="polite"
                    >
                      {count}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const mouse = useMouseParallax()
  useScrollReveal()
  const memberCount = getMemberCount()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) setMobileOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">

      {/* Skip to main content */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* ── NAVBAR ───────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-black/70 backdrop-blur-2xl border-b border-white/[0.05] shadow-[0_1px_0_0_rgba(255,255,255,0.04)]'
            : 'bg-transparent'
        }`}
        aria-label="Main navigation"
      >
        <div className="max-w-6xl mx-auto px-5 h-[60px] flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="Timeless — home">
            <div className="w-6 h-6 relative flex-shrink-0" aria-hidden="true">
              <div className="absolute inset-0 rounded rotate-45 transition-transform group-hover:rotate-[60deg] duration-300" style={{ background: 'linear-gradient(135deg, #4F8EF7, #2563EB)' }} />
              <div className="absolute inset-[2px] bg-black rounded rotate-45" />
              <div className="absolute inset-[3.5px] rounded rotate-45" style={{ background: 'linear-gradient(135deg, #60A5FA, #4F8EF7)' }} />
            </div>
            <span className="font-black text-sm tracking-tight">timeless</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8" role="list">
            {NAV_LINKS.map(l => (
              <a
                key={l.label}
                href={l.href}
                role="listitem"
                className="text-sm text-gray-500 hover:text-white transition-all duration-200 relative group py-1"
              >
                {l.label}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-[#4F8EF7] group-hover:w-full transition-all duration-300" aria-hidden="true" />
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-sm text-gray-500 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/[0.04]"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="btn-premium text-sm px-5 py-2.5 rounded-lg"
            >
              <span className="flex items-center gap-2">
                Join Timeless
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-gray-400 hover:text-white transition-colors p-2 -mr-2 rounded-lg"
            onClick={() => setMobileOpen(v => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileOpen
              ? <X className="w-5 h-5" aria-hidden="true" />
              : <Menu className="w-5 h-5" aria-hidden="true" />
            }
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            id="mobile-menu"
            className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/5 px-5 py-6 flex flex-col gap-4 animate-fade-in"
            role="menu"
          >
            {NAV_LINKS.map(l => (
              <a
                key={l.label}
                href={l.href}
                role="menuitem"
                className="text-gray-300 hover:text-white text-base transition-colors py-1"
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <hr className="border-white/5" />
            <Link href="/auth/login" className="text-sm text-gray-500 py-1" role="menuitem" onClick={() => setMobileOpen(false)}>Sign in</Link>
            <Link
              href="/auth/signup"
              className="btn-premium text-sm text-center py-3.5 rounded-xl"
              role="menuitem"
              onClick={() => setMobileOpen(false)}
            >
              <span>Join Timeless</span>
            </Link>
          </div>
        )}
      </nav>

      {/* ── MAIN CONTENT ─────────────────────────────────── */}
      <main id="main-content">

        {/* ── HERO ─────────────────────────────────────────── */}
        <section
          className="relative min-h-[100dvh] flex items-center justify-center px-5 pt-24 pb-24 overflow-hidden"
          aria-label="Hero"
        >
          {/* Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            <div
              className="absolute inset-0 opacity-[0.018]"
              style={{
                backgroundImage: 'linear-gradient(rgba(79,142,247,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(79,142,247,0.8) 1px, transparent 1px)',
                backgroundSize: '60px 60px',
                transform: `translate(${mouse.x * -6}px, ${mouse.y * -6}px)`,
                transition: 'transform 0.3s ease-out',
                willChange: 'transform',
              }}
            />
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-[0.06]"
              style={{
                background: 'radial-gradient(circle, #4F8EF7, transparent 65%)',
                transform: `translate(calc(-50% + ${mouse.x * 20}px), calc(-50% + ${mouse.y * 20}px))`,
                transition: 'transform 0.6s ease-out',
                willChange: 'transform',
              }}
            />
            <div
              className="absolute top-[20%] left-[15%] w-[320px] h-[320px] rounded-full opacity-[0.04] animate-float"
              style={{
                background: 'radial-gradient(circle, #60A5FA, transparent 70%)',
                transform: `translate(${mouse.x * 30}px, ${mouse.y * 20}px)`,
                transition: 'transform 0.8s ease-out',
                willChange: 'transform',
              }}
            />
            <div
              className="absolute bottom-[25%] right-[12%] w-[250px] h-[250px] rounded-full opacity-[0.035] animate-float"
              style={{
                background: 'radial-gradient(circle, #2563EB, transparent 70%)',
                animationDelay: '-2s',
                transform: `translate(${mouse.x * -25}px, ${mouse.y * -15}px)`,
                transition: 'transform 0.9s ease-out',
                willChange: 'transform',
              }}
            />
          </div>

          {/* Content */}
          <div className="relative max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-10 animate-fade-in">
              <div className="badge">
                <Diamond className="w-3 h-3" aria-hidden="true" />
                The TikTok Shop Operating System
              </div>
            </div>

            <h1
              className="text-5xl sm:text-6xl md:text-[72px] font-black leading-[1.02] tracking-tight mb-8 animate-fade-up"
              style={{ transform: `translateY(${mouse.y * -8}px)`, transition: 'transform 0.4s ease-out' }}
            >
              Learn TikTok Shop<br />
              From People{' '}
              <span className="gradient-text">Actually<br className="hidden sm:block" />Making Money.</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-up delay-100">
              Join creators building real income with proven systems,
              weekly mentorship, and a community that actually wins.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-up delay-200">
              <Link
                href="/auth/signup"
                className="btn-premium text-base px-8 py-4 rounded-2xl inline-flex items-center justify-center gap-2 group"
              >
                <span className="flex items-center gap-2">
                  Get Instant Access
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </span>
              </Link>
              <a
                href="#results"
                className="btn-outline text-base px-8 py-4 rounded-2xl inline-flex items-center justify-center gap-2"
              >
                See Member Results
              </a>
            </div>

            {/* Social proof */}
            <div className="inline-flex items-center gap-4 glass px-5 py-3 rounded-full animate-fade-up delay-300" role="status" aria-label={`${memberCount.toLocaleString()}+ creators inside, 5-star rated`}>
              <div className="flex -space-x-2" aria-hidden="true">
                {['M','J','K','A','T'].map((l, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-black"
                    style={{ background: 'linear-gradient(135deg, #4F8EF7, #2563EB)', opacity: 1 - i * 0.08 }}
                  >
                    {l}
                  </div>
                ))}
              </div>
              <span className="text-sm text-gray-400">
                <span className="text-white font-semibold">{memberCount.toLocaleString()}+ creators</span> already inside
              </span>
              <div className="flex items-center gap-0.5" aria-label="5 stars" role="img">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#4F8EF7] text-[#4F8EF7]" aria-hidden="true" />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ───────────────────────────────────────── */}
        <section className="py-20 px-5 border-y border-white/[0.04]" aria-label="Platform statistics">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatItem prefix="$" value={4.8} suffix="M+" label="Creator Revenue Generated" decimals={1} />
              <StatItem value={memberCount} suffix="+" label="Active Members" />
              <StatItem value={14000} suffix="+" label="Videos Posted" />
              <div className="text-center">
                <span className="text-3xl md:text-4xl font-black count-up gradient-text-blue">7–14 Days</span>
                <div className="text-sm text-gray-500 mt-2">Avg. Time to First Sale</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── LEARN ───────────────────────────────────────── */}
        <section id="learn" className="py-28 px-5" aria-labelledby="learn-heading">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 reveal">
              <div className="badge mx-auto mb-5">Curriculum</div>
              <h2 id="learn-heading" className="text-4xl md:text-5xl font-black mb-4">
                Everything you need.<br />
                <span className="gradient-text">In the right order.</span>
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">No fluff. No padded content. Just the exact system people are using to make money right now.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { icon: BookOpen, title: 'TikTok Shop Fundamentals', desc: 'Build your foundation — account setup, the algorithm, and your first product listing done right.' },
                { icon: TrendingUp, title: 'Product Research System', desc: 'The 3-filter method to find products that sell before you film a single video.' },
                { icon: Zap, title: 'Viral Content Playbook', desc: 'Hook formulas, script structures, and filming techniques that drive real sales — not just views.' },
                { icon: Users, title: 'Scaling to $10k/Month', desc: 'How to systematize content output, reinvest profits, and build a sustainable TikTok Shop operation.' },
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.title}
                    className={`card-premium p-6 flex gap-4 group reveal reveal-delay-${i + 1}`}
                  >
                    <div className="w-10 h-10 rounded-xl glass-blue flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                      <Icon className="w-5 h-5 text-[#4F8EF7]" />
                    </div>
                    <div>
                      <div className="font-bold mb-1.5 group-hover:text-[#60A5FA] transition-colors">{item.title}</div>
                      <div className="text-sm text-gray-500 leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── RESULTS ─────────────────────────────────────── */}
        <section id="results" className="py-28 px-5 relative overflow-hidden" aria-labelledby="results-heading">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] pointer-events-none" aria-hidden="true">
            <div className="w-full h-full rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #4F8EF7, transparent 70%)' }} />
          </div>
          <div className="max-w-5xl mx-auto relative">
            <div className="text-center mb-16 reveal">
              <div className="badge mx-auto mb-5">Real Results</div>
              <h2 id="results-heading" className="text-4xl md:text-5xl font-black mb-4">
                Not testimonials.<br />
                <span className="gradient-text">Revenue numbers.</span>
              </h2>
              <p className="text-gray-500">Real members. Real timelines. Real income — with the receipts to prove it.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {RESULT_CARDS.map((card, i) => (
                <div key={card.name} className={`reveal reveal-delay-${i + 1}`}>
                  <ResultCard card={card} idx={i} />
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-gray-700 mt-8">
              Results vary. These are real member outcomes, not guarantees. Most people make less. Some make more.
            </p>
          </div>
        </section>

        {/* ── COMMUNITY ───────────────────────────────────── */}
        <section id="community" className="py-28 px-5" aria-labelledby="community-heading">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="reveal">
                <div className="badge mb-6">Community</div>
                <h2 id="community-heading" className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                  You don&apos;t build this<br />
                  <span className="gradient-text">alone.</span>
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  Timeless isn&apos;t a course you buy and forget. It&apos;s a room full of people posting wins every day — and expecting you to show up too.
                </p>
                <ul className="space-y-3" aria-label="Community features">
                  {[
                    'Daily accountability check-ins',
                    'Wins feed with real numbers',
                    'Feedback on your content before you post',
                    'Find your accountability partner',
                    'Active channels for every niche',
                  ].map(item => (
                    <li key={item} className="flex items-center gap-3 group">
                      <div className="w-5 h-5 rounded-full glass-blue flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform" aria-hidden="true">
                        <Check className="w-3 h-3 text-[#4F8EF7]" />
                      </div>
                      <span className="text-gray-300 text-sm group-hover:text-white transition-colors">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="reveal reveal-delay-2">
                <CommunityFeed />
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ────────────────────────────────────── */}
        <section className="py-28 px-5 border-t border-white/[0.04]" aria-labelledby="features-heading">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 reveal">
              <div className="badge mx-auto mb-5">What&apos;s Inside</div>
              <h2 id="features-heading" className="text-4xl md:text-5xl font-black">
                Built different.<br />
                <span className="gradient-text">On purpose.</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {FEATURES.map((f, i) => {
                const Icon = f.icon
                return (
                  <div key={f.title} className={`card-premium p-5 group reveal reveal-delay-${(i % 3) + 1}`}>
                    <div
                      className="w-9 h-9 rounded-xl glass-blue flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300"
                      aria-hidden="true"
                    >
                      <Icon className="w-[18px] h-[18px] text-[#4F8EF7]" />
                    </div>
                    <div className="font-bold text-sm mb-1.5 group-hover:text-[#60A5FA] transition-colors">{f.title}</div>
                    <div className="text-xs text-gray-500 leading-relaxed">{f.desc}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ────────────────────────────────── */}
        <section className="py-28 px-5" aria-labelledby="testimonials-heading">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 reveal">
              <div className="badge mx-auto mb-5">Testimonials</div>
              <h2 id="testimonials-heading" className="text-4xl md:text-5xl font-black">
                Don&apos;t take our word.<br />
                <span className="gradient-text">Take theirs.</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {TESTIMONIALS.map((t, i) => (
                <blockquote key={t.name} className={`card-premium p-6 flex flex-col group reveal reveal-delay-${i + 1}`}>
                  <div className="flex items-center gap-0.5 mb-5" aria-label={`${t.stars} out of 5 stars`} role="img">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-[#4F8EF7] text-[#4F8EF7] group-hover:scale-110 transition-transform"
                        style={{ transitionDelay: `${i * 30}ms` }}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed flex-1 mb-6">&ldquo;{t.text}&rdquo;</p>
                  <footer className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black text-white"
                        style={{ background: 'linear-gradient(135deg, #4F8EF7, #2563EB)' }}
                        aria-hidden="true"
                      >
                        {t.avatar}
                      </div>
                      <div>
                        <cite className="text-sm font-semibold not-italic">{t.name}</cite>
                        <div className="text-xs text-gray-500">{t.role}</div>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-emerald-400" aria-label={`Earning ${t.revenue}`}>{t.revenue}</div>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ─────────────────────────────────────── */}
        <section id="pricing" className="py-28 px-5 border-t border-white/[0.04]" aria-labelledby="pricing-heading">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16 reveal">
              <div className="badge mx-auto mb-5">Pricing</div>
              <h2 id="pricing-heading" className="text-4xl md:text-5xl font-black mb-4">
                One price.<br />
                <span className="gradient-text">Everything unlocked.</span>
              </h2>
              <p className="text-gray-500">No upsells. No paywalled content. Full access from day one.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {/* Monthly */}
              <div className="card-premium p-8 group reveal">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-4">Monthly</div>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-5xl font-black">$49</span>
                  <span className="text-lg font-bold text-gray-400 mb-1">.99</span>
                  <span className="text-gray-500 mb-1.5">/month</span>
                </div>
                <div className="text-xs text-gray-600 mb-6">Full access. Cancel anytime.</div>
                <ul className="space-y-3 mb-8" aria-label="Monthly plan features">
                  {['Complete TikTok Shop course', 'Private creator community', 'Weekly live calls', 'Daily missions & streaks', 'Discord access', 'Course updates forever'].map(f => (
                    <li key={f} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full glass-blue flex items-center justify-center flex-shrink-0" aria-hidden="true">
                        <Check className="w-3 h-3 text-[#4F8EF7]" />
                      </div>
                      <span className="text-sm text-gray-300">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup" className="btn-ghost block text-center py-3.5 rounded-xl font-bold text-sm">
                  Join Timeless
                </Link>
              </div>

              {/* Annual */}
              <div
                className="relative rounded-2xl p-8 group reveal reveal-delay-1"
                style={{ background: 'rgba(79,142,247,0.04)', border: '1px solid rgba(79,142,247,0.2)', boxShadow: '0 0 40px rgba(79,142,247,0.08)' }}
              >
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-black px-4 py-1.5 rounded-full whitespace-nowrap text-white animate-pulse-blue"
                  style={{ background: 'linear-gradient(135deg, #4F8EF7, #2563EB)' }}
                >
                  BEST VALUE — Save $132
                </div>
                <div className="text-xs text-[#4F8EF7] uppercase tracking-wider mb-4 font-semibold">Annual</div>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-5xl font-black">$39</span>
                  <span className="text-gray-400 mb-1.5">/month</span>
                </div>
                <div className="text-xs text-gray-500 mb-6">Billed annually — $468/year</div>
                <ul className="space-y-3 mb-8" aria-label="Annual plan features">
                  {[
                    'Everything in Monthly',
                    '2 private mentorship calls included',
                    'Priority support & content feedback',
                    'Exclusive member-only workshops',
                    'Early access to new modules',
                  ].map(f => (
                    <li key={f} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full glass-blue flex items-center justify-center flex-shrink-0" aria-hidden="true">
                        <Check className="w-3 h-3 text-[#4F8EF7]" />
                      </div>
                      <span className="text-sm text-gray-300">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup" className="btn-premium block text-center py-3.5 rounded-xl font-bold text-sm group/btn">
                  <span className="flex items-center justify-center gap-2">
                    Get Instant Access
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" aria-hidden="true" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-12" role="list" aria-label="Trust signals">
              {[
                { icon: RefreshCw, label: '30-Day Guarantee' },
                { icon: Lock, label: 'Secure Checkout' },
                { icon: CreditCard, label: 'Powered by Stripe' },
                { icon: XCircle, label: 'Cancel Anytime' },
              ].map(b => {
                const Icon = b.icon
                return (
                  <div key={b.label} className="flex items-center gap-2 glass px-3.5 py-2 rounded-full text-xs text-gray-400" role="listitem">
                    <Icon className="w-3.5 h-3.5 text-[#4F8EF7]" aria-hidden="true" />
                    {b.label}
                  </div>
                )
              })}
            </div>

            {/* ── MENTORSHIP UPSELL ── */}
            <div
              className="relative rounded-2xl overflow-hidden group/mentorship transition-all duration-500 reveal"
              style={{
                background: '#050505',
                border: '1px solid rgba(79,142,247,0.12)',
                boxShadow: '0 0 0 1px rgba(79,142,247,0.04), 0 24px 80px rgba(0,0,0,0.6)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.border = '1px solid rgba(79,142,247,0.28)'
                el.style.boxShadow = '0 0 0 1px rgba(79,142,247,0.1), 0 24px 80px rgba(0,0,0,0.7), 0 0 60px rgba(79,142,247,0.06)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.border = '1px solid rgba(79,142,247,0.12)'
                el.style.boxShadow = '0 0 0 1px rgba(79,142,247,0.04), 0 24px 80px rgba(0,0,0,0.6)'
              }}
            >
              <div className="absolute top-0 right-0 w-80 h-80 pointer-events-none" style={{ background: 'radial-gradient(circle at top right, rgba(79,142,247,0.07), transparent 60%)' }} aria-hidden="true" />
              <div className="absolute bottom-0 left-0 w-48 h-48 pointer-events-none opacity-50" style={{ background: 'radial-gradient(circle at bottom left, rgba(37,99,235,0.06), transparent 65%)' }} aria-hidden="true" />

              <div className="relative p-8">
                <div className="flex flex-wrap items-center gap-2.5 mb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-orange-300" style={{ background: 'rgba(251,146,60,0.08)', border: '1px solid rgba(251,146,60,0.2)' }}>
                    🔥 Limited Spots
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#60A5FA]" style={{ background: 'rgba(79,142,247,0.07)', border: '1px solid rgba(79,142,247,0.18)' }}>
                    Applications Open
                  </div>
                  <span className="text-xs text-gray-600 ml-auto hidden sm:block">Only accepting a few new mentees each month</span>
                </div>

                <div className="flex items-start justify-between gap-6 mb-7 flex-wrap">
                  <div>
                    <div className="text-xs text-[#4F8EF7] font-semibold uppercase tracking-wider mb-2">Direct 1-on-1 access</div>
                    <h3 className="text-2xl font-black mb-2 leading-tight">TikTok Shop Mentorship</h3>
                    <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
                      This is not a course you watch alone. This is direct access to someone generating real revenue — who will look at your specific account and tell you exactly what to do.
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-4xl font-black tracking-tight" style={{ textShadow: '0 0 30px rgba(79,142,247,0.2)' }}>
                      $1,080
                    </div>
                    <div className="text-xs font-medium text-[#4F8EF7]/70 mt-1">One-time payment</div>
                  </div>
                </div>

                <ul className="grid sm:grid-cols-2 gap-3 mb-7" aria-label="Mentorship includes">
                  {[
                    'Bi-weekly 1-on-1 coaching sessions',
                    'Personalized product & content strategy',
                    'Full account audit & teardown',
                    'Weekly private accountability calls',
                    'Priority DM access between sessions',
                    'Custom action plan built for your niche',
                  ].map(f => (
                    <li key={f} className="flex items-center gap-2.5 group/item">
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover/item:scale-110"
                        style={{ background: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.3)' }}
                        aria-hidden="true"
                      >
                        <Check className="w-2.5 h-2.5 text-[#4F8EF7]" />
                      </div>
                      <span className="text-xs text-gray-400 group-hover/item:text-gray-200 transition-colors duration-200">{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="divider mb-6" />

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Link
                    href="/auth/signup"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 group/btn"
                    style={{ background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.2)', color: '#60A5FA' }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = 'rgba(79,142,247,0.14)'
                      el.style.border = '1px solid rgba(79,142,247,0.38)'
                      el.style.boxShadow = '0 0 20px rgba(79,142,247,0.15)'
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = 'rgba(79,142,247,0.08)'
                      el.style.border = '1px solid rgba(79,142,247,0.2)'
                      el.style.boxShadow = 'none'
                    }}
                  >
                    Apply for Mentorship
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" aria-hidden="true" />
                  </Link>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-gray-500">Application required · Spots are limited</span>
                    <span className="text-xs text-gray-700">Not everyone is accepted. We only work with people serious about building.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ───────────────────────────────────── */}
        <section className="py-32 px-5 relative overflow-hidden" aria-label="Call to action">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(79,142,247,0.05), transparent 60%)' }} aria-hidden="true" />
          <div className="relative max-w-3xl mx-auto text-center reveal">
            <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
              The window is<br />
              <span className="shimmer-text">open right now.</span>
            </h2>
            <p className="text-gray-500 text-lg mb-12 max-w-xl mx-auto">
              TikTok Shop is still early. The creators who move now build the advantage that lasts.
            </p>
            <Link
              href="/auth/signup"
              className="btn-premium text-lg px-10 py-5 rounded-2xl inline-flex items-center gap-3 group"
            >
              <span className="flex items-center gap-3">
                Start Building Today
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </span>
            </Link>
          </div>
        </section>

      </main>

      {/* ── FOOTER ──────────────────────────────────────── */}
      <footer className="border-t border-white/[0.04] pt-16 pb-10 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4" aria-label="Timeless">
                <div className="w-6 h-6 relative" aria-hidden="true">
                  <div className="absolute inset-0 rounded rotate-45" style={{ background: 'linear-gradient(135deg, #4F8EF7, #2563EB)' }} />
                  <div className="absolute inset-[2px] bg-black rounded rotate-45" />
                  <div className="absolute inset-[3.5px] rounded rotate-45" style={{ background: 'linear-gradient(135deg, #60A5FA, #4F8EF7)' }} />
                </div>
                <span className="font-black text-sm">timeless</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mb-5">
                The TikTok Shop operating system for creators who are serious about building real income.
              </p>
              <div className="flex gap-3">
                {[
                  { icon: Twitter, href: '#', label: 'Twitter' },
                  { icon: Instagram, href: '#', label: 'Instagram' },
                  { icon: MessageCircle, href: '#', label: 'Discord' },
                ].map(s => {
                  const Icon = s.icon
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      aria-label={`Timeless on ${s.label}`}
                      className="w-8 h-8 glass rounded-lg flex items-center justify-center text-gray-600 hover:text-white hover:border-white/10 transition-all"
                    >
                      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Platform */}
            <nav aria-label="Platform links">
              <div className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Platform</div>
              <ul className="space-y-2.5">
                {['Courses', 'Community', 'Mentorship', 'Dashboard', 'Pricing'].map(l => (
                  <li key={l}>
                    <a href="#" className="text-xs text-gray-600 hover:text-white transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Company */}
            <nav aria-label="Company links">
              <div className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Company</div>
              <ul className="space-y-2.5">
                {['About', 'Blog', 'Careers', 'Contact', 'Apply for Mentorship'].map(l => (
                  <li key={l}>
                    <a href="#" className="text-xs text-gray-600 hover:text-white transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Legal */}
            <nav aria-label="Legal links">
              <div className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Legal</div>
              <ul className="space-y-2.5">
                {['Privacy Policy', 'Terms of Service', 'Refund Policy', 'Cookie Policy', 'Earnings Disclaimer'].map(l => (
                  <li key={l}>
                    <a href="#" className="text-xs text-gray-600 hover:text-white transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="divider mb-8" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-700">© {new Date().getFullYear()} Timeless Network, LLC. All rights reserved.</p>
            <p className="text-xs text-gray-700 text-center max-w-md">
              Timeless is not affiliated with TikTok or ByteDance. Results are not typical. Individual outcomes vary based on effort, experience, and market conditions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
