'use client'

import { useState } from 'react'
import Link from 'next/link'
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
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  const handleOAuth = async (provider: 'google' | 'discord') => {
    if (!isSupabaseConfigured()) return
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSupabaseConfigured()) {
      setError('Supabase is not configured yet. Add your keys to .env.local and restart the dev server.')
      return
    }
    setLoading(true)
    setError('')
    try {
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
        return
      }
      setSubmitted(true)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
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

          {/* OAuth buttons */}
          <div className="flex flex-col gap-3 mb-6">
            <button
              type="button"
              onClick={() => handleOAuth('google')}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium transition-all"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
              aria-label="Sign up with Google"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            <button
              type="button"
              onClick={() => handleOAuth('discord')}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium transition-all"
              style={{ background: 'rgba(88,101,242,0.08)', border: '1px solid rgba(88,101,242,0.2)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(88,101,242,0.14)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(88,101,242,0.08)')}
              aria-label="Sign up with Discord"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="#5865F2" aria-hidden="true">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
              </svg>
              Continue with Discord
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6" role="separator" aria-label="or">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
            <span className="text-xs text-gray-600">or</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
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
