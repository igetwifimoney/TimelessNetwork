'use client'

import Sidebar from '@/components/Sidebar'
import { Star, Calendar, TrendingUp, ChevronRight, Check } from 'lucide-react'

const MENTORS = [
  {
    avatar: 'JW', name: 'James W.', specialty: 'TikTok Shop Scaling',
    revenue: '$180k/mo', rating: 4.9, reviews: 87, available: true,
    tags: ['Product Research', 'Content Strategy', 'Paid Ads'],
    bio: 'Built 3 TikTok Shop brands from scratch. Specializes in finding winning products and scaling with paid traffic. 2-year track record.',
    students: 34,
  },
  {
    avatar: 'KS', name: 'Keisha S.', specialty: 'Viral Content Creation',
    revenue: '$65k/mo', rating: 5.0, reviews: 54, available: true,
    tags: ['Script Writing', 'Hook Creation', 'Organic Growth'],
    bio: 'Content creator with 10+ viral TikToks (1M+ views each). Teaches the hook formula that drives shop sales consistently.',
    students: 21,
  },
  {
    avatar: 'RM', name: 'Ryan M.', specialty: 'Affiliate & Commission Strategy',
    revenue: '$42k/mo', rating: 4.8, reviews: 112, available: false,
    tags: ['Affiliate Models', 'Commission Structures', 'Niche Selection'],
    bio: 'Full-time TikTok Shop affiliate. Built a system that generates income without holding inventory — completely location-free.',
    students: 58,
  },
  {
    avatar: 'DN', name: 'Diana N.', specialty: 'Brand Building',
    revenue: '$95k/mo', rating: 4.9, reviews: 63, available: true,
    tags: ['Brand Identity', 'Premium Positioning', 'Team Building'],
    bio: 'Built a 7-figure brand on TikTok Shop. Expert in premium product positioning and building a real business — not just a side hustle.',
    students: 29,
  },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Choose a mentor', desc: 'Browse by specialty, revenue proof, and ratings' },
  { step: '02', title: 'Book a session', desc: '45-minute deep-dive — your account, your goals' },
  { step: '03', title: 'Get your plan', desc: 'Leave with a concrete action plan to implement' },
]

export default function MentorshipPage() {
  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />

      <main className="flex-1 overflow-y-auto" id="main-content">
        <div className="max-w-4xl mx-auto px-6 py-8">

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-black mb-1">Mentorship</h1>
            <p className="text-gray-500">Book 1-on-1 sessions with sellers who&apos;ve already done what you&apos;re trying to do.</p>
          </header>

          {/* How it works */}
          <ol className="grid grid-cols-3 gap-4 mb-10" aria-label="How mentorship works">
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

          {/* Mentor cards */}
          <div className="space-y-4" role="list" aria-label="Available mentors">
            {MENTORS.map(mentor => (
              <article
                key={mentor.name}
                className="card-premium p-6 group"
                aria-label={`${mentor.name}, ${mentor.specialty}${mentor.available ? ', available' : ', fully booked'}`}
              >
                <div className="flex items-start gap-5">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black text-white"
                      style={{ background: 'linear-gradient(135deg, #4F8EF7, #2563EB)' }}
                      aria-hidden="true"
                    >
                      {mentor.avatar}
                    </div>
                    {mentor.available && (
                      <div
                        className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 flex items-center justify-center"
                        style={{ border: '2px solid #000' }}
                        aria-hidden="true"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-4 flex-wrap mb-1">
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-bold text-lg">{mentor.name}</span>
                          <span
                            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full`}
                            style={mentor.available
                              ? { background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.15)', color: '#34D399' }
                              : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#6B7280' }
                            }
                          >
                            {mentor.available ? '● Available' : 'Fully Booked'}
                          </span>
                        </div>
                        <div className="text-sm text-[#4F8EF7] font-medium mt-0.5">{mentor.specialty}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-black text-emerald-400">{mentor.revenue}</div>
                        <div className="text-xs text-gray-600">monthly revenue</div>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-gray-400 leading-relaxed mt-2 mb-3">{mentor.bio}</p>

                    {/* Tags */}
                    <ul className="flex flex-wrap gap-2 mb-4" aria-label="Specialties">
                      {mentor.tags.map(tag => (
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
                        <span className="flex items-center gap-1.5">
                          <span
                            className="flex items-center gap-0.5"
                            role="img"
                            aria-label={`Rating: ${mentor.rating} out of 5`}
                          >
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < Math.floor(mentor.rating) ? 'fill-[#4F8EF7] text-[#4F8EF7]' : 'text-gray-700'}`}
                                aria-hidden="true"
                              />
                            ))}
                          </span>
                          <span className="font-semibold text-white">{mentor.rating}</span>
                          <span>({mentor.reviews} reviews)</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5 text-[#4F8EF7]" aria-hidden="true" />
                          {mentor.students} students mentored
                        </span>
                      </div>
                      <button
                        disabled={!mentor.available}
                        className={`flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all ${
                          mentor.available ? 'btn-premium' : 'cursor-not-allowed'
                        }`}
                        style={!mentor.available ? {
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          color: '#4B5563',
                        } : {}}
                        aria-label={mentor.available
                          ? `Book a session with ${mentor.name}`
                          : `Join waitlist for ${mentor.name} — currently fully booked`
                        }
                      >
                        <Calendar className="w-4 h-4" aria-hidden="true" />
                        {mentor.available ? 'Book Session' : 'Join Waitlist'}
                        {mentor.available && (
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <p className="text-center text-sm text-gray-700 mt-8">
            Generating serious revenue on TikTok Shop?{' '}
            <a href="#" className="text-[#4F8EF7] hover:text-[#60A5FA] transition-colors font-medium">
              Apply to become a mentor →
            </a>
          </p>
        </div>
      </main>
    </div>
  )
}
