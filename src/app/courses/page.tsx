'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { BookOpen, Play, Lock, CheckCircle2, Clock, ChevronDown, ChevronUp, Check } from 'lucide-react'

const MODULES = [
  {
    id: 1, title: 'TikTok Shop Fundamentals', lessons: 6, duration: '2h 15m', progress: 100, unlocked: true,
    desc: 'Everything you need to get started — account setup, how the algorithm works, and your first listing.',
    lessons_list: [
      { title: 'How TikTok Shop Works',          done: true,  duration: '18m' },
      { title: 'Setting Up Your Seller Account',  done: true,  duration: '22m' },
      { title: 'Understanding the Algorithm',     done: true,  duration: '31m' },
      { title: 'Your First Product Listing',      done: true,  duration: '28m' },
      { title: 'Commission Structures Explained', done: true,  duration: '19m' },
      { title: 'Module 1 Final Checklist',        done: true,  duration: '17m' },
    ],
  },
  {
    id: 2, title: 'Product Research Mastery', lessons: 8, duration: '3h 40m', progress: 75, unlocked: true,
    desc: 'Find winning products before you film a single video using the 3-filter method.',
    lessons_list: [
      { title: 'The 3-Filter Product Method',       done: true,  duration: '25m' },
      { title: 'Using TikTok Shop Analytics',       done: true,  duration: '33m' },
      { title: 'Competitor Reverse-Engineering',    done: true,  duration: '41m' },
      { title: 'Trend vs. Evergreen Products',      done: true,  duration: '29m' },
      { title: 'Supplier Negotiation Scripts',      done: true,  duration: '37m' },
      { title: 'Profit Margin Calculator Workshop', done: true,  duration: '22m' },
      { title: 'Building Your Product Shortlist',   done: false, duration: '31m' },
      { title: 'Launch-Ready Checklist',            done: false, duration: '22m' },
    ],
  },
  {
    id: 3, title: 'Content Creation System', lessons: 10, duration: '4h 20m', progress: 35, unlocked: true,
    desc: 'Hook formulas, filming techniques, and script structures that convert views into sales.',
    lessons_list: [
      { title: 'The Viral Hook Formula',         done: true,  duration: '28m' },
      { title: 'Filming Without Fancy Equipment', done: true,  duration: '35m' },
      { title: 'Script Writing with AI',          done: true,  duration: '42m' },
      { title: 'CTA Psychology',                  done: false, duration: '24m' },
      { title: 'Editing for Retention',           done: false, duration: '38m' },
    ],
  },
  {
    id: 4, title: 'Scaling to $10k/Month', lessons: 7, duration: '3h 00m', progress: 0, unlocked: true,
    desc: 'Systematize your content output, reinvest profits, and build a sustainable operation.',
    lessons_list: [],
  },
  {
    id: 5, title: 'Building a Content Team', lessons: 5, duration: '2h 10m', progress: 0, unlocked: false,
    desc: 'Hire and manage creators, editors, and VAs to scale without burning out.',
    lessons_list: [],
  },
  {
    id: 6, title: 'Advanced TikTok Ads', lessons: 9, duration: '4h 45m', progress: 0, unlocked: false,
    desc: 'Paid traffic strategies that pour fuel on an already-working organic system.',
    lessons_list: [],
  },
]

export default function CoursesPage() {
  const [expanded, setExpanded] = useState<number | null>(2)

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />

      <main className="flex-1 overflow-y-auto" id="main-content">
        <div className="max-w-4xl mx-auto px-6 py-8">

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-black mb-1">Courses</h1>
            <p className="text-gray-500">Your complete TikTok Shop curriculum — learn at your pace.</p>
          </header>

          {/* Progress overview */}
          <div className="card-premium p-5 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="flex-1 w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">Overall Progress</span>
                  <span className="text-sm font-bold text-[#4F8EF7]">32%</span>
                </div>
                <div
                  className="w-full h-2 rounded-full overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                  role="progressbar"
                  aria-valuenow={32}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Overall course progress: 32%"
                >
                  <div
                    className="h-2 rounded-full transition-all duration-700"
                    style={{ width: '32%', background: 'linear-gradient(90deg, #4F8EF7, #60A5FA)' }}
                  />
                </div>
                <div className="text-xs text-gray-600 mt-1.5">4 modules remaining · 19h total content</div>
              </div>
              <dl className="flex gap-5 text-center flex-shrink-0">
                {[
                  { value: '2',  label: 'Done'    },
                  { value: '6',  label: 'Total'   },
                  { value: '19h', label: 'Content' },
                ].map(s => (
                  <div key={s.label}>
                    <dt className="text-xs text-gray-600">{s.label}</dt>
                    <dd className="text-2xl font-black gradient-text-blue">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Module list */}
          <ol className="space-y-3" aria-label="Course modules">
            {MODULES.map(module => {
              const isExpanded = expanded === module.id
              const statusColor =
                module.progress === 100 ? 'text-emerald-400' :
                module.progress > 0    ? 'text-[#4F8EF7]'   : 'text-gray-600'

              const actionLabel =
                module.progress === 100 ? 'Review' :
                module.progress > 0    ? 'Continue' : 'Start'

              return (
                <li
                  key={module.id}
                  className="rounded-2xl overflow-hidden transition-all duration-300"
                  style={{
                    background: '#0E0E0E',
                    border: isExpanded
                      ? '1px solid rgba(79,142,247,0.2)'
                      : '1px solid rgba(255,255,255,0.05)',
                    opacity: !module.unlocked ? 0.55 : 1,
                    boxShadow: isExpanded ? '0 0 0 1px rgba(79,142,247,0.06)' : 'none',
                  }}
                >
                  {/* Module row — two separate elements, not button-in-button */}
                  <div className="flex items-center gap-4 p-5">
                    {/* Status icon */}
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      aria-hidden="true"
                      style={{
                        background: module.progress === 100
                          ? 'rgba(52,211,153,0.08)'
                          : module.progress > 0
                          ? 'rgba(79,142,247,0.08)'
                          : 'rgba(255,255,255,0.03)',
                        border: module.progress === 100
                          ? '1px solid rgba(52,211,153,0.15)'
                          : module.progress > 0
                          ? '1px solid rgba(79,142,247,0.15)'
                          : '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      {module.progress === 100
                        ? <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        : !module.unlocked
                        ? <Lock className="w-5 h-5 text-gray-700" />
                        : <BookOpen className={`w-5 h-5 ${statusColor}`} />
                      }
                    </div>

                    {/* Info — clicking this area toggles expansion */}
                    <button
                      className="flex-1 min-w-0 text-left hover:bg-transparent"
                      onClick={() => module.unlocked && module.lessons_list.length > 0 && setExpanded(isExpanded ? null : module.id)}
                      disabled={!module.unlocked || module.lessons_list.length === 0}
                      aria-expanded={module.lessons_list.length > 0 ? isExpanded : undefined}
                      aria-controls={module.lessons_list.length > 0 ? `module-lessons-${module.id}` : undefined}
                      aria-label={`Module ${module.id}: ${module.title}${module.unlocked ? '' : ' (locked)'}`}
                    >
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Module {module.id}</span>
                        {module.progress === 100 && (
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full text-emerald-400"
                            style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.15)' }}
                          >
                            Complete
                          </span>
                        )}
                        {!module.unlocked && (
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full text-gray-600"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                          >
                            Locked
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-sm mb-1">{module.title}</div>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" aria-hidden="true" />{module.lessons} lessons
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" aria-hidden="true" />{module.duration}
                        </span>
                      </div>
                      {module.progress > 0 && module.progress < 100 && (
                        <div className="flex items-center gap-2 mt-2">
                          <div
                            className="flex-1 h-1 rounded-full overflow-hidden"
                            style={{ background: 'rgba(255,255,255,0.05)' }}
                            role="progressbar"
                            aria-valuenow={module.progress}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`Module progress: ${module.progress}%`}
                          >
                            <div
                              className="h-1 rounded-full"
                              style={{ width: `${module.progress}%`, background: 'linear-gradient(90deg, #4F8EF7, #60A5FA)' }}
                            />
                          </div>
                          <span className="text-[10px] text-[#4F8EF7] font-semibold">{module.progress}%</span>
                        </div>
                      )}
                    </button>

                    {/* Right actions */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {module.unlocked && (
                        <button
                          className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl transition-all ${
                            module.progress === 100
                              ? 'text-emerald-400'
                              : module.progress > 0
                              ? 'btn-premium'
                              : 'text-gray-500'
                          }`}
                          style={module.progress === 100
                            ? { background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.15)' }
                            : module.progress === 0
                            ? { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }
                            : {}}
                          aria-label={`${actionLabel} Module ${module.id}: ${module.title}`}
                        >
                          <Play className="w-3.5 h-3.5" aria-hidden="true" />
                          {actionLabel}
                        </button>
                      )}
                      {module.unlocked && module.lessons_list.length > 0 && (
                        <span className="text-gray-600" aria-hidden="true">
                          {isExpanded
                            ? <ChevronUp className="w-4 h-4" />
                            : <ChevronDown className="w-4 h-4" />
                          }
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expanded lesson list */}
                  {isExpanded && module.lessons_list.length > 0 && (
                    <ol
                      id={`module-lessons-${module.id}`}
                      style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
                      aria-label={`Lessons in ${module.title}`}
                    >
                      {module.lessons_list.map((lesson, li) => (
                        <li
                          key={li}
                          className="group"
                          style={{ borderBottom: li < module.lessons_list.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}
                        >
                          <button
                            className="w-full flex items-center gap-3.5 px-5 py-3.5 text-left transition-colors hover:bg-white/[0.015]"
                            aria-label={`${lesson.done ? 'Completed: ' : ''}${lesson.title} — ${lesson.duration}`}
                          >
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                              aria-hidden="true"
                              style={lesson.done
                                ? { background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }
                                : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }
                              }
                            >
                              {lesson.done
                                ? <Check className="w-3 h-3 text-emerald-400" />
                                : <Play className="w-2.5 h-2.5 text-gray-600" />
                              }
                            </div>
                            <span className={`flex-1 text-sm ${
                              lesson.done
                                ? 'text-gray-500 line-through'
                                : 'text-gray-300 group-hover:text-white transition-colors'
                            }`}>
                              {lesson.title}
                            </span>
                            <span className="text-xs text-gray-700 flex-shrink-0">{lesson.duration}</span>
                          </button>
                        </li>
                      ))}
                    </ol>
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      </main>
    </div>
  )
}
