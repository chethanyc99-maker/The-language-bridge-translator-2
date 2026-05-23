import React, { useState } from "react";
import { Edit2, Settings, MessageSquare, Volume2, Award, ShieldCheck, Flame, Clock, Plus, BookOpen, Languages, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { recentActivities, userLanguages, achievements } from "../data";

interface ProfileViewProps {
  onNavigate: (tab: string) => void;
  xp: number;
  streak: number;
  accentClass: string;
  userName?: string;
  userLevel?: number;
  userEmail?: string;
  storiesReadCount?: number;
  badgesCount?: number;
  isProVerified?: boolean;
  userLocation?: string;
  userAvatarEmoji?: string;
  onUpdateName?: (name: string) => void;
  onUpdateProfile?: (updates: { name?: string; location?: string; avatarEmoji?: string }) => void;
  userLoginDate?: string;
}

export default function ProfileView({ 
  onNavigate, 
  xp, 
  streak, 
  accentClass,
  userName = "Yash",
  userLevel = 7,
  userEmail = "yash@example.com",
  storiesReadCount = 24,
  badgesCount = 12,
  isProVerified = false,
  userLocation = "India",
  userAvatarEmoji = "👩‍🎓",
  onUpdateName,
  onUpdateProfile,
  userLoginDate
}: ProfileViewProps) {
  const [learningLanguages, setLearningLanguages] = useState(userLanguages);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editNameValue, setEditNameValue] = useState(userName);
  const [editLocationValue, setEditLocationValue] = useState(userLocation);
  const [editAvatarValue, setEditAvatarValue] = useState(userAvatarEmoji);

  const handleOpenEdit = () => {
    setEditNameValue(userName);
    setEditLocationValue(userLocation);
    setEditAvatarValue(userAvatarEmoji);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = () => {
    if (!editNameValue.trim()) {
      alert("Name cannot be empty!");
      return;
    }
    if (onUpdateProfile) {
      onUpdateProfile({
        name: editNameValue.trim(),
        location: editLocationValue.trim(),
        avatarEmoji: editAvatarValue.trim()
      });
    } else if (onUpdateName) {
      onUpdateName(editNameValue.trim());
    }
    setIsEditingProfile(false);
  };

  const handleAddNewLanguage = () => {
    const nextLang = prompt("Enter the name of the language you'd like to start learning (e.g., Italian, Chinese, Korean):");
    if (nextLang && nextLang.trim()) {
      const exists = learningLanguages.some(l => l.name.toLowerCase() === nextLang.trim().toLowerCase());
      if (exists) {
        alert("You are already learning this language!");
        return;
      }
      setLearningLanguages([
        ...learningLanguages,
        { name: nextLang.trim(), level: "Beginner", percent: 5 }
      ]);
      alert(`🎉 Wonderful choice! Added ${nextLang.trim()} to your target languages portfolio.`);
    }
  };

  const handleLevelPercentageAdjustment = (langName: string, amount: number) => {
    setLearningLanguages(prev => prev.map(l => {
      if (l.name === langName) {
        return { ...l, percent: Math.min(100, Math.max(0, l.percent + amount)) };
      }
      return l;
    }));
  };

  return (
    <div className="space-y-6 text-white font-sans text-left selection:bg-purple-600">
      
      {/* Page Header */}
      <div className="flex justify-between items-center pb-2 border-b border-white/5">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">My Profile</h2>
          <p className="text-xs text-slate-400">Track your credentials, progress, and unlockable badges catalog.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenEdit}
            className="px-4 py-2 bg-[#121435] hover:bg-white/5 border border-white/5 rounded-xl text-xs font-semibold text-slate-300 flex items-center gap-1.5 cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Edit Profile</span>
          </button>
          
          <button
            onClick={() => onNavigate("settings")}
            className="p-2 bg-[#131438] border border-white/5 hover:bg-white/5 rounded-xl text-slate-300 cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero card details (Yash, Level 7 summary banner) */}
      <div className="bg-[#0b0c24] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Decorative ambient glowing center */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-48 h-48 bg-purple-600/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left z-10 w-full sm:w-auto">
          {/* Avatar frame */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 border-2 border-white/10 flex items-center justify-center p-0.5 shadow-lg shadow-purple-950">
              <div className="w-full h-full rounded-full bg-[#11122a] flex items-center justify-center text-4xl select-none">
                {userAvatarEmoji}
              </div>
            </div>
            {/* Edit overlay trigger */}
            <button 
              onClick={handleOpenEdit}
              className="absolute bottom-0 right-0 w-6 h-6 bg-purple-600 hover:bg-purple-500 rounded-full flex items-center justify-center p-1 border border-slate-900 cursor-pointer"
            >
              <Edit2 className="w-3 h-3 text-white" />
            </button>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2 justify-center sm:justify-start">
              <span>{userName}</span>
              {isProVerified && (
                <span className="text-xs bg-purple-950 border border-purple-800 text-purple-400 px-2.5 py-0.5 rounded-full font-bold">
                  PRO VERIFIED
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">{userEmail}</p>
            <div className="flex items-center gap-3 justify-center sm:justify-start text-xs text-slate-400 mt-1 font-mono">
              <span>📍 {userLocation}</span>
              <span>•</span>
              <span>Logged in: {userLoginDate || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
            </div>
          </div>
        </div>

        {/* Level metrics bar */}
        <div className="w-full md:w-80 space-y-2 z-10">
          <div className="flex justify-between items-end text-xs font-mono">
            <span className="font-bold text-slate-400">Level {userLevel} Journey</span>
            <span className="text-white font-bold">{xp} / 1000 XP</span>
          </div>

          <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(xp / 1000) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
            ></motion.div>
          </div>
          <p className="text-[10px] text-slate-500 italic mt-1 text-center md:text-right">Only {1000 - xp} XP to Level {userLevel + 1}!</p>
        </div>

      </div>

      {/* Mini stats dashboard grid row (Page 7 metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Stories Read", val: `${storiesReadCount}`, icon: BookOpen, color: "text-blue-400 bg-blue-500/10" },
          { label: "Languages", val: `${learningLanguages.length}`, icon: Languages, color: "text-cyan-400 bg-cyan-500/10" },
          { label: "Badges", val: `${badgesCount}`, icon: Award, color: "text-amber-400 bg-amber-500/10" },
          { label: "Day Streak", val: `${streak}`, icon: Flame, color: "text-orange-400 bg-orange-500/10" },
          { label: "Time Spent", val: "18h 30m", icon: Clock, color: "text-indigo-400 bg-indigo-500/10" }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-[#0b0c24] border border-white/5 rounded-xl p-3.5 flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 leading-none">{stat.label}</p>
                <p className="text-base font-bold text-white mt-1">{stat.val}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column details structure (Achievements + languages) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Side: Accomplishments Feed (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Achievements Row cards (Page 7 style slots) */}
          <div className="bg-[#0b0c24] border border-white/5 rounded-2xl p-5 shadow-lg">
            <h4 className="text-sm font-bold text-white mb-3">Earned Achievements</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 text-center">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className="bg-[#121435] border border-white/5 p-2 rounded-xl flex flex-col justify-between items-center group hover:border-purple-500/20 transition-all cursor-pointer"
                  title={`${ach.desc} (${ach.count})`}
                >
                  <span className="text-2xl mb-1 group-hover:scale-105 transition-transform">{ach.icon}</span>
                  <p className="text-[10px] font-bold text-slate-200 line-clamp-1 leading-tight">{ach.title}</p>
                  <p className="text-[8px] text-slate-500 font-mono mt-1 whitespace-nowrap">{ach.count}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity history list */}
          <div className="bg-[#0a0b1f] border border-white/5 rounded-2xl p-5 shadow-lg">
            <h4 className="text-sm font-bold text-white mb-3">Recent Activity Logs</h4>
            
            <div className="space-y-2">
              {recentActivities.map((act) => (
                <div key={act.id} className="bg-[#11122a] hover:bg-[#15173d] p-3 rounded-xl border border-white/5 flex items-center justify-between text-left transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      {act.type === "story" ? "📖" : act.type === "challenge" ? "🎯" : act.type === "chat" ? "💬" : "🔥"}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-white">{act.title}</p>
                      <p className="text-[10px] text-slate-400">{act.detail}</p>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-3 shrink-0">
                    <span className="text-[10px] text-slate-500 font-mono">{act.timeAgo}</span>
                    {act.xpGained && (
                      <span className="text-[10px] text-cyan-400 bg-cyan-950/40 border border-cyan-900/50 px-2 py-0.5 rounded font-mono">
                        +{act.xpGained} XP
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sparkline Weekly progress indicator */}
          <div className="bg-[#0b0c24] border border-white/5 rounded-2xl p-5 shadow-lg">
            <h4 className="text-sm font-bold text-white mb-1.5">Weekly Progress Chart</h4>
            <p className="text-[10px] text-slate-400">Total XP scored per weekday</p>

            <div className="h-28 w-full mt-4 bg-[#121435] border border-white/5 rounded-xl relative flex items-end justify-between p-3">
              {/* Daily bars */}
              {[
                { day: "M", val: 30 },
                { day: "T", val: 50 },
                { day: "W", val: 80 },
                { day: "T", val: 20 },
                { day: "F", val: 90 },
                { day: "S", val: 65 },
                { day: "S", val: 40 }
              ].map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 flex-1 h-full justify-end">
                  {/* Glowing Bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${day.val}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                    className="w-5 bg-gradient-to-t from-indigo-500 to-cyan-400 rounded-t shadow-[0_0_10px_rgba(34,211,238,0.2)] hover:from-indigo-400 hover:to-cyan-300 transition-all text-center relative group cursor-pointer"
                  >
                    {/* Hover Tooltip */}
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-black text-[9px] text-cyan-300 py-0.5 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow font-mono font-bold">
                      {day.val} XP
                    </span>
                  </motion.div>
                  <span className="text-[10px] text-slate-400 font-bold font-mono">{day.day}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Language Gauge + preferences (5 cols, Page 7) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-[#0b0c24] border border-white/5 rounded-2xl p-5 shadow-lg space-y-4">
            <h4 className="text-sm font-bold text-white">Languages Portfolio</h4>

            <div className="space-y-3">
              {learningLanguages.map((lang) => (
                <div key={lang.name} className="bg-[#11122a] border border-white/5 p-3 rounded-xl space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold flex items-center gap-1.5 text-slate-200">
                      <span>🌐</span>
                      <span>{lang.name}</span>
                    </span>
                    
                    <span className="text-[10px] text-purple-400 font-mono font-bold">
                      {lang.level} ({lang.percent}%)
                    </span>
                  </div>

                  {/* Manual slider adjusting tool for testing */}
                  <div className="flex items-center gap-2">
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${lang.percent}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                      ></motion.div>
                    </div>

                    {/* Quick tester increments trigger knobs */}
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => handleLevelPercentageAdjustment(lang.name, -5)}
                        className="w-4 h-4 bg-white/5 hover:bg-white/10 text-[9px] font-bold rounded flex items-center justify-center text-slate-400 pointer-events-auto cursor-pointer"
                        title="Reduce"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleLevelPercentageAdjustment(lang.name, 5)}
                        className="w-4 h-4 bg-white/5 hover:bg-white/10 text-[9px] font-bold rounded flex items-center justify-center text-slate-400 pointer-events-auto cursor-pointer"
                        title="Boost"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleAddNewLanguage}
              className="w-full mt-2 py-2.5 bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/35 hover:to-purple-600/35 border border-purple-500/30 text-purple-300 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 pointer-events-auto cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Language to Profile</span>
            </button>
          </div>

          {/* Quick preferences checklists row (Page 7) */}
          <div className="bg-[#0a0b1f] border border-white/5 rounded-2xl p-5 shadow-lg space-y-2">
            <h4 className="text-sm font-bold text-white mb-2">Preferences Summary</h4>
            
            <div className="space-y-2 text-xs">
              {[
                { title: "Daily Learning Goal", val: "20 mins / day" },
                { title: "Default App Language", val: "English (US)" },
                { title: "Visual Color Theme", val: "Space Indigo Dark" },
                { title: "Sound Actions", val: "Enabled" }
              ].map((pref, i) => (
                <div key={i} className="flex justify-between items-center bg-[#11122a] p-2.5 rounded-xl border border-white/5">
                  <span className="text-slate-400 font-medium">{pref.title}</span>
                  <span className="text-indigo-400 font-bold px-2 py-0.5 rounded bg-indigo-950/30 border border-indigo-900/30 font-mono text-[11px]">
                    {pref.val}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Edit Profile Modal Dialog Overlay */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#0b0c24] border border-white/10 p-5 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl relative"
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Customize Profile</span>
              </h3>
              <button 
                onClick={() => setIsEditingProfile(false)}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                title="Discard edits"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold block text-left">Your Username</label>
                <input
                  type="text"
                  placeholder="e.g. Yash"
                  value={editNameValue}
                  onChange={(e) => setEditNameValue(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121435] border border-white/5 focus:border-purple-400 text-white rounded-xl outline-none font-sans"
                />
              </div>

              <div className="space-y-1 font-sans">
                <label className="text-slate-400 font-semibold block text-left">Region / Location</label>
                <input
                  type="text"
                  placeholder="e.g. India"
                  value={editLocationValue}
                  onChange={(e) => setEditLocationValue(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121435] border border-white/5 focus:border-purple-400 text-white rounded-xl outline-none font-sans"
                />
              </div>

              <div className="space-y-1 font-sans">
                <label className="text-slate-400 font-semibold block text-left">Avatar Emoji</label>
                <div className="flex gap-2 mb-2 font-sans">
                  <input
                    type="text"
                    maxLength={2}
                    placeholder="👩‍🎓"
                    value={editAvatarValue}
                    onChange={(e) => setEditAvatarValue(e.target.value)}
                    className="w-12 text-center py-1.5 bg-[#121435] border border-white/5 focus:border-purple-400 text-white rounded-xl outline-none text-xl font-sans"
                  />
                  <div className="flex flex-wrap gap-1 items-center font-sans">
                    {["👩‍🎓", "👨‍🎓", "🧑‍💻", "🌍", "🚀", "🦊", "🦁", "🦄", "🎨", "📚"].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setEditAvatarValue(emoji)}
                        className={`w-7 h-7 text-sm rounded bg-[#121435] hover:bg-purple-900/30 flex items-center justify-center transition-all ${editAvatarValue === emoji ? "border border-purple-400 bg-purple-950/40" : "border border-transparent"}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-950/50 active:scale-95 transition-all cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
