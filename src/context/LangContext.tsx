import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { Lang } from '@/types';
import { tr, type TranslationKey } from '@/i18n';

const LANG_CYCLE: Lang[] = ['mr', 'hi', 'en'];

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Cycles mr → hi → en → mr */
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
  /** Translate arbitrary text via the backend API. Falls back to source text on error. */
  translateDynamic: (text: string, sourceLang?: Lang) => Promise<string>;
}

const LangContext = createContext<LangCtx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('mr');

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const idx = LANG_CYCLE.indexOf(prev);
      return LANG_CYCLE[(idx + 1) % LANG_CYCLE.length];
    });
  }, []);

  const tFn = useCallback(
    (key: TranslationKey) => tr(key, lang),
    [lang]
  );

  /** Call the backend translation endpoint */
  const translateDynamic = useCallback(
    async (text: string, sourceLang?: Lang): Promise<string> => {
      if (!text.trim()) return text;
      if (sourceLang === lang) return text; // no-op

      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, targetLang: lang, sourceLang }),
        });
        if (!res.ok) return text;
        const data = await res.json();
        return data.translated ?? text;
      } catch {
        return text; // graceful fallback — never break the UI
      }
    },
    [lang]
  );

  return (
    <LangContext.Provider value={{ lang, setLang, toggleLang, t: tFn, translateDynamic }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
