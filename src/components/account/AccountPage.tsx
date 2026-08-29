import { useState } from 'react';
import { Globe, LogOut, Mic, Plus } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import { profile } from '@/data/mockData';
import { ProfileSection } from './ProfileSection';

export function AccountPage() {
  const { t, lang, toggleLang } = useLang();
  const [voiceOn, setVoiceOn] = useState(true);

  return (
    <div className="px-4 py-5 lg:px-8 lg:py-7 max-w-5xl mx-auto">
      <h1 className="text-2xl lg:text-3xl font-bold text-ink mb-5">{t('accountTitle')}</h1>

      {/* Completeness bar */}
      <div className="card p-4 mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-ink">
            {t('profileComplete')} {profile.completeness}% {t('complete')}
          </span>
        </div>
        <div className="h-2 rounded-full bg-ochre-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-brand-600 transition-all"
            style={{ width: `${profile.completeness}%` }}
          />
        </div>
      </div>

      {/* Desktop: two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
          <ProfileSection
            title={t('currentCrop')}
            rows={[
              { label: t('crop'), value: profile.crop },
              { label: t('variety'), value: profile.variety },
              { label: t('sowingDate'), value: profile.sowingDate },
            ]}
          />
          <ProfileSection
            title={t('soilIrrigation')}
            rows={[
              { label: t('soil'), value: profile.soil },
              { label: t('irrigation'), value: profile.irrigation },
              { label: t('waterSource'), value: profile.waterSource },
            ]}
          />
          <div className="card p-4">
            <h3 className="font-semibold text-ink mb-3">{t('addMoreInfo')}</h3>
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ochre-200 py-3 text-sm font-medium text-muted hover:border-brand-400 hover:text-brand-700 transition-colors">
              <Plus className="h-4 w-4" />
              {t('addMoreInfo')}
            </button>
          </div>
        </div>
      </div>

      {/* Settings — full width below */}
      <div className="mt-5">
        <div className="card p-4">
          <h3 className="font-semibold text-ink mb-3">{t('settings')}</h3>
          <div className="space-y-3">
            <button
              onClick={toggleLang}
              className="flex w-full items-center justify-between rounded-xl bg-cream px-4 py-3 transition-colors hover:bg-brand-50"
            >
              <span className="flex items-center gap-2 text-sm font-medium text-ink">
                <Globe className="h-5 w-5 text-muted" />
                {t('language')}
              </span>
              <span className="text-sm text-muted">
                {lang === 'mr' ? 'मराठी' : 'English'}
              </span>
            </button>

            <div className="flex w-full items-center justify-between rounded-xl bg-cream px-4 py-3">
              <span className="flex items-center gap-2 text-sm font-medium text-ink">
                <Mic className="h-5 w-5 text-muted" />
                {t('voiceToggle')}
              </span>
              <button
                onClick={() => setVoiceOn((v) => !v)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  voiceOn ? 'bg-brand-700' : 'bg-ochre-200'
                }`}
                aria-pressed={voiceOn}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                    voiceOn ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <button className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-urgent transition-colors hover:bg-urgent/5">
              <LogOut className="h-5 w-5" />
              {t('logout')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
