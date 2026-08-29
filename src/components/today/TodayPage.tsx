import { useState } from 'react';
import { useLang } from '@/context/LangContext';
import { DecisionCard } from './DecisionCard';
import { WhyExpandable } from './WhyExpandable';
import { ThreeDayForecast } from './ThreeDayForecast';
import { ProfitOutlook, MarketSnapshot } from './ProfitAndMarket';
import { WhatIfToggle } from './WhatIfToggle';
import { decision } from '@/data/mockData';

export function TodayPage() {
  const { t } = useLang();
  const [crops] = useState(['Onion', 'Cotton']);
  const [activeCrop, setActiveCrop] = useState('Onion');

  const handleListen = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        `${decision.headline}. ${decision.reason}`
      );
      utterance.lang = 'mr-IN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="px-4 py-5 lg:px-8 lg:py-7 max-w-6xl mx-auto">
      {/* Greeting bar */}
      <div className="mb-5">
        <h1 className="text-2xl lg:text-3xl font-bold text-ink">
          {t('greeting')}
        </h1>
        <p className="text-sm text-muted mt-0.5">{t('farmInfo')}</p>
      </div>

      {/* Crop selector chips */}
      <div className="mb-5 flex gap-2">
        {crops.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCrop(c)}
            className={`chip ${activeCrop === c ? 'chip-active' : 'chip-inactive'}`}
          >
            {c === 'Onion' ? 'कांदा' : 'कापूस'}
          </button>
        ))}
      </div>

      {/* Desktop: two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Left column — decision + why + what-if */}
        <div className="lg:col-span-3 space-y-4">
          <DecisionCard decision={decision} onListen={handleListen} />
          <WhyExpandable />
          <WhatIfToggle />
        </div>

        {/* Right column — forecast + profit + market */}
        <div className="lg:col-span-2 space-y-4">
          <ThreeDayForecast />
          <ProfitOutlook />
          <MarketSnapshot />
        </div>
      </div>
    </div>
  );
}
