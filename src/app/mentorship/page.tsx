'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { Heart, TrendingUp, ChevronRight, Quote, CreditCard, Loader2, ClipboardList, X } from 'lucide-react'

// ── Ty — the ONLY bookable mentor ─────────────────────
const TY = {
  avatar: 'TB',
  name: 'Ty - igetwifimoney',
  specialty: 'TikTok Shop & Creator Monetization',
  revenue: '$XX,000/mo',
  tags: ['TikTok Shop', 'Content Strategy', 'Organic Growth', 'Creator Revenue Program'],
  bio: "I've been building on TikTok Shop for years — and built Timeless from the ground up after finding a system that actually works. I've coached over 247 creators 1-on-1 and watched them go from confused beginners to consistent earners. In our session, we'll look at your specific account, content, and goals and you'll leave with a clear action plan that actually fits your situation.",
  students: 247,
}

// ── Mentee Success Stories ────
// Sorted by likes descending
const MENTEES = [
  {
    avatar: 'JW',
    name: 'James W.',
    specialty: 'TikTok Shop Scaling',
    revenue: '$180k/mo',
    tags: ['Product Research', 'Content Strategy', 'Paid Ads'],
    likes: 847,
    quote: "Working with Ty was the turning point for me. He helped me find the right products, nail my content formula, and I went from $0 to $180k/month in under 8 months. He doesn't give generic advice he actually looks at what you're doing and tells you exactly what to fix.",
  },
  {
    avatar: 'KS',
    name: 'Keisha S.',
    specialty: 'Viral Content Creation',
    revenue: '$65k/mo',
    tags: ['Script Writing', 'Hook Creation', 'Organic Growth'],
    likes: 623,
    quote: "I had 10+ videos go past 1M views after our 1-on-1 with Ty. He broke down my hooks and showed me exactly what was stopping my content from catching. I went from averaging 2K views to 400K views average. Completely changed my career trajectory.",
  },
  {
    avatar: 'RM',
    name: 'Ryan M.',
    specialty: 'Affiliate & Commission Strategy',
    revenue: '$42k/mo',
    tags: ['Affiliate Models', 'Commission Structures', 'Niche Selection'],
    likes: 412,
    quote: "Ty helped me build a TikTok Shop affiliate system that runs without me holding inventory. I'm completely location-free now making $42k/month. The session paid for itself in the first two days the niche switch alone was worth thousands.",
  },
  {
    avatar: 'DN',
    name: 'Diana N.',
    specialty: 'Brand Building',
    revenue: '$95k/mo',
    tags: ['Brand Identity', 'Premium Positioning', 'Team Building'],
    likes: 298,
    quote: "I went from random product videos to an actual 7-figure brand identity thanks to Ty's mentorship. He helped me see the bigger picture that I wasn't just an affiliate, I was building a brand. That mindset shift plus his tactical advice on premium positioning changed everything.",
  },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Apply', desc: 'Tell us about your TikTok Shop journey — takes about 2 minutes' },
  { step: '02', title: 'Get reviewed', desc: 'Every application is reviewed personally — no automatic approval' },
  { step: '03', title: 'Start mentorship', desc: 'Approved applicants get a personalized plan and direct access to Ty' },
]

const EMPTY_APPLY_FORM = {
  name: '',
  email: '',
  experience: '',
  revenue: '',
  challenge: '',
  goals: '',
  why_mentor: '',
}

export default function MentorshipPage() {
  const router = useRouter()
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')

  const [showApplyModal, setShowApplyModal] = useState(false)
  const [applyLoading, setApplyLoading] = useState(false)
  const [applyError, setApplyError] = useState('')
  const [applySuccess, setApplySuccess] = useState(false)
  const [applyForm, setApplyForm] = useState(EMPTY_APPLY_FORM)

  const updateApplyField = (field: keyof typeof EMPTY_APPLY_FORM, value: string) =>
    setApplyForm(prev => ({ ...prev, [field]: value }))

  const closeApplyModal = () => {
    setShowApplyModal(false)
    setApplySuccess(false)
    setApplyError('')
    setApplyForm(EMPTY_APPLY_FORM)
  }

  const submitApplication = async (e: React.FormEvent) => {
    e.preventDefault()
    setApplyLoading(true)
    setApplyError('')
    try {
      const res = await fetch('/api/mentorship-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...applyForm, source: 'network' }),
      })
      const data = await res.json()
      if (!res.ok) {
        setApplyError(data.error || 'Could not submit application. Please try again.')
        return
      }
      setApplySuccess(true)
    } catch {
      setApplyError('Could not submit application. Please try again.')
    } finally {
      setApplyLoading(false)
    }
  }

  const purchaseMentorship = async () => {
    setCheckoutLoading(true)
    setCheckoutError('')
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productKey: 'MENTORSHIP' }),
      })
      if (res.status === 401) {
        router.push('/auth/login?next=/mentorship')
        return
      }
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
        return
      }
      setCheckoutError(data.error || 'Could not start checkout. Please try again.')
    } catch {
      setCheckoutError('Could not start checkout. Please try again.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />

      <main className="flex-1 overflow-y-auto pb-24 lg:pb-0" id="main-content">
        <div className="max-w-4xl mx-auto px-4 py-6 lg:px-6 lg:py-8">

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-black mb-1">Mentorship</h1>
            <p className="text-gray-500 text-sm">Apply for 1-on-1 mentorship with Ty and get a personalized action plan for your TikTok Shop journey.</p>
          </header>

          {/* How it works */}
          <ol className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10" aria-label="How mentorship works">
            {HOW_IT_WORKS.map(item => (
              <li key={item.step} className="card-premium p-5 text-center group list-none">
                <div className="text-2xl font-black gradient-text-blue mb-3 group-hover:scale-110 transition-transform inline-block" aria-hidden="true">
                  {item.step}
                </div>
                <div className="text-sm font-bold mb-1">{item.title}</div>
                <div className="text-xs text-gray-600 leading-relaxed">{item.desc}</div>
              </li>
            ))}
          </ol>

          {/* ── TY'S CARD ── */}
          <section aria-labelledby="ty-heading" className="mb-12">
            <h2 id="ty-heading" className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Apply for Mentorship</h2>

            <article
              className="card-premium p-6 group"
              style={{ border: '1px solid rgba(168,85,247,0.2)', background: 'linear-gradient(145deg, #0a0a0a, #0d1117)' }}
              aria-label="Apply for 1-on-1 mentorship with Ty"
            >
              <div className="flex items-start gap-5">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <img
                    src="/founder.jpg"
                    alt="Ty"
                    className="w-16 h-16 rounded-2xl object-cover"
                    style={{ border: '1px solid rgba(168,85,247,0.2)' }}
                  />
                  {/* Live indicator */}
                  <div
                    className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 flex items-center justify-center"
                    style={{ border: '2px solid #000' }}
                    aria-hidden="true"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-1">
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-bold text-lg">{TY.name}</span>
                        <span
                          className="text-xs font-semibold px-2.5 py-0.5 rounded-full text-emerald-400"
                          style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.15)' }}
                        >
                          ● Available
                        </span>
                        <span
                          className="text-xs font-bold px-2.5 py-0.5 rounded-full text-[#a855f7]"
                          style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}
                        >
                          Founder
                        </span>
                      </div>
                      <div className="text-sm text-[#a855f7] font-medium mt-0.5">{TY.specialty}</div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-gray-400 leading-relaxed mt-2 mb-3">{TY.bio}</p>

                  {/* Tags */}
                  <ul className="flex flex-wrap gap-2 mb-4" aria-label="Specialties">
                    {TY.tags.map(tag => (
                      <li
                        key={tag}
                        className="text-xs px-2.5 py-1 rounded-lg font-medium list-none"
                        style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.12)', color: '#c084fc' }}
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>

                  {/* Footer */}
                  <div
                    className="flex items-center justify-between pt-4 flex-wrap gap-3"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-[#a855f7]" aria-hidden="true" />
                        {TY.students}+ members coached
                      </span>
                    </div>

                    <button
                      onClick={() => setShowApplyModal(true)}
                      className="btn-premium flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all"
                      aria-label="Apply for 1-on-1 mentorship with Ty"
                    >
                      <ClipboardList className="w-4 h-4" aria-hidden="true" />
                      Apply for Mentorship
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Purchase mentorship directly — skips the application, straight to checkout */}
                  <div
                    className="flex items-center justify-between pt-4 mt-4 flex-wrap gap-3"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <span className="text-xs text-gray-600">Already sure this is for you? Skip the wait and purchase directly.</span>
                    <button
                      onClick={purchaseMentorship}
                      disabled={checkoutLoading}
                      className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                      aria-label="Purchase TikTok Shop Mentorship"
                    >
                      {checkoutLoading
                        ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                        : <CreditCard className="w-4 h-4" aria-hidden="true" />
                      }
                      Purchase Mentorship — $1,080
                    </button>
                  </div>
                  {checkoutError && (
                    <p className="text-xs text-red-400 mt-2" role="alert">{checkoutError}</p>
                  )}
                </div>
              </div>
            </article>
          </section>

          {/* ── MENTEE SUCCESS STORIES ── */}
          <section aria-labelledby="success-heading">
            <h2 id="success-heading" className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Mentee Success Stories</h2>
            <p className="text-sm text-gray-500 mb-5">Real members who worked 1-on-1 with Ty and transformed their results.</p>

            <div className="space-y-4">
              {MENTEES.map(mentee => (
                <article
                  key={mentee.name}
                  className="card-premium p-6"
                  aria-label={`Success story: ${mentee.name}, ${mentee.specialty}`}
                >
                  <div className="flex items-start gap-5">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black text-white"
                        style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}
                        aria-hidden="true"
                      >
                        {mentee.avatar}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-4 flex-wrap mb-1">
                        <div>
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="font-bold text-base">{mentee.name}</span>
                            <span
                              className="text-xs font-semibold px-2 py-0.5 rounded-full text-emerald-400"
                              style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.12)' }}
                            >
                              Timeless Mentee
                            </span>
                          </div>
                          <div className="text-sm text-[#a855f7] font-medium mt-0.5">{mentee.specialty}</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-lg font-black text-emerald-400">{mentee.revenue}</div>
                          <div className="text-xs text-gray-600">monthly revenue</div>
                        </div>
                      </div>

                      {/* Tags */}
                      <ul className="flex flex-wrap gap-2 my-3" aria-label="Specialties">
                        {mentee.tags.map(tag => (
                          <li
                            key={tag}
                            className="text-xs px-2.5 py-1 rounded-lg font-medium list-none"
                            style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.12)', color: '#c084fc' }}
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>

                      {/* Quote */}
                      <blockquote
                        className="rounded-xl p-4 text-sm text-gray-300 leading-relaxed italic"
                        style={{ background: 'rgba(168,85,247,0.04)', border: '1px solid rgba(168,85,247,0.08)' }}
                      >
                        <Quote className="w-3.5 h-3.5 text-[#a855f7] mb-2 opacity-60" aria-hidden="true" />
                        {mentee.quote}
                      </blockquote>

                      {/* Likes */}
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-105"
                          style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)', color: '#F87171' }}
                          aria-label={`${mentee.likes} likes`}
                        >
                          <Heart className="w-3.5 h-3.5 fill-[#F87171]" />
                          {mentee.likes.toLocaleString()}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="mt-10 text-center">
            <p className="text-sm text-gray-600 mb-4">
              Ready to accelerate your results?
            </p>
            <button
              onClick={() => setShowApplyModal(true)}
              className="btn-premium inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm"
            >
              <ClipboardList className="w-4 h-4" />
              Apply for Mentorship
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      {/* ── APPLICATION MODAL ── */}
      {showApplyModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)' }}
          onClick={closeApplyModal}
        >
          <div
            className="w-full max-w-md rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto"
            style={{ background: 'linear-gradient(145deg, #0a0a0a, #0d1117)', border: '1px solid rgba(168,85,247,0.2)' }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={closeApplyModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {!applySuccess ? (
              <>
                <h3 className="text-xl font-black mb-1">Apply for Mentorship</h3>
                <p className="text-sm text-gray-500 mb-5">
                  Tell us a bit about yourself — every application is reviewed personally. If it&apos;s a fit, we&apos;ll follow up by email with next steps.
                </p>
                <form onSubmit={submitApplication} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={applyForm.name}
                      onChange={e => updateApplyField('name', e.target.value)}
                      className="w-full rounded-lg px-3 py-2 text-sm bg-black/40 border border-white/10 focus:outline-none focus:border-[#a855f7]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={applyForm.email}
                      onChange={e => updateApplyField('email', e.target.value)}
                      className="w-full rounded-lg px-3 py-2 text-sm bg-black/40 border border-white/10 focus:outline-none focus:border-[#a855f7]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">TikTok Shop Experience</label>
                    <textarea
                      rows={2}
                      value={applyForm.experience}
                      onChange={e => updateApplyField('experience', e.target.value)}
                      placeholder="e.g. 6 months, posting daily"
                      className="w-full rounded-lg px-3 py-2 text-sm bg-black/40 border border-white/10 focus:outline-none focus:border-[#a855f7] resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">Current Revenue / Results So Far</label>
                    <input
                      type="text"
                      value={applyForm.revenue}
                      onChange={e => updateApplyField('revenue', e.target.value)}
                      placeholder="e.g. $2k/mo, just starting out"
                      className="w-full rounded-lg px-3 py-2 text-sm bg-black/40 border border-white/10 focus:outline-none focus:border-[#a855f7]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">Biggest Challenge Right Now</label>
                    <textarea
                      rows={2}
                      value={applyForm.challenge}
                      onChange={e => updateApplyField('challenge', e.target.value)}
                      className="w-full rounded-lg px-3 py-2 text-sm bg-black/40 border border-white/10 focus:outline-none focus:border-[#a855f7] resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">Goals for the Next 6 Months</label>
                    <textarea
                      rows={2}
                      value={applyForm.goals}
                      onChange={e => updateApplyField('goals', e.target.value)}
                      className="w-full rounded-lg px-3 py-2 text-sm bg-black/40 border border-white/10 focus:outline-none focus:border-[#a855f7] resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">Why do you want 1-on-1 mentorship?</label>
                    <textarea
                      rows={3}
                      value={applyForm.why_mentor}
                      onChange={e => updateApplyField('why_mentor', e.target.value)}
                      className="w-full rounded-lg px-3 py-2 text-sm bg-black/40 border border-white/10 focus:outline-none focus:border-[#a855f7] resize-none"
                    />
                  </div>

                  {applyError && <p className="text-xs text-red-400" role="alert">{applyError}</p>}

                  <button
                    type="submit"
                    disabled={applyLoading}
                    className="btn-premium w-full flex items-center justify-center gap-2 text-sm font-bold px-5 py-3 rounded-xl transition-all mt-2"
                  >
                    {applyLoading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
                    Submit Application
                  </button>
                </form>
              </>
            ) : (
              <>
                <h3 className="text-xl font-black mb-2">Application received 🎉</h3>
                <p className="text-sm text-gray-500 mb-5">
                  Thanks — we review every application personally. If it&apos;s a fit, you&apos;ll hear from us by email.
                </p>
                <button
                  onClick={closeApplyModal}
                  className="btn-premium w-full flex items-center justify-center gap-2 text-sm font-bold px-5 py-3 rounded-xl transition-all"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
