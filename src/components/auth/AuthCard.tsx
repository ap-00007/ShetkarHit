import { useState, type ReactNode } from 'react';
import { useLang } from '@/context/LangContext';
import { Sprout, ArrowLeft } from 'lucide-react';

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  onBack: () => void;
}

export function AuthCard({ title, subtitle, children, onBack }: AuthCardProps) {
  const { t } = useLang();

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <div className="flex items-center gap-3 px-6 pt-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-700">
          <Sprout className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold text-brand-700">{t('appName')}</span>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-[480px] card p-8">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('cancel')}
          </button>
          <h2 className="text-2xl font-bold text-ink mb-1">{title}</h2>
          <p className="text-sm text-muted mb-6">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

interface LoginProps {
  onBack: () => void;
  onOtpSent: (mobile: string, flow: 'login' | 'signup') => void;
  flow: 'login' | 'signup';
}

export function LoginPage({ onBack, onOtpSent, flow }: LoginProps) {
  const { t } = useLang();
  const [mobile, setMobile] = useState('');

  const isSignup = flow === 'signup';
  const title = isSignup
    ? t('newFarmer')
    : t('alreadyAccount');
  const subtitle = isSignup ? t('otpNote') : '';
  const btnText = isSignup ? t('sendOtpStart') : t('sendOtp');

  return (
    <AuthCard title={title} subtitle={subtitle} onBack={onBack}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">{t('mobile')}</label>
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="+91 98765 43210"
            className="input-field"
            inputMode="tel"
          />
        </div>
        <button
          onClick={() => onOtpSent(mobile, flow)}
          className="btn-primary w-full"
        >
          {btnText}
        </button>
      </div>
    </AuthCard>
  );
}
