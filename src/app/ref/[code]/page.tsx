'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RefPage({ params }: { params: { code: string } }) {
  const router = useRouter()
  const { code } = params

  useEffect(() => {
    if (code) {
      // Store the referral code in localStorage so signup can read it
      try {
        localStorage.setItem('timeless_ref_code', code.toUpperCase())
      } catch {}
    }
    // Redirect to signup
    router.replace('/auth/signup')
  }, [code, router])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-[#4F8EF7] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Setting up your referral…</p>
      </div>
    </div>
  )
}
