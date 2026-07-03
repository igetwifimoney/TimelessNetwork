import { createClient } from '@supabase/supabase-js'

// ─────────────────────────────────────────────────────────────────────────────
// Features
// Every capability the platform can grant lives here.
// Add new features here first — nothing else needs to change structurally.
// ─────────────────────────────────────────────────────────────────────────────
export type Feature =
  | 'course_library'       // full course access
  | 'community'            // private community + channels
  | 'weekly_calls'         // weekly live calls
  | 'mentorship_dashboard' // private mentorship dashboard
  | 'booking_portal'       // 1:1 session booking
  | 'direct_messaging'     // DM with mentor

// ─────────────────────────────────────────────────────────────────────────────
// Product catalog
// product_key is the source of truth that ties Stripe metadata → entitlements.
// When you add a new product:
//   1. Add it here
//   2. Run scripts/stripe-seed.ts (or create it manually in Stripe and set metadata.key)
//   3. Add the price ID to .env.local
// ─────────────────────────────────────────────────────────────────────────────
export interface ProductConfig {
  name:         string
  description:  string
  priceEnvKey:  string                      // env var that holds the Stripe price ID
  mode:         'subscription' | 'payment'
  interval?:    'month' | 'year'            // only for subscription mode
  entitlements: Feature[]
}

export const PRODUCT_CATALOG: Record<string, ProductConfig> = {
  TIMELESS_MONTHLY: {
    name:         'Timeless Monthly',
    description:  'Full platform access — billed monthly.',
    priceEnvKey:  'STRIPE_PRICE_TIMELESS_MONTHLY',
    mode:         'subscription',
    interval:     'month',
    entitlements: ['course_library', 'community', 'weekly_calls'],
  },
  TIMELESS_ANNUAL: {
    name:         'Timeless Annual',
    description:  'Full platform access — billed annually. Best value.',
    priceEnvKey:  'STRIPE_PRICE_TIMELESS_ANNUAL',
    mode:         'subscription',
    interval:     'year',
    entitlements: ['course_library', 'community', 'weekly_calls'],
  },
  MENTORSHIP: {
    name:         'TikTok Shop Mentorship',
    description:  'One-on-one mentorship + 30-day private dashboard, booking, and direct messaging.',
    priceEnvKey:  'STRIPE_PRICE_MENTORSHIP',
    mode:         'payment',
    entitlements: [
      'course_library',
      'community',
      'weekly_calls',
      'mentorship_dashboard',
      'booking_portal',
      'direct_messaging',
    ],
  },
} as const

export type ProductKey = keyof typeof PRODUCT_CATALOG

// ─────────────────────────────────────────────────────────────────────────────
// Access resolution
// Subscriptions with these statuses still have access (Stripe retries during
// past_due before canceling, so we keep the door open during the grace period).
// ─────────────────────────────────────────────────────────────────────────────
const ACTIVE_STATUSES = new Set(['active', 'trialing', 'past_due'])

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

/**
 * Returns the full set of features the given user currently has access to,
 * derived from their active subscriptions + completed one-time purchases.
 */
export async function getUserEntitlements(userId: string): Promise<Set<Feature>> {
  const db = serviceClient()
  const features = new Set<Feature>()

  const [{ data: subs }, { data: buys }] = await Promise.all([
    db.from('subscriptions').select('product_key, status').eq('user_id', userId),
    db.from('purchases').select('product_key, status').eq('user_id', userId),
  ])

  for (const sub of subs ?? []) {
    if (ACTIVE_STATUSES.has(sub.status)) {
      const config = PRODUCT_CATALOG[sub.product_key as ProductKey]
      config?.entitlements.forEach(f => features.add(f))
    }
  }

  for (const buy of buys ?? []) {
    if (buy.status === 'complete') {
      const config = PRODUCT_CATALOG[buy.product_key as ProductKey]
      config?.entitlements.forEach(f => features.add(f))
    }
  }

  return features
}

/** Quick single-feature check. */
export async function hasFeature(userId: string, feature: Feature): Promise<boolean> {
  const entitlements = await getUserEntitlements(userId)
  return entitlements.has(feature)
}

/** Returns the Stripe price ID for a given product key, or null if unconfigured. */
export function getPriceId(productKey: ProductKey): string | null {
  const config = PRODUCT_CATALOG[productKey]
  if (!config) return null
  return process.env[config.priceEnvKey] ?? null
}
