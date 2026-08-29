import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import { decision } from '@/data/mockData';

export function WhyExpandable() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <div className="card p-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="font-semibold text-ink">{t('whyThis')}</span>
        <ChevronDown
          className={`h-5 w-5 text-muted transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <p className="mt-3 text-sm text-muted leading-relaxed animate-fade-in">
          {decision.reason}
        </p>
      )}
    </div>
  );
}
