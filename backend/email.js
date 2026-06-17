const nodemailer = require('nodemailer');

// ── Transport ─────────────────────────────────────────────────────────────────
// In development (no SMTP credentials), Nodemailer logs emails to the console
// instead of sending them. Set SMTP_* vars in .env to send real emails.

function createTransport() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  // Dev fallback — prints email to console instead of sending
  return {
    sendMail: (opts) => {
      console.log('\n📧  [EMAIL — dev mode, not sent]');
      console.log(`   To:      ${opts.to}`);
      console.log(`   Subject: ${opts.subject}`);
      console.log('─'.repeat(50));
      return Promise.resolve({ messageId: 'dev-mode' });
    },
  };
}

const FROM = process.env.SMTP_FROM || '"Collide Sport" <info@collidesport.co.za>';

// ── Brand colours ─────────────────────────────────────────────────────────────
const C = { navy: '#0e1b4d', blue: '#4770db', green: '#47db71', lavender: '#eff0f5' };

// ── Shared layout wrapper ─────────────────────────────────────────────────────
function layout(bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Collide Sport</title>
</head>
<body style="margin:0;padding:0;background:${C.lavender};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${C.lavender};padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(14,27,77,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:${C.navy};padding:28px 40px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:2px;text-transform:uppercase;">COLLIDE SPORT</h1>
            <p style="margin:4px 0 0;color:rgba(255,255,255,0.45);font-size:11px;letter-spacing:3px;text-transform:uppercase;">Play Hard</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 40px 32px;">
            ${bodyHtml}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:${C.lavender};padding:24px 40px;text-align:center;border-top:1px solid rgba(14,27,77,0.06);">
            <p style="margin:0 0 8px;font-size:12px;color:rgba(14,27,77,0.4);">
              Collide Sport — South African Made Rugby Gear
            </p>
            <p style="margin:0;font-size:11px;color:rgba(14,27,77,0.3);">
              <a href="mailto:info@collidesport.co.za" style="color:${C.blue};text-decoration:none;">info@collidesport.co.za</a>
              &nbsp;·&nbsp;
              <a href="https://www.instagram.com/collide_sport/" style="color:${C.blue};text-decoration:none;">@collide_sport</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Helper: format cents → ZAR ────────────────────────────────────────────────
const zar = (cents) => `R${(cents / 100).toFixed(2)}`;

// ── Helper: order items table rows ────────────────────────────────────────────
function itemRows(items) {
  return items.map(i => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid rgba(14,27,77,0.06);">
        <p style="margin:0;font-size:14px;font-weight:600;color:${C.navy};">${i.product_name}</p>
        ${i.variant_label ? `<p style="margin:2px 0 0;font-size:12px;color:rgba(14,27,77,0.45);">${i.variant_label}</p>` : ''}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid rgba(14,27,77,0.06);text-align:center;font-size:14px;color:rgba(14,27,77,0.5);">×${i.quantity}</td>
      <td style="padding:10px 0;border-bottom:1px solid rgba(14,27,77,0.06);text-align:right;font-size:14px;font-weight:600;color:${C.navy};">${zar(i.price_at_purchase * i.quantity)}</td>
    </tr>
  `).join('');
}

// ── 1. Order Confirmation ─────────────────────────────────────────────────────
async function sendOrderConfirmation(order, items) {
  const transport = createTransport();
  const addr = (() => { try { return JSON.parse(order.shipping_address); } catch { return order.shipping_address; } })();
  const addrStr = typeof addr === 'object'
    ? [addr.street, addr.city, addr.province, addr.postal_code, addr.country].filter(Boolean).join(', ')
    : addr;

  const html = layout(`
    <h2 style="margin:0 0 8px;font-size:24px;font-weight:800;color:${C.navy};">Order Confirmed! 🎉</h2>
    <p style="margin:0 0 24px;font-size:15px;color:rgba(14,27,77,0.55);line-height:1.6;">
      Thanks for your order, ${order.email}. We're getting it ready and will update you once it ships.
    </p>

    <!-- Order meta -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${C.lavender};border-radius:12px;padding:20px;margin-bottom:28px;">
      <tr>
        <td style="font-size:12px;color:rgba(14,27,77,0.45);padding-bottom:4px;">Order ID</td>
        <td style="font-size:12px;font-weight:700;color:${C.navy};text-align:right;font-family:monospace;">${order.id.substring(0,8).toUpperCase()}</td>
      </tr>
      <tr>
        <td style="font-size:12px;color:rgba(14,27,77,0.45);padding-bottom:4px;">Tracking Number</td>
        <td style="font-size:12px;font-weight:700;color:${C.blue};text-align:right;font-family:monospace;">${order.tracking_number}</td>
      </tr>
      <tr>
        <td style="font-size:12px;color:rgba(14,27,77,0.45);padding-bottom:4px;">Shipping to</td>
        <td style="font-size:12px;color:${C.navy};text-align:right;">${addrStr}</td>
      </tr>
      <tr>
        <td style="font-size:12px;color:rgba(14,27,77,0.45);">Delivery method</td>
        <td style="font-size:12px;color:${C.navy};text-align:right;text-transform:capitalize;">${order.shipping_method}</td>
      </tr>
    </table>

    <!-- Items -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <th style="text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:rgba(14,27,77,0.35);padding-bottom:8px;">Item</th>
        <th style="text-align:center;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:rgba(14,27,77,0.35);padding-bottom:8px;">Qty</th>
        <th style="text-align:right;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:rgba(14,27,77,0.35);padding-bottom:8px;">Price</th>
      </tr>
      ${itemRows(items)}
    </table>

    <!-- Totals -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td style="font-size:13px;color:rgba(14,27,77,0.5);padding:4px 0;">Subtotal</td>
        <td style="font-size:13px;color:${C.navy};text-align:right;padding:4px 0;">${zar(order.subtotal)}</td>
      </tr>
      ${order.discount_amount > 0 ? `
      <tr>
        <td style="font-size:13px;color:${C.green};padding:4px 0;">Discount (${order.discount_code})</td>
        <td style="font-size:13px;color:${C.green};text-align:right;padding:4px 0;">−${zar(order.discount_amount)}</td>
      </tr>` : ''}
      <tr>
        <td style="font-size:13px;color:rgba(14,27,77,0.5);padding:4px 0;">Shipping</td>
        <td style="font-size:13px;color:${C.navy};text-align:right;padding:4px 0;">${order.shipping_cost === 0 ? 'Free' : zar(order.shipping_cost)}</td>
      </tr>
      <tr>
        <td style="font-size:16px;font-weight:800;color:${C.navy};padding-top:12px;border-top:2px solid rgba(14,27,77,0.08);">Total</td>
        <td style="font-size:16px;font-weight:800;color:${C.navy};text-align:right;padding-top:12px;border-top:2px solid rgba(14,27,77,0.08);">${zar(order.total)}</td>
      </tr>
    </table>

    <p style="margin:0;font-size:13px;color:rgba(14,27,77,0.4);line-height:1.6;text-align:center;">
      Questions? Reply to this email or WhatsApp us on <strong>082 780 4116</strong>
    </p>
  `);

  await transport.sendMail({
    from: FROM,
    to: order.email,
    subject: `Order confirmed — ${order.tracking_number} 🏉`,
    html,
  });

  console.log(`📧  Order confirmation sent to ${order.email}`);
}

// ── 2. Shipping Update ────────────────────────────────────────────────────────
async function sendShippingUpdate(order) {
  const transport = createTransport();

  const statusMessages = {
    packed:    { headline: 'Your order is packed & ready! 📦', body: "We've carefully packed your Collide Sport gear and it's heading to our courier shortly." },
    shipped:   { headline: "It's on its way! 🚚",              body: "Your order has been collected by our courier. Use your tracking number to follow its journey." },
    delivered: { headline: 'Delivered! Time to Play Hard 🏉',  body: "Your Collide Sport gear has been delivered. We hope you love it — tag us @collide_sport!" },
    cancelled: { headline: 'Order Cancelled',                   body: "Your order has been cancelled. If you have questions, please contact us and we'll sort it out." },
  };

  const msg = statusMessages[order.status] || { headline: `Order Update: ${order.status}`, body: 'Your order status has been updated.' };

  const html = layout(`
    <h2 style="margin:0 0 8px;font-size:24px;font-weight:800;color:${C.navy};">${msg.headline}</h2>
    <p style="margin:0 0 24px;font-size:15px;color:rgba(14,27,77,0.55);line-height:1.6;">${msg.body}</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:${C.lavender};border-radius:12px;padding:20px;margin-bottom:28px;">
      <tr>
        <td style="font-size:12px;color:rgba(14,27,77,0.45);padding-bottom:4px;">Order ID</td>
        <td style="font-size:12px;font-weight:700;color:${C.navy};text-align:right;font-family:monospace;">${order.id.substring(0,8).toUpperCase()}</td>
      </tr>
      <tr>
        <td style="font-size:12px;color:rgba(14,27,77,0.45);padding-bottom:4px;">Tracking Number</td>
        <td style="font-size:12px;font-weight:700;color:${C.blue};text-align:right;font-family:monospace;">${order.tracking_number}</td>
      </tr>
      <tr>
        <td style="font-size:12px;color:rgba(14,27,77,0.45);">Status</td>
        <td style="font-size:12px;font-weight:700;color:${C.green};text-align:right;text-transform:capitalize;">${order.status}</td>
      </tr>
    </table>

    <p style="margin:0;font-size:13px;color:rgba(14,27,77,0.4);line-height:1.6;text-align:center;">
      Questions? Reply to this email or WhatsApp us on <strong>082 780 4116</strong>
    </p>
  `);

  await transport.sendMail({
    from: FROM,
    to: order.email,
    subject: `${msg.headline} — ${order.tracking_number}`,
    html,
  });

  console.log(`📧  Shipping update (${order.status}) sent to ${order.email}`);
}

// ── 3. Payment Failed ─────────────────────────────────────────────────────────
async function sendPaymentFailed(order) {
  const transport = createTransport();

  const html = layout(`
    <h2 style="margin:0 0 8px;font-size:24px;font-weight:800;color:${C.navy};">Payment Unsuccessful ⚠️</h2>
    <p style="margin:0 0 24px;font-size:15px;color:rgba(14,27,77,0.55);line-height:1.6;">
      Unfortunately your payment for order <strong>${order.tracking_number}</strong> could not be processed.
      Your order has been cancelled and no stock has been reserved.
    </p>
    <p style="margin:0 0 24px;font-size:15px;color:rgba(14,27,77,0.55);line-height:1.6;">
      Please try again or contact us on <strong>082 780 4116</strong> if you need help.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${C.lavender};border-radius:12px;padding:20px;">
      <tr>
        <td style="font-size:12px;color:rgba(14,27,77,0.45);padding-bottom:4px;">Order Reference</td>
        <td style="font-size:12px;font-weight:700;color:${C.navy};text-align:right;font-family:monospace;">${order.tracking_number}</td>
      </tr>
      <tr>
        <td style="font-size:12px;color:rgba(14,27,77,0.45);">Amount</td>
        <td style="font-size:12px;font-weight:700;color:${C.navy};text-align:right;">${zar(order.total)}</td>
      </tr>
    </table>
  `);

  await transport.sendMail({
    from: FROM,
    to: order.email,
    subject: `Payment failed — ${order.tracking_number}`,
    html,
  });

  console.log(`📧  Payment failed notice sent to ${order.email}`);
}

// ── 4. Password Reset ─────────────────────────────────────────────────────────
async function sendPasswordReset(toEmail, resetUrl) {
  const transport = createTransport();

  const html = layout(`
    <h2 style="margin:0 0 8px;font-size:24px;font-weight:800;color:${C.navy};">Reset your password 🔑</h2>
    <p style="margin:0 0 24px;font-size:15px;color:rgba(14,27,77,0.55);line-height:1.6;">
      We received a request to reset the password for your Collide Sport account.
      Click the button below to choose a new password.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td align="center">
          <a href="${resetUrl}"
             style="display:inline-block;background:${C.blue};color:#ffffff;font-size:15px;font-weight:700;
                    text-decoration:none;padding:14px 36px;border-radius:50px;letter-spacing:0.5px;">
            Reset My Password
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 12px;font-size:13px;color:rgba(14,27,77,0.4);line-height:1.6;text-align:center;">
      This link expires in <strong>1 hour</strong>. If you didn't request a password reset, you can safely ignore this email — your password won't change.
    </p>

    <div style="background:${C.lavender};border-radius:8px;padding:12px 16px;margin-top:16px;">
      <p style="margin:0;font-size:11px;color:rgba(14,27,77,0.4);word-break:break-all;">
        If the button doesn't work, copy this link into your browser:<br/>
        <a href="${resetUrl}" style="color:${C.blue};text-decoration:none;">${resetUrl}</a>
      </p>
    </div>
  `);

  await transport.sendMail({
    from: FROM,
    to: toEmail,
    subject: 'Reset your Collide Sport password',
    html,
  });

  console.log(`📧  Password reset email sent to ${toEmail}`);
}

module.exports = { sendOrderConfirmation, sendShippingUpdate, sendPaymentFailed, sendPasswordReset };
