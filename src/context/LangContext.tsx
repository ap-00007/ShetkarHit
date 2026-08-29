import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Lang } from '@/types';
import { tr, type TranslationKey } from '@/i18n';

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
}

const LangContext = createContext<LangCtx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('mr');

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'mr' ? 'en' : 'mr'));
  }, []);

  const tFn = useCallback(
    (key: TranslationKey) => tr(key, lang),
    [lang]
  );

  return (
    <LangContext.Provider value={{ lang, setLang, toggleLang, t: tFn }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
