import { useState } from 'react';
import { useLang } from '@/context/LangContext';
import {
  Sprout, User, MapPin, Tractor, Wheat, Droplets, ClipboardCheck,
  ChevronRight, ChevronLeft, Plus, X, Scale,
} from 'lucide-react';
import { FarmIllustration } from './FarmIllustration';
import { CropComparePanel } from './CropComparePanel';
import type { CropEntry } from '@/types';

/* ─── Public result type ─── */
export interface OnboardingResult {
  name: string;
  village: string;
  district: string;
  state: string;
  acres: string;
  crops: CropEntry[];
  soil: string;
  irrigation: string;
  waterSource: string;
}

/* ─── Chip selector helper ─── */
function ChipGroup({
  options, value, onChange,
}: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`chip text-sm ${value === opt ? 'chip-active' : 'chip-inactive'}`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

/* ─── Progress milestone bar ─── */
const STEP_LABELS = ['stepPersonal', 'stepLocation', 'stepFarmLand', 'stepCrop', 'stepSoil', 'stepReview'] as const;

function MilestoneBar({ step, total, tLabels }: { step: number; total: number; tLabels: string[] }) {
  return (
    <div className="mb-8">
      {/* Track */}
      <div className="relative h-1.5 rounded-full bg-ochre-100 mb-3">
        <div
          className="absolute h-full rounded-full bg-brand-700 transition-all duration-500"
          style={{ width: `${(step / (total - 1)) * 100}%` }}
        />
        {/* Tick marks */}
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full border-2 transition-all duration-300 ${
              i <= step
                ? 'bg-brand-700 border-brand-700'
                : 'bg-white border-ochre-200'
            }`}
            style={{ left: `${(i / (total - 1)) * 100}%` }}
          />
        ))}
      </div>
      {/* Labels */}
      <div className="flex justify-between">
        {tLabels.map((label, i) => (
          <span
            key={i}
            className={`text-[10px] font-medium transition-colors ${
              i <= step ? 'text-brand-700' : 'text-muted'
            }`}
            style={{ width: `${100 / total}%`, textAlign: i === 0 ? 'left' : i === total - 1 ? 'right' : 'center' }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Shared auth layout shell ─── */
function OnboardingShell({ children }: { children: React.ReactNode }) {
  const { lang, toggleLang, t } = useLang();
  return (
    <div className="min-h-screen bg-cream flex flex-col lg:flex-row overflow-hidden">
      {/* Illustration side — desktop only */}
      <div className="hidden lg:flex lg:w-[38%] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-green-50 to-ochre-50" />
        <div className="absolute -top-16 -left-16 h-72 w-72 rounded-full bg-brand-200/25 blur-3xl" />
        <FarmIllustration className="relative z-10 w-full h-full p-6" />
        <div className="absolute top-6 left-6 flex items-center gap-2 z-20">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-700 shadow-md">
            <Sprout className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-brand-700">{t('appName')}</span>
        </div>
        <div className="absolute bottom-8 left-6 right-6 z-20 card p-5 shadow-lg">
          <p className="text-sm font-bold text-brand-700 mb-1">{t('onboardingWelcome')}</p>
          <p className="text-xs text-muted leading-relaxed">{t('onboardingSubtitle')}</p>
        </div>
      </div>

      {/* Form side */}
      <div className="flex flex-1 flex-col min-h-screen">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between px-5 pt-5 pb-1 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-700">
              <Sprout className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-brand-700">{t('appName')}</span>
          </div>
          <button
            onClick={toggleLang}
            className="rounded-full border border-ochre-200 bg-white px-3 py-1.5 text-xs font-medium text-ink hover:bg-brand-50 transition-colors"
          >
            {lang === 'mr' ? 'EN' : 'मर'}
          </button>
        </div>
        {/* Desktop lang toggle */}
        <div className="hidden lg:flex justify-end px-8 pt-5">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 rounded-full border border-ochre-200 bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-brand-50"
          >
            {lang === 'mr' ? 'English' : 'मराठी'}
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

/* ─── Crop row component ─── */
function CropRow({
  crop, index, onChange, onRemove, lang,
}: {
  crop: CropEntry;
  index: number;
  onChange: (i: number, field: keyof CropEntry, val: string) => void;
  onRemove: (i: number) => void;
  lang: string;
}) {
  return (
    <div className="rounded-xl border border-ochre-200 bg-cream p-3 space-y-2.5 relative">
      {index > 0 && (
        <button
          onClick={() => onRemove(index)}
          className="absolute top-2.5 right-2.5 text-muted hover:text-urgent transition-colors"
          aria-label="Remove crop"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <p className="text-xs font-semibold text-brand-700 uppercase tracking-wide">
        {lang === 'mr' ? `पीक ${index + 1}` : `Crop ${index + 1}`}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <input
          type="text"
          value={crop.name}
          onChange={(e) => onChange(index, 'name', e.target.value)}
          placeholder={lang === 'mr' ? 'उदा. कांदा' : 'e.g. Onion'}
          className="input-field py-2 text-sm"
        />
        <input
          type="text"
          value={crop.variety}
          onChange={(e) => onChange(index, 'variety', e.target.value)}
          placeholder={lang === 'mr' ? 'वाण (N-53)' : 'Variety (N-53)'}
          className="input-field py-2 text-sm"
        />
        <input
          type="date"
          value={crop.sowingDate}
          onChange={(e) => onChange(index, 'sowingDate', e.target.value)}
          className="input-field py-2 text-sm"
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Main component
═══════════════════════════════════════════ */
interface Props {
  onDone: (data: OnboardingResult) => void;
  onSkip: () => void;
}

const TOTAL_STEPS = 6;

export function OnboardingPage({ onDone, onSkip }: Props) {
  const { lang, t } = useLang();
  const [step, setStep] = useState(0);
  const [showCompare, setShowCompare] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [acres, setAcres] = useState('');
  const [crops, setCrops] = useState<CropEntry[]>([{ name: '', variety: '', sowingDate: '' }]);
  const [soil, setSoil] = useState('');
  const [irrigation, setIrrigation] = useState('');
  const [waterSource, setWaterSource] = useState('');

  const stepLabels = STEP_LABELS.map((k) => t(k));
  const stepIcons = [User, MapPin, Tractor, Wheat, Droplets, ClipboardCheck];
  const StepIcon = stepIcons[step];

  const canProceed = (() => {
    if (step === 0) return name.trim() !== '';
    if (step === 1) return village.trim() !== '';
    if (step === 2) return acres.trim() !== '';
    if (step === 3) return crops.some((c) => c.name.trim() !== '');
    if (step === 4) return soil !== '' && irrigation !== '' && waterSource !== '';
    return true; // review step always enabled
  })();

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1);
    else {
      onDone({ name, village, district, state, acres, crops, soil, irrigation, waterSource });
    }
  };

  const handleBack = () => setStep((s) => Math.max(0, s - 1));

  // Crop row helpers
  const updateCrop = (i: number, field: keyof CropEntry, val: string) => {
    setCrops((prev) => prev.map((c, idx) => idx === i ? { ...c, [field]: val } : c));
  };
  const addCrop = () => setCrops((prev) => [...prev, { name: '', variety: '', sowingDate: '' }]);
  const removeCrop = (i: number) => setCrops((prev) => prev.filter((_, idx) => idx !== i));
  const addFromComparison = (crop: CropEntry) => {
    // Fill the first empty crop slot, or append
    const emptyIdx = crops.findIndex((c) => c.name.trim() === '');
    if (emptyIdx >= 0) {
      updateCrop(emptyIdx, 'name', crop.name);
    } else {
      setCrops((prev) => [...prev, crop]);
    }
  };

  const soilOptions = [t('soilMedium'), t('soilLoamy'), t('soilSandy'), t('soilClay')];
  const irrOptions = [t('irrDrip'), t('irrFlood'), t('irrSprinkler')];
  const srcOptions = [t('srcBorewell'), t('srcCanal'), t('srcRiver'), t('srcRainfed')];

  return (
    <OnboardingShell>
      <div className="flex flex-1 items-start lg:items-center justify-center px-5 py-6 lg:py-8">
        <div className="w-full max-w-lg">
          {/* Milestone bar */}
          <MilestoneBar step={step} total={TOTAL_STEPS} tLabels={stepLabels} />

          {/* Step card */}
          <div className="card p-6 lg:p-8 shadow-md animate-slide-up">
            {/* Step icon + title */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 shrink-0">
                <StepIcon className="h-5 w-5 text-brand-700" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">{`${t('stepPersonal').split('')[0]}${step + 1} / ${TOTAL_STEPS}`}</p>
                <h2 className="text-lg font-bold text-ink leading-tight">{stepLabels[step]}</h2>
              </div>
            </div>

            {/* ── STEP 1: Personal Info ── */}
            {step === 0 && (
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">{t('nameLabel')}</label>
                <input
                  id="onboard-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === 'mr' ? 'उदा. रवी पाटील' : 'e.g. Ravi Patil'}
                  className="input-field"
                  autoFocus
                />
              </div>
            )}

            {/* ── STEP 2: Location ── */}
            {step === 1 && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">{t('villageLabel')}</label>
                  <input
                    id="onboard-village"
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder={lang === 'mr' ? 'उदा. कोपरगाव' : 'e.g. Kopargaon'}
                    className="input-field"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">{t('districtLabel')}</label>
                  <input
                    id="onboard-district"
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder={lang === 'mr' ? 'उदा. अहमदनगर' : 'e.g. Ahmednagar'}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">{t('stateLabel')}</label>
                  <input
                    id="onboard-state"
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder={lang === 'mr' ? 'उदा. महाराष्ट्र' : 'e.g. Maharashtra'}
                    className="input-field"
                  />
                </div>
              </div>
            )}

            {/* ── STEP 3: Farm & Land ── */}
            {step === 2 && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">{t('acresLabel')}</label>
                  <div className="relative">
                    <input
                      id="onboard-acres"
                      type="number"
                      min="0"
                      step="0.5"
                      value={acres}
                      onChange={(e) => setAcres(e.target.value)}
                      placeholder={lang === 'mr' ? 'उदा. ४' : 'e.g. 4'}
                      className="input-field pr-16"
                      inputMode="decimal"
                      autoFocus
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted font-medium">
                      {lang === 'mr' ? 'एकर' : 'acres'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['1', '2', '3', '4', '5', '10', '15', '20'].map((v) => (
                    <button
                      key={v}
                      onClick={() => setAcres(v)}
                      className={`chip text-sm ${acres === v ? 'chip-active' : 'chip-inactive'}`}
                    >
                      {v} {lang === 'mr' ? 'एकर' : 'ac'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── STEP 4: Current Crop ── */}
            {step === 3 && (
              <div className="space-y-3">
                {/* Compare button */}
                <button
                  id="open-compare-btn"
                  onClick={() => setShowCompare(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-brand-200 bg-brand-50 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-100 hover:border-brand-400 transition-all"
                >
                  <Scale className="h-4 w-4" />
                  {t('compareCrops')}
                </button>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-ochre-100" />
                  <span className="text-xs text-muted font-medium">{lang === 'mr' ? 'किंवा स्वतः भरा' : 'or enter manually'}</span>
                  <div className="flex-1 h-px bg-ochre-100" />
                </div>

                {/* Crop rows */}
                <div className="space-y-2.5">
                  {crops.map((crop, i) => (
                    <CropRow
                      key={i}
                      crop={crop}
                      index={i}
                      onChange={updateCrop}
                      onRemove={removeCrop}
                      lang={lang}
                    />
                  ))}
                </div>

                {/* Add another crop */}
                <button
                  id="add-another-crop-btn"
                  onClick={addCrop}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ochre-200 py-2.5 text-sm font-medium text-muted hover:border-brand-400 hover:text-brand-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  {t('addAnotherCrop')}
                </button>
              </div>
            )}

            {/* ── STEP 5: Soil & Irrigation ── */}
            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">{t('soil')}</label>
                  <ChipGroup options={soilOptions} value={soil} onChange={setSoil} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">{t('irrigation')}</label>
                  <ChipGroup options={irrOptions} value={irrigation} onChange={setIrrigation} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">{t('waterSource')}</label>
                  <ChipGroup options={srcOptions} value={waterSource} onChange={setWaterSource} />
                </div>
              </div>
            )}

            {/* ── STEP 6: Review & Confirm ── */}
            {step === 5 && (
              <div className="space-y-3 text-sm">
                <p className="text-muted text-sm mb-3">{t('reviewSubtitle')}</p>
                {[
                  { label: t('nameLabel'), value: name || '—' },
                  { label: t('villageLabel'), value: village || '—' },
                  { label: t('districtLabel'), value: district || '—' },
                  { label: t('stateLabel'), value: state || '—' },
                  { label: t('acresLabel'), value: acres ? `${acres} ${lang === 'mr' ? 'एकर' : 'acres'}` : '—' },
                  { label: t('soil'), value: soil || '—' },
                  { label: t('irrigation'), value: irrigation || '—' },
                  { label: t('waterSource'), value: waterSource || '—' },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-ochre-50 last:border-0">
                    <span className="text-muted">{row.label}</span>
                    <span className="font-medium text-ink text-right">{row.value}</span>
                  </div>
                ))}
                {/* Crops summary */}
                <div className="pt-1">
                  <p className="text-muted mb-2">{t('stepCrop')}</p>
                  {crops.filter((c) => c.name.trim()).map((c, i) => (
                    <div key={i} className="flex items-center gap-2 mb-1 pl-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-400 shrink-0" />
                      <span className="font-medium text-ink text-sm">{c.name} {c.variety ? `(${c.variety})` : ''}</span>
                    </div>
                  ))}
                  {crops.filter((c) => c.name.trim()).length === 0 && (
                    <p className="text-muted pl-2 italic text-sm">{lang === 'mr' ? 'पीक नाही' : 'None added'}</p>
                  )}
                </div>
              </div>
            )}

            {/* Nav buttons */}
            <div className="flex gap-3 mt-7">
              {step > 0 && (
                <button
                  id="onboard-back-btn"
                  onClick={handleBack}
                  className="flex items-center gap-1.5 btn-secondary px-5 py-3"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {t('backBtn')}
                </button>
              )}
              <button
                id={step === TOTAL_STEPS - 1 ? 'onboard-confirm-btn' : 'onboard-next-btn'}
                onClick={handleNext}
                disabled={!canProceed}
                className={`flex-1 btn-primary py-3 flex items-center justify-center gap-2 shadow-sm transition-all ${
                  !canProceed ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'
                }`}
              >
                {step === TOTAL_STEPS - 1 ? t('confirmStart') : t('nextBtn')}
                {step < TOTAL_STEPS - 1 && <ChevronRight className="h-4 w-4" />}
              </button>
            </div>

            {/* Skip link */}
            <button
              id="onboard-skip-btn"
              onClick={onSkip}
              className="mt-3 w-full text-center text-xs text-muted hover:text-ink transition-colors py-1"
            >
              {t('onboardingSkip')}
            </button>
          </div>
        </div>
      </div>

      {/* Crop Comparison panel */}
      {showCompare && (
        <CropComparePanel
          onSelect={addFromComparison}
          onClose={() => setShowCompare(false)}
        />
      )}
    </OnboardingShell>
  );
}
