import { useState, useEffect } from 'react';
import { Search, ChevronDown, Award, Filter, Loader2, CheckCircle2, Sparkles } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import type { Scheme } from '@/types';
import type { OnboardingResult } from '@/components/auth/OnboardingPage';

const relevanceConfig: Record<
  Scheme['relevance'],
  { bg: string; text: string; border: string; label: string }
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
  const { t, lang } = useLang();
  const [open, setOpen] = useState(false);
  const cfg = relevanceConfig[scheme.relevance] || relevanceConfig.medium;

  return (
    <div className={`card border ${cfg.border} overflow-hidden transition-shadow hover:shadow-md flex flex-col justify-between`}>
      <div className="p-5">
        {/* Top Badges: Relevance & Eligibility */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full ${cfg.bg} ${cfg.text} px-3 py-1 text-xs font-semibold`}
          >
            {scheme.relevance === 'high' && <Award className="h-3.5 w-3.5" />}
            {t(cfg.label as any)}
          </span>

          {scheme.eligibility && (
            <span className="inline-flex items-center gap-1 rounded-full bg-positive/10 text-positive border border-positive/20 px-2.5 py-1 text-xs font-bold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {scheme.eligibility.badge}
            </span>
          )}
        </div>

        <h3 className="font-bold text-ink text-base mb-1.5 leading-snug">{scheme.name}</h3>
        <p className="text-sm text-muted leading-relaxed mb-3">{scheme.summary}</p>

        {/* Personalized Eligibility Explanation Box */}
        {scheme.eligibility?.reason && (
          <div className="rounded-xl bg-brand-50/70 border border-brand-100 p-3 mb-2">
            <p className="text-xs font-semibold text-brand-900 mb-0.5 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-brand-700" />
              {lang === 'mr' ? 'तुमची पात्रता (Eligibility Reason):' : lang === 'hi' ? 'आपकी पात्रता (Eligibility Reason):' : 'Why You Are Eligible:'}
            </p>
            <p className="text-xs text-brand-800 leading-relaxed">
              {scheme.eligibility.reason}
            </p>
          </div>
        )}

        {/* Learn more toggle */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="mt-2 flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800 transition-colors"
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

interface SchemesPageProps {
  farmProfile?: OnboardingResult | null;
}

export function SchemesPage({ farmProfile }: SchemesPageProps) {
  const { t, lang } = useLang();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'high' | 'medium'>('all');
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [eligibleCount, setEligibleCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Fetch schemes when lang, search query, or profile changes
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const profileQuery = farmProfile ? `&profile=${encodeURIComponent(JSON.stringify(farmProfile))}` : '';
    const searchQuery = query ? `&q=${encodeURIComponent(query)}` : '';
    const url = `/api/schemes?lang=${lang}${profileQuery}${searchQuery}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch schemes');
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setSchemes(data.schemes || []);
          setEligibleCount(data.eligibleCount || 0);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('[SchemesPage]', err);
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [lang, query, farmProfile]);

  const filtered = schemes.filter((s) => {
    return filter === 'all' || s.relevance === filter;
  });

  return (
    <div className="px-4 py-5 lg:px-8 lg:py-7 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-ink">
            {t('schemesTitle')}
          </h1>
          <p className="text-sm text-muted mt-1">{t('schemesSubtitle')}</p>
        </div>
      </div>

      {/* ── Eligibility Overview Banner ── */}
      {eligibleCount > 0 && !loading && (
        <div className="mb-6 card p-4 bg-gradient-to-r from-brand-50 to-green-50/60 border-brand-200 flex items-center gap-3.5 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-white shadow-sm">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-brand-900">
              {lang === 'mr'
                ? `तुमच्या शेताच्या प्रोफाइलनुसार तुम्ही ${eligibleCount} योजनांसाठी पात्र आहात!`
                : lang === 'hi'
                ? `आपकी खेत प्रोफाइल के अनुसार आप ${eligibleCount} सरकारी योजनाओं के लिए पात्र हैं!`
                : `You are eligible for ${eligibleCount} government schemes based on your farm profile!`}
            </p>
            <p className="text-xs text-muted mt-0.5">
              {farmProfile?.acres ? `${farmProfile.acres} ${lang === 'mr' ? 'एकर' : 'acres'}` : ''}
              {farmProfile?.village ? ` · ${farmProfile.village}` : ''}
              {farmProfile?.waterSource ? ` · ${farmProfile.waterSource}` : ''}
            </p>
          </div>
        </div>
      )}

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
            placeholder={lang === 'mr' ? 'योजना किंवा पात्रता शोधा...' : lang === 'hi' ? 'योजना या पात्रता खोजें...' : 'Search schemes or eligibility...'}
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
                ? (lang === 'mr' ? 'सर्व' : lang === 'hi' ? 'सभी' : 'All')
                : f === 'high'
                ? t('highRelevance')
                : t('mediumRelevance')}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading && schemes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-brand-700" />
          <p className="text-sm font-medium">
            {lang === 'mr' ? 'योजना व पात्रता तपासत आहे...' : lang === 'hi' ? 'योजनाएं व पात्रता जांची जा रही हैं...' : 'Calculating scheme eligibility...'}
          </p>
        </div>
      )}

      {/* Results */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {filtered.map((s) => (
            <SchemeCard key={s.id} scheme={s} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted text-sm">
            {lang === 'mr' ? 'कोणतीही योजना सापडली नाही.' : lang === 'hi' ? 'कोई योजना नहीं मिली।' : 'No schemes found.'}
          </p>
          {query || filter !== 'all' ? (
            <button
              onClick={() => { setQuery(''); setFilter('all'); }}
              className="mt-3 text-sm font-semibold text-brand-700 hover:underline"
            >
              {lang === 'mr' ? 'सर्व पाहा' : lang === 'hi' ? 'सभी देखें' : 'View all'}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
