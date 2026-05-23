import React from "react";
import { Grid, BookOpen, Languages, MessageSquare, Trophy, User, Settings, LogOut, Database } from "lucide-react";
import { motion } from "motion/react";

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  accentClass: string;
  onLogout: () => void;
  streak: number;
  userEmail?: string;
}

export default function Sidebar({ currentTab, setCurrentTab, accentClass, onLogout, streak, userEmail }: SidebarProps) {
  const isAdmin = userEmail?.toLowerCase() === "admin@languagebridge.com" || userEmail?.toLowerCase() === "chethanyc396@gmail.com";
  
  const navItems = [
    { id: "home", label: "Home", icon: Grid },
    { id: "stories", label: "Stories", icon: BookOpen },
    { id: "translate", label: "Translate", icon: Languages },
    { id: "chat", label: "Chat", icon: MessageSquare },
    { id: "challenges", label: "Challenges", icon: Trophy },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
    ...(isAdmin ? [{ id: "database", label: "Database", icon: Database }] : []),
  ];

  // Mascot quotes according to current active tab
  const getMascotQuote = () => {
    switch (currentTab) {
      case "home":
        return "Hi, Storyteller! Let's learn something amazing today!";
      case "stories":
        return "Let's explore amazing stories together!";
      case "translate":
        return "Let's break language barriers together.";
      case "chat":
        return "Let's chat and connect with the world 🌍";
      case "challenges":
        return "Every challenge you complete makes you better!";
      case "profile":
        return "Keep learning, keep growing! 🚀";
      case "settings":
        return "Tweak your experience to make it yours!";
      case "database":
        return "Admin permission granted: modify backend profile resources directly! 🗄️";
      default:
        return "Hi, Storyteller!";
    }
  };

  return (
    <div className="w-64 bg-[#0a0b1f] border-r border-white/5 flex flex-col justify-between h-screen fixed top-0 left-0 z-20 text-white font-sans font-medium">
      
      {/* Brand Header */}
      <div className="p-5 border-b border-white/5 flex flex-col gap-1 items-start">
        <div className="flex items-center gap-2">
          {/* Circular logo */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center shadow-md shadow-blue-500/20">
            <span className="font-bold text-sm">B</span>
          </div>
          <span className="text-base font-semibold tracking-wide bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Language Bridge
          </span>
        </div>
        <span className="text-[9px] tracking-[0.25em] text-slate-500 ml-10 uppercase font-mono">
          Storyteller
        </span>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentTab === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              whileHover={{ scale: 1.04, x: 4 }}
              whileTap={{ scale: 0.92, y: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 30, bounce: 0 }}
              className={`w-full py-2.5 px-4 rounded-xl flex items-center gap-3.5 text-sm transition-all relative cursor-pointer outline-none ${
                isActive
                  ? `${accentClass} text-white font-semibold shadow-lg shadow-purple-900/30`
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <IconComponent className={`w-5 h-5 ${isActive ? "text-white animate-pulse" : "text-slate-400"}`} />
              <span>{item.label}</span>
              
              {isActive && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Logout Action */}
      <div className="px-3 py-1.5 border-t border-white/5 mx-3 mb-2">
        <motion.button
          onClick={onLogout}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.93 }}
          transition={{ type: "spring", stiffness: 100, damping: 30, bounce: 0 }}
          className="w-full py-2 px-4 rounded-xl flex items-center gap-3.5 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all cursor-pointer font-medium"
        >
          <LogOut className="w-5 h-5 text-rose-400" />
          <span>Logout Session</span>
        </motion.button>
      </div>

      {/* Robot Assistant Mascot */}
      <div className="p-4 mx-3 mb-3 bg-[#11122a] border border-white/5 rounded-2xl flex flex-col items-center text-center shadow-lg relative overflow-hidden">
        
        {/* Glow indicator */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none"></div>

        {/* Mascot Face Canvas */}
        <div className="w-16 h-12 bg-[#1b1c3c] border border-cyan-400 rounded-2xl p-1 flex flex-col justify-between shadow-[0_0_12px_rgba(34,211,238,0.2)] mb-2.5 relative">
          <div className="flex gap-1.5 justify-center mt-1">
            <div className="w-3 h-2.5 bg-cyan-300 rounded-full animate-pulse shadow-[0_0_4px_cyan]"></div>
            <div className="w-3 h-2.5 bg-cyan-300 rounded-full animate-pulse shadow-[0_0_4px_cyan]"></div>
          </div>
          <div className="w-6 h-1 bg-cyan-400 rounded-full mx-auto"></div>
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-2 bg-cyan-400 rounded"></div>
        </div>

        <p className="text-[10px] text-slate-400 font-mono tracking-tight font-sans leading-relaxed mb-2 max-w-[170px]">
          {getMascotQuote()}
        </p>

      </div>

    </div>
  );
}
