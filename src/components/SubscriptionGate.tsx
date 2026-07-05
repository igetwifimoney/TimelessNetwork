'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, ArrowRight, Check, Zap, Loader2 } from 'lucide-react'

interface Props {
  children: React.ReactNode
}

type Status = 'loading' | 'granted' | 'no-sub' | 'no-auth'

export default function SubscriptionGate({ children }: Props) {
  const [status, setStatus] = useState<Status>('loading')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/subscription/status')
      .then(r => r.json())
      .then(({ hasAccess, isLoggedIn }: { hasAccess: boolean; isLoggedIn: boolean }) => {
        if (!isLoggedIn) {
          setStatus('no-auth')
        } else if (hasAccess) {
          setStatus('granted')
        } else {
          setStatus('no-sub')
        }
      })
      .catch(() => setStatus('no-sub'))
  }, [])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'no-auth') {
      router.push('/auth/login?next=' + encodeURIComponent(window.location.pathname))
    }
  }, [status, router])

  if (status === 'loading' || status === 'no-auth') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-[#4F8EF7]" />
      </div>
    )
  }

  if (status === 'no-sub') {
    return <Paywall />
  }

  return <>{children}</>
}

function Paywall() {
  return (
    <div className="flex items-center justify-center min-h-[70vh] px-5 py-16">
      <div className="max-w-md w-full text-center">

        {/* Lock icon */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{
            background: 'rgba(79,142,247,0.08)',
            border: '1px solid rgba(79,142,247,0.2)',
            boxShadow: '0 0 30px rgba(79,142,247,0.1)',
          }}
        >
          <Lock className="w-7 h-7 text-[#4F8EF7]" />
        </div>

        <div className="text-xs text-[#4F8EF7] font-bold uppercase tracking-widest mb-3">
          Members Only
        </div>
        <h2 className="text-3xl font-black mb-3 leading-tight">
          Unlock the full<br />course library
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
          This content is exclusive to Timeless members. Join to get instant access to every course, live calls, community, and more.
        </p>

        {/* What's included */}
        <div
          className="rounded-2xl p-5 mb-7 text-left"
          style={{
            background: 'rgba(79,142,247,0.03)',
            border: '1px solid rgba(79,142,247,0.12)',
          }}
        >
          <div className="text-xs text-gray-600 uppercase tracking-wider mb-4">What you get</div>
          <ul className="space-y-2.5">
            {[
              'Complete TikTok Shop Course Library',
              'Every Future Course Update',
              'Weekly Live Group Coaching',
              'Private Community + Discord',
              'Daily Missions & Accountability',
              'Product Research Resources',
            ].map(f => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-gray-300">
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.25)' }}
                >
                  <Check className="w-2.5 h-2.5 text-[#4F8EF7]" />
                </div>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing + CTA */}
        <div className="mb-4">
          <div className="text-xs text-gray-600 mb-1">Starting at</div>
          <div className="text-2xl font-black mb-4">
            $49<span className="text-base font-normal text-gray-400">.99/month</span>
          </div>
          <Link
            href="/billing"
            className="btn-premium flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm group/btn w-full"
          >
            <Zap className="w-4 h-4" />
            Get Instant Access
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>

        <p className="text-xs text-gray-600">
          Already a member?{' '}
          <Link href="/auth/login" className="text-[#4F8EF7] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
