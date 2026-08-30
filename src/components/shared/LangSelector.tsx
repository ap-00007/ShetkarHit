import { useLang } from '@/context/LangContext';
import type { Lang } from '@/types';

const LANGS: { code: Lang; label: string }[] = [
  { code: 'mr', label: 'मराठी' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'en', label: 'EN' },
];

interface Props {
  /** 'pills' (default) = inline pill row; 'compact' = shows only active lang abbreviated */
  variant?: 'pills' | 'compact';
  className?: string;
}

export function LangSelector({ variant = 'pills', className = '' }: Props) {
  const { lang, setLang } = useLang();

  if (variant === 'compact') {
    // Simple cycling button used in tight spaces (auth headers, mobile top bar, etc.)
    const next = LANGS[(LANGS.findIndex((l) => l.code === lang) + 1) % LANGS.length];
    return (
      <button
        id="lang-compact-btn"
        onClick={() => setLang(next.code)}
        className={`rounded-full border border-ochre-200 bg-white/80 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-ink hover:bg-brand-50 transition-colors ${className}`}
        aria-label={`Switch to ${next.label}`}
      >
        {LANGS.find((l) => l.code === lang)?.label ?? lang.toUpperCase()}
      </button>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-0.5 rounded-full border border-ochre-200 bg-white/80 backdrop-blur-sm p-1 ${className}`}
      role="group"
      aria-label="Language selector"
    >
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          id={`lang-${code}-btn`}
          onClick={() => setLang(code)}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
            lang === code
              ? 'bg-brand-700 text-white shadow-sm'
              : 'text-muted hover:text-ink hover:bg-ochre-50'
          }`}
          aria-pressed={lang === code}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
