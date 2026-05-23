import React, { useState, useEffect } from "react";
import { Award, Star, Flame, Trophy, Calendar, Sparkles, CheckCircle, Gift, ChevronRight, Lock } from "lucide-react";
import { defaultTasks, leaderboard } from "../data";

interface ChallengesViewProps {
  xp: number;
  onAddXP: (xpGained: number) => void;
  streak: number;
  accentClass: string;
  onDailyChallengeIncrement?: () => void;
  onClaimChest?: () => void;
  leaderboardData?: any[];
  currentEmail?: string;
}

export default function ChallengesView({ 
  xp, 
  onAddXP, 
  streak, 
  accentClass, 
  onDailyChallengeIncrement, 
  onClaimChest,
  leaderboardData = [],
  currentEmail = ""
}: ChallengesViewProps) {
  const [tasksList, setTasksList] = useState(() => {
    const stored = localStorage.getItem("lingo_daily_tasks_list");
    if (stored) {
      try { return JSON.parse(stored); } catch (e) {}
    }
    return defaultTasks;
  });
  const [dailyClaimed, setDailyClaimed] = useState(false);
  const [countdown, setCountdown] = useState({ hrs: 23, mins: 59, secs: 59 });
  const [loginHistory, setLoginHistory] = useState<string[]>([]);

  const liveLeaderboard = leaderboardData && leaderboardData.length > 0
    ? leaderboardData.map(user => ({
        ...user,
        isSelf: user.email?.toLowerCase() === currentEmail?.toLowerCase()
      }))
    : leaderboard;

  // Helper inside timezone context
  const getTodayDateStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const dateVal = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${dateVal}`;
  };

  // Setup Tasks state, trigger daily resets, load logins based on calendar midnight
  useEffect(() => {
    const today = getTodayDateStr();

    // 1. Setup daily tasks logic
    const storedTasksStr = localStorage.getItem("lingo_daily_tasks_list");
    let currentTasks = defaultTasks;
    if (storedTasksStr) {
      try {
        currentTasks = JSON.parse(storedTasksStr);
      } catch (e) {
        currentTasks = defaultTasks;
      }
    }

    const lastResetDate = localStorage.getItem("lingo_tasks_last_reset_date");

    if (!lastResetDate) {
      localStorage.setItem("lingo_tasks_last_reset_date", today);
      localStorage.setItem("lingo_daily_tasks_list", JSON.stringify(defaultTasks));
      setTasksList(defaultTasks);
    } else if (lastResetDate !== today) {
      // Automatically reset progress to 0 on a new day based on the systems calendar
      const resetTasks = currentTasks.map(t => ({ ...t, progress: 0 }));
      localStorage.setItem("lingo_tasks_last_reset_date", today);
      localStorage.setItem("lingo_daily_tasks_list", JSON.stringify(resetTasks));
      setTasksList(resetTasks);
    } else {
      setTasksList(currentTasks);
    }

    // 2. Setup login history logic
    const storedLogins = localStorage.getItem("lingo_login_history");
    let history: string[] = [];
    if (storedLogins) {
      try {
        history = JSON.parse(storedLogins);
      } catch (e) {
        history = [];
      }
    }
    if (!history.includes(today)) {
      history.push(today);
      localStorage.setItem("lingo_login_history", JSON.stringify(history));
    }
    setLoginHistory(history);
  }, []);

  // Countdown timer effect based on actual system/global clock until midnight
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
      const remainingMs = Math.max(0, midnight.getTime() - now.getTime());

      if (remainingMs <= 1000) {
        // Rolled over to a new calendar day! Trigger tasks reset
        const today = getTodayDateStr();
        const storedTasksStr = localStorage.getItem("lingo_daily_tasks_list");
        let currentTasks = defaultTasks;
        if (storedTasksStr) {
          try { currentTasks = JSON.parse(storedTasksStr); } catch (e) {}
        }
        const resetTasks = currentTasks.map(t => ({ ...t, progress: 0 }));
        localStorage.setItem("lingo_tasks_last_reset_date", today);
        localStorage.setItem("lingo_daily_tasks_list", JSON.stringify(resetTasks));
        setTasksList(resetTasks);
      }

      const hrs = Math.floor(remainingMs / (1000 * 60 * 60));
      const mins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((remainingMs % (1000 * 60)) / 1000);

      setCountdown({ hrs, mins, secs });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleIncrementProgress = (taskId: string, rewardValue: number) => {
    setTasksList(prev => {
      const updated = prev.map(t => {
        if (t.id === taskId) {
          const nextProgress = Math.min(t.total, t.progress + 1);
          if (nextProgress === t.total && t.progress < t.total) {
            onAddXP(rewardValue);
            alert(`🎉 Outstanding! You completed the task: "${t.title}" and gained +${rewardValue} XP!`);
            if (onDailyChallengeIncrement) {
              onDailyChallengeIncrement();
            }
          } else if (nextProgress < t.total) {
            onAddXP(10); // small progress award
            if (onDailyChallengeIncrement) {
              onDailyChallengeIncrement();
            }
          }
          return { ...t, progress: nextProgress };
        }
        return t;
      });
      localStorage.setItem("lingo_daily_tasks_list", JSON.stringify(updated));
      return updated;
    });
  };

  const handleClaimChestReward = () => {
    if (dailyClaimed) {
      alert("You already claimed today's continuous streak chest reward!");
      return;
    }
    if (onClaimChest) {
      onClaimChest();
    } else {
      onAddXP(100);
    }
    setDailyClaimed(true);
    alert("🎁 Incredible! Opened the Spanish Vocab Chest and claimed +100 XP! Keep that streak hot! 🔥");
  };

  // Compute weekdays dynamically relative to current ISO week
  const getWeekdaysData = () => {
    const weekdaysNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const now = new Date();
    
    // Get current day of week: 0 is Sun, 1 is Mon, 2 is Tue, etc.
    const currentDayOfWeek = now.getDay();
    // Monday offset
    const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    
    const monday = new Date();
    monday.setDate(now.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);

    const todayStr = getTodayDateStr();

    return weekdaysNames.map((name, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const dateVal = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${dateVal}`;
      
      const isToday = dateStr === todayStr;
      
      let status: "completed" | "missed" | "future" = "future";
      
      if (isToday) {
        status = "completed"; // they are in the app right now!
      } else {
        const compareDate = new Date(d);
        compareDate.setHours(0, 0, 0, 0);
        
        const todayMidnight = new Date();
        todayMidnight.setHours(0, 0, 0, 0);

        if (compareDate.getTime() < todayMidnight.getTime()) {
          // If in past and logged in => checked/ticked, else missed (X mark)
          status = loginHistory.includes(dateStr) ? "completed" : "missed";
        } else {
          status = "future";
        }
      }

      return {
        name,
        dateStr,
        dayNum: d.getDate(),
        status
      };
    });
  };

  const weekdays = getWeekdaysData();

  return (
    <div className="space-y-6 text-white font-sans text-left selection:bg-purple-600">
      
      {/* Page Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight">Daily Challenges</h2>
        <p className="text-xs text-slate-400">Complete objectives, log everyday progress, and scale the ranks.</p>
      </div>

      {/* Main Column Grid Layout */}
      <div className="space-y-5">
        
        {/* Main Daily Streak Tracking Card (Page 6 Header exact style) */}
        <div className="bg-gradient-to-r from-blue-950/80 via-[#0c0d2a] to-purple-950/80 border border-white/10 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between gap-6">
          
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400 animate-pulse" />
              <div>
                <h3 className="text-base font-bold text-white">Daily Challenge</h3>
                <p className="text-xs text-slate-400">Complete tasks, earn XP and build your streak!</p>
              </div>
            </div>

            {/* Resets in timer widget */}
            <div className="flex items-center gap-2 bg-black/30 border border-white/5 rounded-xl px-4 py-2 w-fit">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Resets in</span>
              <span className="text-xs font-mono font-bold text-cyan-400">
                {String(countdown.hrs).padStart(2, "0")} : {String(countdown.mins).padStart(2, "0")} : {String(countdown.secs).padStart(2, "0")}
              </span>
            </div>

            {/* Week calendars layout checkboxes (Page 6 exact item row) */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Weekly Streak Progress</p>
                <span className="text-[9px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded font-mono">
                  Synced with global clock
                </span>
              </div>
              
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {weekdays.map((day, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 shrink-0">
                    <div
                      title={day.status === "completed" ? `Logged in on ${day.name} (${day.dateStr})` : day.status === "missed" ? `No login on ${day.name} (${day.dateStr})` : `${day.name} (${day.dateStr})`}
                      className={`w-9 h-9 rounded-full border flex items-center justify-center font-mono text-xs transition-all duration-200 select-none ${
                        day.status === "completed"
                          ? `${accentClass} border-transparent text-white font-bold shadow-lg shadow-indigo-500/20`
                          : day.status === "missed"
                          ? "bg-[#2a1215] border-rose-500/30 text-rose-500 font-bold"
                          : "bg-[#11122a] border-white/10 text-slate-500"
                      }`}
                    >
                      {day.status === "completed" ? (
                        <span className="text-xs">✓</span>
                      ) : day.status === "missed" ? (
                        <span className="text-xs">✕</span>
                      ) : (
                        day.dayNum
                      )}
                    </div>
                    <span className="text-[9px] text-slate-400 uppercase font-mono font-bold">{day.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Golden present chest widget column right (Page 6) */}
          <div className="md:w-64 bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-between text-center relative shrink-0">
            <div className="absolute top-2 right-2 flex gap-1">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </div>

            <div className="space-y-2">
              <span className="text-4xl block animate-bounce-subtle">🎁</span>
              <h4 className="text-xs font-bold text-white">Continuous Streak Chest</h4>
              <p className="text-[10px] text-slate-400">Keep going! Clean 3 more days to unlock this bonus reward!</p>
            </div>

            <button
              onClick={handleClaimChestReward}
              disabled={dailyClaimed}
              className={`w-full mt-4 py-2 rounded-lg text-xs font-semibold ${
                dailyClaimed
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-amber-500 hover:bg-amber-400 text-slate-900 shadow-md shadow-amber-500/20"
              } cursor-pointer`}
            >
              {dailyClaimed ? "Chest Claimed" : "Claim Chest +100 XP"}
            </button>
          </div>

        </div>

        {/* TODAY'S TASKS LIST COLUMN (Page 6 bottom) */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Today's Tasks</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tasksList.map((task) => (
              <div
                key={task.id}
                className="bg-[#0b0c24] border border-white/5 hover:border-purple-500/20 rounded-2xl p-5 flex flex-col justify-between shadow-lg space-y-4 group hover:bg-[#11122e] transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-2xl">
                      {task.type === "translation" ? "🌐" : task.type === "chat" ? "💬" : "📚"}
                    </span>
                    <span className="text-[10px] bg-indigo-950/50 border border-indigo-900/60 text-cyan-400 px-2.5 py-0.5 rounded-full font-mono">
                      +{task.xpReward} XP
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white leading-tight group-hover:text-cyan-400 transition-colors">
                    {task.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-normal">
                    {task.description}
                  </p>
                </div>

                <div className="space-y-3.5 pt-3 border-t border-white/5">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>Completed Progress</span>
                      <span className="text-white font-bold">{task.progress} / {task.total}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full"
                        style={{ width: `${(task.progress / task.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Continue/Do trigger button */}
                  <button
                    disabled={task.progress >= task.total}
                    onClick={() => handleIncrementProgress(task.id, task.xpReward)}
                    className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer flex justify-center items-center gap-1"
                  >
                    <span>{task.progress >= task.total ? "Completed ✓" : "Continue"}</span>
                    {task.progress < task.total && <span>→</span>}
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM METRICS COLUMN GAUGE: Weekly Milestone & Live Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Milestone (5 cols) */}
          <div className="lg:col-span-5 bg-[#0b0c24] border border-white/5 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Weekly Challenge</span>
                <h4 className="text-base font-bold text-white mt-1">Score 1000 XP this week</h4>
              </div>
              <span className="text-xs text-purple-400 font-bold font-mono">650 / 1000 XP</span>
            </div>

            <p className="text-xs text-slate-400 leading-normal">
              Earn XP by reading, translating and chatting. Complete the milestone to unlock the "Super Storyteller" rare badge award!
            </p>

            {/* Reward badges showcase */}
            <div className="my-4 py-3 px-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl animate-pulse">🏅</span>
                <div>
                  <p className="text-xs text-white font-medium">Super Storyteller</p>
                  <p className="text-[10px] text-slate-400">Collectible Badge Level 7</p>
                </div>
              </div>
              <span className="text-xs text-amber-400 font-bold">+500 XP</span>
            </div>

            {/* Slider bar */}
            <div className="space-y-1">
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500" style={{ width: "65%" }}></div>
              </div>
              <p className="text-[10px] text-slate-500 text-right mt-1">65% Completed</p>
            </div>
          </div>

          {/* Leaderboard grid layout (7 cols, Page 6 exact metrics) */}
          <div className="lg:col-span-7 bg-[#0a0b1f] border border-white/5 rounded-2xl p-5 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Leaderboard</span>
              </h4>
              <button onClick={() => alert("Loading full regional ladder stats...")} className="text-xs text-indigo-400 hover:underline cursor-pointer">
                View All
              </button>
            </div>

            <div className="space-y-2">
              {liveLeaderboard.map((user, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl flex items-center justify-between border transition-all ${
                    user.isSelf
                      ? "bg-purple-950/30 border-purple-500/30 shadow-md shadow-purple-950/20"
                      : "bg-[#11122a] border-white/5 hover:bg-[#15173e]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Rank Badge */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                      user.rank === 1
                        ? "bg-amber-500 text-slate-900"
                        : user.rank === 2
                        ? "bg-slate-300 text-slate-900"
                        : user.rank === 3
                        ? "bg-amber-700 text-slate-900"
                        : "bg-slate-800 text-slate-400"
                    }`}>
                      {user.rank}
                    </div>

                    {/* Avatar circle */}
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white/10">
                      <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>

                    <div>
                      <p className={`text-xs font-bold leading-none ${user.isSelf ? "text-purple-400" : "text-white"}`}>
                        {user.name}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">{user.country}</p>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-slate-200">{user.xp} XP</span>
                    {user.isSelf && (
                      <span className="text-[9px] uppercase font-bold text-purple-400 bg-purple-950/40 border border-purple-800 px-2 py-0.5 rounded leading-none">
                        Self
                      </span>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
