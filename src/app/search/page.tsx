'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, BookOpen, FileText, ChevronRight, X } from 'lucide-react'
import { COURSES } from '@/data/courses'

// Flatten all searchable items
const COURSE_ITEMS = COURSES.flatMap(course =>
  course.lessons.map(lesson => ({
    type: 'lesson' as const,
    title: lesson.title,
    subtitle: course.title,
    href: `/courses/${course.slug}/${lesson.slug}`,
    badge: course.badge,
    xp: lesson.xp,
    keywords: `${course.title} ${lesson.title} ${course.category}`.toLowerCase(),
  }))
)

const COURSE_CARDS = COURSES.map(course => ({
  type: 'course' as const,
  title: course.title,
  subtitle: `${course.totalLessons} lessons · ${course.totalXP} XP · ${course.level}`,
  href: `/courses/${course.slug}`,
  badge: course.badge,
  keywords: `${course.title} ${course.description} ${course.category}`.toLowerCase(),
}))

const RESOURCE_ITEMS = [
  { title: '50 Proven TikTok Hooks', subtitle: 'Hooks & Scripts', href: '/resources', keywords: 'hooks scripts tiktok viral' },
  { title: '20 High-Converting CTAs', subtitle: 'Hooks & Scripts', href: '/resources', keywords: 'cta call to action convert' },
  { title: 'Product Video Script Template', subtitle: 'Templates', href: '/resources', keywords: 'script template video' },
  { title: 'Competitor Research Sheet', subtitle: 'Research Tools', href: '/resources', keywords: 'research competitor analysis' },
  { title: 'Pre-Post Checklist', subtitle: 'Checklists', href: '/resources', keywords: 'checklist post upload' },
  { title: 'Pre-Live Checklist', subtitle: 'Checklists', href: '/resources', keywords: 'live stream checklist' },
  { title: 'AI Hook Generator Prompt', subtitle: 'Prompts', href: '/resources', keywords: 'ai prompt hook generator' },
  { title: 'Brand Outreach Templates', subtitle: 'Templates', href: '/resources', keywords: 'brand outreach email template' },
].map(r => ({ ...r, type: 'resource' as const, badge: '📄' }))

const ALL_ITEMS = [...COURSE_CARDS, ...COURSE_ITEMS, ...RESOURCE_ITEMS]

const QUICK_LINKS = [
  { label: 'TikTok Shop Foundation', href: '/courses/ttshop-foundation', badge: '🛒' },
  { label: 'Hook Formula', href: '/courses/tiktok-hooks', badge: '🎣' },
  { label: 'Going Live', href: '/courses/ttshop-live', badge: '🔴' },
  { label: 'Resources', href: '/resources', badge: '📚' },
  { label: 'Product Tracker', href: '/tracker', badge: '📦' },
  { label: 'Dashboard', href: '/dashboard', badge: '⚡' },
]

export default function SearchPage() {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return []
    return ALL_ITEMS.filter(item =>
      item.keywords.includes(q) || item.title.toLowerCase().includes(q)
    ).slice(0, 20)
  }, [query])

  const courses = results.filter(r => r.type === 'course')
  const lessons = results.filter(r => r.type === 'lesson')
  const resources = results.filter(r => r.type === 'resource')

  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      <div className="max-w-2xl mx-auto px-4 lg:px-6 py-6 lg:py-12">

        {/* Search bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search courses, lessons, resources..."
            className="w-full pl-12 pr-12 py-4 rounded-2xl text-base bg-white/4 border border-white/8 text-white placeholder-gray-600 outline-none focus:border-white/20 transition-colors"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          />
          {query && (
            <button onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Empty state — quick links */}
        {!query && (
          <div>
            <div className="text-xs text-gray-600 font-medium uppercase tracking-wider mb-3">Quick Links</div>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_LINKS.map(link => (
                <Link key={link.href} href={link.href}
                  className="flex items-center gap-3 p-3 rounded-xl transition-all hover:border-white/12"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="text-xl">{link.badge}</span>
                  <span className="text-sm text-gray-300 font-medium truncate">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* No results */}
        {query && results.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-8 h-8 text-gray-700 mx-auto mb-3" />
            <div className="text-gray-500 text-sm">No results for &ldquo;{query}&rdquo;</div>
            <div className="text-gray-700 text-xs mt-1">Try "hooks", "live", "product research"...</div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-6">
            {courses.length > 0 && (
              <ResultSection title="Courses" icon={<BookOpen className="w-3.5 h-3.5" />} items={courses} />
            )}
            {lessons.length > 0 && (
              <ResultSection title="Lessons" icon={<BookOpen className="w-3.5 h-3.5" />} items={lessons} />
            )}
            {resources.length > 0 && (
              <ResultSection title="Resources" icon={<FileText className="w-3.5 h-3.5" />} items={resources} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function ResultSection({ title, icon, items }: {
  title: string
  icon: React.ReactNode
  items: typeof ALL_ITEMS
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">
        {icon} {title}
      </div>
      <div className="space-y-1">
        {items.map((item, i) => (
          <Link key={i} href={item.href}
            className="flex items-center gap-3 p-3 rounded-xl transition-all hover:border-white/12 group"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-xl flex-shrink-0">{item.badge}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{item.title}</div>
              <div className="text-xs text-gray-500 truncate">{item.subtitle}</div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-[#4F8EF7] transition-colors flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  )
}
