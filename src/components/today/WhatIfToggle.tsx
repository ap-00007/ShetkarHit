import { useState } from 'react';
import { useLang } from '@/context/LangContext';
import type { WhatIfToggle } from '@/types';

export function WhatIfToggle() {
  const { t } = useLang();
  const [toggles, setToggles] = useState<WhatIfToggle[]>([]);
  const [changedImpact, setChangedImpact] = useState<string | null>(null);

  if (toggles.length === 0) return null;

  const handleToggle = (id: string) => {
    setToggles((prev) =>
      prev.map((tg) => {
        if (tg.id === id) {
          const newEnabled = !tg.enabled;
          if (newEnabled) {
            setChangedImpact(tg.impact);
            setTimeout(() => setChangedImpact(null), 3000);
          }
          return { ...tg, enabled: newEnabled };
        }
        return tg;
      })
    );
  };

  return (
    <div className="card p-4">
      <h3 className="font-semibold text-ink mb-3">{t('whatIf')}</h3>
      <div className="space-y-3">
        {toggles.map((tg) => (
          <div key={tg.id}>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-ink flex-1">{tg.label}</span>
              <button
                onClick={() => handleToggle(tg.id)}
                className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                  tg.enabled ? 'bg-brand-700' : 'bg-gray-200'
                }`}
                aria-pressed={tg.enabled}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                    tg.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            {tg.enabled && (
              <div className="mt-2 rounded-xl bg-warning/10 px-3 py-2.5 animate-slide-up">
                <p className="text-sm text-ink leading-relaxed">{tg.impact}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
