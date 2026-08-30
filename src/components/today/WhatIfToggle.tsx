import { useState, useEffect } from 'react';
import { useLang } from '@/context/LangContext';
import type { WhatIfToggle } from '@/types';

interface Props {
  toggles?: WhatIfToggle[];
}

export function WhatIfToggle({ toggles: initialToggles = [] }: Props) {
  const { t } = useLang();
  const [toggles, setToggles] = useState<WhatIfToggle[]>(initialToggles);
  const [, setChangedImpact] = useState<string | null>(null);

  useEffect(() => {
    setToggles(initialToggles);
  }, [initialToggles]);

  if (!toggles || toggles.length === 0) return null;

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
                type="button"
                role="switch"
                aria-checked={tg.enabled}
                onClick={() => handleToggle(tg.id)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  tg.enabled ? 'bg-brand-700' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    tg.enabled ? 'translate-x-5' : 'translate-x-0'
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
