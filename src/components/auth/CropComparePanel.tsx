import { X, TrendingUp, TrendingDown, Minus, Droplets, Clock, TrendingUpIcon } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import { cropCandidates } from '@/data/mockData';
import type { CropCandidate, CropEntry } from '@/types';

interface Props {
  onSelect: (crop: CropEntry) => void;
  onClose: () => void;
}

function TrendBadge({ trend, note, lang }: { trend: CropCandidate['priceTrend']; note: string; lang: string }) {
  const config = {
    up: { icon: TrendingUp, color: 'text-positive bg-green-50 border-green-200', label: '↑' },
    down: { icon: TrendingDown, color: 'text-urgent bg-red-50 border-red-200', label: '↓' },
    stable: { icon: Minus, color: 'text-muted bg-ochre-50 border-ochre-200', label: '→' },
  }[trend];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${config.color}`}>
      <Icon className="h-3 w-3" />
      {note}
    </span>
  );
}

export function CropComparePanel({ onSelect, onClose }: Props) {
  const { lang, t } = useLang();

  const handleSelect = (c: CropCandidate) => {
    onSelect({
      name: lang === 'mr' ? c.nameMr : c.nameEn,
      variety: '',
      sowingDate: '',
    });
    onClose();
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t('compareCrops')}
    >
      {/* Scrim */}
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet / modal */}
      <div className="relative z-10 w-full sm:max-w-3xl bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-start justify-between p-5 pb-3 border-b border-ochre-100">
          <div>
            <h2 className="text-lg font-bold text-ink">{t('compareCrops')}</h2>
            <p className="text-sm text-muted mt-0.5">{t('compareCropsHint')}</p>
          </div>
          <button
            id="compare-close-btn"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-ochre-100 transition-colors text-muted ml-4 shrink-0 mt-0.5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Horizontally scrollable cards */}
        <div className="overflow-y-auto flex-1 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {cropCandidates.map((c) => (
              <div
                key={c.id}
                className="card p-4 flex flex-col gap-3 hover:shadow-md transition-shadow"
              >
                {/* Crop header */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{c.emoji}</span>
                  <div>
                    <p className="font-bold text-ink leading-tight">
                      {lang === 'mr' ? c.nameMr : c.nameEn}
                    </p>
                    <p className="text-xs text-muted">
                      {lang === 'mr' ? c.nameEn : c.nameMr}
                    </p>
                  </div>
                </div>

                {/* Stats grid */}
                <div className="space-y-2 text-sm">
                  {/* Profit */}
                  <div className="flex items-start gap-2">
                    <TrendingUpIcon className="h-3.5 w-3.5 text-positive mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted leading-none mb-0.5">{t('profitRange')}</p>
                      <p className="font-semibold text-positive text-xs leading-tight">{c.profitRange}</p>
                    </div>
                  </div>

                  {/* Water */}
                  <div className="flex items-start gap-2">
                    <Droplets className="h-3.5 w-3.5 text-brand-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted leading-none mb-0.5">{t('waterReq')}</p>
                      <p className="font-medium text-ink text-xs leading-tight">{c.waterReq}</p>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="flex items-start gap-2">
                    <Clock className="h-3.5 w-3.5 text-ochre-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted leading-none mb-0.5">{t('duration')}</p>
                      <p className="font-medium text-ink text-xs leading-tight">{c.duration}</p>
                    </div>
                  </div>

                  {/* Price trend */}
                  <div>
                    <p className="text-xs text-muted mb-1">{t('priceTrend')}</p>
                    <TrendBadge trend={c.priceTrend} note={c.priceNote} lang={lang} />
                  </div>
                </div>

                {/* Select CTA */}
                <button
                  id={`select-crop-${c.id}`}
                  onClick={() => handleSelect(c)}
                  className="mt-auto btn-primary w-full py-2.5 text-sm"
                >
                  {t('selectThisCrop')}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-ochre-100 p-4 text-center">
          <button
            id="compare-manual-btn"
            onClick={onClose}
            className="text-sm font-semibold text-brand-700 hover:underline"
          >
            {t('typeManually')} →
          </button>
        </div>
      </div>
    </div>
  );
}
