/**
 * scripts/stripe-seed.ts
 *
 * Creates all Timeless products and prices in your Stripe account.
 * Run ONCE against your live or test account:
 *
 *   npx ts-node --project tsconfig.json scripts/stripe-seed.ts
 *
 * Outputs the price IDs to add to your .env.local.
 * Each Stripe product gets metadata.key set so webhooks can identify it.
 */

import Stripe from 'stripe'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Set STRIPE_SECRET_KEY in .env.local before running this script')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20' as const,
})

interface ProductDef {
  key:         string
  name:        string
  description: string
  price:       number        // in cents
  mode:        'recurring' | 'one_time'
  interval?:   'month' | 'year'
}

const PRODUCTS: ProductDef[] = [
  {
    key:         'TIMELESS_MONTHLY',
    name:        'Timeless Monthly',
    description: 'Full platform access — course library, community, weekly live calls, and Discord. Billed monthly.',
    price:       4999,       // $49.99/mo
    mode:        'recurring',
    interval:    'month',
  },
  {
    key:         'TIMELESS_ANNUAL',
    name:        'Timeless Annual',
    description: 'Full platform access + 2 private mentorship calls, priority support, and exclusive workshops. Billed annually ($468/yr).',
    price:       46800,      // $468/yr ($39/mo)
    mode:        'recurring',
    interval:    'year',
  },
  {
    key:         'MENTORSHIP',
    name:        'TikTok Shop Mentorship',
    description: 'One-on-one mentorship + private dashboard, booking portal, and direct messaging.',
    price:       108000,     // $1,080 one-time
    mode:        'one_time',
  },
]

async function seed() {
  console.log('\n🔧  Seeding Stripe products...\n')
  const envLines: string[] = []

  for (const def of PRODUCTS) {
    // Create product with metadata.key so webhooks can identify it
    const product = await stripe.products.create({
      name:        def.name,
      description: def.description,
      metadata:    { key: def.key },
    })

    // Create price
    const price = await stripe.prices.create({
      product:     product.id,
      unit_amount: def.price,
      currency:    'usd',
      ...(def.mode === 'recurring'
        ? { recurring: { interval: def.interval! } }
        : {}
      ),
      metadata: { key: def.key },
    })

    const priceLabel = def.mode === 'recurring'
      ? `$${(def.price / 100).toFixed(0)}/${def.interval}`
      : `$${(def.price / 100).toFixed(0)} one-time`

    console.log(`✓  ${def.name}`)
    console.log(`   Product: ${product.id}`)
    console.log(`   Price:   ${price.id}  (${priceLabel})\n`)

    envLines.push(`STRIPE_PRICE_${def.key}=${price.id}`)
  }

  console.log('─'.repeat(54))
  console.log('Add these lines to your .env.local:\n')
  envLines.forEach(l => console.log(l))
  console.log('─'.repeat(54))
  console.log('\nThen restart your dev server.\n')
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})
