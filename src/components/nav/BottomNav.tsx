import { Sprout, Mic, ClipboardList, User } from 'lucide-react';
import { useLang } from '@/context/LangContext';

type Page = 'today' | 'ask' | 'schemes' | 'account';

interface Props {
  current: Page;
  onNavigate: (p: Page) => void;
}

export function BottomNav({ current, onNavigate }: Props) {
  const { t } = useLang();

  const items = [
    { id: 'today' as const, label: t('navToday'), icon: Sprout },
    { id: 'ask' as const, label: t('navAsk'), icon: Mic },
    { id: 'schemes' as const, label: t('navSchemes'), icon: ClipboardList },
    { id: 'account' as const, label: t('navAccount'), icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-ochre-100 bg-white">
      <div className="flex">
        {items.map((item) => {
          const Icon = item.icon;
          const active = current === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 transition-colors ${
                active ? 'text-brand-700' : 'text-muted'
              }`}
            >
              <Icon className={`h-6 w-6 ${active ? 'fill-brand-100' : ''}`} strokeWidth={active ? 2.5 : 2} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
