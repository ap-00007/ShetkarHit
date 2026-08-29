import { useLang } from '@/context/LangContext';
import { Sprout } from 'lucide-react';
import { FarmIllustration } from '@/components/auth/FarmIllustration';

interface Props {
  onStart: () => void;
  onLogin: () => void;
}

export function IntroPage({ onStart, onLogin }: Props) {
  const { lang, toggleLang, t } = useLang();

  const values = [t('introValue1'), t('introValue2'), t('introValue3')];

  return (
    <div className="min-h-screen bg-cream flex flex-col lg:flex-row overflow-hidden">
      {/* ── Left panel: logo, tagline, bullets ── */}
      <div className="relative flex flex-col justify-center px-8 py-12 lg:w-[52%] lg:px-16 lg:py-20">
        {/* Language toggle */}
        <div className="absolute top-5 right-6">
          <button
            id="lang-toggle-intro"
            onClick={toggleLang}
            className="flex items-center gap-1.5 rounded-full border border-ochre-200 bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-brand-50"
          >
            {lang === 'mr' ? 'English' : 'मराठी'}
          </button>
        </div>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-700 shadow-lg">
            <Sprout className="h-7 w-7 text-white" />
          </div>
          <span className="text-2xl font-bold text-brand-700">{t('appName')}</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl lg:text-4xl font-bold text-ink leading-tight mb-3">
          {t('tagline')}
        </h1>
        <p className="text-base text-muted mb-8 leading-relaxed max-w-sm">
          {lang === 'mr'
            ? 'दररोज एक स्मार्ट शेत निर्णय — हवामान, बाजार, आणि कीड नियंत्रण एकत्र.'
            : 'One smart farm decision every day — weather, market prices, and pest control, combined.'}
        </p>

        {/* Value bullets */}
        <div className="space-y-3 mb-10">
          {values.map((v, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-ochre-400" />
              <p className="text-sm text-muted leading-relaxed">{v}</p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3 max-w-xs">
          <button
            id="intro-get-started"
            onClick={onStart}
            className="btn-primary w-full text-base py-3.5 shadow-md hover:shadow-lg transition-shadow"
          >
            {t('getStarted')}
          </button>
          <button
            id="intro-login"
            onClick={onLogin}
            className="w-full text-center text-sm font-semibold text-brand-700 hover:text-brand-800 py-2 transition-colors"
          >
            {t('switchToLogin')}
          </button>
        </div>
      </div>

      {/* ── Right panel: farm illustration ── */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden bg-brand-700/5">
        {/* Decorative background blobs */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-green-50 to-ochre-50" />
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-200/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-ochre-200/25 blur-2xl" />

        <FarmIllustration className="relative z-10 w-full h-full object-contain p-8" />

        {/* Floating badge */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-lg border border-ochre-100 text-center">
          <p className="text-xs text-muted font-medium">
            {lang === 'mr' ? '१०,०००+ शेतकरी वापरतात' : '10,000+ farmers trust us'}
          </p>
          <div className="flex items-center justify-center gap-0.5 mt-1">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="h-3.5 w-3.5 fill-ochre-400" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: illustration strip */}
      <div className="lg:hidden w-full overflow-hidden" style={{ height: '220px' }}>
        <div className="relative w-full h-full bg-gradient-to-br from-brand-50 to-green-50">
          <FarmIllustration className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}
