import { useState } from 'react';
import { useLang } from '@/context/LangContext';
import { Sprout, ArrowLeft, Mail, Lock, Eye, EyeOff, User, Loader2, AlertCircle } from 'lucide-react';
import farmBgImg from '@/assets/farm-landscape.jpg';

/* ─────────────────────────────────────────────
   Full-screen background Auth Shell (Centered Form)
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
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-x-hidden p-4 sm:p-6">
      {/* ── Fullscreen Background Image ── */}
      <img
        src={farmBgImg}
        alt="ShetkariHit Farm Background"
        className="fixed inset-0 w-full h-full object-cover object-center -z-20"
      />

      {/* ── Ambient Soft Vignette & Blur Overlay ── */}
      <div className="fixed inset-0 bg-black/25 backdrop-blur-[2px] -z-10" />

      {/* ── Top Floating Navigation Bar ── */}
      <div className="fixed top-4 left-4 right-4 sm:top-6 sm:left-8 sm:right-8 flex items-center justify-between z-30 pointer-events-none">
        {/* Brand Logo */}
        <div className="pointer-events-auto flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-white/80">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-700 shadow-sm">
            <Sprout className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-brand-700 text-sm tracking-wide">{t('appName')}</span>
        </div>

        {/* Language Switcher */}
        <button
          onClick={toggleLang}
          className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-white/80 bg-white/90 backdrop-blur-md px-4 py-2 text-xs font-semibold text-ink shadow-lg hover:bg-brand-50 transition-colors"
        >
          {lang === 'mr' ? 'English' : 'मराठी'}
        </button>
      </div>

      {/* ── Centered Auth Card ── */}
      <div className="w-full max-w-[440px] my-16 sm:my-20 z-20 animate-slide-up">
        {/* Back / Cancel link */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-white mb-3 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/20 transition-all hover:bg-black/40 group shadow-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          {t('cancel')}
        </button>

        {/* Glassmorphic White Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/90">
          <h2 className="text-2xl font-bold text-ink mb-1.5 leading-tight">{headline}</h2>
          <p className="text-xs sm:text-sm text-muted mb-6 leading-relaxed">{subtitle}</p>

          {children}

          {/* Switch between Login and Signup */}
          <p className="mt-5 text-center text-xs sm:text-sm text-muted">
            <button
              type="button"
              onClick={onSwitch}
              className="font-semibold text-brand-700 hover:text-brand-800 hover:underline transition-colors"
            >
              {switchText}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Sign Up Page (Email & Password + Confirm Password + Required Name)
───────────────────────────────────────────── */
interface SignUpPageProps {
  onBack: () => void;
  onSignUp: (email: string, pass: string, name: string) => Promise<void>;
  onSwitch: () => void;
}

export function SignUpPage({ onBack, onSignUp, onSwitch }: SignUpPageProps) {
  const { t, lang } = useLang();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isNameValid = name.trim().length >= 2;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isPasswordValid = password.length >= 6;
  const isConfirmMatch = password.length > 0 && password === confirmPassword;
  const canSubmit = isNameValid && isEmailValid && isPasswordValid && isConfirmMatch && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setLoading(true);

    try {
      await onSignUp(email.trim(), password, name.trim());
    } catch (err: any) {
      console.error('[SignUp]', err);
      setError(err.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      headline={t('signupHeadline')}
      subtitle={t('signupSubtitle')}
      onBack={onBack}
      switchText={t('switchToLogin')}
      onSwitch={onSwitch}
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {error && (
          <div className="rounded-xl bg-urgent/10 border border-urgent/20 p-2.5 text-xs text-urgent flex items-center gap-2 animate-fade-in">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Name input (REQUIRED) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
            {t('fullNameLabel')} <span className="text-urgent">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              id="signup-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={lang === 'mr' ? 'उदा. रवी पाटील' : 'e.g. Ravi Patil'}
              className={`input-field pl-10 py-2.5 text-sm ${name.length > 0 && !isNameValid ? 'border-urgent focus:ring-urgent/30' : ''}`}
              required
              autoFocus
            />
          </div>
          {name.length > 0 && !isNameValid && (
            <p className="mt-1 text-[11px] text-urgent">{t('nameRequired')}</p>
          )}
        </div>

        {/* 2. Email input (REQUIRED) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
            {t('emailLabel')} <span className="text-urgent">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('emailPlaceholder')}
              className={`input-field pl-10 py-2.5 text-sm ${email.length > 0 && !isEmailValid ? 'border-urgent focus:ring-urgent/30' : ''}`}
              required
              autoComplete="email"
            />
          </div>
          {email.length > 0 && !isEmailValid && (
            <p className="mt-1 text-[11px] text-urgent">{lang === 'mr' ? 'कृपया वैध ईमेल प्रविष्ट करा.' : 'Please enter a valid email address.'}</p>
          )}
        </div>

        {/* 3. Password input (REQUIRED) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
            {t('passwordLabel')} <span className="text-urgent">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('passwordPlaceholder')}
              className={`input-field pl-10 pr-10 py-2.5 text-sm ${password.length > 0 && !isPasswordValid ? 'border-urgent focus:ring-urgent/30' : ''}`}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {password.length > 0 && !isPasswordValid && (
            <p className="mt-1 text-[11px] text-urgent">{lang === 'mr' ? 'पासवर्ड किमान ६ अक्षरांचा असावा.' : 'Password must be at least 6 characters.'}</p>
          )}
        </div>

        {/* 4. Confirm Password input (REQUIRED) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
            {t('confirmPasswordLabel')} <span className="text-urgent">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              id="signup-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('confirmPasswordPlaceholder')}
              className={`input-field pl-10 pr-10 py-2.5 text-sm ${confirmPassword.length > 0 && !isConfirmMatch ? 'border-urgent focus:ring-urgent/30' : ''}`}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {confirmPassword.length > 0 && !isConfirmMatch && (
            <p className="mt-1 text-[11px] text-urgent">{t('passwordMismatch')}</p>
          )}
        </div>

        {/* Submit button */}
        <button
          id="signup-submit-btn"
          type="submit"
          disabled={!canSubmit}
          className={`btn-primary w-full py-3 text-base shadow-sm transition-all flex items-center justify-center gap-2 mt-3 ${
            !canSubmit ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'
          }`}
        >
          {loading && <Loader2 className="h-5 w-5 animate-spin" />}
          {t('signupBtn')}
        </button>
      </form>
    </AuthShell>
  );
}

/* ─────────────────────────────────────────────
   Log In Page (Email & Password)
───────────────────────────────────────────── */
interface LogInPageProps {
  onBack: () => void;
  onLogIn: (email: string, pass: string) => Promise<void>;
  onSwitch: () => void;
}

export function LogInPage({ onBack, onLogIn, onSwitch }: LogInPageProps) {
  const { t, lang } = useLang();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canSubmit = isEmailValid && password.length >= 6 && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setLoading(true);

    try {
      await onLogIn(email.trim(), password);
    } catch (err: any) {
      console.error('[LogIn]', err);
      setError(
        err.message?.includes('Invalid login credentials')
          ? (lang === 'mr' ? 'ईमेल किंवा पासवर्ड चुकीचा आहे.' : lang === 'hi' ? 'ईमेल या पासवर्ड गलत है।' : 'Invalid email or password.')
          : (err.message || 'Login failed. Please try again.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      headline={t('loginHeadline')}
      subtitle={t('loginSubtitle')}
      onBack={onBack}
      switchText={t('switchToSignup')}
      onSwitch={onSwitch}
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {error && (
          <div className="rounded-xl bg-urgent/10 border border-urgent/20 p-2.5 text-xs text-urgent flex items-center gap-2 animate-fade-in">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Email input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
            {t('emailLabel')}
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('emailPlaceholder')}
              className="input-field pl-10 py-2.5 text-sm"
              required
              autoFocus
              autoComplete="email"
            />
          </div>
        </div>

        {/* Password input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
            {t('passwordLabel')}
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('passwordPlaceholder')}
              className="input-field pl-10 pr-10 py-2.5 text-sm"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Submit button */}
        <button
          id="login-submit-btn"
          type="submit"
          disabled={!canSubmit}
          className={`btn-primary w-full py-3 text-base shadow-sm transition-all flex items-center justify-center gap-2 mt-3 ${
            !canSubmit ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'
          }`}
        >
          {loading && <Loader2 className="h-5 w-5 animate-spin" />}
          {t('loginBtn')}
        </button>
      </form>
    </AuthShell>
  );
}

// Legacy export compatibility
export { AuthShell as AuthCard };
