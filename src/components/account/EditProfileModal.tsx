import { useState } from 'react';
import { X, Plus, Trash2, Check, Sparkles, MapPin, Sprout, Droplets } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import type { OnboardingResult } from '@/components/auth/OnboardingPage';
import type { CropEntry } from '@/types';

const SOIL_OPTIONS = [
  { id: 'light', mr: 'हलकी / वाळूमिश्रित जमीन', hi: 'हल्की / रेतीली मिट्टी', en: 'Light / Sandy Soil' },
  { id: 'medium', mr: 'मध्यम काळी जमीन', hi: 'मध्यम काली मिट्टी', en: 'Medium Black Soil' },
  { id: 'heavy', mr: 'भारी / काळी कसदार जमीन', hi: 'भारी / उपजाऊ काली मिट्टी', en: 'Heavy / Deep Black Soil' },
  { id: 'red', mr: 'तांबडी जमीन', hi: 'लाल मिट्टी', en: 'Red Laterite Soil' },
];

const IRRIGATION_OPTIONS = [
  { id: 'drip', mr: 'ठिबक सिंचन (Drip)', hi: 'ड्रिप सिंचाई (Drip)', en: 'Drip Irrigation' },
  { id: 'sprinkler', mr: 'तुषार सिंचन (Sprinkler)', hi: 'फव्वारा सिंचाई (Sprinkler)', en: 'Sprinkler Irrigation' },
  { id: 'flood', mr: 'पाट पाणी / मोकाट सिंचन', hi: 'नाली / खुला पानी', en: 'Flood / Furrow Irrigation' },
];

const WATER_SOURCES = [
  { id: 'well', mr: 'विहीर (Well)', hi: 'कुआं (Well)', en: 'Open Well' },
  { id: 'borewell', mr: 'बोअरवेल (Borewell)', hi: 'बोरवेल (Borewell)', en: 'Borewell' },
  { id: 'canal', mr: 'कालवा / नदी (Canal)', hi: 'नहर / नदी (Canal)', en: 'Canal / River' },
  { id: 'farm_pond', mr: 'शेततळे (Farm Pond)', hi: 'खेत तालाब (Farm Pond)', en: 'Farm Pond' },
];

interface Props {
  initialData?: OnboardingResult | null;
  userEmail?: string;
  initialTab?: 'personal' | 'location' | 'crops' | 'soil';
  onSave: (data: OnboardingResult) => void;
  onClose: () => void;
}

export function EditProfileModal({
  initialData,
  initialTab = 'personal',
  onSave,
  onClose,
}: Props) {
  const { lang, t } = useLang();

  const [activeTab, setActiveTab] = useState<'personal' | 'location' | 'crops' | 'soil'>(initialTab);

  // Form states
  const [name, setName] = useState(initialData?.name || '');
  const [village, setVillage] = useState(initialData?.village || '');
  const [district, setDistrict] = useState(initialData?.district || 'Ahmednagar');
  const [state, setState] = useState(initialData?.state || 'Maharashtra');
  const [acres, setAcres] = useState(initialData?.acres || '4');
  const [soil, setSoil] = useState(initialData?.soil || 'medium');
  const [irrigation, setIrrigation] = useState(initialData?.irrigation || 'drip');
  const [waterSource, setWaterSource] = useState(initialData?.waterSource || 'well');
  const [crops, setCrops] = useState<CropEntry[]>(
    initialData?.crops && initialData.crops.length > 0
      ? initialData.crops
      : [{ name: 'Onion', variety: 'Garwa', sowingDate: '2026-06-15' }]
  );

  const handleAddCrop = () => {
    setCrops((prev) => [...prev, { name: '', variety: '', sowingDate: '' }]);
  };

  const handleRemoveCrop = (index: number) => {
    setCrops((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCropChange = (index: number, field: keyof CropEntry, val: string) => {
    setCrops((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: val } : c))
    );
  };

  const handleSave = () => {
    const updated: OnboardingResult = {
      name: name.trim() || 'शेतकरी मित्र',
      village: village.trim(),
      district: district.trim() || 'Ahmednagar',
      state: state.trim() || 'Maharashtra',
      acres: acres.trim() || '4',
      soil,
      irrigation,
      waterSource,
      crops: crops.filter((c) => c.name.trim() !== ''),
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-ochre-100 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ochre-100 bg-cream/50">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-ink">
                {lang === 'mr' ? 'माहिती बदला (Edit Profile)' : lang === 'hi' ? 'जानकारी बदलें' : 'Edit Farm Profile'}
              </h2>
              <p className="text-xs text-muted">
                {lang === 'mr'
                  ? 'बदल सर्व सल्ले आणि बाजार भावावर लगेच लागू होतील'
                  : 'Changes will immediately update your daily advisory and dashboard'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-ochre-100 flex items-center justify-center text-muted hover:text-ink transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-ochre-100 px-6 pt-2 gap-2 bg-cream/20 overflow-x-auto">
          {[
            { id: 'personal', label: lang === 'mr' ? 'वैयक्तिक व स्थान' : 'Personal & Location', icon: MapPin },
            { id: 'crops', label: lang === 'mr' ? 'पिके (Crops)' : 'Crops', icon: Sprout },
            { id: 'soil', label: lang === 'mr' ? 'जमीन व पाणी' : 'Soil & Water', icon: Droplets },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-brand-700 text-brand-700 bg-white shadow-xs'
                    : 'border-transparent text-muted hover:text-ink hover:bg-white/50'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: Personal & Location */}
          {activeTab === 'personal' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-ink mb-1.5">{t('fullNameLabel')}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ashish Patil"
                  className="input-field w-full py-2.5 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1.5">{t('village')}</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="e.g. Kopargaon"
                    className="input-field w-full py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink mb-1.5">{t('district')}</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. Ahmednagar"
                    className="input-field w-full py-2.5 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1.5">{t('state')}</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Maharashtra"
                    className="input-field w-full py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink mb-1.5">
                    {lang === 'mr' ? 'एकूण शेत जमीन (एकर)' : 'Total Land (Acres)'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={acres}
                    onChange={(e) => setAcres(e.target.value)}
                    placeholder="e.g. 4"
                    className="input-field w-full py-2.5 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Crops Manager */}
          {activeTab === 'crops' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted">
                  {lang === 'mr' ? 'तुमची सर्व चालू पिके जोडा किंवा संपादित करा' : 'Add or modify all your current active crops'}
                </p>
                <button
                  type="button"
                  onClick={handleAddCrop}
                  className="flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 border border-brand-200 px-3 py-1.5 rounded-full transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {lang === 'mr' ? 'पीक जोडा' : 'Add Crop'}
                </button>
              </div>

              <div className="space-y-3">
                {crops.map((c, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl border border-ochre-100 bg-cream/40 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">
                        {lang === 'mr' ? `पीक ${i + 1}` : `Crop ${i + 1}`}
                      </span>
                      {crops.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveCrop(i)}
                          className="text-muted hover:text-urgent p-1 rounded-md transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-muted mb-1">{t('crop')} *</label>
                        <input
                          type="text"
                          value={c.name}
                          onChange={(e) => handleCropChange(i, 'name', e.target.value)}
                          placeholder="e.g. Onion, Sugarcane"
                          className="input-field w-full py-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-muted mb-1">{t('variety')}</label>
                        <input
                          type="text"
                          value={c.variety || ''}
                          onChange={(e) => handleCropChange(i, 'variety', e.target.value)}
                          placeholder="e.g. Garwa, Co 86032"
                          className="input-field w-full py-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-muted mb-1">{t('sowingDate')}</label>
                        <input
                          type="date"
                          value={c.sowingDate || ''}
                          onChange={(e) => handleCropChange(i, 'sowingDate', e.target.value)}
                          className="input-field w-full py-2 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Soil & Water */}
          {activeTab === 'soil' && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-ink mb-2">
                  {lang === 'mr' ? 'मातीचा प्रकार (Soil Type)' : 'Soil Type'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SOIL_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSoil(opt.id as any)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs text-left font-medium transition-all ${
                        soil === opt.id
                          ? 'border-brand-700 bg-brand-50 text-brand-800 font-bold'
                          : 'border-ochre-100 bg-white hover:bg-cream/50 text-ink'
                      }`}
                    >
                      <span>{opt[lang === 'mr' ? 'mr' : lang === 'hi' ? 'hi' : 'en']}</span>
                      {soil === opt.id && <Check className="h-4 w-4 text-brand-700 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-2">
                  {lang === 'mr' ? 'सिंचन पद्धत (Irrigation Method)' : 'Irrigation Method'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {IRRIGATION_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setIrrigation(opt.id as any)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs text-left font-medium transition-all ${
                        irrigation === opt.id
                          ? 'border-brand-700 bg-brand-50 text-brand-800 font-bold'
                          : 'border-ochre-100 bg-white hover:bg-cream/50 text-ink'
                      }`}
                    >
                      <span>{opt[lang === 'mr' ? 'mr' : lang === 'hi' ? 'hi' : 'en']}</span>
                      {irrigation === opt.id && <Check className="h-4 w-4 text-brand-700 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-2">
                  {lang === 'mr' ? 'पाणी स्रोत (Water Source)' : 'Water Source'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {WATER_SOURCES.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setWaterSource(opt.id as any)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs text-left font-medium transition-all ${
                        waterSource === opt.id
                          ? 'border-brand-700 bg-brand-50 text-brand-800 font-bold'
                          : 'border-ochre-100 bg-white hover:bg-cream/50 text-ink'
                      }`}
                    >
                      <span>{opt[lang === 'mr' ? 'mr' : lang === 'hi' ? 'hi' : 'en']}</span>
                      {waterSource === opt.id && <Check className="h-4 w-4 text-brand-700 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-ochre-100 bg-cream/40">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-ochre-200 text-muted hover:text-ink font-semibold text-xs transition-colors"
          >
            {lang === 'mr' ? 'रद्द करा' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn-primary py-2.5 px-6 text-xs font-bold shadow-md shadow-brand-700/20"
          >
            {lang === 'mr' ? 'बदल जतन करा (Save Changes)' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
