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
    <div className="min-h-screen bg-cream">
      {/* ══════════════════════════════════
          Mobile layout (< lg)
          Full-bleed illustration hero, then content card
         ══════════════════════════════════ */}
      <div className="lg:hidden flex flex-col min-h-screen">
        {/* Full-bleed hero illustration */}
        <div className="relative w-full" style={{ height: '52vw', minHeight: '200px', maxHeight: '320px' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-brand-700/5 via-green-50 to-cream" />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-50 to-ochre-50/50" />
          <FarmIllustration className="absolute inset-0 w-full h-full" />

          {/* Logo overlay */}
          <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-700 shadow-md">
              <Sprout className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-brand-700 text-base">{t('appName')}</span>
          </div>

          {/* Lang toggle */}
          <button
            id="lang-toggle-intro"
            onClick={toggleLang}
            className="absolute top-4 right-4 z-10 rounded-full border border-ochre-200 bg-white/80 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-ink hover:bg-brand-50 transition-colors"
          >
            {lang === 'mr' ? 'English' : 'मराठी'}
          </button>

          {/* Floating trust badge */}
          <div className="absolute bottom-3 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow border border-ochre-100 text-center">
            <p className="text-[10px] text-muted font-medium leading-tight">
              {lang === 'mr' ? '१०,०००+ शेतकरी विश्वास ठेवतात' : '10,000+ farmers trust us'}
            </p>
            <div className="flex items-center justify-center gap-0.5 mt-0.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="h-3 w-3 fill-ochre-400" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
          </div>
        </div>

        {/* Content card */}
        <div className="flex-1 bg-cream px-6 pt-7 pb-10">
          <h1 className="text-3xl font-bold text-ink leading-tight mb-3">{t('tagline')}</h1>
          <p className="text-sm text-muted leading-relaxed mb-7">
            {lang === 'mr'
              ? 'दररोज एक स्मार्ट शेत निर्णय — हवामान, बाजार, आणि कीड नियंत्रण एकत्र.'
              : 'One smart farm decision every day — weather, market prices, and pest control, combined.'}
          </p>

          {/* Value props */}
          <div className="space-y-2.5 mb-9">
            {values.map((v, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-ochre-400" />
                <p className="text-sm text-muted leading-relaxed">{v}</p>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <button
            id="intro-get-started"
            onClick={onStart}
            className="btn-primary w-full text-base py-4 shadow-md mb-3"
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

      {/* ══════════════════════════════════
          Desktop layout (lg+)
          Left content panel + right illustration
         ══════════════════════════════════ */}
      <div className="hidden lg:flex min-h-screen overflow-hidden">
        {/* Left panel */}
        <div className="relative flex flex-col justify-center px-16 py-20 w-[52%]">
          {/* Language toggle */}
          <div className="absolute top-6 right-8">
            <button
              id="lang-toggle-intro-desktop"
              onClick={toggleLang}
              className="flex items-center gap-1.5 rounded-full border border-ochre-200 bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-brand-50"
            >
              {lang === 'mr' ? 'English' : 'मराठी'}
            </button>
          </div>

          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="flex h-13 w-13 items-center justify-center rounded-xl bg-brand-700 shadow-lg" style={{ width: '3.25rem', height: '3.25rem' }}>
              <Sprout className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-brand-700">{t('appName')}</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-bold text-ink leading-tight mb-4">{t('tagline')}</h1>
          <p className="text-base text-muted mb-10 leading-relaxed max-w-md">
            {lang === 'mr'
              ? 'दररोज एक स्मार्ट शेत निर्णय — हवामान, बाजार, आणि कीड नियंत्रण एकत्र.'
              : 'One smart farm decision every day — weather, market prices, and pest control, combined.'}
          </p>

          <div className="space-y-4 mb-12">
            {values.map((v, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-ochre-400" />
                <p className="text-sm text-muted leading-relaxed">{v}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 max-w-xs">
            <button
              id="intro-get-started-desktop"
              onClick={onStart}
              className="btn-primary w-full text-base py-4 shadow-md hover:shadow-lg transition-shadow"
            >
              {t('getStarted')}
            </button>
            <button
              id="intro-login-desktop"
              onClick={onLogin}
              className="w-full text-center text-sm font-semibold text-brand-700 hover:text-brand-800 py-2 transition-colors"
            >
              {t('switchToLogin')}
            </button>
          </div>
        </div>

        {/* Right illustration panel */}
        <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-green-50 to-ochre-50" />
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-200/30 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-ochre-200/25 blur-2xl" />
          <FarmIllustration className="absolute inset-0 w-full h-full object-contain p-8" />

          {/* Floating badge */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3.5 shadow-lg border border-ochre-100 text-center whitespace-nowrap">
            <p className="text-xs text-muted font-medium">
              {lang === 'mr' ? '१०,०००+ शेतकरी विश्वास ठेवतात' : '10,000+ farmers trust us'}
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
      </div>
    </div>
  );
}
