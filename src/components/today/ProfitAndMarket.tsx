import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import { profitOutlook, marketPrices } from '@/data/mockData';
import type { MarketPrice } from '@/types';

const statusConfig = {
  positive: { bg: 'bg-positive/10', text: 'text-positive', icon: TrendingUp },
  neutral: { bg: 'bg-warning/10', text: 'text-warning', icon: Minus },
  negative: { bg: 'bg-urgent/10', text: 'text-urgent', icon: TrendingDown },
};

const trendIcons: Record<MarketPrice['trend'], { icon: typeof TrendingUp; color: string }> = {
  up: { icon: TrendingUp, color: 'text-positive' },
  down: { icon: TrendingDown, color: 'text-urgent' },
  stable: { icon: Minus, color: 'text-muted' },
};

export function ProfitOutlook() {
  const { t } = useLang();
  const cfg = statusConfig[profitOutlook.status];
  const Icon = cfg.icon;

  return (
    <div className="card p-4">
      <h3 className="font-semibold text-ink mb-3">{t('profitOutlook')}</h3>
      <div className={`flex items-center gap-3 rounded-xl ${cfg.bg} px-3 py-3`}>
        <Icon className={`h-6 w-6 ${cfg.text} shrink-0`} />
        <div className="flex-1 min-w-0">
          <p className={`text-lg font-bold ${cfg.text}`}>{profitOutlook.estProfit}</p>
          <p className="text-xs text-muted mt-0.5">{t('estProfit')}</p>
        </div>
      </div>
      <p className="mt-2 text-xs text-muted leading-relaxed">{profitOutlook.note}</p>
    </div>
  );
}

export function MarketSnapshot() {
  const { t } = useLang();

  return (
    <div className="card p-4">
      <h3 className="font-semibold text-ink mb-3">{t('marketSnapshot')}</h3>
      <div className="space-y-2">
        {marketPrices.map((m, i) => {
          const TrendIcon = trendIcons[m.trend].icon;
          return (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl bg-cream px-3 py-2.5"
            >
              <div>
                <p className="font-medium text-ink text-sm">{m.crop}</p>
                <p className="text-xs text-muted">/{m.unit}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-ink">{m.price}</span>
                <span className={`flex items-center text-xs font-medium ${trendIcons[m.trend].color}`}>
                  <TrendIcon className="h-3.5 w-3.5" />
                  {m.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
