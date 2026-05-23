import React from "react";
import { Sparkles, Gamepad2, Volume2, MessageSquare, Flame, Coins, ShieldCheck, ChevronRight, Star, Plus, Clock, Timer, Play, Pause, Award, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { popularLanguages } from "../data";

interface HomeViewProps {
  onNavigate: (tab: string) => void;
  xp: number;
  streak: number;
  onStartChallenge: () => void;
  accentClass: string;
  level?: number;
  storiesReadCount?: number;
  languagesCount?: number;
  badgesCount?: number;
  storyProgress?: number;
  dailyChallengeWordsDone?: number;
  userName?: string;
  onAddXP?: (amount: number) => void;
}

export default function HomeView({ 
  onNavigate, 
  xp, 
  streak, 
  onStartChallenge, 
  accentClass,
  level = 7,
  storiesReadCount = 24,
  languagesCount = 5,
  badgesCount = 12,
  storyProgress = 60,
  dailyChallengeWordsDone = 3,
  userName = "Yash",
  onAddXP = () => {}
}: HomeViewProps) {

  // Daily Goal state: 20-minute daily target
  const [minutesCompleted, setMinutesCompleted] = React.useState(() => {
    const saved = localStorage.getItem("lb_daily_minutes");
    return saved ? Math.min(20, Number(saved)) : 12; // default to 12 minutes
  });

  const [timerActive, setTimerActive] = React.useState(false);
  const [secondsRemaining, setSecondsRemaining] = React.useState(60);
  const [rewardClaimed, setRewardClaimed] = React.useState(() => {
    const saved = localStorage.getItem("lb_daily_reward_claimed");
    return saved === "true";
  });

  // Track timer ticking
  React.useEffect(() => {
    let interval: any = null;
    if (timerActive && minutesCompleted < 20) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            // Completed 1 minute!
            setMinutesCompleted((m) => {
              const nextM = Math.min(20, m + 1);
              localStorage.setItem("lb_daily_minutes", String(nextM));
              return nextM;
            });
            return 60; // reset seconds
          }
          return prev - 1;
        });
      }, 1000); // 1-second ticks
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, minutesCompleted]);

  // Pause timer automatically if goal completed
  React.useEffect(() => {
    if (minutesCompleted >= 20) {
      setTimerActive(false);
    }
  }, [minutesCompleted]);

  const handleAddMinutes = (amt: number) => {
    setMinutesCompleted((prev) => {
      const next = Math.min(20, prev + amt);
      localStorage.setItem("lb_daily_minutes", String(next));
      return next;
    });
  };

  const handleResetGoal = () => {
    setMinutesCompleted(0);
    setSecondsRemaining(60);
    setRewardClaimed(false);
    localStorage.setItem("lb_daily_minutes", "0");
    localStorage.setItem("lb_daily_reward_claimed", "false");
  };

  const handleClaimReward = () => {
    if (minutesCompleted >= 20 && !rewardClaimed) {
      onAddXP(50);
      setRewardClaimed(true);
      localStorage.setItem("lb_daily_reward_claimed", "true");
    }
  };

  const getLevelTitle = (lvl: number) => {
    if (lvl === 0) return "Beginner (Complete 1 Story to unlock!)";
    if (lvl <= 2) return "Novice";
    if (lvl <= 4) return "Language Explorer";
    if (lvl <= 6) return "Speaking Apprentice";
    if (lvl <= 8) return "Story Adventurer";
    if (lvl <= 10) return "Master Storyteller";
    return "Sovereign Linguist";
  };
  
  const bentoActions = [
    {
      title: "AI Story Generator",
      desc: "Create unique stories in any language",
      icon: Sparkles,
      color: "from-blue-600 to-indigo-600",
      action: () => onNavigate("stories"),
    },
    {
      title: "Live Translation",
      desc: "Translate text or speech instantly",
      icon: Gamepad2, // Maps custom visual
      color: "from-blue-500 to-cyan-500",
      action: () => onNavigate("translate"),
    },
    {
      title: "Voice Narration",
      desc: "Listen to stories in your language",
      icon: Volume2,
      color: "from-pink-500 to-rose-500",
      action: () => onNavigate("stories"),
    },
    {
      title: "Multi-language Chat",
      desc: "Talk with AI in multiple languages",
      icon: MessageSquare,
      color: "from-emerald-500 to-teal-500",
      action: () => onNavigate("chat"),
    },
  ];

  const trendingStories = [
    {
      title: "The Brave Little Tailor",
      language: "English",
      rating: 4.8,
      coverUrl: "https://images.unsplash.com/photo-1560942485-b2a11cc13456?auto=format&fit=crop&q=80&w=250",
    },
    {
      title: "El viaje de Sofía",
      language: "Spanish",
      rating: 4.7,
      coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=250",
    },
    {
      title: "Le Petit Prince",
      language: "French",
      rating: 4.9,
      coverUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=250",
    },
  ];

  return (
    <div className="space-y-6 text-white font-sans selection:bg-cyan-600">
      
      {/* Search and Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-xs text-slate-400">Welcome back, {userName}! Take a look at your stats and complete today's challenges.</p>
        </div>
        
        {/* Quick Search */}
        <motion.div 
          className="w-full md:w-80 relative"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 100, damping: 30, bounce: 0 }}
        >
          <input
            type="text"
            placeholder="Search stories, topics, languages..."
            onClick={() => onNavigate("stories")}
            className="w-full bg-[#11122a] border border-white/5 rounded-xl py-2 px-4 text-xs text-slate-300 placeholder:text-slate-500 focus:outline-none focus:border-[#007AFF] transition-colors pointer-events-auto cursor-pointer"
          />
        </motion.div>
      </div>

      {/* Three Columns Dashboard Header Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        
        {/* Left Side: Continue Your Story banner (6 cols) */}
        <div className="xl:col-span-6 bg-gradient-to-r from-blue-900/60 to-[#0a0b25] border border-white/10 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[300px] shadow-lg">
          {/* Background Illustration overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-35 xl:opacity-50 pointer-events-none">
            <img 
              src="https://images.unsplash.com/photo-1599733589046-9b8308b5b50d?auto=format&fit=crop&q=80&w=400"
              alt="Castle fantasy cover" 
              className="w-full h-full object-cover rounded-r-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0b25] via-[#0a0b25]/50 to-transparent"></div>
          </div>

          <div className="z-10 space-y-1">
            <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Continue Your Story</span>
            <h3 className="text-2xl font-bold tracking-tight text-white mt-1">The Lost Kingdom</h3>
            <p className="text-xs text-slate-300">Chapter {Math.max(1, Math.ceil((storyProgress / 100) * 5))}: The Hidden Path</p>
          </div>

          <div className="z-10 space-y-3.5 mt-8 max-w-md">
            {/* Linear Progress bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>Story Progress</span>
                <span className="text-white font-semibold">{storyProgress}%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${storyProgress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full"
                ></motion.div>
              </div>
            </div>

            {/* Read action */}
            <motion.button
              onClick={() => onNavigate("stories")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.93 }}
              transition={{ type: "spring", stiffness: 100, damping: 30, bounce: 0 }}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-605 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/20 hover:shadow-blue-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer outline-none"
            >
              <span>Continue Reading</span>
              <span>→</span>
            </motion.button>
          </div>
        </div>

        {/* Middle Column: Daily Learning Goal card (3 cols) */}
        <div className="xl:col-span-3 bg-[#0c0d28] border border-white/10 rounded-2xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden min-h-[300px]">
          {/* Subtle Ambient background pulse */}
          <div className="absolute -right-12 -bottom-12 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Your Daily Goal</span>
              <h3 className="text-base font-bold text-white mt-0.5 flex items-center gap-1">
                <span>20 Min Goal</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/15 text-amber-400 rounded-full border border-amber-500/20 font-medium">Daily</span>
              </h3>
            </div>
            
            <div className="w-8 h-8 bg-amber-500/10 rounded-xl border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          {/* Radial Circular Progress of studies */}
          <div className="my-3 flex items-center justify-center">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.06)" strokeWidth="8" fill="transparent" />
                <motion.circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  stroke="url(#goalGradient)" 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray="251.2" 
                  initial={{ strokeDashoffset: 251.2 }}
                  animate={{ strokeDashoffset: 251.2 - (251.2 * minutesCompleted) / 20 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  strokeLinecap="round" 
                />
                <defs>
                  <linearGradient id="goalGradient" x1="1" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFAE00" />
                    <stop offset="100%" stopColor="#FF2D55" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center select-none text-center">
                {minutesCompleted >= 20 ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-emerald-400 animate-bounce" />
                    <span className="text-[9px] text-emerald-400 uppercase tracking-wider font-semibold mt-1">Goal Met!</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl font-bold font-mono text-white leading-none">
                      {20 - minutesCompleted}
                    </span>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider mt-0.5 font-medium">Min Left</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Goals Tracker interactive info & buttons */}
          <div className="space-y-2">
            {/* Progress bar text */}
            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span>Progress</span>
              <span className="font-mono font-bold text-white">{minutesCompleted}/20 mins</span>
            </div>

            {/* Reward claim section */}
            {minutesCompleted >= 20 ? (
              rewardClaimed ? (
                <div className="py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold text-center rounded-xl flex items-center justify-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Claimed +50 XP Reward!</span>
                </div>
              ) : (
                <motion.button
                  onClick={handleClaimReward}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="w-full py-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/30 flex items-center justify-center gap-1 cursor-pointer outline-none animate-pulse"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Claim +50 XP Reward!</span>
                </motion.button>
              )
            ) : (
              <div className="flex items-center gap-1.5">
                {/* Active reading/timer state display button */}
                <motion.button
                  onClick={() => setTimerActive(!timerActive)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className={`flex-1 py-1.5 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1 border cursor-pointer outline-none transition-all ${
                    timerActive 
                      ? "bg-red-500/10 border-red-500/30 text-red-400" 
                      : "bg-[#007AFF]/10 border-[#007AFF]/20 text-[#007AFF] hover:bg-[#007AFF]/20"
                  }`}
                >
                  {timerActive ? (
                    <>
                      <Pause className="w-3 h-3 fill-current animate-pulse animate-spin" />
                      <span>Pause Focus ({secondsRemaining}s)</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 fill-current" />
                      <span>Start Study Timer</span>
                    </>
                  )}
                </motion.button>
              </div>
            )}

            {/* Quick Simulate progress buttons row */}
            <div className="grid grid-cols-3 gap-1.5 pt-0.5">
              <button
                onClick={() => handleAddMinutes(2)}
                disabled={minutesCompleted >= 20}
                className="py-1 bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 rounded-lg text-[9px] font-bold text-slate-300 transition-all cursor-pointer outline-none"
                title="Study for 2 mins"
              >
                +2 Min
              </button>
              <button
                onClick={() => handleAddMinutes(5)}
                disabled={minutesCompleted >= 20}
                className="py-1 bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 rounded-lg text-[9px] font-bold text-slate-300 transition-all cursor-pointer outline-none"
                title="Study for 5 mins"
              >
                +5 Min
              </button>
              <button
                onClick={handleResetGoal}
                className="py-1 bg-white/5 border border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 rounded-lg text-[9px] font-bold text-slate-400 transition-all cursor-pointer outline-none"
                title="Reset daily progress"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Level Info card (3 cols) */}
        <div className="xl:col-span-3 bg-[#0c0d28] border border-white/10 rounded-2xl p-4 flex flex-col justify-between shadow-lg relative min-h-[300px]">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Your Level</span>
              <h3 className="text-xl font-bold text-white mt-0.5">Level {level}</h3>
              <p className="text-xs text-cyan-400 font-medium leading-none mt-1">{getLevelTitle(level)}</p>
            </div>
            
            {/* Level Icon */}
            <div className="w-8 h-8 bg-purple-500/10 rounded-xl border border-purple-500/20 flex items-center justify-center text-purple-400">
              🏆
            </div>
          </div>

          {/* Dial Graphic inside layout */}
          <div className="my-3 flex items-center justify-center">
            <div className="relative w-28 h-28 flex items-center justify-center">
              {/* Spinning/progress circle */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.06)" strokeWidth="10" fill="transparent" />
                <motion.circle 
                  cx="50" 
                  cy="50" 
                  r="42" 
                  stroke="url(#levelGradient)" 
                  strokeWidth="10" 
                  fill="transparent" 
                  strokeDasharray="264" 
                  initial={{ strokeDashoffset: 264 }}
                  animate={{ strokeDashoffset: 264 - (264 * xp) / 1000 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  strokeLinecap="round" 
                />
                <defs>
                  <linearGradient id="levelGradient" x1="1" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00F5D4" />
                    <stop offset="100%" stopColor="#007AFF" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center select-none">
                <span className="text-xl font-bold font-mono text-white leading-none">{xp}</span>
                <span className="text-[8px] text-slate-450 uppercase tracking-widest mt-0.5">/ 1000 XP</span>
              </div>
            </div>
          </div>

          {/* Level Stats Summary */}
          <div className="grid grid-cols-3 gap-1 border-t border-white/5 pt-3 text-center">
            <div>
              <p className="text-[9px] text-slate-400">Stories</p>
              <p className="text-xs font-bold text-white mt-0.5">{storiesReadCount}</p>
            </div>
            <div className="border-x border-white/5">
              <p className="text-[9px] text-slate-400">Langs</p>
              <p className="text-xs font-bold text-white mt-0.5">{languagesCount}</p>
            </div>
            <div>
              <p className="text-[9px] text-slate-400">Badges</p>
              <p className="text-xs font-bold text-white mt-0.5">{badgesCount}</p>
            </div>
          </div>

        </div>

      </div>

      {/* Bento actions section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {bentoActions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={idx}
              onClick={action.action}
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 100, damping: 30, bounce: 0 }}
              className="bg-[#0b0c24] border border-white/5 hover:border-white/10 rounded-2xl p-4 flex items-center justify-between text-left group transition-all hover:bg-[#0f113a] pointer-events-auto cursor-pointer shadow-sm shadow-black/20 outline-none"
            >
              <div className="space-y-1 max-w-[75%]">
                <h4 className="text-xs uppercase font-medium text-slate-400 tracking-wider">Features</h4>
                <p className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{action.title}</p>
                <p className="text-[11px] text-slate-400 leading-tight">{action.desc}</p>
              </div>

              {/* Glowing circular icon */}
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${action.color} flex items-center justify-center text-white shadow-md shadow-black/30 group-hover:scale-105 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Bottom Row Layout: Daily Challenge & Trending Stories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Daily Challenge Card (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0c0d28] to-[#12143b] border border-white/10 rounded-2xl p-5 flex flex-col justify-between shadow-lg relative min-h-[240px]">
          {/* Calendar top header */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <span className="text-xl">📅</span>
              <div>
                <h4 className="text-sm font-bold text-white">Daily Challenge</h4>
                <p className="text-xs text-slate-400">Learn 5 new words in Spanish</p>
              </div>
            </div>
            
            {/* XP Badge value */}
            <span className="text-[10px] text-cyan-400 bg-cyan-950/40 border border-cyan-800/50 px-2 py-0.5 rounded-full font-mono">
              +150 XP
            </span>
          </div>

          {/* Gift illustration widget box */}
          <div className="my-5 flex items-center justify-between gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl animate-pulse">🎁</span>
              <div>
                <p className="text-xs text-white font-medium">Spanish Vocab Chest</p>
                <p className="text-[10px] text-slate-400">Unlocks and claim upon completing task</p>
              </div>
            </div>
            {/* Mini Progress */}
            <span className="text-xs font-mono font-bold text-purple-400">{dailyChallengeWordsDone} / 5 words</span>
          </div>

          <div className="space-y-3">
            {/* Progress Bar slider info */}
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(dailyChallengeWordsDone / 5) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
              ></motion.div>
            </div>

            {/* Start Button */}
            <motion.button
              onClick={onStartChallenge}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 100, damping: 30, bounce: 0 }}
              className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all text-white ${accentClass} pointer-events-auto cursor-pointer shadow-md outline-none`}
            >
              <span>Start Challenge</span>
              <span>→</span>
            </motion.button>
          </div>
        </div>

        {/* Trending Stories Panel (7 cols) */}
        <div className="lg:col-span-7 bg-[#0a0b1f] border border-white/5 rounded-2xl p-5 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-bold text-white">Trending Stories</h4>
            <motion.button 
              onClick={() => onNavigate("stories")} 
              whileHover={{ scale: 1.05, x: 2 }}
              whileTap={{ scale: 0.95 }}
              className="text-xs text-indigo-400 hover:underline flex items-center gap-0.5 font-semibold cursor-pointer outline-none"
            >
              <span>View All</span>
              <span>→</span>
            </motion.button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {trendingStories.map((story, i) => (
              <motion.div
                key={i}
                onClick={() => onNavigate("stories")}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 100, damping: 30, bounce: 0 }}
                className="bg-[#11122a] border border-white/5 rounded-xl p-2.5 text-left group hover:bg-[#15173d] transition-all cursor-pointer outline-none"
              >
                <div className="h-28 rounded-lg overflow-hidden relative mb-2">
                  <img
                    src={story.coverUrl}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  {/* Rating Badge */}
                  <div className="absolute top-1.5 right-1.5 bg-black/70 px-1.5 py-0.5 rounded-md text-[9px] flex items-center gap-0.5 text-amber-400 font-bold">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    <span>{story.rating}</span>
                  </div>
                </div>

                <h5 className="text-[11px] font-bold text-white line-clamp-1 group-hover:text-cyan-400 transition-colors">
                  {story.title}
                </h5>
                <p className="text-[10px] text-slate-400 mt-0.5">{story.language}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* Popular Languages carousel */}
      <div className="bg-[#0a0b1f] border border-white/5 rounded-2xl p-5 shadow-lg">
        <h4 className="text-sm font-bold text-white mb-4">Popular Languages</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {popularLanguages.map((lang, idx) => (
            <motion.button
              key={idx}
              onClick={() => onNavigate("stories")}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 100, damping: 30, bounce: 0 }}
              className="bg-[#11122a] border border-white/5 hover:border-white/10 p-3 rounded-xl flex items-center gap-3 text-left hover:bg-[#15173d] transition-transform pointer-events-auto cursor-pointer outline-none"
            >
              <span className="text-2xl">{lang.flag}</span>
              <div>
                <p className="text-[11px] font-bold text-white">{lang.name}</p>
                <p className="text-[9px] text-slate-500 font-mono">{lang.count} Stories</p>
              </div>
            </motion.button>
          ))}
          
          <motion.button
            onClick={() => onNavigate("stories")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 100, damping: 30, bounce: 0 }}
            className="border-2 border-dashed border-white/10 hover:border-white/20 hover:bg-white/5 p-3 rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:text-slate-200 pointer-events-auto cursor-pointer outline-none"
          >
            <Plus className="w-4 h-4" />
            <span className="text-xs font-semibold">More</span>
          </motion.button>
        </div>
      </div>

    </div>
  );
}
