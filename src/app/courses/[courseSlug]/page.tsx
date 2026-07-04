'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { use } from 'react'
import Sidebar from '@/components/Sidebar'
import { getCourseBySlug, COURSES } from '@/data/courses'
import { BookOpen, Zap, Clock, Play, ChevronRight, ArrowLeft } from 'lucide-react'

const LEVEL_COLOR: Record<string, string> = {
  Beginner:     'text-emerald-400',
  Intermediate: 'text-[#4F8EF7]',
  Advanced:     'text-orange-400',
}

export default function CoursePage({ params }: { params: Promise<{ courseSlug: string }> }) {
  const { courseSlug } = use(params)
  const course = getCourseBySlug(courseSlug)
  if (!course) notFound()

  // Find prev/next courses in the full list for navigation
  const idx = COURSES.findIndex(c => c.slug === courseSlug)
  const nextCourse = COURSES[idx + 1]

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />

      <main className="flex-1 overflow-y-auto pb-24 lg:pb-0" id="main-content">
        <div className="max-w-3xl mx-auto px-4 py-6 lg:px-6 lg:py-8">

          {/* Back nav */}
          <Link
            href="/courses"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-6 w-fit"
            aria-label="Back to all courses"
          >
            <ArrowLeft className="w-4 h-4" />
            All Courses
          </Link>

          {/* Course header */}
          <header className="mb-8">
            <div className="flex items-start gap-4 mb-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.15)' }}
                aria-hidden="true"
              >
                {course.badge}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${LEVEL_COLOR[course.level]}`}
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    {course.level}
                  </span>
                  <span className="text-[10px] text-gray-600 font-medium uppercase tracking-wide">
                    {course.category === 'ttshop' ? 'TikTok Shop' : course.category === 'tiktok' ? 'TikTok Growth' : 'YouTube'}
                  </span>
                </div>
                <h1 className="text-2xl font-black leading-tight">{course.title}</h1>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">{course.description}</p>

            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-gray-500">
                <BookOpen className="w-4 h-4" aria-hidden="true" />
                {course.totalLessons} lessons
              </span>
              <span className="flex items-center gap-1.5 text-[#4F8EF7] font-semibold">
                <Zap className="w-4 h-4" aria-hidden="true" />
                {course.totalXP} XP total
              </span>
            </div>
          </header>

          {/* Start button */}
          <Link
            href={`/courses/${course.slug}/${course.lessons[0].slug}`}
            className="btn-premium flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold mb-8"
            aria-label={`Start ${course.title} — first lesson: ${course.lessons[0].title}`}
          >
            <Play className="w-4 h-4" aria-hidden="true" />
            Start Course
          </Link>

          {/* Lessons list */}
          <section aria-labelledby="lessons-heading">
            <h2 id="lessons-heading" className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
              Course Lessons
            </h2>
            <ol className="space-y-2">
              {course.lessons.map((lesson, i) => (
                <li key={lesson.slug}>
                  <Link
                    href={`/courses/${course.slug}/${lesson.slug}`}
                    className="flex items-center gap-4 p-4 rounded-xl group transition-all"
                    style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.05)' }}
                    aria-label={`Lesson ${i + 1}: ${lesson.title} — ${lesson.duration}, ${lesson.xp} XP`}
                  >
                    {/* Lesson number */}
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all group-hover:border-[#4F8EF7]/30"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#6B7280' }}
                      aria-hidden="true"
                    >
                      {i + 1}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors truncate">
                        {lesson.title}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" aria-hidden="true" />
                          {lesson.duration}
                        </span>
                        <span className="flex items-center gap-1 text-[#4F8EF7]">
                          <Zap className="w-3 h-3" aria-hidden="true" />
                          {lesson.xp} XP
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-[#4F8EF7] group-hover:translate-x-0.5 transition-all flex-shrink-0" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ol>
          </section>

          {/* Next course teaser */}
          {nextCourse && (
            <div className="mt-10 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <p className="text-xs text-gray-600 mb-3 uppercase tracking-wider font-semibold">Up Next</p>
              <Link
                href={`/courses/${nextCourse.slug}`}
                className="flex items-center gap-4 p-4 rounded-xl group transition-all hover:border-[#4F8EF7]/20"
                style={{ background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.04)' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: 'rgba(79,142,247,0.06)', border: '1px solid rgba(79,142,247,0.1)' }}
                  aria-hidden="true"
                >
                  {nextCourse.badge}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{nextCourse.title}</div>
                  <div className="text-xs text-gray-600">{nextCourse.totalLessons} lessons · {nextCourse.totalXP} XP</div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-[#4F8EF7] transition-colors flex-shrink-0" aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
