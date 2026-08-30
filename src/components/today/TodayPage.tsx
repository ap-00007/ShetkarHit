import { useState } from 'react';
import { Bell, Globe } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import { DecisionCard } from './DecisionCard';
import { WhyExpandable } from './WhyExpandable';
import { ThreeDayForecast } from './ThreeDayForecast';
import { ProfitOutlook, MarketSnapshot } from './ProfitAndMarket';
import { WhatIfToggle } from './WhatIfToggle';
import type { OnboardingResult } from '@/components/auth/OnboardingPage';

export function TodayPage({ farmProfile }: { farmProfile?: OnboardingResult | null }) {
  const { lang, toggleLang, t } = useLang();

  const cropList = farmProfile?.crops.filter((c) => c.name.trim() !== '') ?? [];
  const [activeCrop, setActiveCrop] = useState(cropList[0]?.name ?? '');

  const greetingName = farmProfile?.name
    ? (lang === 'mr' ? `नमस्कार, ${farmProfile.name} 👋` : `Hello, ${farmProfile.name} 👋`)
    : t('greeting');

  const farmInfo = farmProfile
    ? [
        farmProfile.acres ? `${farmProfile.acres} ${lang === 'mr' ? 'एकर' : 'acres'}` : '',
        farmProfile.village || '',
      ].filter(Boolean).join(' · ')
    : t('farmInfo');

  const handleListen = (headline: string, reason: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`${headline}. ${reason}`);
      utterance.lang = 'mr-IN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="px-4 py-5 lg:px-8 lg:py-7 max-w-6xl mx-auto">

      {/* ── Top bar: greeting + controls ── */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="min-w-0">
          <h1 className="text-2xl lg:text-3xl font-bold text-ink truncate">{greetingName}</h1>
          <p className="text-sm text-muted mt-0.5">{farmInfo}</p>
        </div>

        {/* Right controls — desktop only (mobile top bar handles these) */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <button
            id="today-lang-btn"
            onClick={toggleLang}
            className="flex items-center gap-1.5 rounded-full border border-ochre-200 bg-white px-3 py-1.5 text-sm font-medium text-ink hover:bg-brand-50 transition-colors"
          >
            <Globe className="h-4 w-4" />
            {lang === 'mr' ? 'EN' : 'मर'}
          </button>
          <button
            id="today-bell-btn"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ochre-200 bg-white hover:bg-brand-50 transition-colors text-muted relative"
            aria-label="Notifications"
          >
            <Bell className="h-4.5 w-4.5" style={{ width: '1.125rem', height: '1.125rem' }} />
            {/* Red dot */}
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-urgent border border-white" />
          </button>
        </div>
      </div>

      {/* ── Crop selector chips ── */}
      {cropList.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2">
          {cropList.map((c) => (
            <button
              key={c.name}
              onClick={() => setActiveCrop(c.name)}
              className={`chip ${activeCrop === c.name ? 'chip-active' : 'chip-inactive'}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* ── Two-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Left — decision + why + what-if */}
        <div className="lg:col-span-3 space-y-4">
          {/* Decision card — only shown when real data arrives */}
          <WhyExpandable />
          <WhatIfToggle />
        </div>

        {/* Right — forecast + profit + market */}
        <div className="lg:col-span-2 space-y-4">
          <ThreeDayForecast />
          <ProfitOutlook />
          <MarketSnapshot />
        </div>
      </div>
    </div>
  );
}
