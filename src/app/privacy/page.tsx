import Link from 'next/link'

export const metadata = { title: 'Privacy Policy — Timeless' }

const LAST_UPDATED = 'July 2026'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black px-5 py-16">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-white transition-colors mb-10">
          ← Back to Timeless
        </Link>

        <div className="mb-10">
          <h1 className="text-4xl font-black mb-2">Privacy Policy</h1>
          <p className="text-xs text-gray-600">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="space-y-8">

          <Section title="1. Overview">
            <p>Timeless ("we," "us," "our") operates jointimeless.network. This Privacy Policy explains how we collect, use, and protect your information when you use our platform.</p>
          </Section>

          <Section title="2. Information We Collect">
            <p>We collect information you provide directly:</p>
            <ul>
              <li><strong className="text-gray-300">Account information:</strong> name, email address, and password when you sign up</li>
              <li><strong className="text-gray-300">Payment information:</strong> processed securely by Stripe — we never see or store your card details</li>
              <li><strong className="text-gray-300">Profile information:</strong> anything you optionally add to your profile</li>
              <li><strong className="text-gray-300">Community content:</strong> posts and replies you create inside the platform</li>
              <li><strong className="text-gray-300">Email capture:</strong> if you submit your email on our homepage before signing up</li>
              <li><strong className="text-gray-300">Mentorship applications:</strong> information submitted via the mentorship application form</li>
            </ul>
            <p>We also collect limited technical information automatically (IP address, browser type, pages visited) to keep the platform running and secure.</p>
          </Section>

          <Section title="3. How We Use Your Information">
            <ul>
              <li>To create and manage your account</li>
              <li>To process payments and manage your subscription</li>
              <li>To send transactional emails (welcome, billing receipts, password resets)</li>
              <li>To send product updates and announcements (you can unsubscribe at any time)</li>
              <li>To provide customer support</li>
              <li>To improve the platform and diagnose technical issues</li>
            </ul>
            <p>We do not sell your personal information to third parties.</p>
          </Section>

          <Section title="4. Third-Party Services">
            <p>We use the following services to operate the platform. Each has their own privacy policy:</p>
            <ul>
              <li><strong className="text-gray-300">Supabase</strong> — database and authentication (supabase.com/privacy)</li>
              <li><strong className="text-gray-300">Stripe</strong> — payment processing (stripe.com/privacy)</li>
              <li><strong className="text-gray-300">Resend</strong> — transactional email delivery (resend.com/privacy)</li>
              <li><strong className="text-gray-300">Vercel</strong> — hosting and infrastructure (vercel.com/legal/privacy-policy)</li>
              <li><strong className="text-gray-300">Discord</strong> — community chat (discord.com/privacy) — you join the Discord server separately and voluntarily</li>
            </ul>
          </Section>

          <Section title="5. Data Storage and Security">
            <p>Your data is stored on servers located in the United States via Supabase and Vercel. We use industry-standard security measures including encryption in transit (HTTPS) and at rest.</p>
            <p>No method of internet transmission is 100% secure. While we take reasonable precautions, we cannot guarantee absolute security.</p>
          </Section>

          <Section title="6. Cookies">
            <p>We use essential cookies to keep you logged in and maintain your session. We do not use tracking cookies or third-party advertising cookies.</p>
          </Section>

          <Section title="7. Your Rights">
            <p>You have the right to:</p>
            <ul>
              <li>Access the personal data we hold about you</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your account and associated data</li>
              <li>Unsubscribe from marketing emails at any time</li>
            </ul>
            <p>To exercise any of these rights, email us at <a href="mailto:hello@jointimeless.network" className="text-[#4F8EF7] hover:underline">hello@jointimeless.network</a></p>
          </Section>

          <Section title="8. Data Retention">
            <p>We retain your account data for as long as your account is active. If you delete your account, we will remove your personal information within 30 days, except where we are required to retain it for legal or financial compliance purposes.</p>
          </Section>

          <Section title="9. Children's Privacy">
            <p>Timeless is not directed at children under 13. We do not knowingly collect personal information from anyone under 13. If you believe a child has provided us with their information, contact us and we will delete it.</p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by email or via a notice on the platform. Continued use after changes are posted constitutes your acceptance.</p>
          </Section>

          <Section title="11. Contact">
            <p>Questions about this Privacy Policy? Email us at <a href="mailto:hello@jointimeless.network" className="text-[#4F8EF7] hover:underline">hello@jointimeless.network</a></p>
          </Section>

        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.05]">
          <Link href="/terms" className="text-xs text-[#4F8EF7] hover:underline">Terms of Service →</Link>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-white mb-3">{title}</h2>
      <div className="text-sm text-gray-400 leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_li]:text-gray-400">
        {children}
      </div>
    </section>
  )
}
