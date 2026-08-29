import { useState } from 'react';
import { Globe, LogOut, Mic, Plus, ChevronRight } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import { profile } from '@/data/mockData';
import { ProfileSection, ProfileSectionWithChildren } from './ProfileSection';
import { CropComparePanel } from '@/components/auth/CropComparePanel';
import type { CropEntry } from '@/types';

/* ─── Milestoned progress bar ─── */
const MILESTONES = [
  'milestonePersonal',
  'milestoneLocation',
  'milestoneFarm',
  'milestoneCrop',
  'milestoneSoil',
  'milestoneAll',
] as const;

function MilestonedBar({ pct, labels }: { pct: number; labels: string[] }) {
  // Each milestone is at 0%, 20%, 40%, 60%, 80%, 100%
  const filledCount = Math.round((pct / 100) * (labels.length - 1));
  return (
    <div className="px-1">
      {/* Track */}
      <div className="relative h-2 rounded-full bg-ochre-100 mb-2.5">
        <div
          className="absolute h-full rounded-full bg-brand-600 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
        {/* Tick marks */}
        {labels.map((_, i) => {
          const pos = (i / (labels.length - 1)) * 100;
          const filled = i <= filledCount;
          return (
            <div
              key={i}
              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-4 w-4 rounded-full border-2 transition-all ${
                filled
                  ? 'bg-brand-600 border-brand-600'
                  : 'bg-white border-ochre-200'
              }`}
              style={{ left: `${pos}%` }}
            />
          );
        })}
      </div>
      {/* Labels */}
      <div className="flex justify-between">
        {labels.map((label, i) => {
          const filled = i <= filledCount;
          return (
            <span
              key={i}
              className={`text-[10px] font-medium transition-colors ${
                filled ? 'text-brand-700' : 'text-muted'
              }`}
              style={{
                width: `${100 / labels.length}%`,
                textAlign: i === 0 ? 'left' : i === labels.length - 1 ? 'right' : 'center',
              }}
            >
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Settings row ─── */
function SettingsRow({
  icon: Icon,
  label,
  value,
  onClick,
  className = '',
  children,
}: {
  icon: React.ElementType;
  label: string;
  value?: string;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center justify-between px-4 py-3 rounded-xl hover:bg-brand-50 transition-colors text-left ${className}`}
    >
      <span className="flex items-center gap-3 text-sm font-medium text-ink">
        <Icon className="h-5 w-5 text-muted group-hover:text-brand-600 transition-colors" />
        {label}
      </span>
      <span className="flex items-center gap-1 text-sm text-muted">
        {children ?? value}
        {onClick && <ChevronRight className="h-3.5 w-3.5 opacity-40" />}
      </span>
    </button>
  );
}

/* ═══════════════════════════════════════
   AccountPage
═══════════════════════════════════════ */
export function AccountPage() {
  const { t, lang, toggleLang } = useLang();
  const [voiceOn, setVoiceOn] = useState(true);
  const [showCompare, setShowCompare] = useState(false);
  const [crops, setCrops] = useState<CropEntry[]>(profile.crops);

  const milestoneLabels = MILESTONES.map((k) => t(k));

  const handleAddCropFromComparison = (crop: CropEntry) => {
    setCrops((prev) => [...prev, crop]);
    setShowCompare(false);
  };

  return (
    <div className="px-4 py-5 lg:px-8 lg:py-7 max-w-5xl mx-auto">
      <h1 className="text-2xl lg:text-3xl font-bold text-ink mb-5">{t('accountTitle')}</h1>

      {/* ── Milestoned progress bar ── */}
      <div className="card p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-ink">
            {t('profileComplete')} —{' '}
            <span className="text-brand-700">{profile.completeness}% {t('complete')}</span>
          </span>
        </div>
        <MilestonedBar pct={profile.completeness} labels={milestoneLabels} />
      </div>

      {/* ── Profile sections: two-column on lg, single column below ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Left column */}
        <div className="space-y-4">
          <ProfileSection
            title={t('personalInfo')}
            rows={[
              { label: t('name'), value: profile.name },
              { label: t('mobile'), value: profile.mobile },
            ]}
          />
          <ProfileSection
            title={t('location')}
            rows={[
              { label: t('village'), value: profile.village },
              { label: t('district'), value: profile.district },
              { label: t('state'), value: profile.state },
            ]}
          />
          <ProfileSection
            title={t('farmLand')}
            rows={[{ label: t('area'), value: profile.area }]}
          />
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Current Crop card — multi-crop */}
          <ProfileSectionWithChildren title={t('currentCrop')}>
            <div className="space-y-0">
              {crops.map((crop, i) => (
                <div
                  key={i}
                  className={`py-3 ${i < crops.length - 1 ? 'border-b border-ochre-50' : ''}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-ink">{crop.name || '—'}</p>
                      {crop.variety && (
                        <p className="text-xs text-muted">{t('variety')}: {crop.variety}</p>
                      )}
                      {crop.sowingDate && (
                        <p className="text-xs text-muted">{t('sowingDate')}: {crop.sowingDate}</p>
                      )}
                    </div>
                    <span className="text-xs font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full shrink-0">
                      {lang === 'mr' ? `पीक ${i + 1}` : `Crop ${i + 1}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {/* Add another crop */}
            <div className="mt-3 space-y-2">
              <button
                id="account-compare-btn"
                onClick={() => setShowCompare(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ochre-200 py-2.5 text-sm font-medium text-muted hover:border-brand-400 hover:text-brand-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                {t('addAnotherCrop')}
              </button>
            </div>
          </ProfileSectionWithChildren>

          <ProfileSection
            title={t('soilIrrigation')}
            rows={[
              { label: t('soil'), value: profile.soil },
              { label: t('irrigation'), value: profile.irrigation },
              { label: t('waterSource'), value: profile.waterSource },
            ]}
          />

          {/* Add more info prompt */}
          <div className="card p-5">
            <h3 className="font-semibold text-sm text-ink mb-3">{t('addMoreInfo')}</h3>
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ochre-200 py-3 text-sm font-medium text-muted hover:border-brand-400 hover:text-brand-700 transition-colors">
              <Plus className="h-4 w-4" />
              {t('addMoreInfo')}
            </button>
          </div>
        </div>
      </div>

      {/* ── Settings — full width ── */}
      <div className="card overflow-hidden">
        <div className="px-5 py-3.5 border-b border-ochre-50">
          <h3 className="font-semibold text-sm text-ink">{t('settings')}</h3>
        </div>

        {/* Language */}
        <SettingsRow
          icon={Globe}
          label={t('language')}
          onClick={toggleLang}
          value={lang === 'mr' ? 'मराठी' : 'English'}
        />
        <div className="mx-4 h-px bg-ochre-50" />

        {/* Voice guidance */}
        <div className="group flex w-full items-center justify-between px-4 py-3 rounded-xl hover:bg-brand-50 transition-colors">
          <span className="flex items-center gap-3 text-sm font-medium text-ink">
            <Mic className="h-5 w-5 text-muted group-hover:text-brand-600 transition-colors" />
            {t('voiceToggle')}
          </span>
          <button
            id="voice-toggle-btn"
            onClick={() => setVoiceOn((v) => !v)}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              voiceOn ? 'bg-brand-700' : 'bg-ochre-200'
            }`}
            aria-pressed={voiceOn}
            role="switch"
          >
            <span
              className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                voiceOn ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        <div className="mx-4 h-px bg-ochre-50" />

        {/* Logout */}
        <button
          id="logout-btn"
          className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-urgent hover:bg-urgent/5 transition-colors rounded-b-2xl"
        >
          <LogOut className="h-5 w-5" />
          {t('logout')}
        </button>
      </div>

      {/* Crop comparison panel */}
      {showCompare && (
        <CropComparePanel
          onSelect={handleAddCropFromComparison}
          onClose={() => setShowCompare(false)}
        />
      )}
    </div>
  );
}
