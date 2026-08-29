import { useState } from 'react';
import { ChevronDown, Award } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import { schemes as allSchemes } from '@/data/mockData';
import type { Scheme } from '@/types';

const relevanceConfig: Record<
  Scheme['relevance'],
  { tag?: string; bg: string; text: string; border: string }
> = {
  high: { tag: '🥇', bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/30' },
  medium: { bg: 'bg-brand-50', text: 'text-brand-700', border: 'border-brand-200' },
  low: { bg: 'bg-cream', text: 'text-muted', border: 'border-ochre-200' },
};

function SchemeCard({ scheme }: { scheme: Scheme }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const cfg = relevanceConfig[scheme.relevance];

  return (
    <div className={`card border ${cfg.border} overflow-hidden`}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className={`inline-flex items-center gap-1 rounded-full ${cfg.bg} ${cfg.text} px-2.5 py-1 text-xs font-semibold`}>
            {scheme.relevance === 'high' && <Award className="h-3.5 w-3.5" />}
            {scheme.relevance === 'high' ? t('highRelevance') : t('mediumRelevance')}
          </span>
        </div>
        <h3 className="font-bold text-ink text-base mb-1">{scheme.name}</h3>
        <p className="text-sm text-muted leading-relaxed">{scheme.summary}</p>

        <button
          onClick={() => setOpen((o) => !o)}
          className="mt-3 flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline"
        >
          {open ? t('cancel') : t('learnMore')}
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {open && (
        <div className="border-t border-ochre-100 bg-cream px-4 py-3 animate-fade-in">
          <p className="text-sm text-muted leading-relaxed mb-3">{scheme.detail}</p>
          <button className="btn-primary w-full text-sm">
            {t('applyNow')}
          </button>
        </div>
      )}
    </div>
  );
}

export function SchemesPage() {
  const { t } = useLang();

  return (
    <div className="px-4 py-5 lg:px-8 lg:py-7 max-w-6xl mx-auto">
      <h1 className="text-2xl lg:text-3xl font-bold text-ink mb-1">
        {t('schemesTitle')}
      </h1>
      <p className="text-sm text-muted mb-5">{t('schemesSubtitle')}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allSchemes.map((s) => (
          <SchemeCard key={s.id} scheme={s} />
        ))}
      </div>
    </div>
  );
}
