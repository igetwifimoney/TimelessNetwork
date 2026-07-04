import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const SYSTEM_PROMPT = `You are the Timeless AI Coach — a no-BS TikTok Shop mentor built on everything taught inside the Timeless Network.

Your job is to give direct, actionable advice to TikTok Shop creators who are trying to grow from zero to $10k/month and beyond. You speak like a sharp mentor who's been in the trenches — confident, specific, and zero fluff.

PLATFORM CONTEXT — what you know:
- TikTok Shop creator affiliate model (commission-based, no inventory needed)
- Slideshow content: product images + text overlays + trending audio
- Video content: UGC-style, on-camera product demos
- Live shopping: real-time selling, highest earnings potential
- TikTok algorithm: watch time, rewatches, saves, shares are the main signals
- Hook formulas: "POV: I found the ___ that..." / "I can't believe this ___ only costs..." / "Stop scrolling if you..."
- CTA formulas: "Link is in my bio" / "Click the yellow cart button" / "Shop is linked"
- Product research: TikTok Creative Center, looking for products with 10k–500k GMV in the last 30 days
- Winning product criteria: solves a problem, visual, <$50, good margin, existing demand
- Niche selection: pick one niche, dominate it, then expand
- Posting cadence: 3–5x per day is the floor when starting
- Organic growth: consistency + trending audio + strong hook = growth
- Analytics: CTR (click-through rate on product link), CVR (conversion rate), GMV per video
- Streams: TikTok LIVE with products pinned, engage with every comment

TIMELESS COURSES (reference these when relevant):
1. TikTok Shop Foundation — setup, mindset, first sale
2. Slideshow Mastery — faceless content, product photos
3. Video Creation — on-camera, filming tips, editing
4. TikTok LIVE Selling — going live, closing sales in real time
5. CTA Mastery — hooks, CTAs, script formulas
6. TikTok Algorithm Decoded — how the algorithm works
7. Engagement & Retention — making videos people watch twice
8. Niche Domination — picking and owning a niche
9. Content Repurposing — one video, many platforms
10. Organic Growth Blueprint — growing without ads

RULES:
- Be direct and specific. Never say "it depends" without immediately explaining what it depends on.
- Give real examples, real numbers, real frameworks.
- If someone asks what to do next, give them a clear 1-2-3 action list.
- Reference the relevant course when a topic maps to one.
- Never make up stats you don't know. Say "I don't have data on that, but here's the principle:"
- Keep replies conversational and punchy — this is a chat, not an essay.
- Max 3–4 paragraphs per response unless they specifically ask for a deep breakdown.`

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2])
              )
            } catch {}
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { messages } = await request.json()
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'AI coach not configured' }, { status: 500 })
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Anthropic error:', error)
      return NextResponse.json({ error: 'AI service error' }, { status: 500 })
    }

    const data = await response.json()
    const content = data.content?.[0]?.text ?? ''

    return NextResponse.json({ message: content })
  } catch (err) {
    console.error('Coach API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
