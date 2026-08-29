import { useState, useRef } from 'react';
import { useLang } from '@/context/LangContext';
import { AuthCard } from './AuthCard';

interface Props {
  mobile: string;
  flow: 'login' | 'signup';
  onBack: () => void;
  onVerified: () => void;
}

export function OtpPage({ mobile, flow, onBack, onVerified }: Props) {
  const { t } = useLang();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(30);
  const [resendClicked, setResendClicked] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const title = flow === 'signup' ? t('newFarmer') : t('alreadyAccount');

  const handleChange = (i: number, val: string) => {
    if (val.length > 1) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const handleResend = () => {
    setResendClicked(true);
    setCountdown(30);
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          setResendClicked(false);
          return 30;
        }
        return c - 1;
      });
    }, 1000);
  };

  const allFilled = digits.every((d) => d !== '');

  return (
    <AuthCard title={title} subtitle={t('otpNote')} onBack={onBack}>
      <div className="space-y-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">
            {t('mobile')}: <span className="font-medium text-ink">{mobile || '+91 98765 43210'}</span>
          </span>
          <button onClick={onBack} className="text-brand-700 font-medium hover:underline">
            {t('cancel')}
          </button>
        </div>

        <div className="flex justify-between gap-2">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`h-14 w-12 rounded-xl border-2 text-center text-xl font-bold transition-colors focus:outline-none ${
                d
                  ? 'border-brand-700 bg-brand-50 text-brand-700'
                  : 'border-ochre-200 bg-cream text-ink focus:border-brand-400 focus:ring-2 focus:ring-brand-200'
              }`}
            />
          ))}
        </div>

        <button
          onClick={onVerified}
          disabled={!allFilled}
          className={`btn-primary w-full ${!allFilled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {t('save')}
        </button>

        <div className="text-center text-sm">
          {resendClicked ? (
            <span className="text-muted">
              {countdown} {t('cancel').toLowerCase()}...
            </span>
          ) : (
            <button onClick={handleResend} className="text-brand-700 font-medium hover:underline">
              {t('sendOtp')}
            </button>
          )}
        </div>
      </div>
    </AuthCard>
  );
}
