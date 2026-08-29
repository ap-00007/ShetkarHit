import { CloudRain, Cloud } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import { forecast } from '@/data/mockData';
import type { ForecastDay } from '@/types';

const urgencyColors: Record<ForecastDay['urgency'], string> = {
  now: 'text-urgent',
  monitor: 'text-warning',
  safe: 'text-positive',
};

const iconMap: Record<string, typeof CloudRain> = {
  'cloud-rain': CloudRain,
  cloud: Cloud,
};

export function ThreeDayForecast() {
  const { t } = useLang();

  return (
    <div className="card p-4">
      <h3 className="font-semibold text-ink mb-3">{t('next3Days')}</h3>
      <div className="space-y-2">
        {forecast.map((d, i) => {
          const Icon = iconMap[d.icon] ?? Cloud;
          return (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl bg-cream px-3 py-2.5"
            >
              <Icon className="h-5 w-5 text-brand-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between">
                  <span className="font-medium text-ink text-sm">{d.day}</span>
                  <span className="text-xs text-muted">{d.temp}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted">{d.rain}</span>
                  <span className="text-xs text-muted">·</span>
                  <span className={`text-xs font-medium ${urgencyColors[d.urgency]}`}>
                    {d.action}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
