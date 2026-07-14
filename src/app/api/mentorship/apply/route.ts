import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      name:       string
      email:      string
      experience: string
      revenue:    string
      challenge:  string
      goals:      string
      why_mentor: string
    }

    const { name, email, experience, revenue, challenge, goals, why_mentor } = body

    // Basic validation
    if (!name?.trim() || !email?.trim() || !experience || !revenue || !challenge?.trim() || !goals?.trim() || !why_mentor?.trim()) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    const db = serviceClient()

    const { error } = await db.from('mentorship_applications').insert({
      name:       name.trim(),
      email:      email.toLowerCase().trim(),
      experience,
      revenue,
      challenge:  challenge.trim(),
      goals:      goals.trim(),
      why_mentor: why_mentor.trim(),
      status:     'pending',
    })

    if (error) {
      console.error('[mentorship/apply]', error)
      return NextResponse.json({ error: 'Failed to save application.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[mentorship/apply] unexpected error', err)
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}
