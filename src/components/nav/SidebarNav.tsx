import { Sprout, Mic, ClipboardList, User, Globe } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import { profile } from '@/data/mockData';

type Page = 'today' | 'ask' | 'schemes' | 'account';

interface Props {
  current: Page;
  onNavigate: (p: Page) => void;
}

export function SidebarNav({ current, onNavigate }: Props) {
  const { lang, toggleLang, t } = useLang();

  const items = [
    { id: 'today' as const, label: t('navToday'), icon: Sprout },
    { id: 'ask' as const, label: t('navAsk'), icon: Mic },
    { id: 'schemes' as const, label: t('navSchemes'), icon: ClipboardList },
  ];

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-full w-60 flex-col border-r border-ochre-100 bg-white">
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-700">
            <Sprout className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-brand-700">{t('appName')}</span>
        </div>
        <div className="mt-3 text-sm text-muted">
          <p className="font-medium text-ink">{profile.name}</p>
          <p className="text-xs">{profile.village}, {profile.state}</p>
        </div>
      </div>

      <nav className="mt-2 flex-1 px-3">
        {items.map((item) => {
          const Icon = item.icon;
          const active = current === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-medium transition-colors ${
                active
                  ? 'bg-brand-700 text-white'
                  : 'text-ink hover:bg-brand-50'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="border-t border-ochre-100 px-3 py-4">
        <button
          onClick={() => onNavigate('account')}
          className={`mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium transition-colors ${
            current === 'account' ? 'bg-brand-700 text-white' : 'text-ink hover:bg-brand-50'
          }`}
        >
          <User className="h-5 w-5 shrink-0" />
          <span>{t('navAccount')}</span>
        </button>
        <button
          onClick={toggleLang}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium text-ink transition-colors hover:bg-brand-50"
        >
          <Globe className="h-5 w-5 shrink-0" />
          <span>{lang === 'mr' ? 'English' : 'मराठी'}</span>
        </button>
      </div>
    </aside>
  );
}
