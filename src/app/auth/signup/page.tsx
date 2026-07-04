'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Check, Loader2, ArrowRight, Star, Mail } from 'lucide-react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase'

const PERKS = [
  { icon: '📚', text: 'Complete TikTok Shop course library' },
  { icon: '👥', text: 'Private creator community (1,200+ members)' },
  { icon: '🎙️', text: 'Weekly live Q&A calls with active sellers' },
  { icon: '🎯', text: 'Daily missions, streaks & XP system' },
  { icon: '💬', text: 'Discord access — every niche, every stage' },
]

export default function SignupPage() {
  const router = useRouter()

  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSupabaseConfigured()) {
      setError('Supabase is not configured yet. Add your keys to .env.local and restart the dev server.')
      return
    }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: signupError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.name },
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })
    if (signupError) {
      setError(signupError.message)
      setLoading(false)
      return
    }
    setSubmitted(true)
    setLoading(false)
  }

  // ── Email verification screen ──────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          {/* Icon */}
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.2)' }}
          >
            <Mail className="w-9 h-9 text-[#4F8EF7]" />
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-black mb-3">Check your email</h1>
          <p className="text-gray-400 text-sm leading-relaxed mb-2">
            We sent a verification link to
          </p>
          <p className="font-bold text-white mb-6">{form.email}</p>

          {/* Instructions */}
          <div
            className="rounded-2xl p-5 mb-6 text-left space-y-3"
            style={{ background: 'rgba(79,142,247,0.04)', border: '1px solid rgba(79,142,247,0.12)' }}
          >
            {[
              { num: '1', text: 'Open your email inbox' },
              { num: '2', text: 'Find the email from Timeless' },
              { num: '3', text: 'Click the "Confirm your email" link' },
              { num: '4', text: "You'll be taken straight to your dashboard" },
            ].map(step => (
              <div key={step.num} className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 text-[#4F8EF7]"
                  style={{ background: 'rgba(79,142,247,0.12)' }}
                >
                  {step.num}
                </div>
                <span className="text-sm text-gray-300">{step.text}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-600">
            Didn&apos;t get it? Check your spam folder.{' '}
            <button
              onClick={() => setSubmitted(false)}
              className="text-[#4F8EF7] hover:text-[#60A5FA] transition-colors"
            >
              Try a different email
            </button>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Skip link */}
      <a href="#signup-form" className="skip-link">Skip to sign up form</a>

      {/* ── LEFT — form ── */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12 max-w-lg mx-auto lg:mx-0 relative">
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(79,142,247,0.03), transparent 60%)' }}
          aria-hidden="true"
        />

        <div className="relative">
          <Link href="/" className="flex items-center gap-2.5 mb-12 group w-fit" aria-label="Timeless — go to home">
            <div className="w-6 h-6 relative flex-shrink-0" aria-hidden="true">
              <div className="absolute inset-0 rounded rotate-45 transition-transform group-hover:rotate-[60deg] duration-300"
                style={{ background: 'linear-gradient(135deg, #4F8EF7, #2563EB)' }} />
              <div className="absolute inset-[2px] bg-black rounded rotate-45" />
              <div className="absolute inset-[3.5px] rounded rotate-45"
                style={{ background: 'linear-gradient(135deg, #60A5FA, #4F8EF7)' }} />
            </div>
            <span className="font-black text-sm tracking-tight">timeless</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-black mb-2 leading-tight">
              Create your account
            </h1>
            <p className="text-gray-500 text-sm">Start building your TikTok Shop income today.</p>
          </div>

          <form id="signup-form" onSubmit={handleSignup} className="space-y-4" noValidate aria-label="Create account form">
            <div>
              <label htmlFor="signup-name" className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                Full Name
              </label>
              <input
                id="signup-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                autoComplete="name"
                aria-required="true"
              />
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                autoComplete="email"
                aria-required="true"
                aria-describedby={error ? 'signup-error' : undefined}
              />
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  aria-required="true"
                  aria-describedby={error ? 'signup-error' : 'signup-pw-hint'}
                  style={{ paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" aria-hidden="true" />
                    : <Eye className="w-4 h-4" aria-hidden="true" />
                  }
                </button>
              </div>
              <p id="signup-pw-hint" className="text-xs text-gray-700 mt-1.5">Minimum 8 characters</p>
            </div>

            {error && (
              <div
                id="signup-error"
                role="alert"
                className="rounded-xl px-4 py-3 text-sm text-red-400"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-premium w-full py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  Creating account…
                </>
              ) : (
                <span className="flex items-center gap-2">
                  Get Instant Access
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </span>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-5">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[#4F8EF7] hover:text-[#60A5FA] font-semibold transition-colors">
              Sign in
            </Link>
          </p>

          <p className="text-center text-xs text-gray-700 mt-4">
            By signing up you agree to our{' '}
            <a href="#" className="underline hover:text-gray-500 transition-colors">Terms</a> and{' '}
            <a href="#" className="underline hover:text-gray-500 transition-colors">Privacy Policy</a>.
          </p>
        </div>
      </div>

      {/* ── RIGHT — value prop ── */}
      <div
        className="hidden lg:flex flex-1 items-center justify-center p-16 relative"
        style={{ background: '#050505', borderLeft: '1px solid rgba(255,255,255,0.04)' }}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 60% 40%, rgba(79,142,247,0.05), transparent 60%)' }}
        />

        <div className="max-w-sm relative">
          <div className="mb-10">
            <div className="badge mb-5 w-fit">What you get</div>
            <h2 className="text-4xl font-black mb-3 leading-tight">
              Everything you need.<br />
              <span className="gradient-text">Already inside.</span>
            </h2>
            <p className="text-gray-500 text-sm">Full access from day one. No upsells. No locked content.</p>
          </div>

          <ul className="space-y-3.5 mb-10">
            {PERKS.map(perk => (
              <li key={perk.text} className="flex items-center gap-3 group">
                <div className="w-7 h-7 rounded-lg glass-blue flex items-center justify-center flex-shrink-0 text-sm group-hover:scale-110 transition-transform">
                  {perk.icon}
                </div>
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{perk.text}</span>
              </li>
            ))}
          </ul>

          {/* Social proof card */}
          <blockquote className="card-premium p-5">
            <div className="flex items-center gap-0.5 mb-4" role="img" aria-label="5 stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#4F8EF7] text-[#4F8EF7]" aria-hidden="true" />
              ))}
            </div>
            <p className="text-sm text-gray-300 leading-relaxed mb-4 italic">
              &ldquo;Joined with zero TikTok Shop experience. 4 months later I quit my job. This is the real deal.&rdquo;
            </p>
            <footer className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white"
                  style={{ background: 'linear-gradient(135deg, #4F8EF7, #2563EB)' }}
                  aria-hidden="true"
                >
                  JL
                </div>
                <div>
                  <cite className="text-sm font-semibold not-italic">James L.</cite>
                  <div className="text-xs text-gray-500">Member since Jan 2023</div>
                </div>
              </div>
              <div className="text-sm font-bold text-emerald-400">$18,400/mo</div>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  )
}
