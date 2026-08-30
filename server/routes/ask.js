const HF_ROUTER_URL = 'https://router.huggingface.co/v1/chat/completions';
const DEFAULT_MODEL = 'Qwen/Qwen2.5-7B-Instruct';
const FALLBACK_MODEL = 'meta-llama/Llama-3.1-8B-Instruct';

const getModel = () => process.env.HF_MODEL || DEFAULT_MODEL;

const LANG_NAMES = { mr: 'Marathi', hi: 'Hindi', en: 'English' };

function buildSystemPrompt(farmContext, responseLang) {
  const langName = LANG_NAMES[responseLang] || 'Marathi';
  const ctx = farmContext || {};

  return `You are ShetkariHit, a warm and knowledgeable agricultural advisor for Indian farmers.

Farmer profile:
- Name: ${ctx.name || 'the farmer'}
- Location: ${[ctx.village, ctx.district, ctx.state].filter(Boolean).join(', ') || 'Maharashtra, India'}
- Farm size: ${ctx.acres ? ctx.acres + ' acres' : 'not specified'}
- Crops: ${ctx.crops?.map(c => c.name).join(', ') || 'not specified'}
- Soil type: ${ctx.soil || 'not specified'}
- Irrigation: ${ctx.irrigation || 'not specified'}
- Water source: ${ctx.waterSource || 'not specified'}

Rules:
1. ALWAYS respond in ${langName} — this is mandatory.
2. Be warm, respectful, and use simple language that a rural farmer understands.
3. Give practical, actionable advice specific to the farmer's context above.
4. Keep answers concise — 3-5 sentences maximum unless a detailed explanation is genuinely needed.
5. When mentioning numbers, use the relevant local units (acres, quintals, mm, etc.).
6. If you don't know something, say so honestly and suggest consulting a local agricultural officer (KVK).
7. Never give medical advice or advice outside agriculture.
8. Use a conversational tone — like an experienced neighbour farmer helping out.`;
}

async function callHfChat(apiKey, model, systemPrompt, question) {
  return await fetch(HF_ROUTER_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question },
      ],
      max_tokens: 400,
      temperature: 0.6,
      top_p: 0.9,
    }),
  });
}

export async function askHandler(req, res) {
  const apiKey = process.env.HF_API_KEY;

  if (!apiKey || apiKey === 'your_huggingface_token_here') {
    return res.status(503).json({
      error: 'HF_API_KEY not configured',
      hint: 'Add your Hugging Face token to server/.env as HF_API_KEY',
    });
  }

  try {
    const { question, farmContext, lang = 'mr' } = req.body;

    if (!question?.trim()) {
      return res.status(400).json({ error: 'question is required' });
    }

    const systemPrompt = buildSystemPrompt(farmContext, lang);
    const model = getModel();

    console.log(`[hf-ask] Querying model: ${model} | lang: ${lang}`);
    let hfRes = await callHfChat(apiKey, model, systemPrompt, question);

    // If custom model failed (e.g. 404 / not available on serverless), fallback to Mistral-7B
    if (!hfRes.ok && model !== FALLBACK_MODEL) {
      const errText = await hfRes.text().catch(() => '');
      console.warn(`[hf-ask] Model ${model} returned ${hfRes.status} (${errText}). Retrying with ${FALLBACK_MODEL}...`);
      hfRes = await callHfChat(apiKey, FALLBACK_MODEL, systemPrompt, question);
    }

    if (!hfRes.ok) {
      const errText = await hfRes.text().catch(() => '');
      console.error('[hf-ask] HF Router error:', hfRes.status, errText);

      // Model loading on free tier
      if (hfRes.status === 503) {
        return res.status(503).json({
          error: 'Model is warming up, please retry in 15 seconds.',
          retryAfter: 15,
        });
      }

      return res.status(hfRes.status).json({ error: 'HF API error', details: errText });
    }

    const data = await hfRes.json();
    const answer = data.choices?.[0]?.message?.content?.trim() ?? '';

    if (!answer) {
      return res.status(500).json({ error: 'Empty response from model' });
    }

    console.log(`[hf-ask] Success | response length: ${answer.length} chars`);
    res.json({ answer, lang, model });

  } catch (err) {
    console.error('[hf-ask] Request failed:', err.message, err.cause || '');
    res.status(500).json({ error: 'Could not generate answer', details: err.message });
  }
}

// Streaming stub — can be implemented later with HF SSE support
export async function askStreamHandler(_req, res) {
  res.status(501).json({ error: 'Streaming not yet implemented for HF backend' });
}
