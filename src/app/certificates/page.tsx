'use client'

import { useEffect, useState, useRef } from 'react'
import { COURSES } from '@/data/courses'
import { Award, Download, Lock } from 'lucide-react'

interface CompletedLesson { courseSlug: string; lessonSlug: string }

function getCertEarned(courseSlug: string, completed: CompletedLesson[]): boolean {
  const course = COURSES.find(c => c.slug === courseSlug)
  if (!course) return false
  const completedSlugs = completed.filter(c => c.courseSlug === courseSlug).map(c => c.lessonSlug)
  return course.lessons.every(l => completedSlugs.includes(l.lessonSlug ?? l.slug))
}

function Certificate({ course, name, date }: { course: typeof COURSES[0]; name: string; date: string }) {
  const certRef = useRef<HTMLDivElement>(null)

  function download() {
    if (typeof window === 'undefined') return
    // Open print dialog focused on the cert element
    const printContent = certRef.current?.outerHTML ?? ''
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
      <html><head><title>Certificate - ${course.title}</title>
      <style>
        body { margin: 0; background: #000; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: -apple-system, sans-serif; }
        @media print { body { background: white; } }
      </style></head>
      <body>${printContent}</body></html>
    `)
    win.document.close()
    setTimeout(() => win.print(), 500)
  }

  return (
    <div className="space-y-3">
      {/* Certificate card */}
      <div ref={certRef}
        className="relative overflow-hidden rounded-2xl p-8 text-center"
        style={{
          background: 'linear-gradient(135deg, #050505 0%, #0a0a1a 50%, #050505 100%)',
          border: '1px solid rgba(79,142,247,0.3)',
          boxShadow: '0 0 60px rgba(79,142,247,0.08), inset 0 0 60px rgba(79,142,247,0.02)',
        }}>

        {/* Corner decorations */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 rounded-tl-sm opacity-30" style={{ borderColor: '#4F8EF7' }} />
        <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 rounded-tr-sm opacity-30" style={{ borderColor: '#4F8EF7' }} />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 rounded-bl-sm opacity-30" style={{ borderColor: '#4F8EF7' }} />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 rounded-br-sm opacity-30" style={{ borderColor: '#4F8EF7' }} />

        {/* Badge */}
        <div className="text-5xl mb-4">{course.badge}</div>

        {/* Timeless wordmark */}
        <div className="text-xs font-black uppercase tracking-[0.4em] mb-1" style={{ color: '#4F8EF7' }}>
          TIMELESS NETWORK
        </div>

        {/* Title */}
        <div className="text-[10px] uppercase tracking-widest text-gray-600 mb-6">
          Certificate of Completion
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(79,142,247,0.3))' }} />
          <Award className="w-4 h-4 text-[#4F8EF7]" />
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(79,142,247,0.3))' }} />
        </div>

        {/* Name */}
        <div className="text-xs text-gray-500 mb-1">This certifies that</div>
        <div className="text-2xl font-black mb-1 gradient-text-blue">{name || 'Timeless Member'}</div>
        <div className="text-xs text-gray-500 mb-6">has successfully completed</div>

        {/* Course name */}
        <div className="text-lg font-black text-white mb-2">{course.title}</div>
        <div className="text-xs text-gray-500 mb-8">
          {course.totalLessons} lessons · {course.totalXP} XP · {course.level}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(79,142,247,0.15))' }} />
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(79,142,247,0.15))' }} />
        </div>

        {/* Footer */}
        <div className="flex items-end justify-between px-4">
          <div className="text-left">
            <div className="text-sm font-bold text-white">Ty Baughn</div>
            <div className="text-[10px] text-gray-600">Founder, Timeless Network</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-white">{date}</div>
            <div className="text-[10px] text-gray-600">Date Earned</div>
          </div>
        </div>
      </div>

      {/* Download button */}
      <button onClick={download}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white transition-colors"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <Download className="w-4 h-4" />
        Save / Print Certificate
      </button>
    </div>
  )
}

export default function CertificatesPage() {
  const [completed, setCompleted] = useState<CompletedLesson[]>([])
  const [name, setName] = useState('')
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)

  useEffect(() => {
    // Load completed lessons from localStorage
    const keys = Object.keys(localStorage).filter(k => k.startsWith('lesson_complete_'))
    const lessons: CompletedLesson[] = keys.map(k => {
      const [, , courseSlug, lessonSlug] = k.split('_').join('_').split('lesson_complete_')[1].split('/')
      return { courseSlug, lessonSlug }
    }).filter(l => l.courseSlug && l.lessonSlug)
    setCompleted(lessons)

    // Try to get name from profile
    try {
      const profile = localStorage.getItem('timeless_profile')
      if (profile) setName(JSON.parse(profile).name ?? '')
    } catch {}
  }, [])

  const earnedCourses = COURSES.filter(c => getCertEarned(c.slug, completed))
  const lockedCourses = COURSES.filter(c => !getCertEarned(c.slug, completed)).slice(0, 6)

  const certCourse = selectedCourse ? COURSES.find(c => c.slug === selectedCourse) : null

  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      <div className="max-w-4xl mx-auto px-4 lg:px-6 py-6 lg:py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black mb-1">Certificates</h1>
          <p className="text-gray-500 text-sm">Complete every lesson in a course to earn your certificate.</p>
        </div>

        {/* Name field */}
        <div className="card rounded-2xl p-4 mb-8 flex items-center gap-4">
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">Your name on certificates</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full bg-transparent text-sm text-white placeholder-gray-600 outline-none"
            />
          </div>
          <Award className="w-5 h-5 text-[#4F8EF7] flex-shrink-0" />
        </div>

        {/* Certificate viewer */}
        {certCourse && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-sm">Your Certificate</h2>
              <button onClick={() => setSelectedCourse(null)} className="text-xs text-gray-500 hover:text-white transition-colors">
                Close
              </button>
            </div>
            <Certificate
              course={certCourse}
              name={name}
              date={new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            />
          </div>
        )}

        {/* Earned */}
        {earnedCourses.length > 0 && (
          <div className="mb-8">
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-3">
              Earned ({earnedCourses.length})
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {earnedCourses.map(course => (
                <button key={course.slug} onClick={() => setSelectedCourse(course.slug)}
                  className="card rounded-2xl p-4 text-left transition-all hover:border-[#4F8EF7]/30 group"
                  style={{ border: '1px solid rgba(79,142,247,0.15)' }}>
                  <div className="text-2xl mb-2">{course.badge}</div>
                  <div className="font-bold text-sm mb-0.5">{course.title}</div>
                  <div className="text-xs text-green-400 font-semibold">✓ Certificate Earned</div>
                  <div className="text-xs text-gray-600 mt-1">Tap to view</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty earned state */}
        {earnedCourses.length === 0 && (
          <div className="card rounded-2xl p-8 text-center mb-8" style={{ border: '1px solid rgba(79,142,247,0.1)' }}>
            <Award className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <div className="font-bold text-sm mb-1">No certificates yet</div>
            <div className="text-xs text-gray-500">Complete every lesson in a course to earn your first certificate.</div>
          </div>
        )}

        {/* Locked */}
        <div>
          <div className="text-xs text-gray-600 font-bold uppercase tracking-wider mb-3">
            In Progress / Locked
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lockedCourses.map(course => {
              const done = completed.filter(c => c.courseSlug === course.slug).length
              const total = course.lessons.length
              const pct = total > 0 ? Math.round((done / total) * 100) : 0
              return (
                <div key={course.slug} className="card rounded-2xl p-4 opacity-60">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{course.badge}</span>
                    <Lock className="w-3.5 h-3.5 text-gray-600 ml-auto" />
                  </div>
                  <div className="font-semibold text-sm mb-1">{course.title}</div>
                  <div className="h-1 rounded-full mb-1 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'rgba(79,142,247,0.5)' }} />
                  </div>
                  <div className="text-xs text-gray-600">{done} / {total} lessons</div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
