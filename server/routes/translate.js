// server/routes/translate.js
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const LANG_NAMES = {
  mr: 'Marathi (Devanagari script)',
  hi: 'Hindi (Devanagari script)',
  en: 'English',
};

// Simple in-memory cache: { `${text}::${targetLang}` -> translated }
const cache = new Map();

export async function translateHandler(req, res) {
  try {
    const { text, targetLang, sourceLang } = req.body;

    if (!text || !targetLang) {
      return res.status(400).json({ error: 'text and targetLang are required' });
    }

    if (!['mr', 'hi', 'en'].includes(targetLang)) {
      return res.status(400).json({ error: 'targetLang must be mr | hi | en' });
    }

    // If already in target language (or very short), return as-is
    if (sourceLang === targetLang || !text.trim()) {
      return res.json({ translated: text });
    }

    const cacheKey = `${text}::${targetLang}`;
    if (cache.has(cacheKey)) {
      return res.json({ translated: cache.get(cacheKey) });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Translate the following text to ${LANG_NAMES[targetLang]}.
Rules:
- Return ONLY the translated text, nothing else.
- Keep numbers, crop names, and proper nouns as-is where appropriate.
- Preserve agricultural terminology accurately.
- Do NOT add any explanation, quotes, or extra formatting.

Text to translate:
${text}`;

    const result = await model.generateContent(prompt);
    const translated = result.response.text().trim();

    // Cache for this session (max 500 entries)
    if (cache.size > 500) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    cache.set(cacheKey, translated);

    res.json({ translated });
  } catch (err) {
    console.error('[translate]', err.message);
    res.status(500).json({ error: 'Translation failed', details: err.message });
  }
}
