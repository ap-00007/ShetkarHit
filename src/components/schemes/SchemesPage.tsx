import { useState } from 'react';
import { Search, ChevronDown, Award, Filter } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import type { Scheme } from '@/types';

const relevanceConfig: Record<
  Scheme['relevance'],
  { tag?: string; bg: string; text: string; border: string; label: string }
> = {
  high: {
    bg: 'bg-warning/10',
    text: 'text-warning',
    border: 'border-warning/30',
    label: 'highRelevance',
  },
  medium: {
    bg: 'bg-brand-50',
    text: 'text-brand-700',
    border: 'border-brand-200',
    label: 'mediumRelevance',
  },
  low: {
    bg: 'bg-cream',
    text: 'text-muted',
    border: 'border-ochre-200',
    label: 'mediumRelevance',
  },
};

function SchemeCard({ scheme }: { scheme: Scheme }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const cfg = relevanceConfig[scheme.relevance];

  return (
    <div className={`card border ${cfg.border} overflow-hidden transition-shadow hover:shadow-md`}>
      <div className="p-5">
        {/* Relevance badge */}
        <div className="mb-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full ${cfg.bg} ${cfg.text} px-3 py-1 text-xs font-semibold`}
          >
            {scheme.relevance === 'high' && <Award className="h-3.5 w-3.5" />}
            {t(cfg.label as any)}
          </span>
        </div>

        <h3 className="font-bold text-ink text-base mb-1.5 leading-snug">{scheme.name}</h3>
        <p className="text-sm text-muted leading-relaxed">{scheme.summary}</p>

        {/* Learn more toggle */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="mt-4 flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800 transition-colors"
        >
          {open ? t('cancel') : t('learnMore')}
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Expanded detail */}
      {open && (
        <div className="border-t border-ochre-100 bg-cream/60 px-5 py-4 animate-fade-in">
          <p className="text-sm text-muted leading-relaxed mb-4">{scheme.detail}</p>
          <button
            id={`apply-${scheme.id}`}
            className="btn-primary w-full text-sm py-2.5"
          >
            {t('applyNow')} →
          </button>
        </div>
      )}
    </div>
  );
}

export function SchemesPage() {
  const { t, lang } = useLang();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'high' | 'medium'>('all');

  // No static schemes — will be populated from real API
  const allSchemes: Scheme[] = [];

  const filtered = allSchemes.filter((s) => {
    const matchesQuery =
      !query ||
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.summary.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === 'all' || s.relevance === filter;
    return matchesQuery && matchesFilter;
  });

  return (
    <div className="px-4 py-5 lg:px-8 lg:py-7 max-w-5xl mx-auto">
      <h1 className="text-2xl lg:text-3xl font-bold text-ink mb-1">
        {t('schemesTitle')}
      </h1>
      <p className="text-sm text-muted mb-6">{t('schemesSubtitle')}</p>

      {/* Search + filter row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            id="schemes-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === 'mr' ? 'योजना शोधा...' : 'Search schemes...'}
            className="input-field pl-10"
          />
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 shrink-0">
          <Filter className="h-4 w-4 text-muted shrink-0" />
          {(['all', 'high', 'medium'] as const).map((f) => (
            <button
              key={f}
              id={`filter-${f}`}
              onClick={() => setFilter(f)}
              className={`chip text-xs ${filter === f ? 'chip-active' : 'chip-inactive'}`}
            >
              {f === 'all'
                ? (lang === 'mr' ? 'सर्व' : 'All')
                : f === 'high'
                ? t('highRelevance')
                : t('mediumRelevance')}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((s) => (
            <SchemeCard key={s.id} scheme={s} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted text-sm">
            {lang === 'mr' ? 'कोणतीही योजना उपलब्ध नाही.' : 'No schemes available yet.'}
          </p>
          {query || filter !== 'all' ? (
            <button
              onClick={() => { setQuery(''); setFilter('all'); }}
              className="mt-3 text-sm font-semibold text-brand-700 hover:underline"
            >
              {lang === 'mr' ? 'सर्व पाहा' : 'View all'}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
