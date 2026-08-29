import { useLang } from '@/context/LangContext';
import type { Confidence } from '@/types';

export function ConfidenceBadge({ level }: { level: Confidence }) {
  const { t } = useLang();

  const styles = {
    high: { bg: 'bg-positive/10', text: 'text-positive', dot: 'bg-positive' },
    medium: { bg: 'bg-warning/10', text: 'text-warning', dot: 'bg-warning' },
    low: { bg: 'bg-urgent/10', text: 'text-urgent', dot: 'bg-urgent' },
  };

  const labels = {
    high: t('confidenceHigh'),
    medium: t('confidenceMedium'),
    low: t('confidenceLow'),
  };

  const s = styles[level];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${s.bg} ${s.text}`}>
      <span className={`h-2 w-2 rounded-full ${s.dot}`} />
      {labels[level]}
    </span>
  );
}
