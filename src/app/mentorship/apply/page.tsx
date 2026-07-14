'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, ChevronRight, Loader2, Shield, Star } from 'lucide-react'

interface FormData {
  name:        string
  email:       string
  experience:  string
  revenue:     string
  challenge:   string
  goals:       string
  whyMentor:   string
}

const EMPTY: FormData = {
  name:        '',
  email:       '',
  experience:  '',
  revenue:     '',
  challenge:   '',
  goals:       '',
  whyMentor:   '',
}

const EXPERIENCE_OPTIONS = [
  'Just getting started (0–3 months)',
  'Some experience (3–12 months)',
  'Intermediate (1–2 years)',
  'Established creator (2+ years)',
]

const REVENUE_OPTIONS = [
  "$0 — haven't made a sale yet",
  '$1 – $500/month',
  '$500 – $2,000/month',
  '$2,000 – $5,000/month',
  '$5,000 – $10,000/month',
  '$10,000+/month',
]

export default function MentorshipApplyPage() {
  const [form, setForm]       = useState<FormData>(EMPTY)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError]     = useState('')

  const set = (key: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm(prev => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const required: (keyof FormData)[] = ['name', 'email', 'experience', 'revenue', 'challenge', 'goals', 'whyMentor']
    for (const k of required) {
      if (!form[k].trim()) {
        setError('Please fill in all fields before submitting.')
        return
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/mentorship/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:       form.name,
          email:      form.email,
          experience: form.experience,
          revenue:    form.revenue,
          challenge:  form.challenge,
          goals:      form.goals,
          why_mentor: form.whyMentor,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        setLoading(false)
        return
      }
      setSubmitted(true)
    } catch {
      setError('Network error — please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  /* ── SUCCESS STATE ── */
  if (submitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-5 py-20">
        <div
          className="max-w-lg w-full rounded-3xl overflow-hidden relative"
          style={{
            background: '#040404',
            border: '1px solid rgba(168,85,247,0.2)',
            boxShadow: '0 0 80px rgba(168,85,247,0.07), 0 32px 100px rgba(0,0,0,0.8)',
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.6), transparent)' }} />
          <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none" style={{ background: 'radial-gradient(circle at top right, rgba(168,85,247,0.08), transparent 60%)' }} />

          <div className="relative p-10 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.25)', boxShadow: '0 0 30px rgba(168,85,247,0.15)' }}
            >
              <Check className="w-8 h-8 text-[#a855f7]" />
            </div>

            <div className="text-xs text-[#a855f7] font-bold uppercase tracking-widest mb-3">Application Received</div>
            <h1 className="text-3xl font-black mb-4 leading-tight">
              Thank you,<br />{form.name.split(' ')[0]}.
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
              Your application has been received and will be personally reviewed. We only accept applicants we genuinely believe we can help — so we take every submission seriously.
            </p>

            <div
              className="rounded-2xl p-5 mb-8 text-left"
              style={{ background: 'rgba(168,85,247,0.04)', border: '1px solid rgba(168,85,247,0.12)' }}
            >
              <div className="text-xs text-[#a855f7] font-semibold uppercase tracking-wider mb-3">What happens next</div>
              <ul className="space-y-2.5">
                {[
                  'Your application is read personally — not by a bot',
                  'If you\'re a fit, you\'ll hear back within 3–5 business days',
                  'Accepted applicants receive a private link to schedule a call',
                  'Spots are limited — decisions are final',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                    <span
                      className="w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.2)', color: '#c084fc' }}
                    >{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Timeless
            </Link>
          </div>
        </div>
      </div>
    )
  }

  /* ── FORM ── */
  return (
    <div className="min-h-screen bg-black px-5 py-16">
      <div className="max-w-xl mx-auto">

        {/* Back link */}
        <Link
          href="/#mentorship-apply"
          className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-white transition-colors mb-10"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-2.5 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-orange-300" style={{ background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.25)' }}>
              🔥 Limited Spots
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#c084fc]" style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}>
              Applications Open
            </div>
          </div>
          <h1 className="text-4xl font-black mb-3 leading-tight">
            Apply for<br />
            <span className="gradient-text">Private Mentorship</span>
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-md">
            Every application is personally reviewed. Be honest — we accept based on fit, not experience level. If we believe we can help you, we&apos;ll reach out.
          </p>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: '#040404',
            border: '1px solid rgba(168,85,247,0.15)',
            boxShadow: '0 0 60px rgba(168,85,247,0.05), 0 24px 80px rgba(0,0,0,0.7)',
          }}
          aria-label="Mentorship application form"
          noValidate
        >
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.4), transparent)' }} />
          <div className="absolute top-0 right-0 w-64 h-48 pointer-events-none" style={{ background: 'radial-gradient(circle at top right, rgba(168,85,247,0.07), transparent 60%)' }} />

          <div className="relative p-8 md:p-10 space-y-6">

            {/* Name + Email */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full Name" required>
                <input
                  type="text"
                  value={form.name}
                  onChange={set('name')}
                  placeholder="Your name"
                  className="field-input"
                  autoComplete="name"
                  aria-label="Full name"
                />
              </Field>
              <Field label="Email Address" required>
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="you@email.com"
                  className="field-input"
                  autoComplete="email"
                  aria-label="Email address"
                />
              </Field>
            </div>

            {/* Experience */}
            <Field label="TikTok Shop Experience" required>
              <select
                value={form.experience}
                onChange={set('experience')}
                className="field-input"
                aria-label="TikTok Shop experience level"
              >
                <option value="" disabled>Select your experience level…</option>
                {EXPERIENCE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>

            {/* Revenue */}
            <Field label="Current Monthly Revenue" required>
              <select
                value={form.revenue}
                onChange={set('revenue')}
                className="field-input"
                aria-label="Current monthly revenue"
              >
                <option value="" disabled>Select your current revenue…</option>
                {REVENUE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>

            {/* Biggest Challenge */}
            <Field label="What's your biggest challenge right now?" required>
              <textarea
                value={form.challenge}
                onChange={set('challenge')}
                rows={3}
                placeholder="Be specific — what's actually blocking you?"
                className="field-input resize-none"
                aria-label="Biggest current challenge"
              />
            </Field>

            {/* Goals */}
            <Field label="What are your goals for the next 90 days?" required>
              <textarea
                value={form.goals}
                onChange={set('goals')}
                rows={3}
                placeholder="Revenue targets, milestones, what success looks like…"
                className="field-input resize-none"
                aria-label="90-day goals"
              />
            </Field>

            {/* Why mentorship */}
            <Field label="Why do you want this mentorship?" required>
              <textarea
                value={form.whyMentor}
                onChange={set('whyMentor')}
                rows={4}
                placeholder="Why now? What will change if you get accepted?"
                className="field-input resize-none"
                aria-label="Reason for applying"
              />
            </Field>

            {/* Error */}
            {error && (
              <p className="text-xs text-red-400 flex items-center gap-2" role="alert">
                <span>⚠</span> {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm transition-all duration-300"
              style={{
                background: loading
                  ? 'rgba(168,85,247,0.08)'
                  : 'linear-gradient(135deg, rgba(168,85,247,0.18), rgba(37,99,235,0.12))',
                border: '1px solid rgba(168,85,247,0.3)',
                color: '#93C5FD',
                boxShadow: loading ? 'none' : '0 0 30px rgba(168,85,247,0.10)',
              }}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  Submitting…
                </>
              ) : (
                <>
                  Submit Application
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </>
              )}
            </button>

            {/* Footer note */}
            <div className="flex flex-col gap-1.5 pt-1">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Shield className="w-3.5 h-3.5 text-gray-700 flex-shrink-0" aria-hidden="true" />
                Your information is kept private and never shared.
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Star className="w-3.5 h-3.5 text-gray-700 flex-shrink-0" aria-hidden="true" />
                Every application is reviewed personally — not by automation.
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ── Field wrapper ── */
function Field({
  label,
  required,
  children,
}: {
  label:    string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {label} {required && <span className="text-[#a855f7]" aria-hidden="true">*</span>}
      </label>
      {children}
    </div>
  )
}
