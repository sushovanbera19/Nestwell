import nodemailer from 'nodemailer'

function createTransporter() {
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    console.warn('SMTP not configured — email sending disabled')
    return null
  }

  return nodemailer.createTransport({
    host,
    port: Number(port) || 587,
    secure: Number(port) === 465,
    auth: { user, pass },
  })
}

export async function sendPasswordResetEmail(to, name, resetUrl) {
  const transporter = createTransporter()
  if (!transporter) {
    console.log(`[EMAIL DISABLED] Would send password reset to ${to}: ${resetUrl}`)
    return
  }

  await transporter.sendMail({
    from: `"Nestwell" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Nestwell — Password Reset',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2>Hi ${name},</h2>
        <p>Someone requested a password reset for your Nestwell account.</p>
        <p><a href="${resetUrl}" style="display:inline-block;padding:10px 24px;background:#111;color:#fff;text-decoration:none;border-radius:8px">Reset Password</a></p>
        <p>Or paste this link into your browser:</p>
        <p style="word-break:break-all;font-size:13px;color:#666">${resetUrl}</p>
        <p>If you didn't request this, ignore this email.</p>
      </div>
    `,
  })
}
