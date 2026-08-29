import { useState } from 'react';
import { useLang } from '@/context/LangContext';
import { Sprout, MapPin, Wheat, ChevronRight, Check } from 'lucide-react';
import { FarmIllustration } from './FarmIllustration';

export interface OnboardingResult {
  acres: string;
  village: string;
  district: string;
  crop: string;
}

interface Props {
  onDone: (data: OnboardingResult) => void;
  onSkip: () => void;
}

const CROPS = [
  { id: 'onion', mr: 'कांदा', en: 'Onion', emoji: '🧅' },
  { id: 'cotton', mr: 'कापूस', en: 'Cotton', emoji: '🌿' },
  { id: 'wheat', mr: 'गहू', en: 'Wheat', emoji: '🌾' },
  { id: 'soybean', mr: 'सोयाबीन', en: 'Soybean', emoji: '🫘' },
  { id: 'sugarcane', mr: 'ऊस', en: 'Sugarcane', emoji: '🎋' },
  { id: 'tomato', mr: 'टोमॅटो', en: 'Tomato', emoji: '🍅' },
];

export function OnboardingPage({ onDone, onSkip }: Props) {
  const { lang, toggleLang, t } = useLang();
  const [step, setStep] = useState(0); // 0, 1, 2
  const [acres, setAcres] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [crop, setCrop] = useState('');

  const totalSteps = 3;

  const handleNext = () => {
    if (step < totalSteps - 1) setStep((s) => s + 1);
    else {
      onDone({ acres, village, district, crop });
    }
  };

  const canProceed =
    (step === 0 && acres.trim() !== '') ||
    (step === 1 && village.trim() !== '') ||
    (step === 2 && crop !== '');

  const stepTitles = [t('onboardingStep1Title'), t('onboardingStep2Title'), t('onboardingStep3Title')];
  const stepIcons = [Wheat, MapPin, Sprout];
  const StepIcon = stepIcons[step];

  return (
    <div className="min-h-screen bg-cream flex flex-col lg:flex-row overflow-hidden">
      {/* Illustration side */}
      <div className="hidden lg:flex lg:w-[42%] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-green-50 to-ochre-50" />
        <div className="absolute -top-16 -left-16 h-72 w-72 rounded-full bg-brand-200/25 blur-3xl" />
        <FarmIllustration className="relative z-10 w-full h-full p-6" />

        {/* Brand */}
        <div className="absolute top-6 left-6 flex items-center gap-2 z-20">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-700 shadow-md">
            <Sprout className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-brand-700">{t('appName')}</span>
        </div>

        {/* Welcome card overlay */}
        <div className="absolute bottom-8 left-6 right-6 z-20 card p-5 shadow-lg">
          <p className="text-sm font-bold text-brand-700 mb-1">{t('onboardingWelcome')}</p>
          <p className="text-xs text-muted leading-relaxed">{t('onboardingSubtitle')}</p>
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

        {/* Language desktop */}
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
            {/* Welcome headline */}
            <div className="mb-6 lg:hidden">
              <p className="text-lg font-bold text-brand-700 mb-1">{t('onboardingWelcome')}</p>
              <p className="text-sm text-muted">{t('onboardingSubtitle')}</p>
            </div>

            {/* Progress dots */}
            <div className="flex items-center gap-2 mb-6">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === step
                      ? 'w-8 bg-brand-700'
                      : i < step
                      ? 'w-4 bg-brand-400'
                      : 'w-4 bg-ochre-200'
                  }`}
                />
              ))}
              <span className="ml-auto text-xs text-muted font-medium">
                {step + 1} / {totalSteps}
              </span>
            </div>

            {/* Step card */}
            <div className="card p-8 shadow-md">
              {/* Step icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 mb-5">
                <StepIcon className="h-6 w-6 text-brand-700" />
              </div>

              <h2 className="text-xl font-bold text-ink mb-6">{stepTitles[step]}</h2>

              {/* Step 1: Acres */}
              {step === 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-ink mb-1.5">
                    {t('acresLabel')}
                  </label>
                  <div className="relative">
                    <input
                      id="onboarding-acres"
                      type="number"
                      min="0"
                      step="0.5"
                      value={acres}
                      onChange={(e) => setAcres(e.target.value)}
                      placeholder={lang === 'mr' ? 'उदा. ४' : 'e.g. 4'}
                      className="input-field pr-16"
                      inputMode="decimal"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted font-medium">
                      {lang === 'mr' ? 'एकर' : 'acres'}
                    </span>
                  </div>

                  {/* Quick-pick chips */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {['1', '2', '4', '5', '10'].map((v) => (
                      <button
                        key={v}
                        onClick={() => setAcres(v)}
                        className={`chip text-xs ${acres === v ? 'chip-active' : 'chip-inactive'}`}
                      >
                        {v} {lang === 'mr' ? 'एकर' : 'ac'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Location */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-1.5">
                      {t('villageLabel')}
                    </label>
                    <input
                      id="onboarding-village"
                      type="text"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      placeholder={lang === 'mr' ? 'उदा. कोपरगाव' : 'e.g. Kopargaon'}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-1.5">
                      {t('districtLabel')}
                    </label>
                    <input
                      id="onboarding-district"
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder={lang === 'mr' ? 'उदा. अहमदनगर' : 'e.g. Ahmednagar'}
                      className="input-field"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Crop selector */}
              {step === 2 && (
                <div className="grid grid-cols-2 gap-3">
                  {CROPS.map((c) => (
                    <button
                      key={c.id}
                      id={`crop-${c.id}`}
                      onClick={() => setCrop(c.id)}
                      className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all ${
                        crop === c.id
                          ? 'border-brand-700 bg-brand-50'
                          : 'border-ochre-200 bg-white hover:border-brand-300'
                      }`}
                    >
                      <span className="text-xl">{c.emoji}</span>
                      <div>
                        <p className={`text-sm font-semibold ${crop === c.id ? 'text-brand-700' : 'text-ink'}`}>
                          {lang === 'mr' ? c.mr : c.en}
                        </p>
                      </div>
                      {crop === c.id && (
                        <Check className="ml-auto h-4 w-4 text-brand-700 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* CTA */}
              <button
                id={step === totalSteps - 1 ? 'onboarding-done-btn' : 'onboarding-next-btn'}
                onClick={handleNext}
                disabled={!canProceed}
                className={`mt-7 btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2 shadow-sm transition-all ${
                  !canProceed ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'
                }`}
              >
                {step === totalSteps - 1 ? t('doneBtn') : t('nextBtn')}
                {step < totalSteps - 1 && <ChevronRight className="h-4 w-4" />}
              </button>

              {/* Skip */}
              <button
                id="onboarding-skip-btn"
                onClick={onSkip}
                className="mt-3 w-full text-center text-sm text-muted hover:text-ink transition-colors py-1"
              >
                {t('onboardingSkip')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
