import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Volume2, Languages, Send, Mic, Phone, Video, MoreVertical, RefreshCw, Sparkles } from "lucide-react";
import { ChatMessage } from "../types";

interface ChatPartnersViewProps {
  onAddXP: (xp: number) => void;
  accentClass: string;
  onChatMessageSent?: () => void;
  onPartnerMessageReceived?: () => void;
  userName?: string;
}

export default function ChatPartnersView({ 
  onAddXP, 
  accentClass, 
  onChatMessageSent, 
  onPartnerMessageReceived,
  userName = "Learner"
}: ChatPartnersViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m1",
      sender: "user",
      text: "Hello! How are you today?",
      translation: "नमस्ते! आप कैसे हैं आज?",
      timestamp: "10:30 AM",
      status: "read",
    },
    {
      id: "m2",
      sender: "partner",
      text: "¡Hola! ¿Cómo estás hoy?",
      translation: "Hello! How are you today?",
      timestamp: "10:31 AM",
      status: "read",
    },
    {
      id: "m3",
      sender: "user",
      text: "I'm learning Spanish because I love the culture and people.",
      translation: "मैं स्पेनिश सीख रहा हूँ क्योंकि मुझे वहाँ की संस्कृति और लोग पसंद हैं।",
      timestamp: "10:32 AM",
      status: "read",
    },
    {
      id: "m4",
      sender: "partner",
      text: "¡Eso es genial! ¿Cuánto tiempo llevas aprendiendo?",
      translation: "That's great! How long have you been learning?",
      timestamp: "10:33 AM",
      status: "read",
    }
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [targetLang, setTargetLang] = useState("Spanish");
  const [isTyping, setIsTyping] = useState(false);
  const [activeMode, setActiveMode] = useState<"text" | "voice">("text");
  const [isRecording, setIsRecording] = useState(false);
  const [isChatQuotaLimit, setIsChatQuotaLimit] = useState(false);
  const [isChatFallbackActive, setIsChatFallbackActive] = useState(false);

  const listEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const speakMessage = (text: string, isUserMessage: boolean) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    if (!isUserMessage) {
      if (targetLang === "Spanish") utterance.lang = "es-ES";
      else if (targetLang === "Hindi") utterance.lang = "hi-IN";
      else if (targetLang === "Kannada") utterance.lang = "kn-IN";
      else if (targetLang === "French") utterance.lang = "fr-FR";
      else if (targetLang === "Japanese") utterance.lang = "ja-JP";
    } else {
      utterance.lang = "en-US";
    }
    
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = customMessage || inputMessage;
    if (!textToSend.trim()) return;

    const userMsgId = `user-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: userMsgId,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "sent"
    };

    setMessages(prev => [...prev, newMsg]);
    setInputMessage("");
    if (onChatMessageSent) {
      onChatMessageSent();
    } else {
      onAddXP(10); // +10 XP for active conversation triggers
    }
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat-partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, newMsg],
          targetLanguage: targetLang,
          userName: userName
        })
      });

      if (response.ok) {
        const data = await response.json();
        setIsChatFallbackActive(!!data.isFallback);
        setIsChatQuotaLimit(!!data.isQuotaExceeded);

        const replyMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: "partner",
          text: data.replyText,
          translation: data.replyTranslation,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: "read"
        };
        setMessages(prev => [...prev, replyMsg]);
        if (onPartnerMessageReceived) {
          onPartnerMessageReceived();
        } else {
          onAddXP(15);
        }
      }
    } catch (e) {
      console.error(e);
      setIsChatFallbackActive(true);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSelectQuickPhrase = (phrase: string) => {
    handleSendMessage(phrase);
  };

  const startChatSpeechRecognition = (SpeechRecognition: any) => {
    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;

      // Select language for transcription based on context
      const lowerLang = targetLang.toLowerCase();
      if (lowerLang.includes("hindi")) recognition.lang = "hi-IN";
      else if (lowerLang.includes("kannada")) recognition.lang = "kn-IN";
      else if (lowerLang.includes("spanish")) recognition.lang = "es-ES";
      else if (lowerLang.includes("french")) recognition.lang = "fr-FR";
      else if (lowerLang.includes("japanese")) recognition.lang = "ja-JP";
      else recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputMessage(prev => prev ? `${prev.trim()} ${transcript}` : transcript);
          onAddXP(15);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        if (event.error === "not-allowed") {
          setIsRecording(false);
          const confirmSimulation = window.confirm(
            "🎙️ Browser Blocked Voice Recording Inside the Preview Frame\n\n" +
            "Browsers automatically block speech-to-text input inside sandboxed iFrames.\n\n" +
            "💡 To fix this:\n" +
            "• Click the 'Open in active tab' button at the top-right of your preview frame to load the app in its own browser tab and enjoy native, zero-latency Speech Recognition!\n\n" +
            "Would you like us to activate the simulated audio transcripter helper for now so you can keep testing?"
          );
          if (confirmSimulation) {
            setIsRecording(true);
            setTimeout(() => {
              const simulatedTexts = [
                `I love practicing ${targetLang} every single day!`,
                `Could you please explain this grammatical rule?`,
                `What is the weather like where you are?`
              ];
              const text = simulatedTexts[Math.floor(Math.random() * simulatedTexts.length)];
              setInputMessage(text);
              setIsRecording(false);
              onAddXP(10);
            }, 1500);
          }
        } else if (event.error === "network") {
          setIsRecording(false);
          const confirmSimulation = window.confirm(
            "📡 Speech Recognition Network Error\n\n" +
            "The browser's Speech Recognition service is having trouble reaching its server. Web Speech API relies on online translation/recognition endpoints (e.g. Google speech servers in Google Chrome).\n\n" +
            "Would you like us to run our High-Fidelity Speech Simulator instead so you can keep on testing without service interruption?"
          );
          if (confirmSimulation) {
            setIsRecording(true);
            setTimeout(() => {
              const simulatedTexts = [
                `I love practicing ${targetLang} every single day!`,
                `Could you please explain this grammatical rule?`,
                `What is the weather like where you are?`
              ];
              const text = simulatedTexts[Math.floor(Math.random() * simulatedTexts.length)];
              setInputMessage(text);
              setIsRecording(false);
              onAddXP(10);
            }, 1500);
          }
        } else if (event.error === "no-speech") {
          setIsRecording(false);
          const confirmSimulation = window.confirm(
            "🎙️ No Speech Detected\n\n" +
            "It looks like no sound was captured by your microphone. Please make sure your microphone is unmuted, speak clearly, and try recording again.\n\n" +
            "Would you like to activate the simulated speech transcription helper for this message instead?"
          );
          if (confirmSimulation) {
            setIsRecording(true);
            setTimeout(() => {
              const simulatedTexts = [
                `I love practicing ${targetLang} every single day!`,
                `Could you please explain this grammatical rule?`,
                `What is the weather like where you are?`
              ];
              const text = simulatedTexts[Math.floor(Math.random() * simulatedTexts.length)];
              setInputMessage(text);
              setIsRecording(false);
              onAddXP(10);
            }, 1500);
          }
        } else if (event.error !== "aborted") {
          alert(`Speech recognition error: ${event.error}`);
          setIsRecording(false);
        } else {
          setIsRecording(false);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
        recognitionRef.current = null;
      };

      recognition.start();
    } catch (err) {
      console.error("Speech recognition start failed:", err);
      setIsRecording(false);
    }
  };

  const handleToggleVoiceRecord = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Web Speech API is not supported in this browser. Using simulated transcription...");
      if (isRecording) {
        setIsRecording(false);
      } else {
        setIsRecording(true);
        setTimeout(() => {
          const simulatedTexts = [
            `I love practicing ${targetLang} every single day!`,
            `Could you please explain this grammatical rule?`,
            `What is the weather like where you are?`
          ];
          const text = simulatedTexts[Math.floor(Math.random() * simulatedTexts.length)];
          setInputMessage(text);
          setIsRecording(false);
          onAddXP(10);
        }, 1800);
      }
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.error(err);
        }
      }
      setIsRecording(false);
      return;
    }

    // Checking speech-recognition approval
    const isApproved = localStorage.getItem("speech_recognition_approved") === "true";
    if (!isApproved && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const confirmAuth = window.confirm("💡 MIC PERMISSION & APPROVAL REQUIRED:\n\nTo ensure your voice is properly transcribed inside this iframe, your browser requires a quick microphone permission approval.\n\nClick OK/confirm, then choose 'Allow' when the browser asks.");
      if (confirmAuth) {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then((stream) => {
            stream.getTracks().forEach(track => track.stop());
            localStorage.setItem("speech_recognition_approved", "true");
            alert("🎙️ Approved! Speech recognition is now authorized and starting...");
            startChatSpeechRecognition(SpeechRecognition);
          })
          .catch((err) => {
            console.error(err);
            alert(`⚠️ Permission declined/failed: ${err.message || err}. Running simulated text voice instead.`);
          });
        return;
      }
    }

    startChatSpeechRecognition(SpeechRecognition);
  };

  return (
    <div className="space-y-6 text-white font-sans text-left selection:bg-purple-600">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">AI Chat Partner</h2>
          <p className="text-xs text-slate-400">Practice your speaking and writing skills with LingoBot tutor.</p>
        </div>

        {/* Global Select Language Pair */}
        <div className="flex items-center gap-2 bg-[#121435] border border-white/5 rounded-xl px-3 py-1.5 text-xs">
          <Languages className="w-4 h-4 text-cyan-400" />
          <span>English</span>
          <span className="text-slate-500">↔</span>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="bg-transparent border-none text-white focus:outline-none focus:ring-0 font-bold"
          >
            <option>Spanish</option>
            <option>Hindi</option>
            <option>Kannada</option>
            <option>French</option>
            <option>Japanese</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Left Chat Pane, Right stats helper pane (Page 5 styled exact) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Left Side: Modern messaging area (8 cols) */}
        <div className="lg:col-span-8 bg-[#0c0d28]/95 border border-white/10 rounded-2xl flex flex-col justify-between h-[520px] shadow-xl relative overflow-hidden">
          
          {/* Header row details */}
          <div className="bg-[#0b0c24] border-b border-white/5 p-4 flex justify-between items-center z-10">
            <div className="flex items-center gap-3">
              {/* Cute chatbot indicator */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center p-1 relative">
                {/* Active green spot */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-900 rounded-full"></span>
                <span className="text-xs font-bold text-white">👾</span>
              </div>
              
              <div>
                <h4 className="text-xs font-bold text-white">LingoBot AI Partner</h4>
                <p className="text-[10px] text-green-400 flex items-center gap-1">
                  <span>●</span> <span>Active Online</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-400">
              <button onClick={() => alert("Simulating native voice dial...")} className="hover:text-white pointer-events-auto cursor-pointer">
                <Phone className="w-4 h-4" />
              </button>
              <button onClick={() => alert("Simulating video interaction...")} className="hover:text-white pointer-events-auto cursor-pointer">
                <Video className="w-4 h-4" />
              </button>
              <button className="hover:text-white pointer-events-auto cursor-pointer">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages scroll box */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin">
            {messages.map((m) => {
              const isUser = m.sender === "user";
              return (
                <div
                  key={m.id}
                  className={`flex gap-2.5 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse text-right" : "mr-auto text-left"}`}
                >
                  {/* Miniature user avatar indicator */}
                  <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] ${isUser ? "bg-[#007AFF]" : "bg-[#00F5D4]"}`}>
                    {isUser ? "👤" : "👾"}
                  </div>

                  <div className="space-y-1">
                    {/* Message Bubble */}
                    <div className={`p-3 relative rounded-2xl ${
                      isUser
                        ? "bg-[#007AFF] text-white rounded-tr-none text-left"
                        : "bg-[#00B4D8] border border-cyan-400/20 text-white rounded-tl-none text-left shadow-md"
                    }`}>
                      
                      <p className="text-sm font-medium leading-relaxed font-sans">{m.text}</p>
                      
                      {m.translation && (
                        <p className={`text-[11px] mt-1.5 border-t pt-1 border-white/10 ${isUser ? "text-cyan-100" : "text-cyan-100"} italic`}>
                          {m.translation}
                        </p>
                      )}

                      {/* Small floating speak button inside bubble (Page 5 exact) */}
                      <button
                        onClick={() => speakMessage(m.text, isUser)}
                        className="absolute right-2.5 bottom-2.5 p-1 hover:bg-white/10 rounded text-slate-100/80 hover:text-white transition-all cursor-pointer"
                        title="Listen pronunciation"
                      >
                        <Volume2 className="w-3 h-3 text-white" />
                      </button>
                    </div>

                    {/* Timestamp / read badge */}
                    <p className="text-[9px] text-[#A0AAB2] font-mono mt-0.5 px-1 whitespace-nowrap">
                      {m.timestamp} {isUser && m.status === "read" && <span className="text-[#007AFF]">✓✓</span>}
                    </p>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 mr-auto bg-[#1A2232] border border-white/5 p-3 rounded-2xl rounded-tl-none">
                <span className="text-xs text-[#A0AAB2] flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin text-[#007AFF]" />
                  <span>LingoBot is typing in {targetLang}...</span>
                </span>
              </div>
            )}

            {isChatQuotaLimit ? (
              <div className="p-2.5 mx-3 mt-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-350 text-xs flex items-start gap-1.5 max-w-sm mr-auto">
                <span className="text-xs">⚡</span>
                <div className="space-y-0.5">
                  <p className="font-semibold text-amber-400 text-[10px]">Gemini Cooldown Mode</p>
                  <p className="text-[9px] text-[#A0AAB2] leading-tight">
                    Minute/daily rate limit exceeded on AI services. LingoBot safely migrated to offline practicing logs so your lesson stays warm!
                  </p>
                </div>
              </div>
            ) : isChatFallbackActive ? (
              <div className="p-2 mx-3 mt-1 bg-indigo-500/5 border border-indigo-550/15 rounded-xl text-indigo-300 text-[9px] flex items-center gap-1 max-w-xs mr-auto">
                <span className="text-xs">💡</span>
                <span className="leading-none text-indigo-400">Standard Chat engine simulated.</span>
              </div>
            ) : null}

            <div ref={listEndRef} />
          </div>

          {/* Typing input bar footer (Page 5 styled exact) */}
          <div className="bg-[#0b0c24] border-t border-white/5 p-3 flex items-center gap-2 z-10">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={`Write your message in English or ${targetLang}...`}
                className="w-full bg-[#121435] border border-white/5 rounded-xl py-2.5 pl-4 pr-10 text-xs text-slate-100 focus:outline-none focus:border-purple-600 placeholder:text-slate-600 animate-pulse-light"
              />
              <button
                onClick={handleToggleVoiceRecord}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors cursor-pointer ${
                  isRecording 
                    ? "text-red-500 bg-red-500/10 animate-pulse" 
                    : "text-slate-400 hover:text-white"
                }`}
                title="Dictate with microphone (Speech to Text)"
              >
                <Mic className="w-3.5 h-3.5" />
              </button>
            </div>
            
            {/* Quick action buttons */}
            <button
              onClick={() => handleSendMessage()}
              className={`p-2.5 ${accentClass} rounded-xl text-white shadow-md pointer-events-auto cursor-pointer`}
              title="Send reply"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right Side: Translation helper & metrics pane (4 cols) */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
          
          {/* Quick preset replies box helper (Page 5 exact) */}
          <div className="bg-[#0a0b1f] border border-white/5 rounded-2xl p-4 shadow-lg space-y-3 shrink-0">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Helper Phrases</span>
            </h4>
            
            <p className="text-[10px] text-slate-500">Tap to easily write and submit replies:</p>

            <div className="space-y-1.5 flex flex-col">
              {[
                "Hello! 👋",
                "How are you today?",
                "Where are you from?",
                "What do you like to do?",
                "Thank you so much! 🙏"
              ].map((phrase, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectQuickPhrase(phrase)}
                  className="w-full text-left bg-[#11122a] hover:bg-[#181a44] border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-300 hover:text-white transition-colors flex items-center justify-between group pointer-events-auto cursor-pointer"
                >
                  <span>{phrase}</span>
                  <span className="text-[10px] text-slate-600 group-hover:text-purple-400 transition-colors">⚡ Send</span>
                </button>
              ))}
            </div>
          </div>

          {/* Voice speak recorder waves (Page 5 bottom) */}
          <div className="bg-[#0a0b1f] border border-white/5 rounded-2xl p-4 shadow-lg text-center space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Conversation Mode</h4>
            
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#121435] rounded-xl text-xs">
              <button
                onClick={() => setActiveMode("text")}
                className={`py-1.5 rounded-lg font-semibold cursor-pointer ${activeMode === "text" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
              >
                Text Mode
              </button>
              <button
                onClick={() => setActiveMode("voice")}
                className={`py-1.5 rounded-lg font-semibold cursor-pointer ${activeMode === "voice" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
              >
                Voice Practice
              </button>
            </div>

            {/* Glowing recorder Mic button */}
            <div className="flex flex-col items-center py-2 relative">
              <button
                onClick={handleToggleVoiceRecord}
                className={`w-14 h-14 rounded-full ${isRecording ? "bg-red-500 animate-pulse border-4 border-red-900/40" : "bg-purple-600 hover:bg-purple-500 text-white"} flex items-center justify-center shadow-lg cursor-pointer`}
              >
                <Mic className="w-5 h-5" />
              </button>
              
              <p className="text-[10px] text-slate-400 mt-2">
                {isRecording ? "Transcribing speech..." : "Tap to speak in real-time"}
              </p>
            </div>

            {/* Simulated mini active waveforms */}
            <div className="flex items-end gap-1 px-4 h-6 justify-center">
              {[4, 12, 10, 24, 18, 30, 8, 14, 5, 20, 15, 8].map((val, idx) => (
                <div
                  key={idx}
                  className="w-[3px] bg-cyan-400 rounded-full"
                  style={{
                    height: `${isRecording ? val : 4}px`,
                    opacity: isRecording ? 1.0 : 0.2
                  }}
                ></div>
              ))}
            </div>

          </div>

          {/* Stats Bar checklist (Page 5 exact bottom) */}
          <div className="bg-[#0b0c24] border border-white/10 rounded-2xl p-4 shadow-md space-y-2 shrink-0 text-left">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Chat Stats</h4>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-[10px] text-slate-400">Messages</p>
                <p className="text-sm font-bold text-white mt-0.5">12</p>
              </div>
              <div className="border-x border-white/5">
                <p className="text-[10px] text-slate-400">Duration</p>
                <p className="text-sm font-bold text-white mt-0.5">15 min</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Accuracy</p>
                <p className="text-sm font-bold text-green-400 mt-0.5">98%</p>
              </div>
            </div>

            {/* Sparkline layout visualizer */}
            <div className="h-4 w-full bg-white/5 rounded overflow-hidden mt-3 relative flex items-end">
              <div className="absolute inset-x-0 h-[1.5px] bg-purple-500/30"></div>
              <svg className="w-full h-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M 0,8 Q 20,2 40,7 T 80,1 T 100,5" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
