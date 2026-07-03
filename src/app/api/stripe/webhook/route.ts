import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { stripe } from '@/lib/stripe'
import { getUserIdFromCustomer } from '@/lib/stripe-customers'
import type Stripe from 'stripe'

// ── Webhook secret from Stripe dashboard ───────────────────────────────────
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

/** Reads product_key from Stripe product metadata. Falls back to '' if missing. */
async function getProductKey(productId: string): Promise<string> {
  try {
    const product = await stripe.products.retrieve(productId)
    return product.metadata?.key ?? ''
  } catch {
    return ''
  }
}

/** Converts a Unix timestamp (seconds) to an ISO string. */
function toISO(unix: number): string {
  return new Date(unix * 1000).toISOString()
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/stripe/webhook
// Stripe sends ALL account events here. We verify the signature first, then
// handle the subset of events we care about.
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  const body = await req.text()
  const sig  = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET)
  } catch (err) {
    console.error('[webhook] signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const db = serviceClient()

  try {
    switch (event.type) {

      // ── Checkout session completed ──────────────────────────────
      // Fired for both subscription and one-time payment checkouts.
      // For subscriptions, Stripe will ALSO fire customer.subscription.created,
      // so here we only handle one-time purchases.
      case 'checkout.session.completed': {
        const session    = event.data.object as Stripe.Checkout.Session
        const userId     = session.metadata?.user_id
        const productKey = session.metadata?.product_key

        if (!userId || !productKey) break

        if (session.mode === 'payment' && session.payment_status === 'paid') {
          // Expand line items to get price/product IDs
          const expanded = await stripe.checkout.sessions.retrieve(session.id, {
            expand: ['line_items'],
          })
          const lineItem       = expanded.line_items?.data?.[0]
          const stripePriceId  = (lineItem?.price?.id)                          ?? ''
          const stripeProductId = (lineItem?.price?.product as string | undefined) ?? ''

          await db.from('purchases').upsert({
            id:                session.id,
            user_id:           userId,
            stripe_price_id:   stripePriceId,
            stripe_product_id: stripeProductId,
            product_key:       productKey,
            amount_total:      session.amount_total ?? 0,
            currency:          session.currency     ?? 'usd',
            status:            'complete',
          })
        }
        break
      }

      // ── Subscription created ────────────────────────────────────
      case 'customer.subscription.created':
      // ── Subscription updated (plan change, renewal, cancel-at-period-end) ─
      case 'customer.subscription.updated': {
        const subEvent = event.data.object as Stripe.Subscription
        const userId   = await getUserIdFromCustomer(subEvent.customer as string)
        if (!userId) break

        // Refetch in our API version so field locations are stable regardless
        // of which webhook API version Stripe sends events in.
        const sub = await stripe.subscriptions.retrieve(subEvent.id)

        const priceItem       = sub.items.data[0]
        const stripePriceId   = priceItem?.price?.id                              ?? ''
        const stripeProductId = priceItem?.price?.product as string | undefined   ?? ''

        // product_key comes from subscription metadata (set at checkout) or
        // falls back to a Stripe product metadata lookup
        const productKey = sub.metadata?.product_key
          || await getProductKey(stripeProductId)

        await db.from('subscriptions').upsert({
          id:                   sub.id,
          user_id:              userId,
          status:               sub.status,
          stripe_price_id:      stripePriceId,
          stripe_product_id:    stripeProductId,
          product_key:          productKey,
          current_period_start: toISO(sub.current_period_start),
          current_period_end:   toISO(sub.current_period_end),
          cancel_at_period_end: sub.cancel_at_period_end,
          canceled_at:          sub.canceled_at  ? toISO(sub.canceled_at)  : null,
          trial_end:            sub.trial_end    ? toISO(sub.trial_end)    : null,
          updated_at:           new Date().toISOString(),
        })
        break
      }

      // ── Subscription deleted (hard cancel — period ended or immediate) ──
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        await db
          .from('subscriptions')
          .update({
            status:     'canceled',
            canceled_at: new Date().toISOString(),
            updated_at:  new Date().toISOString(),
          })
          .eq('id', sub.id)
        break
      }

      // ── Invoice paid — keep period dates current after renewal ─────────
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        if (!invoice.subscription) break

        const sub = await stripe.subscriptions.retrieve(invoice.subscription as string)
        await db
          .from('subscriptions')
          .update({
            status:               sub.status,
            current_period_start: toISO(sub.current_period_start),
            current_period_end:   toISO(sub.current_period_end),
            updated_at:           new Date().toISOString(),
          })
          .eq('id', sub.id)
        break
      }

      // ── Invoice payment failed — mark past_due but keep access ──────────
      // Stripe will retry automatically according to your retry schedule.
      // Access is revoked only when the subscription is deleted.
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        if (!invoice.subscription) break

        await db
          .from('subscriptions')
          .update({ status: 'past_due', updated_at: new Date().toISOString() })
          .eq('id', invoice.subscription)
        break
      }

      default:
        // Unhandled event — safe to ignore
        break
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[webhook] handler error:', err)
    // Return 200 anyway — returning 4xx/5xx causes Stripe to retry
    return NextResponse.json({ error: 'Handler error' }, { status: 200 })
  }
}
