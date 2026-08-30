// server/routes/otp.js
// Simulated OTP: logs to console, shown on-screen in dev.
// Swap the `sendSms` function body for Twilio/MSG91 when ready.

const otpStore = new Map(); // mobile → { code, expiresAt }
const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function normalizeMobile(mobile) {
  return mobile.replace(/\D/g, '').slice(-10); // last 10 digits
}

// ── Stub SMS sender — replace with real provider when ready ──
async function sendSms(mobile, otp) {
  // TODO: swap for Twilio, MSG91, etc.
  // const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
  // await client.messages.create({ body: `Your ShetkariHit OTP is ${otp}`, from: process.env.TWILIO_FROM, to: `+91${mobile}` });

  // For now: log to console
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📱 OTP for +91-${mobile}: ${otp}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

export async function sendOtpHandler(req, res) {
  try {
    const { mobile } = req.body;
    if (!mobile) return res.status(400).json({ error: 'mobile is required' });

    const normalized = normalizeMobile(mobile);
    if (normalized.length !== 10) {
      return res.status(400).json({ error: 'Invalid mobile number' });
    }

    const otp = generateOtp();
    otpStore.set(normalized, { code: otp, expiresAt: Date.now() + OTP_TTL_MS });

    await sendSms(normalized, otp);

    // In dev mode, also return OTP in response so the frontend can show a dev hint
    const isDev = process.env.NODE_ENV !== 'production';
    res.json({
      success: true,
      message: `OTP sent to ${mobile}`,
      ...(isDev && { devOtp: otp }), // REMOVE this line before production!
    });
  } catch (err) {
    console.error('[otp/send]', err.message);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
}

export function verifyOtpHandler(req, res) {
  try {
    const { mobile, otp } = req.body;
    if (!mobile || !otp) return res.status(400).json({ error: 'mobile and otp are required' });

    const normalized = normalizeMobile(mobile);
    const stored = otpStore.get(normalized);

    if (!stored) {
      return res.status(400).json({ valid: false, error: 'No OTP found — please request a new one' });
    }
    if (Date.now() > stored.expiresAt) {
      otpStore.delete(normalized);
      return res.status(400).json({ valid: false, error: 'OTP expired — please request a new one' });
    }
    if (stored.code !== otp.trim()) {
      return res.status(400).json({ valid: false, error: 'Incorrect OTP' });
    }

    // Valid — consume it
    otpStore.delete(normalized);
    res.json({ valid: true, message: 'OTP verified successfully' });
  } catch (err) {
    console.error('[otp/verify]', err.message);
    res.status(500).json({ error: 'Verification failed' });
  }
}
