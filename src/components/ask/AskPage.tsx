import { useState, useRef, useEffect } from 'react';
import { Mic, Send, Globe } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import { chatSuggestions, chatResponses } from '@/data/mockData';
import type { ChatMessage } from '@/types';

export function AskPage() {
  const { lang, toggleLang } = useLang();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

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
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
      ts: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: getResponse(text),
        ts: Date.now(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 600);
  };

  const handleMic = () => {
    setListening((l) => !l);
    // Simulated voice input
    if (!listening) {
      setTimeout(() => {
        setListening(false);
        const sampleQ = lang === 'mr' ? 'कांद्याचे दर कधी चांगले येतील?' : 'When will onion prices improve?';
        send(sampleQ);
      }, 2000);
    }
  };

  return (
    <div className="px-4 py-5 lg:px-8 lg:py-7">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl lg:text-3xl font-bold text-ink">
            {lang === 'mr' ? 'विचारा' : 'Ask'}
          </h1>
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 rounded-full border border-ochre-200 bg-white px-3 py-1.5 text-sm font-medium text-ink hover:bg-brand-50 transition-colors"
          >
            <Globe className="h-4 w-4" />
            {lang === 'mr' ? 'English' : 'मराठी'}
          </button>
        </div>

        {/* Chat area */}
        <div
          ref={scrollRef}
          className="min-h-[300px] max-h-[500px] overflow-y-auto space-y-3 mb-4"
        >
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 mb-4">
                <Mic className="h-8 w-8 text-brand-600" />
              </div>
              <p className="text-sm text-muted max-w-xs">
                {lang === 'mr'
                  ? 'तुमचा प्रश्न बोलून किंवा लिहून विचारा. शेतीशी संबंधित कोणताही प्रश्न!'
                  : 'Ask any farming-related question by speaking or typing.'}
              </p>
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-brand-700 text-white rounded-br-sm'
                    : 'bg-white border border-ochre-100 text-ink rounded-bl-sm'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {listening && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-white border border-ochre-100 rounded-2xl rounded-bl-sm px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-urgent animate-pulse" />
                  <span className="text-sm text-muted">
                    {lang === 'mr' ? 'ऐकत आहे...' : 'Listening...'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggestion chips */}
        {messages.length === 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {chatSuggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => send(s)}
                className="chip chip-inactive text-xs"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input bar */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleMic}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${
              listening
                ? 'bg-urgent text-white animate-pulse'
                : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
            }`}
            aria-label={lang === 'mr' ? 'बोला' : 'Speak'}
          >
            <Mic className="h-6 w-6" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send(input)}
            placeholder={lang === 'mr' ? 'तुमचा प्रश्न लिहा...' : 'Type your question...'}
            className="input-field flex-1"
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim()}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${
              input.trim()
                ? 'bg-brand-700 text-white hover:bg-brand-800'
                : 'bg-ochre-200 text-muted cursor-not-allowed'
            }`}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
