import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

interface ApplyBody {
  name?: string
  email?: string
  experience?: string
  revenue?: string
  challenge?: string
  goals?: string
  why_mentor?: string
  source?: string
}

// POST /api/mentorship-apply
// Saves a pending mentorship application instead of charging immediately.
// Reviewed manually — approved applicants get sent a Stripe checkout link.
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ApplyBody
    const { name, email, experience, revenue, challenge, goals, why_mentor, source } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
    }

    const db = serviceClient()
    const { error } = await db.from('mentorship_applications').insert({
      name,
      email,
      experience:  experience  ?? '',
      revenue:     revenue     ?? '',
      challenge:   challenge   ?? '',
      goals:       goals       ?? '',
      why_mentor:  why_mentor  ?? '',
      source:      source      ?? 'trading',
      status:      'pending',
    })

    if (error) {
      console.error('[mentorship-apply]', error)
      return NextResponse.json({ error: 'Could not submit application. Please try again.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[mentorship-apply]', err)
    return NextResponse.json({ error: 'Could not submit application. Please try again.' }, { status: 500 })
  }
}
