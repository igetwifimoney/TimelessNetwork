/**
 * Resend email client — uses the REST API directly (no SDK dependency).
 * Set RESEND_API_KEY in .env.local to enable.
 * Get your key at: https://resend.com/api-keys
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_ADDRESS   = process.env.RESEND_FROM ?? 'Timeless <hello@jointimeless.network>'

interface EmailPayload {
  to:      string | string[]
  subject: string
  html:    string
  replyTo?: string
}

export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.warn('[resend] RESEND_API_KEY not set — skipping email')
    return false
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method:  'POST',
      headers: {
        Authorization:  `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from:     FROM_ADDRESS,
        to:       payload.to,
        subject:  payload.subject,
        html:     payload.html,
        reply_to: payload.replyTo,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[resend] send failed:', res.status, err)
      return false
    }

    return true
  } catch (err) {
    console.error('[resend] network error:', err)
    return false
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Email templates
// ─────────────────────────────────────────────────────────────────────────────

export function welcomeEmail(name: string): { subject: string; html: string } {
  const firstName = name.split(' ')[0] || 'there'
  return {
    subject: `Welcome to Timeless, ${firstName} 🎉`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Timeless</title>
</head>
<body style="margin:0;padding:0;background:#000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#000;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Logo / Brand -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <div style="display:inline-block;padding:10px 22px;background:rgba(168,85,247,0.08);border:1px solid rgba(168,85,247,0.2);border-radius:12px;">
                <span style="font-size:18px;font-weight:900;color:#fff;letter-spacing:-0.5px;">Timeless</span>
              </div>
            </td>
          </tr>

          <!-- Main card -->
          <tr>
            <td style="background:#0a0a0a;border:1px solid rgba(255,255,255,0.07);border-radius:20px;padding:40px 36px;">

              <h1 style="margin:0 0 8px;font-size:28px;font-weight:900;color:#fff;line-height:1.2;">
                Welcome, ${firstName}. 🎉
              </h1>
              <p style="margin:0 0 28px;font-size:15px;color:#9CA3AF;line-height:1.6;">
                Your Timeless membership is active. You now have full access to everything inside — courses, live calls, community, and more. Let's get to work.
              </p>

              <!-- What's included -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(168,85,247,0.04);border:1px solid rgba(168,85,247,0.1);border-radius:14px;padding:20px 22px;margin-bottom:28px;">
                <tr><td>
                  <p style="margin:0 0 14px;font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:1px;">What you have access to</p>
                  ${[
                    'Complete TikTok Shop Course Library',
                    'Weekly Live Group Coaching Calls',
                    'Private Creator Community',
                    'Discord Server',
                    'Daily Missions & Accountability System',
                    'Product Research Resources & Templates',
                  ].map(f => `
                  <table cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
                    <tr>
                      <td style="width:20px;vertical-align:top;padding-top:2px;">
                        <div style="width:16px;height:16px;background:rgba(168,85,247,0.15);border:1px solid rgba(168,85,247,0.3);border-radius:50%;display:flex;align-items:center;justify-content:center;">
                          <span style="color:#a855f7;font-size:10px;font-weight:900;padding-left:4px;">✓</span>
                        </div>
                      </td>
                      <td style="padding-left:10px;font-size:14px;color:#D1D5DB;">${f}</td>
                    </tr>
                  </table>`).join('')}
                </td></tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <a href="https://jointimeless.network/dashboard"
                       style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#a855f7,#ec4899);color:#fff;font-size:15px;font-weight:800;text-decoration:none;border-radius:12px;letter-spacing:-0.2px;">
                      Go to Your Dashboard →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Start here -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:20px 22px;margin-bottom:24px;">
                <tr><td>
                  <p style="margin:0 0 14px;font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:1px;">Recommended first steps</p>
                  ${[
                    ['1', 'Start with the TikTok Shop Foundations course', '/courses'],
                    ['2', 'Introduce yourself in the community', '/community'],
                    ['3', 'Join the Discord server', 'https://discord.gg/TcuZ5u6TMw'],
                  ].map(([n, text, href]) => `
                  <table cellpadding="0" cellspacing="0" style="margin-bottom:10px;width:100%;">
                    <tr>
                      <td style="width:24px;vertical-align:top;">
                        <div style="width:20px;height:20px;background:rgba(168,85,247,0.1);border:1px solid rgba(168,85,247,0.2);border-radius:50%;text-align:center;line-height:20px;font-size:11px;font-weight:900;color:#c084fc;">${n}</div>
                      </td>
                      <td style="padding-left:10px;">
                        <a href="${href.startsWith('http') ? href : `https://jointimeless.network${href}`}"
                           style="font-size:14px;color:#93C5FD;text-decoration:none;">${text}</a>
                      </td>
                    </tr>
                  </table>`).join('')}
                </td></tr>
              </table>

              <p style="margin:0;font-size:13px;color:#6B7280;line-height:1.6;">
                If you have any questions, just reply to this email. I read every one.<br/>
                <span style="color:#9CA3AF;">— Ty</span>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="margin:0;font-size:12px;color:#374151;">
                Timeless · <a href="https://jointimeless.network" style="color:#a855f7;text-decoration:none;">jointimeless.network</a>
              </p>
              <p style="margin:4px 0 0;font-size:11px;color:#1F2937;">
                <a href="https://jointimeless.network/billing" style="color:#374151;">Manage subscription</a>
                &nbsp;·&nbsp;
                <a href="https://jointimeless.network/privacy" style="color:#374151;">Privacy policy</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  }
}
