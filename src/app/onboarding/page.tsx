'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { COURSES } from '@/data/courses'

interface Step {
  id: string
  question: string
  subtitle: string
  options: { value: string; label: string; emoji: string; description: string }[]
}

const STEPS: Step[] = [
  {
    id: 'experience',
    question: 'Where are you right now?',
    subtitle: 'Be honest — this helps us build your roadmap.',
    options: [
      { value: 'zero', emoji: '👋', label: 'Complete beginner', description: 'Never used TikTok Shop. Starting from scratch.' },
      { value: 'started', emoji: '🌱', label: 'Just getting started', description: 'Have an account, posted a few videos, no consistent sales yet.' },
      { value: 'some', emoji: '📈', label: 'Getting some sales', description: 'Making occasional sales but not consistent or scalable.' },
      { value: 'scaling', emoji: '🚀', label: 'Ready to scale', description: 'Consistent income, want to multiply what\'s working.' },
    ],
  },
  {
    id: 'revenue',
    question: 'What\'s your current monthly revenue from TikTok?',
    subtitle: 'Approximate is fine. No judgment — everyone starts at zero.',
    options: [
      { value: '0', emoji: '💤', label: '$0', description: 'Haven\'t made my first sale yet' },
      { value: 'under1k', emoji: '💸', label: 'Under $1,000', description: 'Some sales coming in, not consistent' },
      { value: '1k-5k', emoji: '💰', label: '$1,000–$5,000', description: 'Solid start, want to break through to next level' },
      { value: '5k+', emoji: '🔥', label: '$5,000+', description: 'Already making money, want to 3–10x it' },
    ],
  },
  {
    id: 'goal',
    question: 'What\'s your main goal in the next 90 days?',
    subtitle: 'We\'ll build your roadmap around this.',
    options: [
      { value: 'first-sale', emoji: '🎯', label: 'Make my first sale', description: 'Get started and prove the model works' },
      { value: 'consistent', emoji: '📅', label: 'Get consistent income', description: 'Stop the ups and downs, build a reliable stream' },
      { value: '10k', emoji: '💎', label: 'Hit $10k/month', description: 'Break through to a full-time income' },
      { value: 'scale', emoji: '🏆', label: 'Scale beyond $10k', description: 'Build a real business, potentially build a team' },
    ],
  },
  {
    id: 'content',
    question: 'What type of content feels most natural to you?',
    subtitle: 'Start with your strengths. You can expand later.',
    options: [
      { value: 'faceless', emoji: '🖼️', label: 'Faceless / Slideshows', description: 'No camera needed. Product images + text.' },
      { value: 'video', emoji: '🎬', label: 'Product videos', description: 'On camera, showing and reviewing products.' },
      { value: 'live', emoji: '🔴', label: 'Live streaming', description: 'Real-time interaction, highest earning potential.' },
      { value: 'unsure', emoji: '🤔', label: 'Not sure yet', description: 'Start me with the basics and I\'ll figure it out.' },
    ],
  },
]

// Map answers to recommended starting course
function getRecommendedCourse(answers: Record<string, string>) {
  const { experience, content } = answers

  if (experience === 'zero' || experience === 'started') {
    // Beginners always start with foundation
    return COURSES.find(c => c.slug === 'ttshop-foundation') ?? COURSES[0]
  }

  if (content === 'faceless') {
    return COURSES.find(c => c.slug === 'ttshop-slideshow') ?? COURSES[0]
  }
  if (content === 'live') {
    return COURSES.find(c => c.slug === 'ttshop-live') ?? COURSES[0]
  }
  if (content === 'video') {
    return COURSES.find(c => c.slug === 'ttshop-video') ?? COURSES[0]
  }

  if (experience === 'scaling') {
    return COURSES.find(c => c.slug === 'tiktok-organic-growth') ?? COURSES[0]
  }

  return COURSES[0]
}

function getRoadmapCourses(answers: Record<string, string>) {
  const start = getRecommendedCourse(answers)
  const startIdx = COURSES.findIndex(c => c.slug === start.slug)
  // Return start course + next 3
  return COURSES.slice(startIdx, startIdx + 4)
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [done, setDone] = useState(false)

  const currentStep = STEPS[step]
  const progress = Math.round(((step) / STEPS.length) * 100)
  const isLast = step === STEPS.length - 1

  const select = (value: string) => {
    const next = { ...answers, [currentStep.id]: value }
    setAnswers(next)

    if (isLast) {
      // Save to localStorage so we don't show onboarding again
      localStorage.setItem('onboarding_complete', '1')
      localStorage.setItem('onboarding_answers', JSON.stringify(next))
      setDone(true)
    } else {
      setTimeout(() => setStep(s => s + 1), 200)
    }
  }

  if (done) {
    const recommended = getRecommendedCourse(answers)
    const roadmap = getRoadmapCourses(answers)

    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🎯</div>
            <h1 className="text-3xl font-black mb-2">Your roadmap is ready.</h1>
            <p className="text-gray-500 text-sm">Based on your answers, here&apos;s exactly where to start and what to do next.</p>
          </div>

          {/* Recommended first course */}
          <div className="card-premium p-5 mb-4" style={{ border: '1px solid rgba(168,85,247,0.2)' }}>
            <div className="text-xs text-[#a855f7] font-bold uppercase tracking-wider mb-3">Start Here</div>
            <div className="flex items-center gap-4">
              <div className="text-3xl" aria-hidden="true">{recommended.badge}</div>
              <div className="flex-1">
                <div className="font-bold">{recommended.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{recommended.totalLessons} lessons · {recommended.totalXP} XP · {recommended.level}</div>
              </div>
            </div>
            <Link href={`/courses/${recommended.slug}`}
              className="btn-premium w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm mt-4">
              Start This Course <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Roadmap */}
          <div className="card rounded-2xl p-5 mb-6">
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-3">Your 90-Day Roadmap</div>
            <ol className="space-y-3">
              {roadmap.map((course, i) => (
                <li key={course.slug} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                    style={i === 0
                      ? { background: 'rgba(168,85,247,0.15)', color: '#a855f7' }
                      : { background: 'rgba(255,255,255,0.04)', color: '#6B7280' }}>
                    {i + 1}
                  </div>
                  <span className="text-xl" aria-hidden="true">{course.badge}</span>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-semibold truncate ${i === 0 ? 'text-white' : 'text-gray-500'}`}>
                      {course.title}
                    </div>
                  </div>
                  {i === 0 && <Check className="w-4 h-4 text-[#a855f7] flex-shrink-0" />}
                </li>
              ))}
            </ol>
          </div>

          <Link href="/dashboard"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm text-gray-400 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            Go to Dashboard <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
            Skip for now
          </Link>
          <div className="text-xs text-gray-600">{step + 1} / {STEPS.length}</div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 rounded-full mb-8 overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #a855f7, #c084fc)' }} />
        </div>

        {/* Question */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-black mb-2">{currentStep.question}</h1>
          <p className="text-gray-500 text-sm">{currentStep.subtitle}</p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentStep.options.map(opt => {
            const selected = answers[currentStep.id] === opt.value
            return (
              <button
                key={opt.value}
                onClick={() => select(opt.value)}
                className="w-full text-left p-4 rounded-2xl transition-all group"
                style={selected
                  ? { background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)' }
                  : { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }
                }
                aria-pressed={selected}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl flex-shrink-0" aria-hidden="true">{opt.emoji}</span>
                  <div className="flex-1">
                    <div className={`font-bold text-sm ${selected ? 'text-[#c084fc]' : 'text-white'}`}>
                      {opt.label}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{opt.description}</div>
                  </div>
                  {selected && <Check className="w-4 h-4 text-[#a855f7] flex-shrink-0" />}
                </div>
              </button>
            )
          })}
        </div>

        {/* Back button */}
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)}
            className="mt-6 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-300 transition-colors mx-auto">
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        )}
      </div>
    </div>
  )
}
