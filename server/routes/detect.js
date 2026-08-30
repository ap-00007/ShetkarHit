// server/routes/detect.js
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Heuristic fast-path: check Unicode ranges before hitting Gemini
function quickDetect(text) {
  if (!text || text.trim().length < 2) return null;
  const sample = text.slice(0, 100);

  // Devanagari block: U+0900–U+097F
  const devanagariCount = (sample.match(/[\u0900-\u097F]/g) || []).length;
  if (devanagariCount === 0) return 'en';

  // Hindi-only characters (ख़, ग़, ड़, ढ़, ऱ, ऴ, क़, etc.)
  const hindiSpecific = (sample.match(/[\u0958-\u095F\u0960-\u0963]/g) || []).length;
  // Common Hindi words
  const hindiWords = /\b(है|हैं|का|की|के|और|में|से|को|पर|यह|वह|जो|भी|तो|हो|था|थे|थी|नहीं)\b/u.test(sample);

  // Common Marathi words
  const marathiWords = /\b(आहे|आहेत|आणि|मध्ये|तुम्ही|माझे|असे|तर|येतो|करतो|नाही|असं|म्हणजे)\b/u.test(sample);

  if (marathiWords && !hindiWords) return 'mr';
  if (hindiWords && !marathiWords) return 'hi';
  if (devanagariCount > 0) return 'mr'; // Default Devanagari to Marathi for this app
  return null;
}

export async function detectHandler(req, res) {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'text is required' });

    // Try fast heuristic first
    const quick = quickDetect(text);
    if (quick) return res.json({ lang: quick, method: 'heuristic' });

    // Fall back to Gemini for ambiguous cases
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Detect the language of this text. Reply with ONLY one of these three codes: mr (Marathi), hi (Hindi), en (English). Nothing else.

Text: ${text.slice(0, 200)}`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim().toLowerCase();
    const lang = ['mr', 'hi', 'en'].includes(raw) ? raw : 'mr';

    res.json({ lang, method: 'gemini' });
  } catch (err) {
    console.error('[detect]', err.message);
    // Safe fallback
    res.json({ lang: 'mr', method: 'fallback' });
  }
}
