import { createClient } from '@supabase/supabase-js'
import { stripe } from './stripe'

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

/**
 * Returns the existing Stripe customer ID for a user, or creates one and stores it.
 * Always use this — never call stripe.customers.create() directly — so every user
 * maps to exactly one Stripe customer.
 */
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name?: string
): Promise<string> {
  const db = serviceClient()

  const { data } = await db
    .from('stripe_customers')
    .select('customer_id')
    .eq('user_id', userId)
    .single()

  if (data?.customer_id) return data.customer_id

  const customer = await stripe.customers.create({
    email,
    name: name ?? undefined,
    metadata: { supabase_user_id: userId },
  })

  await db.from('stripe_customers').insert({
    user_id: userId,
    customer_id: customer.id,
  })

  return customer.id
}

/**
 * Looks up the Supabase user ID from a Stripe customer ID.
 * Used in webhook handlers where we receive a customer ID, not a user ID.
 */
export async function getUserIdFromCustomer(customerId: string): Promise<string | null> {
  const db = serviceClient()
  const { data } = await db
    .from('stripe_customers')
    .select('user_id')
    .eq('customer_id', customerId)
    .single()
  return data?.user_id ?? null
}
