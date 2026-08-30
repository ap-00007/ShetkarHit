import { useState, useEffect, useRef } from 'react';
import { useLang } from '@/context/LangContext';
import type { Lang } from '@/types';

// Module-level cache: `${text}::${targetLang}` → translated string
const translationCache = new Map<string, string>();

/**
 * Auto-translates `sourceText` whenever the active language changes.
 * Falls back to `sourceText` if the backend is unavailable.
 *
 * @param sourceText  The original text (written in `sourceLang`, default 'mr')
 * @param sourceLang  The language `sourceText` is written in (default 'mr')
 */
export function useTranslate(sourceText: string, sourceLang: Lang = 'mr'): string {
  const { lang, translateDynamic } = useLang();
  const [translated, setTranslated] = useState(sourceText);
  const latestLang = useRef(lang);

  useEffect(() => {
    latestLang.current = lang;

    // No translation needed
    if (!sourceText.trim() || lang === sourceLang) {
      setTranslated(sourceText);
      return;
    }

    const cacheKey = `${sourceText}::${lang}`;

    // Serve from cache
    if (translationCache.has(cacheKey)) {
      setTranslated(translationCache.get(cacheKey)!);
      return;
    }

    // Show source while fetching
    setTranslated(sourceText);

    let cancelled = false;
    translateDynamic(sourceText, sourceLang).then((result) => {
      if (cancelled || latestLang.current !== lang) return;
      translationCache.set(cacheKey, result);
      setTranslated(result);
    });

    return () => { cancelled = true; };
  }, [sourceText, lang, sourceLang, translateDynamic]);

  return translated;
}
