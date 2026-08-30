import { useState, useRef, useEffect } from 'react';
import { Mic, Send, MicOff } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import { LangSelector } from '@/components/shared/LangSelector';
import type { ChatMessage } from '@/types';

async function detectLang(text: string): Promise<string> {
  try {
    const res = await fetch('/api/detect-lang', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) return 'mr';
    const data = await res.json();
    return data.lang ?? 'mr';
  } catch {
    return 'mr';
  }
}

async function askModel(
  question: string,
  farmContext: object,
  lang: string
): Promise<string> {
  const res = await fetch('/api/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, farmContext, lang }),
  });

  // HF free tier: model cold-start takes ~20s
  if (res.status === 503) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? 'Model is loading, please retry in a moment.');
  }

  if (!res.ok) throw new Error('API error');
  const data = await res.json();
  return data.answer ?? '';
}

interface Props {
  farmContext?: Record<string, unknown>;
}

export function AskPage({ farmContext = {} }: Props) {
  const { lang } = useLang();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const send = async (text: string) => {
    if (!text.trim() || typing) return;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', text, ts: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    try {
      // Detect input language so the model responds in the same language
      const detectedLang = await detectLang(text);
      const answer = await askModel(text, farmContext, detectedLang);

      const aiMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: answer,
        ts: Date.now(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text:
          lang === 'hi'
            ? 'माफ़ करें, अभी जवाब देने में दिक्कत हो रही है। थोड़ी देर बाद पूछें।'
            : lang === 'en'
            ? 'Sorry, I could not connect to the server right now. Please try again.'
            : 'माफ करा, सध्या उत्तर देता येत नाही. थोड्या वेळाने पुन्हा प्रयत्न करा.',
        ts: Date.now(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setTyping(false);
    }
  };

  const handleMic = () => {
    if (listening) { setListening(false); return; }
    setListening(true);
    // Simulated voice input — swap with Web Speech API
    const sampleQ =
      lang === 'hi'
        ? 'कांदा कब बेचूं?'
        : lang === 'en'
        ? 'When should I sell my onions?'
        : 'कांदा कधी विकावा?';
    setTimeout(() => {
      setListening(false);
      send(sampleQ);
    }, 2200);
  };

  const chatSuggestions =
    lang === 'hi'
      ? ['कांदा कब बेचूं?', 'पत्ते पीले पड़ रहे हैं, क्या करूं?', 'ड्रिप सिंचाई कितनी दें?', 'कौन सी खाद डालें?']
      : lang === 'en'
      ? ['When should I sell my onions?', 'Leaves are yellowing, what to do?', 'How much drip irrigation?', 'Which fertilizer to use?']
      : ['कांदा कधी विकावा?', 'पाने पिवळी पडताय, काय करावे?', 'ठिबक सिंचनाचे प्रमाण किती?', 'कोणती खते वापरावी?'];

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-[calc(100vh-57px)] lg:h-screen">
      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 lg:px-0 py-5 lg:py-7">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-ink">
            {lang === 'mr' ? 'विचारा' : lang === 'hi' ? 'पूछें' : 'Ask'}
          </h1>
          <LangSelector variant="pills" />
        </div>

        {/* Chat area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[320px] text-center px-4">
              {/* Hero mic */}
              <div className="relative mb-6">
                <div
                  className={`absolute inset-0 rounded-full bg-brand-200 ${listening ? 'animate-ping' : ''}`}
                  style={{ transform: 'scale(1.35)' }}
                />
                <button
                  id="hero-mic-btn"
                  onClick={handleMic}
                  aria-label={listening ? 'Stop' : 'Start speaking'}
                  className={`relative flex h-24 w-24 items-center justify-center rounded-full shadow-lg transition-all ${
                    listening
                      ? 'bg-urgent text-white scale-105'
                      : 'bg-brand-700 text-white hover:bg-brand-800 hover:scale-105'
                  }`}
                >
                  {listening ? <MicOff className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
                </button>
              </div>

              <h2 className="text-lg font-bold text-ink mb-2">
                {listening
                  ? (lang === 'mr' ? 'ऐकत आहे...' : lang === 'hi' ? 'सुन रहा हूं...' : 'Listening...')
                  : (lang === 'mr' ? 'तुमचा प्रश्न विचारा' : lang === 'hi' ? 'अपना सवाल पूछें' : 'Ask your question')}
              </h2>
              <p className="text-sm text-muted max-w-xs leading-relaxed">
                {lang === 'mr'
                  ? 'मराठी, हिंदी, किंवा इंग्रजीत बोला — शेतीशी संबंधित कोणताही प्रश्न!'
                  : lang === 'hi'
                  ? 'मराठी, हिंदी या अंग्रेजी में बोलें — खेती से जुड़ा कोई भी सवाल!'
                  : 'Speak in Marathi, Hindi, or English — any farming question!'}
              </p>

              {!listening && (
                <div className="mt-7 flex flex-wrap justify-center gap-2 max-w-sm">
                  {chatSuggestions.map((s, i) => (
                    <button
                      key={i}
                      id={`suggestion-${i}`}
                      onClick={() => send(s)}
                      className="chip chip-inactive text-xs"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3 pb-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                >
                  {m.role === 'assistant' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-700 mr-2 mt-1">
                      <Mic className="h-3.5 w-3.5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                      m.role === 'user'
                        ? 'bg-brand-700 text-white rounded-br-sm'
                        : 'bg-white border border-ochre-100 text-ink rounded-bl-sm'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <div className="flex justify-start animate-fade-in">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-700 mr-2 mt-1">
                    <Mic className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div className="bg-white border border-ochre-100 rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {[0, 0.2, 0.4].map((delay, i) => (
                        <span
                          key={i}
                          className="h-2 w-2 rounded-full bg-brand-400 animate-bounce"
                          style={{ animationDelay: `${delay}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {listening && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-urgent/10 border border-urgent/20 rounded-2xl px-4 py-2.5 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-urgent animate-pulse" />
                    <span className="text-sm text-urgent font-medium">
                      {lang === 'mr' ? 'ऐकत आहे...' : lang === 'hi' ? 'सुन रहा हूं...' : 'Listening...'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="mt-3 flex items-center gap-2 border-t border-ochre-100 pt-3 lg:border-0 lg:pt-0">
          <button
            id="input-mic-btn"
            onClick={handleMic}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all ${
              listening ? 'bg-urgent text-white animate-pulse' : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
            }`}
          >
            <Mic className="h-5 w-5" />
          </button>
          <input
            ref={inputRef}
            id="ask-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !typing && send(input)}
            placeholder={
              lang === 'mr'
                ? 'मराठी, हिंदी, किंवा English मध्ये लिहा...'
                : lang === 'hi'
                ? 'मराठी, हिंदी या English में लिखें...'
                : 'Type in Marathi, Hindi, or English...'
            }
            className="input-field flex-1 py-2.5"
          />
          <button
            id="ask-send-btn"
            onClick={() => send(input)}
            disabled={!input.trim() || typing}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
              input.trim() && !typing
                ? 'bg-brand-700 text-white hover:bg-brand-800'
                : 'bg-ochre-100 text-muted cursor-not-allowed'
            }`}
          >
            <Send style={{ width: '1.125rem', height: '1.125rem' }} />
          </button>
        </div>
      </div>
    </div>
  );
}
