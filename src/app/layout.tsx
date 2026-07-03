import type { Metadata, Viewport } from 'next'
import './globals.css'

const SITE_URL = 'https://jointimeless.com'
const SITE_NAME = 'Timeless'
const SITE_DESCRIPTION =
  'The all-in-one platform for TikTok Shop creators. Courses, live mentorship, private community, and daily missions — everything you need to build real income, fast.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Timeless — Build Your TikTok Shop Income',
    template: '%s | Timeless',
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'TikTok Shop',
    'TikTok creator',
    'creator monetization',
    'affiliate marketing',
    'e-commerce',
    'online business',
    'content creator income',
    'TikTok Shop courses',
    'TikTok Shop community',
    'how to make money on TikTok',
  ],
  authors: [{ name: 'Timeless', url: SITE_URL }],
  creator: 'Timeless',
  publisher: 'Timeless Network, LLC',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'Timeless — Build Your TikTok Shop Income',
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Timeless — The TikTok Shop Creator Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Timeless — Build Your TikTok Shop Income',
    description: SITE_DESCRIPTION,
    images: ['/og-image.png'],
    creator: '@jointimeless',
    site: '@jointimeless',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: SITE_URL,
  },
  category: 'education',
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-black text-white antialiased">
        {children}
      </body>
    </html>
  )
}
