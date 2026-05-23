import React, { useState, useEffect, useRef } from "react";
import { Volume2, Copy, Trash2, ArrowLeftRight, Mic, Sparkles, Star, Share2, CornerDownLeft, VolumeX, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { commonPhrases } from "../data";
import { Phrase } from "../types";

interface TranslatorViewProps {
  onAddXP: (xp: number) => void;
  accentClass: string;
  onTranslationSuccess?: () => void;
  onVoiceInputSuccess?: () => void;
}

export default function TranslatorView({ onAddXP, accentClass, onTranslationSuccess, onVoiceInputSuccess }: TranslatorViewProps) {
  const [sourceText, setSourceText] = useState("Hello! How are you today? It's great to connect with you. Let's learn and grow together.");
  const [translatedText, setTranslatedText] = useState("नमस्ते! आप कैसे हैं? आपसे जुड़कर बहुत अच्छा लगा। आइए साथ में सीखें और बढ़ें।");
  
  const [sourceLanguage, setSourceLanguage] = useState("English");
  const [targetLanguage, setTargetLanguage] = useState("Hindi");
  const [isTranslating, setIsTranslating] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"none" | "source" | "target">("none");
  const [favoritePhrases, setFavoritePhrases] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isQuotaExceeded, setIsQuotaExceeded] = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Auto-trigger translation whenever sourceText or targetLanguage changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (sourceText.trim()) {
        triggerTranslation();
      } else {
        setTranslatedText("");
        setIsFallback(false);
        setIsQuotaExceeded(false);
      }
    }, 1000); // 1-second debounce to prevent spamming

    return () => clearTimeout(delayDebounceFn);
  }, [sourceText, targetLanguage]);

  const triggerTranslation = async () => {
    if (!sourceText.trim()) return;
    setIsTranslating(true);
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: sourceText,
          sourceLang: sourceLanguage,
          targetLang: targetLanguage,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setTranslatedText(data.translatedText);
        setIsFallback(!!data.isFallback);
        setIsQuotaExceeded(!!data.isQuotaExceeded);
        
        if (onTranslationSuccess) {
          onTranslationSuccess();
        } else {
          onAddXP(5); // Reward xp for translating
        }
      }
    } catch (err) {
      console.error("Translation api failure:", err);
      setIsFallback(true);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSwapLanguages = () => {
    const prevSource = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(prevSource);
    
    const prevText = sourceText;
    setSourceText(translatedText);
    setTranslatedText(prevText);
  };

  const handleSpeakText = (text: string, lang: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    const lowerLang = lang.toLowerCase();
    if (lowerLang.includes("hindi")) utterance.lang = "hi-IN";
    else if(lowerLang.includes("english")) utterance.lang = "en-US";
    else if (lowerLang.includes("kannada")) utterance.lang = "kn-IN";
    else if (lowerLang.includes("spanish")) utterance.lang = "es-ES";
    else if (lowerLang.includes("french")) utterance.lang = "fr-FR";
    else if (lowerLang.includes("japanese")) utterance.lang = "ja-JP";
    else utterance.lang = "en-US";

    window.speechSynthesis.speak(utterance);
  };

  const handleCopyToClipboard = (text: string, type: "source" | "target") => {
    navigator.clipboard.writeText(text);
    setCopyStatus(type);
    setTimeout(() => {
      setCopyStatus("none");
    }, 2000);
  };

  const handleSelectPhrase = (phrase: Phrase) => {
    setSourceText(phrase.english);
    // Directly speech phrase target
    handleSpeakText(phrase.english, "English");
  };

  const handleToggleFavorite = (text: string) => {
    if (favoritePhrases.includes(text)) {
      setFavoritePhrases(favoritePhrases.filter(x => x !== text));
    } else {
      setFavoritePhrases([...favoritePhrases, text]);
    }
  };

  const startSpeechRecognition = (SpeechRecognition: any) => {
    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;

      // Select translation source speech language
      const lowerLang = sourceLanguage.toLowerCase();
      if (lowerLang.includes("hindi")) recognition.lang = "hi-IN";
      else if (lowerLang.includes("kannada")) recognition.lang = "kn-IN";
      else if (lowerLang.includes("spanish")) recognition.lang = "es-ES";
      else if (lowerLang.includes("french")) recognition.lang = "fr-FR";
      else if (lowerLang.includes("japanese")) recognition.lang = "ja-JP";
      else recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const SpeechToTextResult = event.results[0][0].transcript;
        if (SpeechToTextResult) {
          setSourceText(prev => prev ? `${prev.trim()} ${SpeechToTextResult}` : SpeechToTextResult);
          onAddXP(15);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        if (event.error === "not-allowed") {
          setIsListening(false);
          const confirmSimulation = window.confirm(
            "🎙️ Browser Blocked Audio Recognition Inside the Preview Frame\n\n" +
            "Browsers automatically block live Speech Recognition inside secure iFrames by default.\n\n" +
            "💡 To fix this:\n" +
            "• Click the 'Open in active tab' button at the top-right of your preview frame to load the app in its own browser tab and enjoy native, zero-latency Speech Recognition!\n\n" +
            "Would you like us to run our High-Fidelity Speech Simulator for now so you can keep testing?"
          );
          if (confirmSimulation) {
            setIsListening(true);
            setTimeout(() => {
              const mockSpeeches = [
                "Hello, I am learning a new language today!",
                "Can you translate this sentence for me, please?",
                "This translation app works beautifully."
              ];
              const selectedSpeech = mockSpeeches[Math.floor(Math.random() * mockSpeeches.length)];
              setSourceText(selectedSpeech);
              setIsListening(false);
              if (onVoiceInputSuccess) {
                onVoiceInputSuccess();
              } else {
                onAddXP(10);
              }
            }, 1500);
          }
        } else if (event.error === "network") {
          setIsListening(false);
          const confirmSimulation = window.confirm(
            "📡 Speech Recognition Network Error\n\n" +
            "The browser's Speech Recognition service is having trouble reaching its server. Web Speech API relies on online translation/recognition endpoints (e.g. Google speech servers in Google Chrome).\n\n" +
            "Would you like us to run our High-Fidelity Speech Simulator instead so you can keep on testing without service interruption?"
          );
          if (confirmSimulation) {
            setIsListening(true);
            setTimeout(() => {
              const mockSpeeches = [
                "Hello, I am learning a new language today!",
                "Can you translate this sentence for me, please?",
                "This translation app works beautifully."
              ];
              const selectedSpeech = mockSpeeches[Math.floor(Math.random() * mockSpeeches.length)];
              setSourceText(selectedSpeech);
              setIsListening(false);
              if (onVoiceInputSuccess) {
                onVoiceInputSuccess();
              } else {
                onAddXP(10);
              }
            }, 1500);
          }
        } else if (event.error === "no-speech") {
          setIsListening(false);
          const confirmSimulation = window.confirm(
            "🎙️ No Speech Detected\n\n" +
            "It looks like no sound was captured by your microphone. Please make sure your microphone is unmuted, speak clearly, and try recording again.\n\n" +
            "Would you like to run our High-Fidelity Speech Simulator helper for this action instead?"
          );
          if (confirmSimulation) {
            setIsListening(true);
            setTimeout(() => {
              const mockSpeeches = [
                "Hello, I am learning a new language today!",
                "Can you translate this sentence for me, please?",
                "This translation app works beautifully."
              ];
              const selectedSpeech = mockSpeeches[Math.floor(Math.random() * mockSpeeches.length)];
              setSourceText(selectedSpeech);
              setIsListening(false);
              if (onVoiceInputSuccess) {
                onVoiceInputSuccess();
              } else {
                onAddXP(10);
              }
            }, 1500);
          }
        } else if (event.error !== "aborted") {
          alert(`Speech recognition error: ${event.error}. Please try again.`);
          setIsListening(false);
        } else {
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognition.start();
    } catch (e) {
      console.error("Speech Recognition failed to start:", e);
      setIsListening(false);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Web Speech API is not supported in this browser. Running a simulated voice input demo...");
      setIsListening(true);
      setTimeout(() => {
        const mockSpeeches = [
          "Welcome to Language Bridge! Let's build something nice.",
          "How is your learning progress today?",
          "Stories are the best way to understand diverse cultures."
        ];
        const selectedSpeech = mockSpeeches[Math.floor(Math.random() * mockSpeeches.length)];
        setSourceText(selectedSpeech);
        setIsListening(false);
        if (onVoiceInputSuccess) {
          onVoiceInputSuccess();
        } else {
          onAddXP(10);
        }
      }, 2000);
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error(e);
        }
      }
      setIsListening(false);
      return;
    }

    // Interactive Pre-Flight Microphone Iframe origin permission check
    const isApproved = localStorage.getItem("speech_recognition_approved") === "true";
    if (!isApproved && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const confirmAuth = window.confirm("💡 MICROPHONE APPROVAL REQUISITE:\n\nTo capture your voice within this secure sandboxed context, the browser requires your proactive microphone approval.\n\nClick OK, then select 'Allow' in the permission prompt.");
      if (confirmAuth) {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then((stream) => {
            stream.getTracks().forEach(track => track.stop());
            localStorage.setItem("speech_recognition_approved", "true");
            alert("🎙️ Connection Verified! Speech recognition is now authorized and starting...");
            startSpeechRecognition(SpeechRecognition);
          })
          .catch((err) => {
            console.error(err);
            alert(`⚠️ Access Declined: ${err.message || err}. Running simulated narration helper instead.`);
          });
        return;
      }
    }

    startSpeechRecognition(SpeechRecognition);
  };

  return (
    <div className="space-y-6 text-white font-sans text-left selection:bg-[#007AFF]">
      
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">Live Translator</h2>
          <p className="text-xs text-slate-400">Translate phrases between any standard languages with speech support.</p>
        </div>
        
        {/* Toggle Mode */}
        <motion.button
          onClick={() => alert("Conversation mode tracks audio dialogues between two users simultaneously.")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-[#121435] border border-white/5 hover:bg-white/5 rounded-xl text-xs font-semibold flex items-center gap-1.5 pointer-events-auto cursor-pointer text-slate-300 outline-none"
        >
          <span>🗣️ Conversation Mode</span>
        </motion.button>
      </div>

      {/* Language Selector Bar with swap arrows in the middle (Page 4 layout exact) */}
      <div className="bg-[#0b0c24] border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-4 max-w-2xl">
        
        {/* Source selector */}
        <div className="flex-1">
          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">From</label>
          <select
            value={sourceLanguage}
            onChange={(e) => setSourceLanguage(e.target.value)}
            className="w-full bg-[#121435] border border-white/5 rounded-lg py-1.5 px-2.5 text-xs text-white focus:outline-none cursor-pointer"
          >
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
            <option>Japanese</option>
            <option>Hindi</option>
            <option>Kannada</option>
          </select>
        </div>

        {/* Swap arrows button */}
        <motion.button
          onClick={handleSwapLanguages}
          whileHover={{ scale: 1.15, rotate: 180 }}
          whileTap={{ scale: 0.85 }}
          transition={{ type: "spring", stiffness: 100, damping: 30, bounce: 0 }}
          className="p-2.5 mt-4 bg-cyan-500/10 hover:bg-cyan-500 hover:text-white rounded-xl text-cyan-400 transition-all pointer-events-auto cursor-pointer outline-none"
          title="Swap Languages"
        >
          <ArrowLeftRight className="w-4 h-4" />
        </motion.button>

        {/* Target selector */}
        <div className="flex-1">
          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">To</label>
          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="w-full bg-[#121435] border border-white/5 rounded-lg py-1.5 px-2.5 text-xs text-white focus:outline-none cursor-pointer"
          >
            <option>Hindi</option>
            <option>Kannada</option>
            <option>Spanish</option>
            <option>French</option>
            <option>Japanese</option>
            <option>English</option>
          </select>
        </div>

      </div>

      {/* Side-by-side Dual Panels Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Left Side: Source Language Panel Box */}
        <div className="bg-[#0b0c24] border border-white/5 rounded-2xl p-5 flex flex-col justify-between shadow-lg relative min-h-[250px]">
          
          <div className="space-y-3 flex-1 flex flex-col">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span className="font-semibold text-cyan-400">{sourceLanguage} (Detected)</span>
              
              {/* Clear field */}
              {sourceText && (
                <motion.button
                  onClick={() => setSourceText("")}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="hover:text-red-400 pointer-events-auto cursor-pointer outline-none"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </motion.button>
              )}
            </div>

            {/* Input target */}
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              maxLength={5000}
              placeholder="Type anything here to translate..."
              className="w-full bg-transparent border-none resize-none focus:outline-none text-base text-slate-100 flex-1 min-h-[140px] focus:ring-0 leading-relaxed font-sans placeholder:text-slate-600"
            />
          </div>

          {/* Source Box Footer Details */}
          <div className="flex justify-between items-center pt-3 border-t border-white/5 text-slate-400">
            <div className="flex items-center gap-1.5">
              
              {/* Speak buttons */}
              <motion.button
                disabled={!sourceText}
                onClick={() => handleSpeakText(sourceText, sourceLanguage)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 hover:bg-white/5 hover:text-white rounded-lg transition-colors disabled:opacity-30 cursor-pointer outline-none"
                title="Pronounce"
              >
                <Volume2 className="w-4 h-4 text-cyan-400" />
              </motion.button>

              {/* Copy action */}
              <motion.button
                disabled={!sourceText}
                onClick={() => handleCopyToClipboard(sourceText, "source")}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 hover:bg-white/5 hover:text-white rounded-lg transition-colors relative disabled:opacity-30 cursor-pointer outline-none"
                title="Copy text"
              >
                <Copy className="w-4 h-4" />
                {copyStatus === "source" && (
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-black text-[10px] text-green-400 py-0.5 px-1.5 rounded whitespace-nowrap shadow">
                    Copied!
                  </span>
                )}
              </motion.button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono">{sourceText.length}/5000</span>
              
              {/* Small Mic button */}
              <motion.button
                onClick={handleVoiceInput}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 100, damping: 30, bounce: 0 }}
                className={`p-2 rounded-full ${isListening ? "bg-red-500 text-white animate-ping" : "bg-[#007AFF] hover:bg-blue-600 text-white"} transition-all cursor-pointer outline-none`}
              >
                <Mic className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>

        </div>

        {/* Right Side: Translated Output Panel Box */}
        <div className="bg-[#0b0c24] border border-white/5 rounded-2xl p-5 flex flex-col justify-between shadow-lg relative min-h-[250px] overflow-hidden">
          
          {/* Subtle indicator background gradient */}
          {isTranslating && (
            <div className="absolute inset-0 bg-indigo-500/2 animate-pulse pointer-events-none"></div>
          )}

          <div className="space-y-3 flex-1 flex flex-col justify-start">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span className="font-semibold text-cyan-400">{targetLanguage}</span>
              {isTranslating && (
                <span className="text-[9px] text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded font-mono animate-pulse">
                  AI translating...
                </span>
              )}
            </div>

            {isQuotaExceeded ? (
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2 text-amber-350 text-xs my-1">
                <span className="text-xs">⚡</span>
                <div className="space-y-0.5">
                  <p className="font-semibold text-amber-400">Gemini Limit Reached</p>
                  <p className="text-[10px] text-amber-400/80 leading-normal">
                    AI free-tier daily or minute quota limit hit. The app has seamlessly enabled the high-fidelity translation simulator to keep your lessons going!
                  </p>
                </div>
              </div>
            ) : isFallback ? (
              <div className="p-2 bg-indigo-500/10 border border-indigo-550/20 rounded-xl flex items-start gap-1.5 text-indigo-300 text-[10px] my-1">
                <span className="text-xs">💡</span>
                <p className="font-medium text-indigo-400/90 leading-tight">
                  High-Fidelity Translation Simulator Active.
                </p>
              </div>
            ) : null}

            {/* Translated Display paragraph */}
            {translatedText ? (
              <p className="text-base leading-relaxed text-slate-100 flex-1 block min-h-[140px] font-medium whitespace-pre-wrap select-all selection:bg-cyan-600">
                {translatedText}
              </p>
            ) : (
              <p className="text-xs text-slate-600 flex-1 italic select-none">
                Translations will pop up here as you type...
              </p>
            )}
          </div>

          {/* Target Box Footer Details */}
          <div className="flex justify-between items-center pt-3 border-t border-white/5 text-slate-400">
            <div className="flex items-center gap-1.5">
              
              {/* Speak target */}
              <motion.button
                disabled={!translatedText}
                onClick={() => handleSpeakText(translatedText, targetLanguage)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 hover:bg-white/5 hover:text-white rounded-lg transition-colors disabled:opacity-30 cursor-pointer outline-none"
                title="Pronounce translation"
              >
                <Volume2 className="w-4 h-4 text-cyan-400" />
              </motion.button>

              {/* Copy target */}
              <motion.button
                disabled={!translatedText}
                onClick={() => handleCopyToClipboard(translatedText, "target")}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 hover:bg-white/5 hover:text-white rounded-lg transition-colors relative disabled:opacity-30 cursor-pointer outline-none"
                title="Copy translated"
              >
                <Copy className="w-4 h-4" />
                {copyStatus === "target" && (
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-black text-[10px] text-green-400 py-0.5 px-1.5 rounded whitespace-nowrap shadow">
                    Copied!
                  </span>
                )}
              </motion.button>

              {/* Favorite star */}
              <motion.button
                disabled={!translatedText}
                onClick={() => handleToggleFavorite(translatedText)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-amber-400 disabled:opacity-30 cursor-pointer outline-none"
              >
                <Star className={`w-4 h-4 ${favoritePhrases.includes(translatedText) ? "fill-amber-400 text-amber-400" : ""}`} />
              </motion.button>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                disabled={!translatedText}
                onClick={() => alert(`Review: ${translatedText}`)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer outline-none"
              >
                <Share2 className="w-3.5 h-3.5" />
              </motion.button>
              
              {/* Bottom mic button */}
              <motion.button
                onClick={handleVoiceInput}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-[#007AFF] hover:bg-blue-600 text-white cursor-pointer outline-none"
                title="Pronounce speaking check"
              >
                <Mic className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>

        </div>

      </div>

      {/* Common phrases bento row (Page 4) */}
      <div className="bg-[#0a0b1f] border border-white/5 rounded-2xl p-5 shadow-lg">
        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <span>📚 Common Phrases</span>
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">(Tap on any to load)</span>
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {commonPhrases.map((phrase) => (
            <motion.button
              key={phrase.id}
              onClick={() => handleSelectPhrase(phrase)}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 100, damping: 30, bounce: 0 }}
              className="bg-[#11122a] border border-white/5 hover:border-[#007AFF]/20 p-3 rounded-xl flex items-center justify-between text-left group hover:bg-[#15173d] transition-all pointer-events-auto cursor-pointer outline-none"
            >
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-slate-300 block">{phrase.english}</span>
                <span className="text-xs text-cyan-400 font-medium block">{phrase.translation}</span>
              </div>
              <span className="text-xl group-hover:scale-110 transition-transform">{phrase.emoji}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Bottom Speech Bar / Waveforms visualizer row (Page 4 bottom) */}
      <div className="bg-gradient-to-r from-blue-950/60 via-[#0c0d28]/80 to-[#110e20]/60 border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Big Mic Button */}
          <motion.button
            onClick={handleVoiceInput}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 100, damping: 30, bounce: 0 }}
            className={`w-14 h-14 rounded-full ${isListening ? "bg-red-500 animate-pulse" : "bg-gradient-to-tr from-blue-500 to-cyan-500"} flex items-center justify-center text-white shadow-lg cursor-pointer outline-none`}
          >
            <Mic className="w-6 h-6" />
          </motion.button>
          
          <div>
            <p className="text-sm font-bold text-white">Tap to Speak / Voice Input</p>
            <p className="text-xs text-slate-400">
              {isListening ? "Listening... start talking now" : "Speak in English to hear translated pronunciation"}
            </p>
          </div>
        </div>

        {/* Realistic interactive Audio waveform indicators (Page 4 style) */}
        <div className="flex items-end gap-[3px] h-10 w-44 shrink-0 px-2 justify-center">
          {[8, 12, 28, 18, 6, 24, 38, 14, 22, 10, 30, 16, 25, 4, 18, 12].map((val, idx) => (
            <div
              key={idx}
              className={`w-[4px] rounded-full transition-all duration-300 ${isListening ? "bg-red-400" : "bg-cyan-500"}`}
              style={{
                height: `${isListening ? Math.min(40, val * 1.5) : Math.max(4, val / 3)}px`,
                opacity: isListening ? 1.0 : 0.4
              }}
            ></div>
          ))}
        </div>

        <div className="text-right shrink-0">
          <span className="text-xs text-cyan-400 font-bold bg-cyan-950/30 px-3 py-1.5 rounded-xl border border-cyan-800/40 font-mono">
            Auto-Detect English
          </span>
        </div>

      </div>

    </div>
  );
}
