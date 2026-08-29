import { useState, useRef, useEffect } from 'react';
import { useLang } from '@/context/LangContext';
import { Sprout, ArrowLeft, RefreshCw, ShieldCheck } from 'lucide-react';
import { FarmIllustration } from './FarmIllustration';

interface Props {
  mobile: string;
  flow: 'login' | 'signup';
  onBack: () => void;
  onVerified: (isNewUser: boolean) => void;
}

const COUNTDOWN_SECS = 30;

export function OtpPage({ mobile, flow, onBack, onVerified }: Props) {
  const { lang, toggleLang, t } = useLang();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECS);
  const [canResend, setCanResend] = useState(false);
  const [resent, setResent] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  /* Live countdown on mount */
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (i: number, val: string) => {
    // Allow only digits
    const clean = val.replace(/\D/g, '');
    if (!clean && val) return;
    const next = [...digits];
    next[i] = clean.slice(-1);
    setDigits(next);
    if (clean && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!paste) return;
    const next = [...digits];
    paste.split('').forEach((ch, idx) => {
      if (idx < 6) next[idx] = ch;
    });
    setDigits(next);
    refs.current[Math.min(paste.length, 5)]?.focus();
  };

  const handleResend = () => {
    setDigits(['', '', '', '', '', '']);
    setCountdown(COUNTDOWN_SECS);
    setCanResend(false);
    setResent(true);
    refs.current[0]?.focus();
    setTimeout(() => setResent(false), 3000);

    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const allFilled = digits.every((d) => d !== '');

  /* Mask mobile: show last 4 digits only */
  const maskedMobile = mobile
    ? mobile.replace(/(\+?\d{1,3})?(\d+)(\d{4})$/, (_, cc, mid, last) =>
        `${cc ?? ''} ${'•'.repeat(mid.length)} ${last}`.trim()
      )
    : '+91 •••••• 3210';

  return (
    <div className="min-h-screen bg-cream flex flex-col lg:flex-row overflow-hidden">
      {/* Illustration side */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-green-50 to-ochre-50" />
        <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-brand-200/25 blur-3xl" />
        <FarmIllustration className="relative z-10 w-full h-full p-6" />
        <div className="absolute top-6 left-6 flex items-center gap-2 z-20">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-700 shadow-md">
            <Sprout className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-brand-700">{t('appName')}</span>
        </div>
      </div>

      {/* Form side */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <div className="flex items-center justify-between px-6 pt-6 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-700">
              <Sprout className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-brand-700">{t('appName')}</span>
          </div>
          <button
            onClick={toggleLang}
            className="rounded-full border border-ochre-200 bg-white px-3 py-1.5 text-xs font-medium text-ink hover:bg-brand-50 transition-colors"
          >
            {lang === 'mr' ? 'EN' : 'मर'}
          </button>
        </div>

        {/* Language toggle desktop */}
        <div className="hidden lg:flex justify-end px-8 pt-6">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 rounded-full border border-ochre-200 bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-brand-50"
          >
            {lang === 'mr' ? 'English' : 'मराठी'}
          </button>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-8">
          <div className="w-full max-w-[440px] animate-slide-up">
            {/* Back */}
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink mb-8 transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              {t('changeMobile')}
            </button>

            <div className="card p-8 shadow-md">
              {/* Icon */}
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 mb-5">
                <ShieldCheck className="h-7 w-7 text-brand-700" />
              </div>

              <h2 className="text-2xl font-bold text-ink mb-1">{t('otpHeadline')}</h2>

              {/* Sent-to line */}
              <p className="text-sm text-muted mb-1">
                {t('otpSentTo')}{' '}
                <span className="font-semibold text-ink">{maskedMobile}</span>
              </p>
              <button
                onClick={onBack}
                className="text-xs text-brand-700 font-semibold hover:underline mb-7 block"
              >
                {t('changeMobile')}
              </button>

              {/* 6-digit boxes */}
              <div className="flex justify-between gap-2 mb-6" onPaste={handlePaste}>
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => { refs.current[i] = el; }}
                    id={`otp-digit-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className={`h-14 w-full rounded-xl border-2 text-center text-xl font-bold transition-all focus:outline-none focus:ring-2 ${
                      d
                        ? 'border-brand-700 bg-brand-50 text-brand-700 focus:ring-brand-300'
                        : 'border-ochre-200 bg-cream text-ink focus:border-brand-400 focus:ring-brand-200'
                    }`}
                  />
                ))}
              </div>

              {/* Verify button */}
              <button
                id="verify-otp-btn"
                onClick={() => onVerified(flow === 'signup')}
                disabled={!allFilled}
                className={`btn-primary w-full py-3.5 text-base shadow-sm transition-all mb-5 ${
                  !allFilled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'
                }`}
              >
                {t('otpVerifyBtn')}
              </button>

              {/* Resend / countdown */}
              <div className="text-center text-sm">
                {resent && (
                  <p className="text-brand-700 font-medium mb-1 animate-fade-in">
                    {lang === 'mr' ? 'ओटीपी पुन्हा पाठवला ✓' : 'OTP resent ✓'}
                  </p>
                )}
                {canResend ? (
                  <button
                    id="resend-otp-btn"
                    onClick={handleResend}
                    className="flex items-center gap-1.5 mx-auto text-brand-700 font-semibold hover:underline transition-colors"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    {t('resendOtp')}
                  </button>
                ) : (
                  <p className="text-muted">
                    {t('resendIn')}{' '}
                    <span className="font-semibold text-ink tabular-nums">
                      {countdown}
                    </span>{' '}
                    {t('seconds')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
