import { useState, useEffect } from 'react';
import { Bell, Globe, Loader2 } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import { DecisionCard } from './DecisionCard';
import { WhyExpandable } from './WhyExpandable';
import { ThreeDayForecast } from './ThreeDayForecast';
import { ProfitOutlook, MarketSnapshot } from './ProfitAndMarket';
import { WhatIfToggle } from './WhatIfToggle';
import type { OnboardingResult } from '@/components/auth/OnboardingPage';
import type { Decision, ForecastDay, MarketPrice, ProfitOutlook as ProfitOutlookType, WhatIfToggle as WhatIfToggleType } from '@/types';

interface TodayApiResponse {
  decision: Decision;
  whatIfs: WhatIfToggleType[];
  forecast: ForecastDay[];
  profitOutlook: ProfitOutlookType;
  marketPrices: MarketPrice[];
}

export function TodayPage({ farmProfile }: { farmProfile?: OnboardingResult | null }) {
  const { lang, toggleLang, t } = useLang();

  const cropList = farmProfile?.crops.filter((c) => c.name.trim() !== '') ?? [];
  const [activeCrop, setActiveCrop] = useState(cropList[0]?.name ?? '');
  const [data, setData] = useState<TodayApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync activeCrop if cropList changes
  useEffect(() => {
    if (cropList[0]?.name && !activeCrop) {
      setActiveCrop(cropList[0].name);
    }
  }, [cropList, activeCrop]);

  // Fetch live advisory data on profile, crop, or language change
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch('/api/today', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        farmProfile: farmProfile || {
          name: 'शेतकरी मित्र',
          village: 'Kopargaon',
          district: 'Ahmednagar',
          acres: '4',
          crops: [{ name: activeCrop || 'Onion' }],
        },
        lang,
        activeCrop: activeCrop || cropList[0]?.name,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch today data');
        return res.json();
      })
      .then((json: TodayApiResponse) => {
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('[TodayPage]', err);
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [farmProfile, lang, activeCrop]);

  const greetingName = farmProfile?.name
    ? (lang === 'mr' ? `नमस्कार, ${farmProfile.name} 👋` : `Hello, ${farmProfile.name} 👋`)
    : t('greeting');

  const farmInfo = farmProfile
    ? [
        farmProfile.acres ? `${farmProfile.acres} ${lang === 'mr' ? 'एकर' : 'acres'}` : '',
        farmProfile.village || '',
      ].filter(Boolean).join(' · ')
    : t('farmInfo');

  const handleListen = () => {
    if (data?.decision && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`${data.decision.headline}. ${data.decision.reason}`);
      utterance.lang = lang === 'en' ? 'en-IN' : lang === 'hi' ? 'hi-IN' : 'mr-IN';
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

      {/* Loading Skeleton */}
      {loading && !data && (
        <div className="flex flex-col items-center justify-center py-20 text-muted gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-brand-700" />
          <p className="text-sm font-medium">
            {lang === 'mr' ? 'हवामान व सल्ला माहिती आणत आहे...' : lang === 'hi' ? 'मौसम व सलाह जानकारी लोड हो रही है...' : 'Fetching live weather & advisory...'}
          </p>
        </div>
      )}

      {/* ── Two-column layout ── */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 animate-fade-in">
          {/* Left — decision + why + what-if */}
          <div className="lg:col-span-3 space-y-4">
            {data.decision && (
              <DecisionCard decision={data.decision} onListen={handleListen} />
            )}
            {data.decision?.reason && (
              <WhyExpandable reason={data.decision.reason} />
            )}
            {data.whatIfs && (
              <WhatIfToggle toggles={data.whatIfs} />
            )}
          </div>

          {/* Right — forecast + profit + market */}
          <div className="lg:col-span-2 space-y-4">
            {data.forecast && (
              <ThreeDayForecast forecast={data.forecast} />
            )}
            {data.profitOutlook && (
              <ProfitOutlook profitOutlook={data.profitOutlook} />
            )}
            {data.marketPrices && (
              <MarketSnapshot marketPrices={data.marketPrices} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
