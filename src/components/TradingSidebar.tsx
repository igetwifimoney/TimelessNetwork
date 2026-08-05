'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, TrendingUp, GraduationCap, MessageSquare,
  User, Settings, LogOut, CreditCard
} from 'lucide-react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase'

const NAV = [
  { href: '/trading-dashboard', label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/trading',           label: 'Trading Home', icon: TrendingUp     },
  { href: '/trading#mentorship',label: 'Mentorship',   icon: GraduationCap  },
  { href: '/billing',           label: 'Billing',      icon: CreditCard     },
  { href: '/profile',           label: 'Profile',      icon: User           },
]

const MOBILE_NAV = [
  { href: '/trading-dashboard', label: 'Home',     icon: LayoutDashboard },
  { href: '/trading',           label: 'Trading',  icon: TrendingUp      },
  { href: '/trading#mentorship',label: 'Mentors',  icon: GraduationCap   },
  { href: '/profile',           label: 'Profile',  icon: User            },
]

export default function TradingSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      await supabase.auth.signOut()
    }
    router.push('/trading')
    router.refresh()
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex w-56 flex-shrink-0 border-r border-white/[0.04] flex-col h-screen sticky top-0"
        style={{ background: '#050505' }}
        aria-label="Trading app navigation"
      >
        <div className="p-5 border-b border-white/[0.04]">
          <Link href="/trading" className="flex items-center gap-2.5" aria-label="Timeless Trading — go to home">
            <div className="w-6 h-6 relative" aria-hidden="true">
              <div className="absolute inset-0 rounded rotate-45" style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }} />
              <div className="absolute inset-[2px] bg-black rounded rotate-45" />
              <div className="absolute inset-[3.5px] rounded rotate-45" style={{ background: 'linear-gradient(135deg, #f9a8d4, #ec4899)' }} />
            </div>
            <span className="font-black text-sm tracking-tight">timeless trading</span>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto" aria-label="Main menu">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active ? 'text-white' : 'text-gray-600 hover:text-gray-300 hover:bg-white/[0.03]'
                }`}
                style={active
                  ? { background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.15)' }
                  : { border: '1px solid transparent' }}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-[#a855f7]' : ''}`} aria-hidden="true" />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-white/[0.04] space-y-0.5">
          <a
            href="https://discord.gg/mQPVspGbaG"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:text-gray-300 hover:bg-white/[0.03] transition-all"
            style={{ border: '1px solid transparent' }}
          >
            <MessageSquare className="w-4 h-4" aria-hidden="true" />
            Discord
          </a>
          <Link
            href="/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:text-gray-300 hover:bg-white/[0.03] transition-all"
            style={{ border: '1px solid transparent' }}
          >
            <Settings className="w-4 h-4" aria-hidden="true" />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:text-red-400 hover:bg-red-500/5 transition-all"
            style={{ border: '1px solid transparent' }}
            aria-label="Log out of Timeless Trading"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            Log out
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2"
        style={{
          background: 'rgba(5,5,5,0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingBottom: 'env(safe-area-inset-bottom, 8px)',
        }}
        aria-label="Mobile navigation"
      >
        {MOBILE_NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href} aria-current={active ? 'page' : undefined}
              className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all">
              <Icon className="w-5 h-5" style={{ color: active ? '#a855f7' : '#4B5563' }} aria-hidden="true" />
              <span className="text-[10px] font-semibold" style={{ color: active ? '#a855f7' : '#4B5563' }}>{label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
