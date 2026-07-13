'use client'

import Sidebar from '@/components/Sidebar'
import { Heart, Calendar, TrendingUp, ChevronRight, Quote } from 'lucide-react'

// ── Ty — the ONLY bookable mentor ─────────────────────
const TY = {
  avatar: 'TB',
  name: 'Ty - igetwifimoney',
  specialty: 'TikTok Shop & Creator Monetization',
  revenue: '$XX,000/mo',
  tags: ['TikTok Shop', 'Content Strategy', 'Organic Growth', 'Creator Revenue Program'],
  bio: "I built Timeless from the ground up after going from zero to a full-time income on TikTok Shop. I've coached over 200 creators 1-on-1 and watched them go from confused beginners to consistent earners. In our session, we'll look at your specific account, content, and goals and you'll leave with a clear action plan that actually fits your situation.",
  calLink: 'https://calendly.com', // Replace with real Calendly link
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
  { step: '01', title: 'Book your session', desc: 'Pick a time that works on Ty\'s Calendly — sessions are 45 minutes' },
  { step: '02', title: 'Deep-dive call', desc: 'Your account, your content, your goals — no generic advice' },
  { step: '03', title: 'Get your action plan', desc: 'Leave with a specific roadmap you can implement immediately' },
]

export default function MentorshipPage() {
  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />

      <main className="flex-1 overflow-y-auto pb-24 lg:pb-0" id="main-content">
        <div className="max-w-4xl mx-auto px-4 py-6 lg:px-6 lg:py-8">

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-black mb-1">Mentorship</h1>
            <p className="text-gray-500 text-sm">Book a 1-on-1 session with Ty and get a personalized action plan for your TikTok Shop journey.</p>
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

          {/* ── TY'S CARD — Bookable ── */}
          <section aria-labelledby="ty-heading" className="mb-12">
            <h2 id="ty-heading" className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Book a Session</h2>

            <article
              className="card-premium p-6 group"
              style={{ border: '1px solid rgba(79,142,247,0.2)', background: 'linear-gradient(145deg, #0a0a0a, #0d1117)' }}
              aria-label="Book a 1-on-1 session with Ty"
            >
              <div className="flex items-start gap-5">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <img
                    src="/founder.jpg"
                    alt="Ty"
                    className="w-16 h-16 rounded-2xl object-cover"
                    style={{ border: '1px solid rgba(79,142,247,0.2)' }}
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
                          className="text-xs font-bold px-2.5 py-0.5 rounded-full text-[#4F8EF7]"
                          style={{ background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.2)' }}
                        >
                          Founder
                        </span>
                      </div>
                      <div className="text-sm text-[#4F8EF7] font-medium mt-0.5">{TY.specialty}</div>
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
                        style={{ background: 'rgba(79,142,247,0.06)', border: '1px solid rgba(79,142,247,0.12)', color: '#60A5FA' }}
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
                        <TrendingUp className="w-3.5 h-3.5 text-[#4F8EF7]" aria-hidden="true" />
                        {TY.students}+ members coached
                      </span>
                    </div>

                    <a
                      href={TY.calLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-premium flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all"
                      aria-label="Book a 1-on-1 session with Ty"
                    >
                      <Calendar className="w-4 h-4" aria-hidden="true" />
                      Book Session
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                    </a>
                  </div>
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
                        style={{ background: 'linear-gradient(135deg, #4F8EF7, #2563EB)' }}
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
                          <div className="text-sm text-[#4F8EF7] font-medium mt-0.5">{mentee.specialty}</div>
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
                            style={{ background: 'rgba(79,142,247,0.06)', border: '1px solid rgba(79,142,247,0.12)', color: '#60A5FA' }}
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>

                      {/* Quote */}
                      <blockquote
                        className="rounded-xl p-4 text-sm text-gray-300 leading-relaxed italic"
                        style={{ background: 'rgba(79,142,247,0.04)', border: '1px solid rgba(79,142,247,0.08)' }}
                      >
                        <Quote className="w-3.5 h-3.5 text-[#4F8EF7] mb-2 opacity-60" aria-hidden="true" />
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
            <a
              href={TY.calLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-premium inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm"
            >
              <Calendar className="w-4 h-4" />
              Book Your Session with Ty
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
