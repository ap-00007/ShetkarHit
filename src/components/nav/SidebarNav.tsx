import { Sprout, Mic, ClipboardList, User, LogOut, X } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import { LangSelector } from '@/components/shared/LangSelector';
import type { OnboardingResult } from '@/components/auth/OnboardingPage';

type Page = 'today' | 'ask' | 'schemes' | 'account';

interface Props {
  current: Page;
  onNavigate: (p: Page) => void;
  farmProfile?: OnboardingResult | null;
  /** Mobile: is the sidebar overlay open? */
  isOpen?: boolean;
  /** Mobile: close the sidebar overlay */
  onClose?: () => void;
  onLogout?: () => void;
}

export function SidebarNav({ current, onNavigate, farmProfile, isOpen = false, onClose, onLogout }: Props) {
  const { lang, toggleLang, t } = useLang();

  const navItems = [
    { id: 'today' as const, label: t('navToday'), icon: Sprout },
    { id: 'ask' as const, label: t('navAsk'), icon: Mic },
    { id: 'schemes' as const, label: t('navSchemes'), icon: ClipboardList },
  ];

  const displayName = farmProfile?.name || '—';
  const displayLocation = farmProfile
    ? `${farmProfile.acres ? farmProfile.acres + ' एकर · ' : ''}${farmProfile.village || ''}`.trim()
    : '—';

  const handleNavigate = (p: Page) => {
    onNavigate(p);
    onClose?.();
  };

  const sidebar = (
    <aside className="flex h-full w-64 flex-col bg-white border-r border-ochre-100">
      {/* Brand + close button (mobile only) */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-700">
            <Sprout className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-brand-700">{t('appName')}</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden flex h-8 w-8 items-center justify-center rounded-full hover:bg-ochre-100 transition-colors text-muted"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* User info */}
      <div className="px-5 pb-4 border-b border-ochre-50">
        <p className="font-semibold text-sm text-ink">{displayName}</p>
        <p className="text-xs text-muted mt-0.5">{displayLocation}</p>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = current === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${
                active ? 'bg-brand-700 text-white' : 'text-ink hover:bg-brand-50'
              }`}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" style={{ width: '1.125rem', height: '1.125rem' }} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom items */}
      <div className="border-t border-ochre-100 px-3 py-3 space-y-0.5">
        <button
          onClick={() => handleNavigate('account')}
          className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
            current === 'account' ? 'bg-brand-700 text-white' : 'text-ink hover:bg-brand-50'
          }`}
        >
          <User style={{ width: '1.125rem', height: '1.125rem' }} className="shrink-0" />
          {t('navAccount')}
        </button>
        <LangSelector variant="pills" className="w-full justify-center" />
        <button
          id="sidebar-logout-btn"
          onClick={() => {
            onClose?.();
            onLogout?.();
          }}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-urgent hover:bg-urgent/5 transition-colors"
        >
          <LogOut style={{ width: '1.125rem', height: '1.125rem' }} className="shrink-0" />
          {t('logout')}
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop: fixed sidebar */}
      <div className="hidden lg:flex fixed left-0 top-0 h-full w-64 z-40">
        {sidebar}
      </div>

      {/* Mobile: overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Scrim */}
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Slide-in panel */}
          <div className="relative z-10 animate-slide-up" style={{ animation: 'slideInLeft 0.25s ease-out' }}>
            {sidebar}
          </div>
        </div>
      )}
    </>
  );
}
