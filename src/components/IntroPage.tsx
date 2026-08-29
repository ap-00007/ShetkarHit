import { useLang } from '@/context/LangContext';
import { Sprout, Volume2 } from 'lucide-react';
import type { Lang } from '@/types';

interface Props {
  onStart: () => void;
  onLogin: () => void;
}

export function IntroPage({ onStart, onLogin }: Props) {
  const { lang, toggleLang, t } = useLang();

  const values = [t('introValue1'), t('introValue2'), t('introValue3')];

  return (
    <div className="min-h-screen bg-cream">
      {/* Language toggle top-right */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 rounded-full border border-ochre-200 bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-brand-50"
        >
          {lang === 'mr' ? 'English' : 'मराठी'}
        </button>
      </div>

      <div className="mx-auto flex min-h-screen max-w-6xl flex-col lg:flex-row lg:items-center">
        {/* Left panel */}
        <div className="flex flex-col justify-center px-6 py-12 lg:w-[55%] lg:pr-12 lg:pl-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-700">
              <Sprout className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-brand-700">{t('appName')}</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-ink leading-tight mb-6">
            {t('tagline')}
          </h1>

          <div className="space-y-3 mb-8">
            {values.map((v, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ochre-400" />
                <p className="text-base text-muted leading-relaxed">{v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — auth card preview */}
        <div className="flex justify-center px-6 pb-12 lg:w-[45%] lg:items-center lg:pb-12">
          <div className="w-full max-w-sm card p-8">
            <h2 className="text-xl font-bold text-ink mb-1">
              {lang === 'mr' ? 'सुरुवात करा' : 'Get started'}
            </h2>
            <p className="text-sm text-muted mb-6">
              {lang === 'mr'
                ? 'तुमच्या शेतासाठी आजचा सल्ला मिळवा'
                : "Get today's advice for your farm"}
            </p>

            <button onClick={onStart} className="btn-primary w-full mb-3">
              {t('getStarted')}
            </button>
            <button
              onClick={onLogin}
              className="w-full text-center text-sm font-medium text-brand-700 hover:underline"
            >
              {t('alreadyAccount')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
