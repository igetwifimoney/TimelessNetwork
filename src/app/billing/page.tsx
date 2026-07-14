'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import { CreditCard, CheckCircle, AlertCircle, ExternalLink, Loader, ShoppingBag } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface SubscriptionRow {
  id:                   string
  status:               string
  product_key:          string
  current_period_end:   string | null
  cancel_at_period_end: boolean
  created_at:           string
}

interface PurchaseRow {
  id:          string
  product_key: string
  amount_total: number
  currency:    string
  created_at:  string
}

interface BillingData {
  subscriptions: SubscriptionRow[]
  purchases:     PurchaseRow[]
}

// ─────────────────────────────────────────────────────────────────────────────
// Lookup maps
// ─────────────────────────────────────────────────────────────────────────────
const PRODUCT_NAMES: Record<string, string> = {
  TIMELESS_MONTHLY: 'Timeless — Monthly',
  TIMELESS_ANNUAL:  'Timeless — Annual',
  MENTORSHIP:       'TikTok Shop Mentorship',
}

const STATUS_STYLE: Record<string, { label: string; color: string; bg: string; border: string }> = {
  active:   { label: 'Active',    color: '#34D399', bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.15)'  },
  trialing: { label: 'Trial',     color: '#c084fc', bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.15)'  },
  past_due: { label: 'Past Due',  color: '#FBBF24', bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.15)'  },
  canceled: { label: 'Canceled',  color: '#F87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.15)' },
}

const ACTIVE_STATUSES = new Set(['active', 'trialing', 'past_due'])

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export default function BillingPage() {
  const [billing,       setBilling]       = useState<BillingData | null>(null)
  const [loading,       setLoading]       = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)
  const [error,         setError]         = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/stripe/billing-data')
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error)
        else setBilling(data)
      })
      .catch(() => setError('Failed to load billing info'))
      .finally(() => setLoading(false))
  }, [])

  const openPortal = async () => {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const { url, error: err } = await res.json()
      if (err) { setError(err); setPortalLoading(false); return }
      window.location.href = url
    } catch {
      setError('Could not open billing portal')
      setPortalLoading(false)
    }
  }

  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)

  const startCheckout = async (productKey: string) => {
    setCheckoutLoading(productKey)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productKey }),
      })
      const { url, error: err } = await res.json()
      if (err) { setError(err); setCheckoutLoading(null); return }
      window.location.href = url
    } catch {
      setError('Could not start checkout')
      setCheckoutLoading(null)
    }
  }

  const activeSubs   = billing?.subscriptions.filter(s => ACTIVE_STATUSES.has(s.status)) ?? []
  const canceledSubs = billing?.subscriptions.filter(s => s.status === 'canceled')        ?? []
  const purchases    = billing?.purchases ?? []

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />

      <main className="flex-1 overflow-y-auto" id="main-content">
        <div className="max-w-3xl mx-auto px-6 py-8">

          <header className="mb-8">
            <h1 className="text-3xl font-black mb-1">Billing</h1>
            <p className="text-gray-500">Manage your plan, payment method, and invoices.</p>
          </header>

          {loading && (
            <div className="flex items-center justify-center py-24" role="status" aria-label="Loading billing info">
              <Loader className="w-6 h-6 animate-spin text-[#a855f7]" aria-hidden="true" />
            </div>
          )}

          {error && !loading && (
            <div
              className="card-premium p-5 flex items-center gap-3 text-sm"
              role="alert"
              style={{ borderColor: 'rgba(248,113,113,0.2)' }}
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" aria-hidden="true" />
              <span className="text-red-400">{error}</span>
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-5">

              {/* ── Current Plan ──────────────────────────────── */}
              <section className="card-premium p-6" aria-labelledby="plan-heading">
                <h2 id="plan-heading" className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-5">
                  Current Plan
                </h2>

                {activeSubs.length === 0 ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500 mb-5">No active subscription. Choose a plan below to get full access.</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Monthly */}
                      <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Monthly</div>
                        <div className="text-3xl font-black mb-0.5">$49<span className="text-base font-normal text-gray-500">.99/mo</span></div>
                        <div className="text-xs text-gray-600 mb-4">Cancel anytime</div>
                        <button
                          onClick={() => startCheckout('TIMELESS_MONTHLY')}
                          disabled={checkoutLoading !== null}
                          className="w-full py-2.5 rounded-xl text-sm font-bold transition-all"
                          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                        >
                          {checkoutLoading === 'TIMELESS_MONTHLY' ? <Loader className="w-4 h-4 animate-spin mx-auto" /> : 'Subscribe Monthly'}
                        </button>
                      </div>
                      {/* Annual */}
                      <div className="rounded-2xl p-5 relative" style={{ background: 'rgba(168,85,247,0.04)', border: '1px solid rgba(168,85,247,0.25)' }}>
                        <div className="absolute -top-3 left-4 text-[10px] font-black px-3 py-1 rounded-full text-white" style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}>BEST VALUE</div>
                        <div className="text-xs text-[#a855f7] uppercase tracking-wider mb-2">Annual</div>
                        <div className="text-3xl font-black mb-0.5">$39<span className="text-base font-normal text-gray-500">/mo</span></div>
                        <div className="text-xs text-gray-600 mb-4">$468/year · save $132</div>
                        <button
                          onClick={() => startCheckout('TIMELESS_ANNUAL')}
                          disabled={checkoutLoading !== null}
                          className="btn-premium w-full py-2.5 rounded-xl text-sm font-bold"
                        >
                          {checkoutLoading === 'TIMELESS_ANNUAL' ? <Loader className="w-4 h-4 animate-spin mx-auto" /> : 'Subscribe Annual'}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <ul className="space-y-4" aria-label="Active subscriptions">
                    {activeSubs.map(sub => {
                      const style    = STATUS_STYLE[sub.status] ?? STATUS_STYLE.active
                      const periodEnd = sub.current_period_end
                        ? new Date(sub.current_period_end).toLocaleDateString('en-US', {
                            month: 'long', day: 'numeric', year: 'numeric',
                          })
                        : null
                      return (
                        <li key={sub.id} className="flex items-center justify-between gap-4 flex-wrap">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.15)' }}
                              aria-hidden="true"
                            >
                              <CheckCircle className="w-5 h-5 text-[#a855f7]" />
                            </div>
                            <div>
                              <div className="font-bold text-sm">{PRODUCT_NAMES[sub.product_key] ?? sub.product_key}</div>
                              {periodEnd && (
                                <div className="text-xs text-gray-500 mt-0.5">
                                  {sub.cancel_at_period_end ? `Cancels ${periodEnd}` : `Renews ${periodEnd}`}
                                </div>
                              )}
                            </div>
                          </div>
                          <span
                            className="text-xs font-semibold px-3 py-1 rounded-full"
                            style={{ background: style.bg, border: `1px solid ${style.border}`, color: style.color }}
                          >
                            {style.label}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </section>

              {/* ── Manage Billing ────────────────────────────── */}
              <section className="card-premium p-6" aria-labelledby="portal-heading">
                <h2 id="portal-heading" className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                  Manage Billing
                </h2>
                <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                  Update your payment method, switch plans, download invoices, or cancel — all through
                  the secure Stripe Customer Portal.
                </p>
                <button
                  onClick={openPortal}
                  disabled={portalLoading}
                  className="btn-premium flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold"
                  aria-busy={portalLoading}
                  aria-label="Open Stripe billing portal"
                >
                  {portalLoading
                    ? <Loader className="w-4 h-4 animate-spin" aria-hidden="true" />
                    : <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  }
                  {portalLoading ? 'Opening…' : 'Open Billing Portal'}
                </button>
              </section>

              {/* ── One-Time Purchases ────────────────────────── */}
              {purchases.length > 0 && (
                <section className="card-premium p-6" aria-labelledby="purchases-heading">
                  <h2 id="purchases-heading" className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-5">
                    One-Time Purchases
                  </h2>
                  <ul className="space-y-4" aria-label="Purchase history">
                    {purchases.map(p => (
                      <li key={p.id} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: 'rgba(192,132,252,0.08)', border: '1px solid rgba(192,132,252,0.15)' }}
                            aria-hidden="true"
                          >
                            <ShoppingBag className="w-4 h-4 text-purple-400" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold">{PRODUCT_NAMES[p.product_key] ?? p.product_key}</div>
                            <time className="text-xs text-gray-600" dateTime={p.created_at}>
                              {new Date(p.created_at).toLocaleDateString('en-US', {
                                month: 'long', day: 'numeric', year: 'numeric',
                              })}
                            </time>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-emerald-400">
                          ${(p.amount_total / 100).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* ── Past Subscriptions ────────────────────────── */}
              {canceledSubs.length > 0 && (
                <section className="card-premium p-6" aria-labelledby="history-heading">
                  <h2 id="history-heading" className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-5">
                    Past Subscriptions
                  </h2>
                  <ul className="space-y-3" aria-label="Canceled subscriptions">
                    {canceledSubs.map(sub => (
                      <li key={sub.id} className="flex items-center justify-between gap-3">
                        <span className="text-sm text-gray-500">{PRODUCT_NAMES[sub.product_key] ?? sub.product_key}</span>
                        <span
                          className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                          style={{
                            background: 'rgba(248,113,113,0.08)',
                            border:     '1px solid rgba(248,113,113,0.15)',
                            color:      '#F87171',
                          }}
                        >
                          Canceled
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

            </div>
          )}
        </div>
      </main>
    </div>
  )
}
