import Link from 'next/link'

export const metadata = { title: 'Terms of Service — Timeless' }

const LAST_UPDATED = 'July 2026'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black px-5 py-16">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-white transition-colors mb-10">
          ← Back to Timeless
        </Link>

        <div className="mb-10">
          <h1 className="text-4xl font-black mb-2">Terms of Service</h1>
          <p className="text-xs text-gray-600">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="prose-custom space-y-8">

          <Section title="1. Acceptance of Terms">
            <p>By accessing or using Timeless ("the Platform," "we," "us"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Platform.</p>
          </Section>

          <Section title="2. Description of Service">
            <p>Timeless is a membership platform providing access to educational content, coaching resources, community features, and tools related to TikTok Shop and e-commerce. Access is granted upon payment of the applicable subscription fee.</p>
          </Section>

          <Section title="3. Membership and Payment">
            <ul>
              <li>Memberships are billed monthly or annually depending on the plan selected.</li>
              <li>Payment is processed securely through Stripe. We do not store your payment information.</li>
              <li>Subscriptions automatically renew at the end of each billing period unless canceled.</li>
              <li>You may cancel your subscription at any time through the billing portal. Cancellation takes effect at the end of the current billing period — no partial refunds are issued for unused time.</li>
              <li>We reserve the right to change pricing with 30 days notice to existing members.</li>
            </ul>
          </Section>

          <Section title="4. Acceptable Use">
            <p>You agree not to:</p>
            <ul>
              <li>Share, resell, or distribute course content to non-members</li>
              <li>Screenshot, record, or republish course materials</li>
              <li>Use the platform for any unlawful purpose</li>
              <li>Harass, threaten, or abuse other community members</li>
              <li>Create multiple accounts to circumvent a ban or access restriction</li>
            </ul>
            <p>We reserve the right to terminate access for any violation of these terms without refund.</p>
          </Section>

          <Section title="5. Intellectual Property">
            <p>All course content, materials, templates, and resources are the intellectual property of Timeless. You are granted a limited, non-transferable license to access them for personal use only during your active membership.</p>
          </Section>

          <Section title="6. Disclaimer of Warranties">
            <p>The Platform is provided "as is." We make no warranties, express or implied, regarding the accuracy, completeness, or fitness of the content for any particular purpose.</p>
          </Section>

          <Section title="7. Limitation of Liability">
            <p>To the maximum extent permitted by law, Timeless shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform.</p>
          </Section>

          <Section id="earnings" title="8. Earnings Disclaimer">
            <p>Results shared by members are not typical. Individual income and results will vary based on effort, experience, market conditions, and other factors. Nothing on this Platform constitutes a guarantee of income or business success. Timeless is an educational platform — not a get-rich-quick program.</p>
          </Section>

          <Section title="9. Modifications">
            <p>We reserve the right to modify these Terms at any time. Continued use of the Platform after changes are posted constitutes acceptance of the new Terms.</p>
          </Section>

          <Section title="10. Contact">
            <p>Questions about these Terms? Email us at <a href="mailto:hello@jointimeless.network" className="text-[#a855f7] hover:underline">hello@jointimeless.network</a></p>
          </Section>

        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.05]">
          <Link href="/privacy" className="text-xs text-[#a855f7] hover:underline">Privacy Policy →</Link>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id}>
      <h2 className="text-lg font-bold text-white mb-3">{title}</h2>
      <div className="text-sm text-gray-400 leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_li]:text-gray-400">
        {children}
      </div>
    </section>
  )
}
