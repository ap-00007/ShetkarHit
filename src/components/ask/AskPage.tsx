import { useState, useRef, useEffect } from 'react';
import { Mic, Send, MicOff } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import { chatSuggestions, chatResponses } from '@/data/mockData';
import type { ChatMessage } from '@/types';

export function AskPage() {
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

  const getResponse = (q: string): string => {
    const lower = q.toLowerCase();
    if (lower.includes('दर') || lower.includes('price') || lower.includes('बाजार') || lower.includes('विक्री'))
      return chatResponses.price;
    if (lower.includes('पिवळ') || lower.includes('पान') || lower.includes('कीड') || lower.includes('pest'))
      return chatResponses.pest;
    if (lower.includes('पाणी') || lower.includes('सिंचन') || lower.includes('ठिबक') || lower.includes('irrigation'))
      return chatResponses.irrigation;
    if (lower.includes('खत') || lower.includes('fertilizer') || lower.includes('युरिया'))
      return chatResponses.fertilizer;
    return chatResponses.default;
  };

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', text, ts: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const aiMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: getResponse(text),
        ts: Date.now(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 900);
  };

  const handleMic = () => {
    if (listening) { setListening(false); return; }
    setListening(true);
    setTimeout(() => {
      setListening(false);
      const sampleQ = lang === 'mr' ? 'कांद्याचे दर कधी चांगले येतील?' : 'When will onion prices improve?';
      send(sampleQ);
    }, 2200);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-[calc(100vh-57px)] lg:h-screen px-0">
      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 lg:px-0 py-5 lg:py-7">

        {/* Page title */}
        <h1 className="text-2xl lg:text-3xl font-bold text-ink mb-4 px-0">
          {lang === 'mr' ? 'विचारा' : 'Ask'}
        </h1>

        {/* Chat area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto"
        >
          {isEmpty ? (
            /* ── Hero empty state ── */
            <div className="flex flex-col items-center justify-center h-full min-h-[320px] text-center px-4">
              {/* Pulsing mic hero */}
              <div className="relative mb-6">
                <div
                  className={`absolute inset-0 rounded-full bg-brand-200 ${listening ? 'animate-ping' : ''}`}
                  style={{ transform: 'scale(1.35)' }}
                />
                <button
                  id="hero-mic-btn"
                  onClick={handleMic}
                  aria-label={listening ? 'Stop' : (lang === 'mr' ? 'बोलायला सुरुवात करा' : 'Start speaking')}
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
                  ? (lang === 'mr' ? 'ऐकत आहे...' : 'Listening...')
                  : (lang === 'mr' ? 'तुमचा प्रश्न विचारा' : 'Ask your question')}
              </h2>
              <p className="text-sm text-muted max-w-xs leading-relaxed">
                {lang === 'mr'
                  ? 'मराठीत बोला किंवा खाली लिहा — शेतीशी संबंधित कोणताही प्रश्न!'
                  : 'Speak in Marathi or type below — any farming question!'}
              </p>

              {/* Suggestion chips */}
              {!listening && (
                <div className="mt-7 flex flex-wrap justify-center gap-2 max-w-sm">
                  {chatSuggestions.map((s, i) => (
                    <button
                      key={i}
                      id={`suggestion-${i}`}
                      onClick={() => { send(s); }}
                      className="chip chip-inactive text-xs"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* ── Conversation ── */
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

              {/* Listening indicator */}
              {listening && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-urgent/10 border border-urgent/20 rounded-2xl px-4 py-2.5 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-urgent animate-pulse" />
                    <span className="text-sm text-urgent font-medium">
                      {lang === 'mr' ? 'ऐकत आहे...' : 'Listening...'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input bar — always visible */}
        <div className="mt-3 flex items-center gap-2 border-t border-ochre-100 pt-3 lg:border-0 lg:pt-0">
          <button
            id="input-mic-btn"
            onClick={handleMic}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all ${
              listening
                ? 'bg-urgent text-white animate-pulse'
                : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
            }`}
            aria-label={lang === 'mr' ? 'बोला' : 'Speak'}
          >
            <Mic className="h-5 w-5" />
          </button>
          <input
            ref={inputRef}
            id="ask-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send(input)}
            placeholder={lang === 'mr' ? 'तुमचा प्रश्न लिहा...' : 'Type your question...'}
            className="input-field flex-1 py-2.5"
          />
          <button
            id="ask-send-btn"
            onClick={() => send(input)}
            disabled={!input.trim()}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
              input.trim()
                ? 'bg-brand-700 text-white hover:bg-brand-800'
                : 'bg-ochre-100 text-muted cursor-not-allowed'
            }`}
            aria-label={lang === 'mr' ? 'पाठवा' : 'Send'}
          >
            <Send className="h-4.5 w-4.5" style={{ width: '1.125rem', height: '1.125rem' }} />
          </button>
        </div>
      </div>
    </div>
  );
}
