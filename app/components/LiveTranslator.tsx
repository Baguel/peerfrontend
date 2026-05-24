"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const LANGUAGES = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "es", label: "Español" },
  { code: "pt", label: "Português" },
  { code: "ar", label: "العربية" },
  { code: "zh", label: "中文" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "hi", label: "हिन्दी" },
  { code: "sw", label: "Kiswahili" },
  { code: "yo", label: "Yorùbá" },
  { code: "ig", label: "Igbo" },
  { code: "ha", label: "Hausa" },
  { code: "am", label: "አማርኛ" },
  { code: "wo", label: "Wolof" },
  { code: "fon", label: "Fon" },
  { code: "bm", label: "Bambara" },
  { code: "ln", label: "Lingala" },
  { code: "zu", label: "isiZulu" },
  { code: "sn", label: "Shona" },
  { code: "rw", label: "Kinyarwanda" },
  { code: "lg", label: "Luganda" },
  { code: "ak", label: "Twi" },
  { code: "ee", label: "Ewe" },
  { code: "ti", label: "ትግርኛ" },
  { code: "om", label: "Oromo" },
  { code: "so", label: "Soomaali" },
  { code: "ff", label: "Fulfulde" },
  { code: "ber", label: "Tamazight" },
  { code: "dyu", label: "Dioula" },
];

const SPEECH_LANGS = [
  { code: "fr-FR", label: "Français" },
  { code: "en-US", label: "English" },
  { code: "de-DE", label: "Deutsch" },
  { code: "es-ES", label: "Español" },
  { code: "pt-BR", label: "Português" },
  { code: "ar-SA", label: "العربية" },
  { code: "zh-CN", label: "中文" },
  { code: "ja-JP", label: "日本語" },
  { code: "ko-KR", label: "한국어" },
  { code: "hi-IN", label: "हिन्दी" },
  { code: "sw-KE", label: "Kiswahili" },
  { code: "sw-TZ", label: "Kiswahili (TZ)" },
  { code: "yo-NG", label: "Yorùbá" },
  { code: "ha-NG", label: "Hausa" },
  { code: "am-ET", label: "አማርኛ" },
  { code: "zu-ZA", label: "isiZulu" },
  { code: "ig-NG", label: "Igbo" },
  { code: "af-ZA", label: "Afrikaans" },
  { code: "xh-ZA", label: "isiXhosa" },
  { code: "st-ZA", label: "Sesotho" },
  { code: "tn-ZA", label: "Setswana" },
  { code: "ts-ZA", label: "Xitsonga" },
  { code: "ss-ZA", label: "Siswati" },
  { code: "ve-ZA", label: "Tshivenda" },
  { code: "nr-ZA", label: "isiNdebele" },
  { code: "nso-ZA", label: "Sepedi" },
  { code: "rw-RW", label: "Kinyarwanda" },
  { code: "sn-ZW", label: "Shona" },
  { code: "so-SO", label: "Soomaali" },
  { code: "lg-UG", label: "Luganda" },
  { code: "ak-GH", label: "Twi" },
  { code: "ee-GH", label: "Ewe" },
  { code: "bm-ML", label: "Bambara" },
  { code: "ln-CD", label: "Lingala" },
  { code: "wo-SN", label: "Wolof" },
  { code: "ff-SN", label: "Fulfulde" },
  { code: "ti-ET", label: "ትግርኛ" },
  { code: "om-ET", label: "Oromo" },
  { code: "mg-MG", label: "Malagasy" },
  { code: "ny-MW", label: "Chichewa" },
  { code: "rn-BI", label: "Kirundi" },
  { code: "kg-CD", label: "Kikongo" },
  { code: "fon-BJ", label: "Fon" },
  { code: "dyu-CI", label: "Dioula" },
];

interface TranslationEntry {
  original: string;
  translated: string;
  timestamp: number;
}

interface LiveTranslatorProps {
  isActive: boolean;
}

export default function LiveTranslator({ isActive }: LiveTranslatorProps) {
  const [sourceLang, setSourceLang] = useState("fr-FR");
  const [targetLang, setTargetLang] = useState("en");
  const [isListening, setIsListening] = useState(false);
  const [entries, setEntries] = useState<TranslationEntry[]>([]);
  const [currentText, setCurrentText] = useState("");
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }
  }, []);

  const translate = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      try {
        const res = await fetch("/api/traduction", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: text.trim(), target: targetLang }),
        });
        const data = await res.json();
        const translated = data.textArray
          ? data.textArray.join(" ")
          : data.text || text;
        setEntries((prev) => [
          ...prev.slice(-49),
          { original: text.trim(), translated, timestamp: Date.now() },
        ]);
      } catch {
        setEntries((prev) => [
          ...prev.slice(-49),
          { original: text.trim(), translated: "[Erreur de traduction]", timestamp: Date.now() },
        ]);
      }
    },
    [targetLang]
  );

  const createRecognition = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = sourceLang;

    recognition.onresult = (event: any) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }
      if (final) {
        translate(final);
        setCurrentText("");
      } else {
        setCurrentText(interim);
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error !== "no-speech") {
        console.error("Speech recognition error:", event.error);
      }
    };

    recognition.onend = () => {
      if (recognitionRef.current) {
        recognition.start();
      }
    };

    return recognition;
  }, [translate, sourceLang]);

  const startListening = useCallback(() => {
    const recognition = createRecognition();
    if (!recognition) return;
    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  }, [createRecognition]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    setCurrentText("");
  }, []);

  useEffect(() => {
    if (!isActive && isListening) {
      stopListening();
    }
  }, [isActive, isListening, stopListening]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  if (!supported) {
    return (
      <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl text-amber-700 dark:text-amber-300 text-sm">
        Votre navigateur ne supporte pas la reconnaissance vocale. Utilisez Chrome ou Edge.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
      <div className="p-4 border-b border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="m5 8 6 6" />
              <path d="m4 14 6-6 2-3" />
              <path d="M2 5h12" />
              <path d="M7 2h1" />
              <path d="m22 22-5-10-5 10" />
              <path d="M14 18h6" />
            </svg>
          </div>
          <h3 className="font-bold text-sm text-slate-700 dark:text-zinc-200">
            Traduction en direct
          </h3>
        </div>

        <div className="flex items-center gap-2 flex-1 w-full sm:w-auto flex-wrap">
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            disabled={isListening}
            className="text-sm px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer disabled:opacity-50"
          >
            {SPEECH_LANGS.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>

          <span className="text-slate-400 dark:text-zinc-500 text-sm">→</span>

          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="text-sm px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>

          <button
            onClick={isListening ? stopListening : startListening}
            className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              isListening
                ? "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/60"
                : "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/60"
            }`}
          >
            {isListening ? (
              <>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Stop
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" x2="12" y1="19" y2="22" />
                </svg>
                Traduire
              </>
            )}
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="max-h-64 overflow-y-auto p-4 space-y-3">
        {entries.length === 0 && !currentText && (
          <p className="text-sm text-slate-400 dark:text-zinc-500 text-center py-4">
            {isListening
              ? "En écoute... parlez maintenant"
              : "Cliquez sur « Traduire » pour démarrer la traduction en direct"}
          </p>
        )}

        {entries.map((entry, i) => (
          <div key={entry.timestamp + i} className="space-y-1">
            <p className="text-xs text-slate-400 dark:text-zinc-500">{entry.original}</p>
            <p className="text-sm font-medium text-slate-800 dark:text-zinc-100">{entry.translated}</p>
          </div>
        ))}

        {currentText && (
          <div className="space-y-1 opacity-60">
            <p className="text-xs text-slate-400 dark:text-zinc-500 italic">{currentText}</p>
          </div>
        )}
      </div>
    </div>
  );
}
