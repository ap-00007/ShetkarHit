import { useState } from 'react';
import { useLang } from '@/context/LangContext';
import { Sprout, ArrowLeft, Phone } from 'lucide-react';
import { FarmIllustration } from './FarmIllustration';

/* ─────────────────────────────────────────────
   Shared two-column auth shell
───────────────────────────────────────────── */
interface AuthShellProps {
  headline: string;
  subtitle: string;
  onBack: () => void;
  switchText: string;
  onSwitch: () => void;
  children: React.ReactNode;
}

function AuthShell({ headline, subtitle, onBack, switchText, onSwitch, children }: AuthShellProps) {
  const { lang, toggleLang, t } = useLang();

  return (
    <div className="min-h-screen bg-cream flex flex-col lg:flex-row overflow-hidden">
      {/* ── Left: illustration panel ── */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-green-50 to-ochre-50" />
        <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-brand-200/25 blur-3xl" />
        <div className="absolute bottom-10 right-0 h-52 w-52 rounded-full bg-ochre-200/20 blur-2xl" />
        <FarmIllustration className="relative z-10 w-full h-full p-6" />

        {/* Brand watermark */}
        <div className="absolute top-6 left-6 flex items-center gap-2 z-20">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-700 shadow-md">
            <Sprout className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-brand-700">{t('appName')}</span>
        </div>
      </div>

      {/* ── Right: form panel ── */}
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

        {/* Language toggle — desktop */}
        <div className="hidden lg:flex justify-end px-8 pt-6">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 rounded-full border border-ochre-200 bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-brand-50"
          >
            {lang === 'mr' ? 'English' : 'मराठी'}
          </button>
        </div>

        {/* Form card */}
        <div className="flex flex-1 items-center justify-center px-6 py-8">
          <div className="w-full max-w-[440px] animate-slide-up">
            {/* Back button */}
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink mb-8 transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              {t('cancel')}
            </button>

            {/* Card */}
            <div className="card p-8 shadow-md">
              <h2 className="text-2xl font-bold text-ink mb-1 leading-tight">{headline}</h2>
              <p className="text-sm text-muted mb-7 leading-relaxed">{subtitle}</p>

              {children}

              {/* Switch link */}
              <p className="mt-5 text-center text-sm text-muted">
                <button
                  onClick={onSwitch}
                  className="font-semibold text-brand-700 hover:text-brand-800 hover:underline transition-colors"
                >
                  {switchText}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Shared mobile input form
───────────────────────────────────────────── */
interface MobileFormProps {
  mobile: string;
  setMobile: (v: string) => void;
  onSubmit: () => void;
  btnLabel: string;
}

function MobileForm({ mobile, setMobile, onSubmit, btnLabel }: MobileFormProps) {
  const { t, lang } = useLang();
  const [touched, setTouched] = useState(false);

  const cleanDigits = mobile.replace(/\D/g, '');
  const isValid = cleanDigits.length === 10 && /^[6-9]/.test(cleanDigits);
  const showError = touched && cleanDigits.length > 0 && !isValid;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobile(raw);
    if (!touched) setTouched(true);
  };

  const handleFormSubmit = () => {
    setTouched(true);
    if (isValid) {
      onSubmit();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-ink mb-1.5">
          {t('mobileLabel')}
        </label>
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-muted text-sm font-medium select-none pointer-events-none">
            <Phone className="h-4 w-4" />
            <span>+91</span>
          </div>
          <input
            id="mobile-input"
            type="tel"
            value={mobile}
            onChange={handleChange}
            onBlur={() => setTouched(true)}
            placeholder={lang === 'mr' ? '९८७६५ ४३२१०' : lang === 'hi' ? '९८७६५ ४३२१०' : '98765 43210'}
            className={`input-field pl-16 ${showError ? 'border-urgent focus:ring-urgent/30' : ''}`}
            inputMode="numeric"
            maxLength={10}
          />
        </div>
        {showError ? (
          <p className="mt-1.5 text-xs text-urgent font-medium animate-fade-in">
            {lang === 'mr'
              ? 'कृपया अचूक १० अंकी भारतीय मोबाईल क्रमांक टाका (६, ७, ८, किंवा ९ ने सुरू होणारा).'
              : lang === 'hi'
              ? 'कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें (6, 7, 8 या 9 से शुरू होने वाला)।'
              : 'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.'}
          </p>
        ) : (
          <p className="mt-1.5 text-xs text-muted">
            {t('otpNote')}
          </p>
        )}
      </div>

      <button
        id="send-otp-btn"
        onClick={handleFormSubmit}
        disabled={!isValid}
        className={`btn-primary w-full py-3.5 text-base shadow-sm transition-all ${
          !isValid
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:shadow-md'
        }`}
      >
        {btnLabel}
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Sign Up Page
───────────────────────────────────────────── */
interface AuthPageProps {
  onBack: () => void;
  onOtpSent: (mobile: string, flow: 'login' | 'signup') => void;
  onSwitch: () => void;
}

export function SignUpPage({ onBack, onOtpSent, onSwitch }: AuthPageProps) {
  const { t } = useLang();
  const [mobile, setMobile] = useState('');

  return (
    <AuthShell
      headline={t('signupHeadline')}
      subtitle={t('signupSubtitle')}
      onBack={onBack}
      switchText={t('switchToLogin')}
      onSwitch={onSwitch}
    >
      <MobileForm
        mobile={mobile}
        setMobile={setMobile}
        onSubmit={() => onOtpSent(mobile, 'signup')}
        btnLabel={t('sendOtpStart')}
      />
    </AuthShell>
  );
}

/* ─────────────────────────────────────────────
   Log In Page
───────────────────────────────────────────── */
export function LogInPage({ onBack, onOtpSent, onSwitch }: AuthPageProps) {
  const { t } = useLang();
  const [mobile, setMobile] = useState('');

  return (
    <AuthShell
      headline={t('loginHeadline')}
      subtitle={t('loginSubtitle')}
      onBack={onBack}
      switchText={t('switchToSignup')}
      onSwitch={onSwitch}
    >
      <MobileForm
        mobile={mobile}
        setMobile={setMobile}
        onSubmit={() => onOtpSent(mobile, 'login')}
        btnLabel={t('sendOtp')}
      />
    </AuthShell>
  );
}

// Keep legacy export name so OtpPage import doesn't break during migration
export { AuthShell as AuthCard };
