import { Volume2, Droplet, Sun, Bug, IndianRupee, Sprout } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import { ConfidenceBadge } from '@/components/shared/ConfidenceBadge';
import type { Decision } from '@/types';

const urgencyConfig: Record<
  Decision['urgency'],
  { bg: string; border: string; icon: string; text: string }
> = {
  now: { bg: 'bg-urgent/5', border: 'border-urgent/30', icon: 'bg-urgent/10 text-urgent', text: 'text-urgent' },
  monitor: { bg: 'bg-warning/5', border: 'border-warning/30', icon: 'bg-warning/10 text-warning', text: 'text-warning' },
  safe: { bg: 'bg-positive/5', border: 'border-positive/30', icon: 'bg-positive/10 text-positive', text: 'text-positive' },
};

const iconMap: Record<string, LucideIcon> = {
  droplet: Droplet,
  sun: Sun,
  bug: Bug,
  rupee: IndianRupee,
  sprout: Sprout,
};

interface Props {
  decision: Decision;
  onListen: () => void;
}

export function DecisionCard({ decision, onListen }: Props) {
  const { t } = useLang();
  const cfg = urgencyConfig[decision.urgency];
  const Icon = iconMap[decision.icon] ?? Droplet;

  return (
    <div className={`rounded-2xl border-2 ${cfg.border} ${cfg.bg} p-5 lg:p-6`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">
            {t('todayAction')}
          </span>
        </div>
        <ConfidenceBadge level={decision.confidence} />
      </div>

      <div className="flex items-start gap-4">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${cfg.icon}`}>
          <Icon className="h-7 w-7" strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className={`text-2xl lg:text-3xl font-bold leading-tight ${cfg.text}`}>
            {decision.headline}
          </h2>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          onClick={onListen}
          className="flex items-center gap-2 rounded-xl bg-white border border-ochre-200 px-4 py-2.5 font-medium text-brand-700 transition-colors hover:bg-brand-50"
        >
          <Volume2 className="h-5 w-5" />
          {t('listen')}
        </button>
        <span className="text-xs text-muted">
          {t('lastUpdated')}: {decision.updatedAt}
        </span>
      </div>
    </div>
  );
}
