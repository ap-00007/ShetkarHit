import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Send, MicOff, Volume2, VolumeX, Sparkles, AlertCircle } from 'lucide-react';
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
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>('');
  const isListeningRef = useRef<boolean>(false);
  const silenceTimerRef = useRef<any>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  // Clean up speech synthesis & recognition on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, []);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || typing) return;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', text, ts: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    transcriptRef.current = '';
    setTyping(true);
    setVoiceError(null);

    try {
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
            ? 'माफ़ करें, अभी जवाब देने में दिक्कत हो रही है। कृपया थोड़ी देर बाद पूछें।'
            : lang === 'en'
            ? 'Sorry, I could not connect to the server right now. Please try again.'
            : 'माफ करा, सध्या उत्तर देता येत नाही. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा.',
        ts: Date.now(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setTyping(false);
    }
  }, [typing, farmContext, lang]);

  /* ─────────────────────────────────────────────
     Speech-to-Text (STT) Robust Voice Input
  ───────────────────────────────────────────── */
  const startListening = () => {
    if (typeof window === 'undefined') return;
    setVoiceError(null);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError(
        lang === 'mr'
          ? 'तुमच्या ब्राउझरमध्ये व्हॉइस इनपुट उपलब्ध नाही. कृपया Google Chrome किंवा Microsoft Edge वापरा.'
          : 'Voice input is not supported in this browser. Please use Chrome or Edge.'
      );
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true; // Keep listening continuously until user stops or finishes
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      // Locale mapping
      recognition.lang = lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
      transcriptRef.current = '';
      isListeningRef.current = true;

      recognition.onstart = () => {
        setListening(true);
        isListeningRef.current = true;
        setVoiceError(null);
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = 0; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const combined = (finalTranscript + interimTranscript).trim();
        if (combined) {
          transcriptRef.current = combined;
          setInput(combined);

          // Reset silence timer on every spoken word
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = setTimeout(() => {
            if (isListeningRef.current && transcriptRef.current.trim()) {
              stopListening();
            }
          }, 2500); // 2.5s of silence after speech -> auto-submit
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('[STT] Speech recognition event:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setVoiceError(
            lang === 'mr'
              ? 'कृपया ब्राउझरमध्ये मायक्रोफोन परवानगी सक्षम करा.'
              : 'Microphone permission denied. Please allow microphone access.'
          );
          setListening(false);
          isListeningRef.current = false;
        } else if (event.error === 'no-speech') {
          // Keep listening if user is just thinking
        }
      };

      recognition.onend = () => {
        // If stopped with speech, send it
        const spokenText = transcriptRef.current.trim();
        setListening(false);
        isListeningRef.current = false;

        if (spokenText) {
          send(spokenText);
          transcriptRef.current = '';
        }
      };

      recognition.start();
    } catch (err: any) {
      console.error('[STT] Start error:', err);
      setListening(false);
      isListeningRef.current = false;
      setVoiceError(
        lang === 'mr'
          ? 'मायक्रोफोन सुरू करता आला नाही. कृपया पुन्हा प्रयत्न करा.'
          : 'Could not start microphone. Please try again.'
      );
    }
  };

  const stopListening = () => {
    isListeningRef.current = false;
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setListening(false);
  };

  const handleMicToggle = () => {
    if (listening || isListeningRef.current) {
      stopListening();
    } else {
      startListening();
    }
  };

  /* ─────────────────────────────────────────────
     Text-to-Speech (TTS) Voice Readout
  ───────────────────────────────────────────── */
  const handleSpeak = (msgId: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (speakingId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown formatting before speaking
    const cleanText = text.replace(/[*_#`~]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);

    utterance.lang = lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.92; // Clear, calm pacing
    utterance.pitch = 1.0;

    // Pick best available voice
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find((v) =>
      v.lang.startsWith(lang === 'mr' ? 'mr' : lang === 'hi' ? 'hi' : 'en')
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(msgId);
    window.speechSynthesis.speak(utterance);
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
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-bold text-ink">
              {lang === 'mr' ? 'शेतकरी सल्लागार AI' : lang === 'hi' ? 'किसान सलाहकार AI' : 'Farm Advisor AI'}
            </h1>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-brand-700 bg-brand-50 border border-brand-200/80 px-2 py-0.5 rounded-full">
              <Sparkles className="h-3 w-3 text-brand-600" />
              Qwen-2.5
            </span>
          </div>
          <LangSelector variant="pills" />
        </div>

        {/* Error notification banner */}
        {voiceError && (
          <div className="mb-3 rounded-2xl bg-urgent/10 border border-urgent/20 p-3 text-xs text-urgent flex items-center justify-between animate-fade-in shadow-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{voiceError}</span>
            </div>
            <button
              onClick={() => setVoiceError(null)}
              className="text-urgent font-bold ml-2 hover:opacity-80"
            >
              ✕
            </button>
          </div>
        )}

        {/* Chat area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto pr-1">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[320px] text-center px-4">
              {/* Hero mic button with pulse animation */}
              <div className="relative mb-6">
                <div
                  className={`absolute inset-0 rounded-full bg-brand-200 ${listening ? 'animate-ping opacity-75' : 'opacity-30'}`}
                  style={{ transform: 'scale(1.35)' }}
                />
                <button
                  id="hero-mic-btn"
                  onClick={handleMicToggle}
                  aria-label={listening ? 'Stop speaking' : 'Start speaking'}
                  className={`relative flex h-24 w-24 items-center justify-center rounded-full shadow-xl transition-all ${
                    listening
                      ? 'bg-urgent text-white scale-110 shadow-urgent/40 ring-4 ring-urgent/30 animate-pulse'
                      : 'bg-brand-700 text-white hover:bg-brand-800 hover:scale-105 shadow-brand-700/30'
                  }`}
                >
                  {listening ? <MicOff className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
                </button>
              </div>

              <h2 className="text-lg font-bold text-ink mb-1.5">
                {listening
                  ? (lang === 'mr' ? '🎙️ ऐकत आहे... बोला' : lang === 'hi' ? '🎙️ सुन रहा हूं... बोलिए' : '🎙️ Listening... Speak now')
                  : (lang === 'mr' ? 'माईक दाबा आणि विचारा' : lang === 'hi' ? 'माइक दबाएं और पूछें' : 'Tap mic and speak')}
              </h2>
              <p className="text-xs sm:text-sm text-muted max-w-xs leading-relaxed">
                {listening
                  ? (lang === 'mr' ? 'बोलणे झाल्यावर थांबण्यासाठी पुन्हा बटण दाबा.' : 'Speak your question, then tap to stop or pause.')
                  : (lang === 'mr'
                    ? 'मराठी, हिंदी, किंवा इंग्रजीत बोला — तुमच्या पिकाबद्दल कोणताही प्रश्न!'
                    : lang === 'hi'
                    ? 'मराठी, हिंदी या अंग्रेजी में बोलें — आपकी फसल से जुड़ा कोई भी सवाल!'
                    : 'Speak in Marathi, Hindi, or English — any crop or market question!')}
              </p>

              {!listening && (
                <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-sm">
                  {chatSuggestions.map((s, i) => (
                    <button
                      key={i}
                      id={`suggestion-${i}`}
                      onClick={() => send(s)}
                      className="chip chip-inactive text-xs hover:border-brand-400 hover:text-brand-700 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3.5 pb-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                >
                  {m.role === 'assistant' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-700 mr-2 mt-1 shadow-sm">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div className="max-w-[85%] space-y-1">
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                        m.role === 'user'
                          ? 'bg-brand-700 text-white rounded-br-sm'
                          : 'bg-white border border-ochre-100 text-ink rounded-bl-sm whitespace-pre-wrap'
                      }`}
                    >
                      {m.text}
                    </div>

                    {/* TTS Speaker Listen Button for AI response */}
                    {m.role === 'assistant' && (
                      <div className="flex items-center gap-2 pl-1">
                        <button
                          onClick={() => handleSpeak(m.id, m.text)}
                          className="flex items-center gap-1.5 text-[11px] font-semibold text-brand-700 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-2.5 py-1 rounded-full border border-brand-200 transition-colors shadow-xs"
                        >
                          {speakingId === m.id ? (
                            <>
                              <VolumeX className="h-3.5 w-3.5 text-urgent" />
                              <span className="text-urgent">{lang === 'mr' ? 'थांबवा' : 'Stop'}</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="h-3.5 w-3.5 text-brand-700" />
                              <span>{lang === 'mr' ? 'ऐका (Listen)' : lang === 'hi' ? 'सुनें' : 'Listen'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <div className="flex justify-start animate-fade-in">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-700 mr-2 mt-1">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white border border-ochre-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-1.5">
                      {[0, 0.2, 0.4].map((delay, i) => (
                        <span
                          key={i}
                          className="h-2 w-2 rounded-full bg-brand-500 animate-bounce"
                          style={{ animationDelay: `${delay}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Live speech listening indicator */}
              {listening && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-urgent/10 border border-urgent/20 rounded-2xl px-4 py-2.5 flex items-center gap-2 shadow-sm">
                    <span className="h-2.5 w-2.5 rounded-full bg-urgent animate-ping" />
                    <span className="text-sm text-urgent font-medium">
                      {lang === 'mr' ? 'ऐकत आहे... बोला' : lang === 'hi' ? 'सुन रहा हूं... बोलिए' : 'Listening... Speak now'}
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
            onClick={handleMicToggle}
            aria-label="Toggle voice recording"
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all shadow-sm ${
              listening
                ? 'bg-urgent text-white animate-pulse ring-2 ring-urgent/30'
                : 'bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200'
            }`}
          >
            {listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
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
            className="input-field flex-1 py-2.5 text-sm"
          />
          <button
            id="ask-send-btn"
            onClick={() => send(input)}
            disabled={!input.trim() || typing}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all shadow-sm ${
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
