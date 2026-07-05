'use client'

import { useState } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import SubscriptionGate from '@/components/SubscriptionGate'
import { COURSES, type Course } from '@/data/courses'
import { BookOpen, Clock, Zap, ChevronRight, ShoppingBag, TrendingUp } from 'lucide-react'

const CATEGORIES = [
  { id: 'all',    label: 'All Courses',   icon: BookOpen    },
  { id: 'ttshop', label: 'TikTok Shop',   icon: ShoppingBag },
  { id: 'tiktok', label: 'TikTok Growth', icon: TrendingUp  },
] as const

const LEVEL_COLOR: Record<string, string> = {
  Beginner:     'text-emerald-400',
  Intermediate: 'text-[#4F8EF7]',
  Advanced:     'text-orange-400',
}

function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="card-premium p-5 flex flex-col gap-3 group hover:border-[#4F8EF7]/30 transition-all"
      aria-label={`${course.title} — ${course.level}, ${course.totalLessons} lessons`}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.15)' }}
          aria-hidden="true"
        >
          {course.badge}
        </div>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${LEVEL_COLOR[course.level]}`}
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          {course.level}
        </span>
      </div>

      <div className="flex-1">
        <h2 className="font-bold text-sm mb-1 group-hover:text-white transition-colors leading-snug">
          {course.title}
        </h2>
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{course.description}</p>
      </div>

      <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="flex items-center gap-3 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" aria-hidden="true" />
            {course.totalLessons} lessons
          </span>
          <span className="flex items-center gap-1 text-[#4F8EF7] font-semibold">
            <Zap className="w-3 h-3" aria-hidden="true" />
            {course.totalXP} XP
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-[#4F8EF7] group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
      </div>
    </Link>
  )
}

export default function CoursesPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'ttshop' | 'tiktok'>('all')

  const filtered = activeCategory === 'all'
    ? COURSES.filter(c => c.category !== 'youtube')
    : COURSES.filter(c => c.category === activeCategory)

  const totalXP = COURSES.reduce((s, c) => s + c.totalXP, 0)
  const totalLessons = COURSES.reduce((s, c) => s + c.totalLessons, 0)

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />

      <main className="flex-1 overflow-y-auto pb-24 lg:pb-0" id="main-content">
        <SubscriptionGate>
        <div className="max-w-5xl mx-auto px-4 py-6 lg:px-6 lg:py-8">

          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black">Courses</h1>
              <span
                className="text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1"
                style={{ background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.2)', color: '#60A5FA' }}
              >
                <Clock className="w-2.5 h-2.5" />
                Updated July 2026
              </span>
            </div>
            <p className="text-gray-500 text-sm">Your complete TikTok Shop & creator curriculum. Learn at your pace, earn XP every lesson.</p>
          </header>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { label: 'Total Courses',  value: COURSES.length },
              { label: 'Total Lessons',  value: totalLessons   },
              { label: 'Total XP Available', value: `${totalXP.toLocaleString()} XP` },
            ].map(s => (
              <div key={s.label} className="card-premium p-4 text-center">
                <div className="text-2xl font-black gradient-text-blue">{s.value}</div>
                <div className="text-xs text-gray-600 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Category filter */}
          <nav className="flex gap-2 mb-6 overflow-x-auto pb-1 -mx-1 px-1" aria-label="Course categories">
            {CATEGORIES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveCategory(id as typeof activeCategory)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold flex-shrink-0 transition-all"
                style={activeCategory === id
                  ? { background: 'rgba(79,142,247,0.12)', border: '1px solid rgba(79,142,247,0.25)', color: '#60A5FA' }
                  : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#6B7280' }
                }
                aria-pressed={activeCategory === id}
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                {label}
              </button>
            ))}
          </nav>

          {/* Course grid */}
          <section aria-label={`${activeCategory === 'all' ? 'All courses' : CATEGORIES.find(c => c.id === activeCategory)?.label}`}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(course => (
                <CourseCard key={course.slug} course={course} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-600">
                <BookOpen className="w-8 h-8 mx-auto mb-3 opacity-40" />
                <p>No courses in this category yet.</p>
              </div>
            )}
          </section>

          {/* Coming Soon */}
          <div className="mt-10 rounded-2xl p-6 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-2xl mb-2">🎬</div>
            <h3 className="font-bold text-sm mb-1">YouTube & Video Courses — Coming Soon</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Full video course library with walkthroughs, breakdowns, and step-by-step tutorials. Drop in the community when you want to see it.
            </p>
          </div>
        </div>
        </SubscriptionGate>
      </main>
    </div>
  )
}
