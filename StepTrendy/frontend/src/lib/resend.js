const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'hello@steptrendy.com';
const FROM_NAME = process.env.RESEND_FROM_NAME || 'StepTrendy';

export async function sendEmail({ to, subject, html, text }) {
  if (!RESEND_API_KEY) {
    console.log('[Resend] No API key configured. Email not sent.');
    return { success: false, message: 'Resend not configured' };
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to send email: ${err}`);
  }

  return res.json();
}

// ─── Email Templates ───

export function welcomeEmail(name) {
  return {
    subject: `Welcome to StepTrendy, ${name}!`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0a0a0a;color:#f0f0f0;border-radius:16px;">
        <h1 style="font-size:28px;font-weight:bold;margin-bottom:8px;">
          <span style="background:linear-gradient(135deg,#3b82f6,#00d4ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">STEP</span>
          <span style="color:white;">TRENDY</span>
        </h1>
        <p style="color:#9ca3af;font-size:16px;margin-bottom:24px;">Welcome aboard, ${name}!</p>
        <p style="color:#d1d5db;font-size:14px;margin-bottom:24px;">Thank you for joining StepTrendy. Get ready to discover premium fashion curated by AI.</p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/products" style="display:inline-block;padding:12px 32px;background:linear-gradient(135deg,#3b82f6,#00d4ff);color:white;text-decoration:none;border-radius:999px;font-weight:600;">Start Shopping</a>
      </div>
    `,
  };
}

export function otpEmail(otp) {
  return {
    subject: 'Your StepTrendy OTP Code',
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0a0a0a;color:#f0f0f0;border-radius:16px;">
        <h1 style="font-size:24px;font-weight:bold;margin-bottom:16px;">Verification Code</h1>
        <div style="background:#1a1a1a;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
          <span style="font-size:48px;font-weight:bold;letter-spacing:8px;background:linear-gradient(135deg,#3b82f6,#00d4ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${otp}</span>
        </div>
        <p style="color:#9ca3af;font-size:14px;">This code expires in 10 minutes. Never share this code with anyone.</p>
      </div>
    `,
  };
}

export function orderConfirmationEmail(order) {
  const itemsHtml = (order.items || []).map(item => `
    <tr><td style="padding:8px 0;border-bottom:1px solid #1a1a1a;color:#d1d5db;">${item.name}</td>
    <td style="padding:8px 0;border-bottom:1px solid #1a1a1a;color:#9ca3af;">x${item.quantity}</td>
    <td style="padding:8px 0;border-bottom:1px solid #1a1a1a;color:#f0f0f0;text-align:right;">₹${(item.price * item.quantity).toLocaleString()}</td></tr>
  `).join('');

  return {
    subject: `Order Confirmed - #${order.orderNumber}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0a0a0a;color:#f0f0f0;border-radius:16px;">
        <h1 style="font-size:24px;margin-bottom:8px;">Order Confirmed 🎉</h1>
        <p style="color:#9ca3af;margin-bottom:24px;">Your order <strong style="color:white;">#${order.orderNumber}</strong> has been placed successfully.</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">${itemsHtml}</table>
        <div style="border-top:1px solid #1a1a1a;padding-top:16px;text-align:right;">
          <p style="font-size:20px;font-weight:bold;">Total: ₹${order.total?.toLocaleString()}</p>
        </div>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/account/orders/${order.orderNumber}" style="display:inline-block;padding:12px 32px;background:linear-gradient(135deg,#3b82f6,#00d4ff);color:white;text-decoration:none;border-radius:999px;font-weight:600;margin-top:24px;">Track Order</a>
      </div>
    `,
  };
}

export function passwordResetEmail(resetUrl) {
  return {
    subject: 'Reset Your StepTrendy Password',
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0a0a0a;color:#f0f0f0;border-radius:16px;">
        <h1 style="font-size:24px;margin-bottom:16px;">Password Reset</h1>
        <p style="color:#9ca3af;margin-bottom:24px;">Click the button below to reset your password. This link expires in 30 minutes.</p>
        <a href="${resetUrl}" style="display:inline-block;padding:12px 32px;background:linear-gradient(135deg,#3b82f6,#00d4ff);color:white;text-decoration:none;border-radius:999px;font-weight:600;">Reset Password</a>
      </div>
    `,
  };
}

export function shipmentUpdateEmail(order, status) {
  return {
    subject: `Order Update - #${order.orderNumber} is ${status}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0a0a0a;color:#f0f0f0;border-radius:16px;">
        <h1 style="font-size:24px;margin-bottom:8px;">Order Update</h1>
        <p style="color:#9ca3af;">Your order <strong style="color:white;">#${order.orderNumber}</strong> is now <strong style="color:#3b82f6;">${status}</strong>.</p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/account/orders/${order.orderNumber}" style="display:inline-block;padding:12px 32px;background:linear-gradient(135deg,#3b82f6,#00d4ff);color:white;text-decoration:none;border-radius:999px;font-weight:600;margin-top:24px;">View Order</a>
      </div>
    `,
  };
}
