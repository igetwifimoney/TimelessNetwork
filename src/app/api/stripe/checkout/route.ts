import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { PRODUCT_CATALOG, getPriceId, type ProductKey } from '@/lib/entitlements'
import { getOrCreateStripeCustomer } from '@/lib/stripe-customers'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export async function POST(req: Request) {
  try {
    const { productKey, couponCode } = (await req.json()) as {
      productKey: ProductKey
      couponCode?: string
    }

    // ── Validate product ────────────────────────────────────────
    const product = PRODUCT_CATALOG[productKey]
    if (!product) {
      return NextResponse.json({ error: 'Invalid product key' }, { status: 400 })
    }

    const priceId = getPriceId(productKey)
    if (!priceId) {
      return NextResponse.json(
        { error: `Price not configured — set ${product.priceEnvKey} in .env.local` },
        { status: 500 }
      )
    }

    // ── Auth ────────────────────────────────────────────────────
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      }
    )
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ── Stripe customer ────────────────────────────────────────
    const customerId = await getOrCreateStripeCustomer(
      user.id,
      user.email,
      user.user_metadata?.full_name ?? undefined
    )

    // ── Checkout session ───────────────────────────────────────
    // allow_promotion_codes and discounts[] are mutually exclusive in Stripe.
    // If a coupon is passed explicitly we apply it directly; otherwise we
    // show the promotion code field in the Stripe-hosted checkout UI.
    const discountParams = couponCode
      ? { discounts: [{ coupon: couponCode }] }
      : { allow_promotion_codes: true }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: product.mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${SITE_URL}/dashboard?payment=success`,
      cancel_url:  `${SITE_URL}/billing?payment=canceled`,
      // Metadata is available in every webhook event for this session
      metadata: {
        user_id:     user.id,
        product_key: productKey,
      },
      // Automatic invoices for one-time purchases
      ...(product.mode === 'payment' && {
        invoice_creation: { enabled: true },
        payment_intent_data: {
          metadata: { user_id: user.id, product_key: productKey },
        },
      }),
      // Carry metadata into the subscription so webhooks can read it
      ...(product.mode === 'subscription' && {
        subscription_data: {
          metadata: { user_id: user.id, product_key: productKey },
        },
      }),
      ...discountParams,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[stripe/checkout]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
