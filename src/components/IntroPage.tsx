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
    <div className="min-h-screen bg-cream overflow-x-hidden">
      {/* ══════════════════════════════════
          Mobile layout (< lg)
          Hero image covers 52% of initial viewport
         ══════════════════════════════════ */}
      <div className="lg:hidden flex flex-col min-h-screen">
        {/* Hero image occupying ~52% of viewport height */}
        <div className="relative w-full h-[52vh] min-h-[300px] max-h-[460px] overflow-hidden">
          <FarmIllustration className="w-full h-full" />

          {/* Top Header Bar Overlay */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm border border-ochre-100/80">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-700">
                <Sprout className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-brand-700 text-sm">{t('appName')}</span>
            </div>

            <button
              id="lang-toggle-intro"
              onClick={toggleLang}
              className="rounded-full border border-ochre-200 bg-white/90 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-ink hover:bg-brand-50 transition-colors shadow-sm"
            >
              {lang === 'mr' ? 'English' : 'मराठी'}
            </button>
          </div>

          {/* Floating trust badge on image */}
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md rounded-xl px-3 py-1.5 shadow-md border border-ochre-100 text-center z-10">
            <p className="text-[10px] text-ink font-semibold leading-tight">
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

        {/* Content card below hero */}
        <div className="flex-1 bg-cream px-6 pt-6 pb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-ink leading-tight mb-2.5">{t('tagline')}</h1>
          <p className="text-sm text-muted leading-relaxed mb-6">
            {lang === 'mr'
              ? 'दररोज एक स्मार्ट शेत निर्णय — हवामान, बाजार, आणि कीड नियंत्रण एकत्र.'
              : 'One smart farm decision every day — weather, market prices, and pest control, combined.'}
          </p>

          {/* Value props */}
          <div className="space-y-2.5 mb-8">
            {values.map((v, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-ochre-400" />
                <p className="text-sm text-muted leading-relaxed">{v}</p>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <button
            id="intro-get-started"
            onClick={onStart}
            className="btn-primary w-full text-base py-3.5 shadow-md mb-3"
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
          Left content (44%) + Right image (56%)
         ══════════════════════════════════ */}
      <div className="hidden lg:flex min-h-screen items-center">
        {/* Left panel (~44% width) */}
        <div className="relative flex flex-col justify-center px-12 xl:px-16 py-12 w-[44%] z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-700 shadow-md">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-brand-700">{t('appName')}</span>
          </div>

          <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-bold text-ink leading-[1.2] mb-4">{t('tagline')}</h1>
          <p className="text-base text-muted mb-8 leading-relaxed max-w-md">
            {lang === 'mr'
              ? 'दररोज एक स्मार्ट शेत निर्णय — हवामान, बाजार, आणि कीड नियंत्रण एकत्र.'
              : 'One smart farm decision every day — weather, market prices, and pest control, combined.'}
          </p>

          <div className="space-y-3.5 mb-10">
            {values.map((v, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-ochre-400" />
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

        {/* Right hero image panel (~56% width, covering 55-60% of viewport) */}
        <div className="w-[56%] h-screen p-5 pl-0 relative flex items-center justify-center">
          <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/70">
            <FarmIllustration className="w-full h-full" />

            {/* Language toggle at top right over image */}
            <div className="absolute top-6 right-6 z-20">
              <button
                id="lang-toggle-intro-desktop"
                onClick={toggleLang}
                className="flex items-center gap-1.5 rounded-full border border-ochre-200 bg-white/90 backdrop-blur-md px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-brand-50 shadow-md"
              >
                {lang === 'mr' ? 'English' : 'मराठी'}
              </button>
            </div>

            {/* Floating Trust Badge over image bottom */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md rounded-2xl px-6 py-3.5 shadow-2xl border border-ochre-100 text-center whitespace-nowrap z-20">
              <p className="text-xs text-ink font-bold">
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
    </div>
  );
}
