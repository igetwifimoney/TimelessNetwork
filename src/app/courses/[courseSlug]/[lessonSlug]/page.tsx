'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import SubscriptionGate from '@/components/SubscriptionGate'
import { getCourseBySlug } from '@/data/courses'
import {
  ArrowLeft, ChevronLeft, ChevronRight,
  CheckCircle, Zap, Clock, Loader2, BookOpen
} from 'lucide-react'

// Simple markdown-ish renderer — handles headings, bold, lists, blockquotes, code, dividers
function RenderContent({ content }: { content: string }) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  const parseInline = (text: string) => {
    // Handle **bold**, `code`, and plain text
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
    return parts.map((part, pi) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={pi} className="text-white font-semibold">{part.slice(2, -2)}</strong>
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={pi} className="px-1.5 py-0.5 rounded text-[#c084fc] text-xs font-mono" style={{ background: 'rgba(168,85,247,0.1)' }}>{part.slice(1, -1)}</code>
      }
      return <span key={pi}>{part}</span>
    })
  }

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-base font-bold text-white mt-6 mb-2">{line.slice(4)}</h3>)
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-xl font-black text-white mt-8 mb-3">{line.slice(3)}</h2>)
    } else if (line.startsWith('# ')) {
      elements.push(<h1 key={i} className="text-2xl font-black text-white mb-4">{line.slice(2)}</h1>)
    } else if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={i} className="my-4 pl-4 py-3 rounded-r-xl text-sm text-gray-300 leading-relaxed" style={{ borderLeft: '3px solid #a855f7', background: 'rgba(168,85,247,0.06)' }}>
          {parseInline(line.slice(2))}
        </blockquote>
      )
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      // Collect list items
      const items: string[] = []
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        items.push(lines[i].slice(2))
        i++
      }
      elements.push(
        <ul key={`ul-${i}`} className="my-3 space-y-1.5 ml-4">
          {items.map((item, ii) => (
            <li key={ii} className="flex items-start gap-2 text-sm text-gray-300 leading-relaxed">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#a855f7] flex-shrink-0" aria-hidden="true" />
              <span>{parseInline(item)}</span>
            </li>
          ))}
        </ul>
      )
      continue
    } else if (/^\d+\. /.test(line)) {
      // Numbered list
      const items: string[] = []
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ''))
        i++
      }
      elements.push(
        <ol key={`ol-${i}`} className="my-3 space-y-1.5 ml-4">
          {items.map((item, ii) => (
            <li key={ii} className="flex items-start gap-2.5 text-sm text-gray-300 leading-relaxed">
              <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-[#a855f7]" style={{ background: 'rgba(168,85,247,0.1)' }} aria-hidden="true">{ii + 1}</span>
              <span>{parseInline(item)}</span>
            </li>
          ))}
        </ol>
      )
      continue
    } else if (line === '---') {
      elements.push(<hr key={i} className="my-6 border-white/[0.06]" />)
    } else if (line.trim() === '') {
      // blank line — skip (headings/paragraphs add their own spacing)
    } else {
      elements.push(
        <p key={i} className="text-sm text-gray-300 leading-relaxed my-2">
          {parseInline(line)}
        </p>
      )
    }

    i++
  }

  return <div className="prose-timeless">{elements}</div>
}

export default function LessonPage({
  params,
}: {
  params: { courseSlug: string; lessonSlug: string }
}) {
  const { courseSlug, lessonSlug } = params
  const course = getCourseBySlug(courseSlug)
  if (!course) notFound()

  const lessonIndex = course.lessons.findIndex(l => l.slug === lessonSlug)
  if (lessonIndex === -1) notFound()

  const lesson = course.lessons[lessonIndex]
  const prevLesson = course.lessons[lessonIndex - 1]
  const nextLesson = course.lessons[lessonIndex + 1]

  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [xpToast, setXpToast] = useState(false)

  // Check if already completed (from localStorage as lightweight client cache)
  useEffect(() => {
    const key = `completed:${courseSlug}:${lessonSlug}`
    if (localStorage.getItem(key)) setCompleted(true)
  }, [courseSlug, lessonSlug])

  const markComplete = async () => {
    if (completed || loading) return
    setLoading(true)

    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseSlug, lessonSlug, xp: lesson.xp }),
      })

      if (res.ok) {
        // Cache locally
        localStorage.setItem(`completed:${courseSlug}:${lessonSlug}`, '1')
        setCompleted(true)
        setXpToast(true)
        setTimeout(() => setXpToast(false), 3000)
      }
    } catch {
      // If API fails (e.g. not logged in), still mark locally so UX works
      localStorage.setItem(`completed:${courseSlug}:${lessonSlug}`, '1')
      setCompleted(true)
      setXpToast(true)
      setTimeout(() => setXpToast(false), 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />

      {/* XP Toast */}
      {xpToast && (
        <div
          className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl text-sm font-bold shadow-2xl animate-pulse"
          style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)', color: '#c084fc' }}
          role="status"
          aria-live="polite"
        >
          <Zap className="w-4 h-4" aria-hidden="true" />
          +{lesson.xp} XP earned! 🎉
        </div>
      )}

      <main className="flex-1 overflow-y-auto pb-24 lg:pb-0" id="main-content">
        <SubscriptionGate>
        <div className="max-w-2xl mx-auto px-4 py-6 lg:px-6 lg:py-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-gray-600 mb-6 flex-wrap" aria-label="Breadcrumb">
            <Link href="/courses" className="hover:text-gray-300 transition-colors">Courses</Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
            <Link href={`/courses/${courseSlug}`} className="hover:text-gray-300 transition-colors truncate max-w-[140px]">
              {course.title}
            </Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
            <span className="text-gray-400 truncate max-w-[120px]">{lesson.title}</span>
          </nav>

          {/* Lesson header */}
          <header className="mb-6">
            <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" aria-hidden="true" />
                Lesson {lessonIndex + 1} of {course.lessons.length}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" aria-hidden="true" />
                {lesson.duration}
              </span>
              <span className="flex items-center gap-1 text-[#a855f7] font-semibold">
                <Zap className="w-3 h-3" aria-hidden="true" />
                {lesson.xp} XP
              </span>
            </div>
            <h1 className="text-2xl font-black leading-tight">{lesson.title}</h1>

            {/* Progress bar */}
            <div className="mt-3">
              <div
                className="w-full h-1 rounded-full overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.05)' }}
                role="progressbar"
                aria-valuenow={Math.round(((lessonIndex + (completed ? 1 : 0)) / course.lessons.length) * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Course progress`}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.round(((lessonIndex + (completed ? 1 : 0)) / course.lessons.length) * 100)}%`,
                    background: 'linear-gradient(90deg, #a855f7, #c084fc)',
                  }}
                />
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {lessonIndex + (completed ? 1 : 0)} of {course.lessons.length} lessons complete
              </div>
            </div>
          </header>

          {/* Lesson content */}
          <article
            className="card rounded-2xl p-6 mb-6"
            aria-label={`Lesson content: ${lesson.title}`}
          >
            <RenderContent content={lesson.content} />
          </article>

          {/* Mark Complete Button */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <button
              onClick={markComplete}
              disabled={completed || loading}
              className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all ${
                completed
                  ? 'cursor-default'
                  : 'btn-premium'
              }`}
              style={completed ? {
                background: 'rgba(52,211,153,0.08)',
                border: '1px solid rgba(52,211,153,0.2)',
                color: '#34D399',
              } : {}}
              aria-label={completed ? 'Lesson completed' : `Mark lesson complete and earn ${lesson.xp} XP`}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Saving…</>
              ) : completed ? (
                <><CheckCircle className="w-4 h-4" aria-hidden="true" /> Lesson Complete — {lesson.xp} XP Earned</>
              ) : (
                <><CheckCircle className="w-4 h-4" aria-hidden="true" /> Mark Complete &amp; Earn {lesson.xp} XP</>
              )}
            </button>
          </div>

          {/* Prev / Next navigation */}
          <nav className="flex gap-3" aria-label="Lesson navigation">
            {prevLesson ? (
              <Link
                href={`/courses/${courseSlug}/${prevLesson.slug}`}
                className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-white transition-all group"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
                aria-label={`Previous lesson: ${prevLesson.title}`}
              >
                <ChevronLeft className="w-4 h-4 flex-shrink-0 group-hover:-translate-x-0.5 transition-transform" aria-hidden="true" />
                <div className="min-w-0">
                  <div className="text-[10px] text-gray-600 uppercase tracking-wide">Previous</div>
                  <div className="truncate font-medium">{prevLesson.title}</div>
                </div>
              </Link>
            ) : (
              <Link
                href={`/courses/${courseSlug}`}
                className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-white transition-all group"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
                aria-label="Back to course overview"
              >
                <ChevronLeft className="w-4 h-4 flex-shrink-0 group-hover:-translate-x-0.5 transition-transform" aria-hidden="true" />
                <div>
                  <div className="text-[10px] text-gray-600 uppercase tracking-wide">Back to</div>
                  <div className="font-medium">Course Overview</div>
                </div>
              </Link>
            )}

            {nextLesson ? (
              <Link
                href={`/courses/${courseSlug}/${nextLesson.slug}`}
                className="flex-1 flex items-center justify-end gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all group"
                style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)', color: '#c084fc' }}
                aria-label={`Next lesson: ${nextLesson.title}`}
              >
                <div className="min-w-0 text-right">
                  <div className="text-[10px] text-[#a855f7]/60 uppercase tracking-wide">Next Lesson</div>
                  <div className="truncate">{nextLesson.title}</div>
                </div>
                <ChevronRight className="w-4 h-4 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
              </Link>
            ) : (
              <Link
                href={`/courses/${courseSlug}`}
                className="flex-1 flex items-center justify-end gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all group"
                style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', color: '#34D399' }}
                aria-label="Course complete — back to course overview"
              >
                <div className="text-right">
                  <div className="text-[10px] text-emerald-400/60 uppercase tracking-wide">Course Done!</div>
                  <div>Back to Overview</div>
                </div>
                <ChevronRight className="w-4 h-4 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
              </Link>
            )}
          </nav>
        </div>
        </SubscriptionGate>
      </main>
    </div>
  )
}
