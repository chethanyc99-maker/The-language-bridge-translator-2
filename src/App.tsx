import React, { useState, useEffect } from "react";
import { 
  Flame, 
  Coins, 
  Award, 
  Grid, 
  BookOpen, 
  Languages, 
  MessageSquare, 
  Trophy, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  Smartphone, 
  Laptop, 
  Sparkles,
  Database,
  X,
  Cloud,
  Loader2,
  Sun,
  Moon
} from "lucide-react";
import LoginView from "./components/LoginView";
import Sidebar from "./components/Sidebar";
import HomeView from "./components/HomeView";
import StoriesView from "./components/StoriesView";
import TranslatorView from "./components/TranslatorView";
import ChatPartnersView from "./components/ChatPartnersView";
import ChallengesView from "./components/ChallengesView";
import ProfileView from "./components/ProfileView";
import SettingsView from "./components/SettingsView";
import DatabaseView from "./components/DatabaseView";

export default function App() {
  // Session details (Screenshot 1 login vs rest is gated by user session!)
  const [userSession, setUserSession] = useState<string | null>(null);
  const [userName, setUserName] = useState("Yash");
  const [userLocation, setUserLocation] = useState("India");
  const [userAvatarEmoji, setUserAvatarEmoji] = useState("👩‍🎓");
  const [isProVerified, setIsProVerified] = useState(false);
  const [userLevel, setUserLevel] = useState(7);
  const [loginDate, setLoginDate] = useState<string>(() => {
    return localStorage.getItem("userSessionLoginDate") || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  });

  // Stats / Performance tracking properties state
  const [storiesReadCount, setStoriesReadCount] = useState(24);
  const [languagesCount, setLanguagesCount] = useState(5);
  const [badgesCount, setBadgesCount] = useState(12);
  const [storyProgress, setStoryProgress] = useState(60);
  const [dailyChallengeWordsDone, setDailyChallengeWordsDone] = useState(3);
  const [translationsCount, setTranslationsCount] = useState(35);
  const [chatMessagesCount, setChatMessagesCount] = useState(18);

  // States
  const [currentTab, setCurrentTab] = useState("home");
  const [xp, setXp] = useState(720); // starts with Yash's level 7 standard (720/1000 XP)
  const [streak, setStreak] = useState(12); // starts with Yash's standard 12-day streak
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");
  const [accentColor, setAccentColor] = useState("bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 hover:opacity-95 transition-all text-white shadow-lg");
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [autosaveStatus, setAutosaveStatus] = useState<"synced" | "saving" | "error">("synced");
  const [lastSaved, setLastSaved] = useState<string>("");

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("/api/leaderboard");
      const data = await res.json();
      if (data.success && data.leaderboard) {
        setLeaderboardData(data.leaderboard);
      }
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("themeMode") as "dark" | "light" | null;
    if (savedTheme) {
      setThemeMode(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("themeMode", themeMode);
    if (themeMode === "light") {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    } else {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    }
  }, [themeMode]);

  useEffect(() => {
    fetchLeaderboard();
  }, [userSession]);

  useEffect(() => {
    const resumeSession = async () => {
      const storedEmail = localStorage.getItem("userSessionEmail");
      if (storedEmail) {
        try {
          const response = await fetch(`/api/user/stats?email=${encodeURIComponent(storedEmail)}`);
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.user) {
              const u = data.user;
              handleLoginSuccess(u.email, u.name, u.level, u.xp, u);
              setLastSaved(new Date().toLocaleTimeString());
            }
          }
        } catch (error) {
          console.error("Autologin restore session error:", error);
        }
      }
    };
    resumeSession();
  }, []);

  // Mobile Display responsive states
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobileScreen(window.innerWidth < 1024);

      const handleResize = () => {
        setIsMobileScreen(window.innerWidth < 1024);
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const getReadingLevel = (storiesCount: number): number => {
    if (storiesCount <= 0) return 0;
    if (storiesCount <= 4) return 1;
    if (storiesCount <= 8) return 2;
    if (storiesCount <= 12) return 3;
    if (storiesCount <= 16) return 4;
    if (storiesCount <= 20) return 5;
    if (storiesCount <= 23) return 6;
    if (storiesCount <= 30) return 7;
    if (storiesCount <= 45) return 8;
    if (storiesCount <= 60) return 9;
    return 10;
  };

  const handleLoginSuccess = (email: string, name?: string, level?: number, initialXp?: number, extraStats?: any) => {
    setUserSession(email);
    localStorage.setItem("userSessionEmail", email);
    
    const todayStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    setLoginDate(todayStr);
    localStorage.setItem("userSessionLoginDate", todayStr);

    // Automatically record login for today
    const dObj = new Date();
    const yr = dObj.getFullYear();
    const mo = String(dObj.getMonth() + 1).padStart(2, "0");
    const dt = String(dObj.getDate()).padStart(2, "0");
    const todayISOStr = `${yr}-${mo}-${dt}`;
    const storedLogins = localStorage.getItem("lingo_login_history");
    let history: string[] = [];
    if (storedLogins) {
      try { history = JSON.parse(storedLogins); } catch (e) {}
    }
    if (!history.includes(todayISOStr)) {
      history.push(todayISOStr);
      localStorage.setItem("lingo_login_history", JSON.stringify(history));
    }

    if (name) setUserName(name);
    
    // Set streak to 1 for new users, keep premium streaks for admin and Yash
    if (email.toLowerCase() === "admin@languagebridge.com") {
      setStreak(99);
    } else if (email.toLowerCase() === "yash@example.com") {
      setStreak(12);
    } else {
      setStreak(1);
    }

    // Set performance metrics
    let finalStoriesCount = 0;
    if (extraStats) {
      if (extraStats.storiesReadCount !== undefined) {
        finalStoriesCount = Number(extraStats.storiesReadCount);
        setStoriesReadCount(finalStoriesCount);
      }
      if (extraStats.languagesCount !== undefined) setLanguagesCount(Number(extraStats.languagesCount));
      if (extraStats.badgesCount !== undefined) setBadgesCount(Number(extraStats.badgesCount));
      if (extraStats.storyProgress !== undefined) setStoryProgress(Number(extraStats.storyProgress));
      if (extraStats.dailyChallengeWordsDone !== undefined) setDailyChallengeWordsDone(Number(extraStats.dailyChallengeWordsDone));
      if (extraStats.translationsCount !== undefined) setTranslationsCount(Number(extraStats.translationsCount));
      if (extraStats.chatMessagesCount !== undefined) setChatMessagesCount(Number(extraStats.chatMessagesCount));
      if (extraStats.location !== undefined) setUserLocation(extraStats.location);
      if (extraStats.avatarEmoji !== undefined) setUserAvatarEmoji(extraStats.avatarEmoji);
      if (extraStats.isProVerified !== undefined) setIsProVerified(Boolean(extraStats.isProVerified));
    } else {
      // Default fallback
      const isNewUser = email.toLowerCase() !== "admin@languagebridge.com" && email.toLowerCase() !== "yash@example.com";
      finalStoriesCount = isNewUser ? 0 : (email.toLowerCase() === "admin@languagebridge.com" ? 88 : 24);
      setStoriesReadCount(finalStoriesCount);
      setLanguagesCount(isNewUser ? 0 : (email.toLowerCase() === "admin@languagebridge.com" ? 12 : 5));
      setBadgesCount(isNewUser ? 0 : (email.toLowerCase() === "admin@languagebridge.com" ? 25 : 12));
      setStoryProgress(isNewUser ? 0 : (email.toLowerCase() === "admin@languagebridge.com" ? 100 : 60));
      setDailyChallengeWordsDone(isNewUser ? 0 : (email.toLowerCase() === "admin@languagebridge.com" ? 5 : 3));
      setTranslationsCount(isNewUser ? 0 : (email.toLowerCase() === "admin@languagebridge.com" ? 142 : 35));
      setChatMessagesCount(isNewUser ? 0 : (email.toLowerCase() === "admin@languagebridge.com" ? 97 : 18));
      setUserLocation("India");
      setUserAvatarEmoji("👩‍🎓");
      setIsProVerified(email.toLowerCase() === "admin@languagebridge.com" || email.toLowerCase() === "chethanyc396@gmail.com");
    }

    // Force Level & XP to 0 if storiesReadCount is 0!
    if (finalStoriesCount === 0) {
      setUserLevel(0);
      setXp(0);
    } else {
      if (level !== undefined) setUserLevel(level);
      if (initialXp !== undefined) setXp(initialXp);
    }

    setCurrentTab("home");
  };

  const handleLogout = () => {
    setUserSession(null);
    localStorage.removeItem("userSessionEmail");
  };

  const handleImpersonate = (email: string, name: string, level: number, initialXp: number, extraStats?: any) => {
    setUserSession(email);
    localStorage.setItem("userSessionEmail", email);
    
    const todayStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    setLoginDate(todayStr);
    localStorage.setItem("userSessionLoginDate", todayStr);

    // Automatically record login for today
    const dObj = new Date();
    const yr = dObj.getFullYear();
    const mo = String(dObj.getMonth() + 1).padStart(2, "0");
    const dt = String(dObj.getDate()).padStart(2, "0");
    const todayISOStr = `${yr}-${mo}-${dt}`;
    const storedLogins = localStorage.getItem("lingo_login_history");
    let history: string[] = [];
    if (storedLogins) {
      try { history = JSON.parse(storedLogins); } catch (e) {}
    }
    if (!history.includes(todayISOStr)) {
      history.push(todayISOStr);
      localStorage.setItem("lingo_login_history", JSON.stringify(history));
    }

    setUserName(name);
    setStreak(
      email.toLowerCase() === "admin@languagebridge.com" 
        ? 99 
        : email.toLowerCase() === "yash@example.com" 
          ? 12 
          : 1
    );

    let finalStoriesCount = 0;
    if (extraStats) {
      if (extraStats.storiesReadCount !== undefined) {
        finalStoriesCount = Number(extraStats.storiesReadCount);
        setStoriesReadCount(finalStoriesCount);
      }
      if (extraStats.languagesCount !== undefined) setLanguagesCount(Number(extraStats.languagesCount));
      if (extraStats.badgesCount !== undefined) setBadgesCount(Number(extraStats.badgesCount));
      if (extraStats.storyProgress !== undefined) setStoryProgress(Number(extraStats.storyProgress));
      if (extraStats.dailyChallengeWordsDone !== undefined) setDailyChallengeWordsDone(Number(extraStats.dailyChallengeWordsDone));
      if (extraStats.translationsCount !== undefined) setTranslationsCount(Number(extraStats.translationsCount));
      if (extraStats.chatMessagesCount !== undefined) setChatMessagesCount(Number(extraStats.chatMessagesCount));
      if (extraStats.location !== undefined) setUserLocation(extraStats.location);
      if (extraStats.avatarEmoji !== undefined) setUserAvatarEmoji(extraStats.avatarEmoji);
      if (extraStats.isProVerified !== undefined) setIsProVerified(Boolean(extraStats.isProVerified));
    } else {
      const isNewUser = email.toLowerCase() !== "admin@languagebridge.com" && email.toLowerCase() !== "yash@example.com";
      finalStoriesCount = isNewUser ? 0 : (email.toLowerCase() === "admin@languagebridge.com" ? 88 : 24);
      setStoriesReadCount(finalStoriesCount);
      setLanguagesCount(isNewUser ? 0 : (email.toLowerCase() === "admin@languagebridge.com" ? 12 : 5));
      setBadgesCount(isNewUser ? 0 : (email.toLowerCase() === "admin@languagebridge.com" ? 25 : 12));
      setStoryProgress(isNewUser ? 0 : (email.toLowerCase() === "admin@languagebridge.com" ? 100 : 60));
      setDailyChallengeWordsDone(isNewUser ? 0 : (email.toLowerCase() === "admin@languagebridge.com" ? 5 : 3));
      setTranslationsCount(isNewUser ? 0 : (email.toLowerCase() === "admin@languagebridge.com" ? 142 : 35));
      setChatMessagesCount(isNewUser ? 0 : (email.toLowerCase() === "admin@languagebridge.com" ? 97 : 18));
      setUserLocation("India");
      setUserAvatarEmoji("👩‍🎓");
      setIsProVerified(email.toLowerCase() === "admin@languagebridge.com" || email.toLowerCase() === "chethanyc396@gmail.com");
    }

    if (finalStoriesCount === 0) {
      setUserLevel(0);
      setXp(0);
    } else {
      setUserLevel(level);
      setXp(initialXp);
    }

    setCurrentTab("home");
  };

  const syncStatsWithServer = async (updatedFields: any) => {
    if (!userSession) return;
    setAutosaveStatus("saving");
    try {
      await fetch("/api/user/update-stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userSession,
          ...updatedFields
        })
      });
      // Refresh the high scores leaderboard with the database
      await fetchLeaderboard();
      setAutosaveStatus("synced");
      setLastSaved(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Backend performance synchronization error:", err);
      setAutosaveStatus("error");
    }
  };

  const handleUpdateProfile = (updates: { name?: string; location?: string; avatarEmoji?: string }) => {
    if (updates.name !== undefined) setUserName(updates.name);
    if (updates.location !== undefined) setUserLocation(updates.location);
    if (updates.avatarEmoji !== undefined) setUserAvatarEmoji(updates.avatarEmoji);

    syncStatsWithServer({
      name: updates.name,
      location: updates.location,
      avatarEmoji: updates.avatarEmoji
    });
  };

  const handleAddXP = (xpGained: number) => {
    if (storiesReadCount === 0) {
      console.log("No XP can be gained yet. User has read 0 books. Complete an AI Story first!");
      return;
    }
    setXp((prev) => {
      const nextXp = prev + xpGained;
      if (nextXp >= 1000) {
        const nextLevel = userLevel + 1;
        setUserLevel(nextLevel);
        alert(`🎉 Congratulations! You scored enough XP to level up to Level ${nextLevel}! Keep it up! 🏆`);
        syncStatsWithServer({ xp: nextXp - 1000, level: nextLevel });
        return nextXp - 1000;
      }
      syncStatsWithServer({ xp: nextXp });
      return nextXp;
    });
  };

  const handleCompleteStory = () => {
    let nextCount = 0;
    setStoriesReadCount((prevCount) => {
      nextCount = prevCount + 1;
      let nextBadges = badgesCount;
      if (nextCount % 5 === 0) {
        nextBadges = nextBadges + 1;
        setBadgesCount(nextBadges);
      }

      setXp((prevXp) => {
        let currentLvl = userLevel;
        let baseXpGained = 200; // Major XP boost for reading!
        
        let newXp = prevXp;
        let newLvl = currentLvl;
        
        if (prevCount === 0) {
          // Unlocked first book! Move from level 0 -> 1 and get initial 200 XP
          newLvl = 1;
          newXp = baseXpGained;
          setUserLevel(newLvl);
          alert(`📚 Amazing! You completed your first story! You leveled up from Level 0 to Level 1 and gained +${baseXpGained} XP! 🚀`);
        } else {
          newXp = prevXp + baseXpGained;
          const milestoneLvl = getReadingLevel(nextCount);
          if (milestoneLvl > currentLvl) {
            newLvl = milestoneLvl;
            setUserLevel(newLvl);
            newXp = newXp % 1000;
            alert(`🎉 Reading milestone unlocked! Completed story #${nextCount}, leveled up to Level ${newLvl}, and gained +${baseXpGained} XP! 🏆`);
          } else if (newXp >= 1000) {
            newLvl = currentLvl + 1;
            setUserLevel(newLvl);
            newXp = newXp % 1000;
            alert(`🎉 Awesome! You completed story #${nextCount} and advanced to Level ${newLvl}! 🏆`);
          } else {
            alert(`📚 Story completed! You now have read ${nextCount} stories and gained +${baseXpGained} XP!`);
          }
        }

        syncStatsWithServer({
          storiesReadCount: nextCount,
          badgesCount: nextBadges,
          xp: newXp,
          level: newLvl
        });

        return newXp;
      });

      return nextCount;
    });
  };

  const handleProgressUpdate = (percentage: number) => {
    setStoryProgress(percentage);
    syncStatsWithServer({ storyProgress: percentage });
  };

  const handleTranslationSuccess = () => {
    handleAddXP(5);
    setTranslationsCount((prev) => {
      const next = prev + 1;
      let nextLangs = languagesCount;
      if (next % 15 === 0) {
        nextLangs = nextLangs + 1;
        setLanguagesCount(nextLangs);
      }
      syncStatsWithServer({ translationsCount: next, languagesCount: nextLangs });
      return next;
    });
  };

  const handleVoiceInputSuccess = () => {
    handleAddXP(10);
    setTranslationsCount((prev) => {
      const next = prev + 1;
      let nextLangs = languagesCount;
      if (next % 15 === 0) {
        nextLangs = nextLangs + 1;
        setLanguagesCount(nextLangs);
      }
      syncStatsWithServer({ translationsCount: next, languagesCount: nextLangs });
      return next;
    });
  };

  const handleChatMessageSent = () => {
    handleAddXP(10);
    setChatMessagesCount((prev) => {
      const next = prev + 1;
      let nextBadges = badgesCount;
      if (next % 20 === 0) {
        nextBadges = nextBadges + 1;
        setBadgesCount(nextBadges);
      }
      syncStatsWithServer({ chatMessagesCount: next, badgesCount: nextBadges });
      return next;
    });
  };

  const handlePartnerMessageReceived = () => {
    handleAddXP(15);
  };

  const handleDailyChallengeProgressIncrement = () => {
    setDailyChallengeWordsDone((prev) => {
      const next = Math.min(5, prev + 1);
      let nextBadges = badgesCount;
      if (next === 5 && prev < 5) {
        nextBadges = nextBadges + 1;
        setBadgesCount(nextBadges);
        alert("🎁 You have fully unlocked the Daily Spanish Vocab Chest! +1 Badge & 100 XP Bonus awarded!");
        handleAddXP(100);
      }
      syncStatsWithServer({ dailyChallengeWordsDone: next, badgesCount: nextBadges });
      return next;
    });
  };

  const handleStartDailyChallenge = () => {
    alert("🔍 Navigating to translating challenges catalog... Let's complete tasks!");
    setCurrentTab("challenges");
  };

  // Helper bottom navigation elements for small viewport panels
  const bottomNavItems = [
    { id: "home", label: "Home", icon: Grid },
    { id: "stories", label: "Stories", icon: BookOpen },
    { id: "translate", label: "Translate", icon: Languages },
    { id: "chat", label: "Chat", icon: MessageSquare },
    { id: "challenges", label: "Challenges", icon: Trophy },
  ];

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
      default:
        return "Hi, Storyteller!";
    }
  };

  // Render content of active tab
  const renderTabContent = () => {
    switch (currentTab) {
      case "home":
        return (
          <HomeView
            onNavigate={setCurrentTab}
            xp={xp}
            streak={streak}
            onStartChallenge={handleStartDailyChallenge}
            accentClass={accentColor}
            level={userLevel}
            storiesReadCount={storiesReadCount}
            languagesCount={languagesCount}
            badgesCount={badgesCount}
            storyProgress={storyProgress}
            dailyChallengeWordsDone={dailyChallengeWordsDone}
            userName={userName}
            onAddXP={handleAddXP}
          />
        );
      case "stories":
        return (
          <StoriesView
            onAddXP={handleAddXP}
            accentClass={accentColor}
            onCompleteStory={handleCompleteStory}
            onProgressUpdate={handleProgressUpdate}
          />
        );
      case "translate":
        return (
          <TranslatorView
            onAddXP={handleAddXP}
            accentClass={accentColor}
            onTranslationSuccess={handleTranslationSuccess}
            onVoiceInputSuccess={handleVoiceInputSuccess}
          />
        );
      case "chat":
        return (
          <ChatPartnersView
            onAddXP={handleAddXP}
            accentClass={accentColor}
            onChatMessageSent={handleChatMessageSent}
            onPartnerMessageReceived={handlePartnerMessageReceived}
            userName={userName}
          />
        );
      case "challenges":
        return (
          <ChallengesView
            xp={xp}
            onAddXP={handleAddXP}
            streak={streak}
            accentClass={accentColor}
            onDailyChallengeIncrement={handleDailyChallengeProgressIncrement}
            onClaimChest={handleCompleteStory}
            leaderboardData={leaderboardData}
            currentEmail={userSession || ""}
          />
        );
      case "profile":
        return (
          <ProfileView
            onNavigate={setCurrentTab}
            xp={xp}
            streak={streak}
            accentClass={accentColor}
            userName={userName}
            userLevel={userLevel}
            userEmail={userSession || undefined}
            storiesReadCount={storiesReadCount}
            badgesCount={badgesCount}
            isProVerified={isProVerified}
            userLocation={userLocation}
            userAvatarEmoji={userAvatarEmoji}
            onUpdateProfile={handleUpdateProfile}
            userLoginDate={loginDate}
          />
        );
      case "settings":
        return (
          <SettingsView
            accentColor={accentColor}
            setAccentColor={setAccentColor}
            themeMode={themeMode}
            setThemeMode={setThemeMode}
            onNavigate={setCurrentTab}
            onLogout={handleLogout}
            userName={userName}
            userEmail={userSession || undefined}
          />
        );
      case "database":
        if (userSession?.toLowerCase() !== "admin@languagebridge.com" && userSession?.toLowerCase() !== "chethanyc396@gmail.com") {
          return (
            <HomeView
              onNavigate={setCurrentTab}
              xp={xp}
              streak={streak}
              onStartChallenge={handleStartDailyChallenge}
              accentClass={accentColor}
              level={userLevel}
              storiesReadCount={storiesReadCount}
              languagesCount={languagesCount}
              badgesCount={badgesCount}
              storyProgress={storyProgress}
              dailyChallengeWordsDone={dailyChallengeWordsDone}
              userName={userName}
              onAddXP={handleAddXP}
            />
          );
        }
        return (
          <DatabaseView
            onImpersonate={handleImpersonate}
            accentClass={accentColor}
          />
        );
      default:
        return null;
    }
  };

  // Theme support
  const themeBgClass = themeMode === "light" ? "bg-slate-50 text-slate-800" : "bg-[#070519] text-white";

  // MOBILE INNER WORKSPACE SCREEN
  const renderMobileAppWorkspace = () => {
    return (
      <div className="flex-1 flex flex-col h-full w-full relative bg-[#070519] text-white overflow-hidden pb-16">
        {/* Dynamic iOS Liquid Color Blobs */}
        <div className="absolute top-[10%] left-[-10%] w-[180px] h-[180px] bg-[#FF2D55]/20 rounded-full blur-[55px] pointer-events-none animate-float-liquid-slow"></div>
        <div className="absolute top-[45%] left-[20%] w-[150px] h-[150px] bg-[#007AFF]/18 rounded-full blur-[60px] pointer-events-none animate-float-liquid-fast"></div>
        
        {/* Mobile Header top status */}
        <header className="bg-[#0a0b1f]/95 border-b border-white/5 sticky top-0 z-10 p-3 flex justify-between items-center backdrop-blur bg-opacity-80 shrink-0">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="p-1.5 hover:bg-white/5 rounded-xl text-slate-300 hover:text-white transition-all cursor-pointer border border-white/5 bg-white/2"
            >
              <Menu className="w-4 h-4 text-purple-400" />
            </button>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold bg-gradient-to-r from-teal-300 via-cyan-400 to-pink-400 bg-clip-text text-transparent font-sans uppercase tracking-wider leading-none">
                Language Bridge
              </span>
              <span className="text-[7px] text-cyan-400 font-mono tracking-widest uppercase mt-0.5">STORYTELLER</span>
            </div>
            
            {/* Small Mobile Cloud Sync Dot */}
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/2 border border-white/5 rounded-lg text-[8px] font-mono shrink-0 ml-1">
              {autosaveStatus === "saving" ? (
                <>
                  <Loader2 className="w-2.5 h-2.5 text-cyan-400 animate-spin" />
                  <span className="text-cyan-400 text-[7px] hidden xs:inline">Saving...</span>
                </>
              ) : (
                <>
                  <Cloud className="w-2.5 h-2.5 text-emerald-400" />
                  <span className="text-emerald-400 text-[7px] hidden xs:inline">Saved</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5 bg-orange-500/10 border border-orange-500/20 px-1.5 py-0.5 rounded-lg text-[9px] font-bold text-orange-400">
              🔥<span className="font-mono text-white ml-0.5">{streak}</span>
            </div>
            <div className="flex items-center gap-0.5 bg-purple-600/10 border border-purple-500/20 px-1.5 py-0.5 rounded-lg text-[9px] font-bold text-purple-400">
              💎<span className="font-mono text-white ml-0.5">{xp}</span>
            </div>
            
            {/* Dark/Light mode theme switch */}
            <button
              onClick={() => setThemeMode(themeMode === "dark" ? "light" : "dark")}
              className="p-1 px-1.5 bg-white/5 border border-white/10 hover:bg-white/15 rounded-lg transition-all cursor-pointer flex items-center justify-center text-slate-300"
              title={themeMode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {themeMode === "dark" ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-blue-400" />
              )}
            </button>

            <button 
              onClick={() => setCurrentTab("profile")}
              className="w-6 h-6 rounded-full overflow-hidden border border-purple-500/30 cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=60"
                alt="Avatar"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </button>
          </div>
        </header>

        {/* Scrolling Inner Section */}
        <div className="flex-1 overflow-y-auto p-4 relative">
          {renderTabContent()}
        </div>

        {/* Slide navigation drawer */}
        {isDrawerOpen && (
          <div className="absolute inset-0 z-45 flex font-sans">
            <div 
              className="absolute inset-0 bg-black/65 backdrop-blur-xs transition-opacity"
              onClick={() => setIsDrawerOpen(false)}
            />
            <div className="relative w-64 max-w-[85%] bg-[#0a0b1f] border-r border-white/10 h-full flex flex-col justify-between p-4 z-50 text-white animate-in slide-in-from-left duration-200">
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold text-xs">
                    B
                  </div>
                  <span className="text-xs font-semibold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    Language Bridge
                  </span>
                </div>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 py-4 space-y-4 overflow-y-auto">
                <div className="p-2.5 bg-white/5 rounded-lg border border-white/5 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-purple-500/20">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=60"
                      alt="Yash Profile"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-white leading-none">{userName}</p>
                    <p className="text-[9px] text-cyan-400 mt-1">Level {userLevel} • {xp} XP</p>
                  </div>
                </div>

                <nav className="space-y-1">
                  {[
                    { id: "home", label: "Home View", icon: Grid },
                    { id: "stories", label: "Stories Catalog", icon: BookOpen },
                    { id: "translate", label: "Translate Room", icon: Languages },
                    { id: "chat", label: "AI Chat Partners", icon: MessageSquare },
                    { id: "challenges", label: "Daily Challenges", icon: Trophy },
                    { id: "profile", label: "My Profile Details", icon: User },
                    { id: "settings", label: "System Preferences", icon: Settings },
                    ...((userSession?.toLowerCase() === "admin@languagebridge.com" || userSession?.toLowerCase() === "chethanyc396@gmail.com") 
                      ? [{ id: "database", label: "User Database Dev", icon: Database }] 
                      : []),
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setCurrentTab(item.id);
                          setIsDrawerOpen(false);
                        }}
                        className={`w-full py-2 px-3 rounded-xl flex items-center gap-3 text-[11px] font-semibold transition-all ${
                          isActive 
                            ? `${accentColor} text-white shadow` 
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>

                <div className="p-2.5 bg-[#11122a] border border-white/5 rounded-xl text-center">
                  <div className="w-8 h-6 bg-[#1b1c3c] border border-cyan-400 rounded p-0.5 flex flex-col justify-between mx-auto mb-1.5 shadow-[0_0_6px_cyan]">
                    <div className="flex gap-0.5 justify-center mt-0.5">
                      <div className="w-1.5 h-1 bg-cyan-300 rounded-full animate-pulse"></div>
                      <div className="w-1.5 h-1 bg-cyan-300 rounded-full animate-pulse"></div>
                    </div>
                    <div className="w-3 h-0.5 bg-cyan-400 rounded-full mx-auto"></div>
                  </div>
                  <p className="text-[9px] text-slate-400 font-mono leading-relaxed leading-snug">
                    {getMascotQuote()}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsDrawerOpen(false);
                  }}
                  className="w-full py-1.5 bg-red-950/20 border border-red-900/30 text-[10px] text-red-300 hover:text-white hover:bg-red-900/40 rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Logout Session</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Tab Bar Container */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#0a0b1f] border-t border-white/5 flex justify-around items-center z-30 px-2 shadow-2xl">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setIsDrawerOpen(false);
                }}
                className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-all ${
                  isActive ? "text-purple-400 font-bold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className={`w-4 h-4 transition-transform ${isActive ? "scale-115 text-purple-400" : ""}`} />
                <span className="text-[9px] mt-1 tracking-tight font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    );
  };

  // 1. UNAUTHENTICATED SEAMLESS FALLBACK
  if (!userSession) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  // 2. PHYSICAL NATIVE SMARTPHONE BLEED-THROUGH
  if (isMobileScreen) {
    return renderMobileAppWorkspace();
  }

  // 3. REGULAR FLUID RESPONSIVE WIDESCREEN
  return (
    <div className={`min-h-screen ${themeBgClass} flex font-sans relative overflow-hidden`}>
      {/* Floating Animated iOS Liquid Color Blobs */}
      <div className="absolute top-[15%] left-[10%] w-[380px] h-[380px] bg-[#FF2D55]/20 rounded-full blur-[100px] pointer-events-none animate-float-liquid-slow"></div>
      <div className="absolute top-[50%] left-[40%] w-[330px] h-[330px] bg-[#007AFF]/15 rounded-full blur-[110px] pointer-events-none animate-float-liquid-fast"></div>
      
      {/* 1. Side Navigation Rail */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        accentClass={accentColor}
        onLogout={handleLogout}
        streak={streak}
        userEmail={userSession || undefined}
      />

      {/* 2. Main content room layout offset for left sidebar */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen relative">
        
        {/* Top Status Header bar with live sync stats indicators (shown across ALL dashboards screens!) */}
        <header className="bg-[#0a0b1f]/90 border-b border-white/5 sticky top-0 z-10 p-4 flex justify-between items-center backdrop-blur bg-opacity-70">
          <div className="flex items-center gap-1.5 p-1 relative">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#94a3b8]">Language Bridge</span>
            <span className="text-[10px] bg-indigo-950 font-bold text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded-full font-mono uppercase">
              Storyteller
            </span>
          </div>

          {/* Autosave status pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-xl text-[10px] font-mono">
            {autosaveStatus === "saving" ? (
              <>
                <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span className="text-cyan-400">Autosaving progress...</span>
              </>
            ) : autosaveStatus === "error" ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-red-400">Save failed. Retrying...</span>
              </>
            ) : (
              <>
                <Cloud className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Synced & Autosaved to Server</span>
                {lastSaved && <span className="text-slate-500">({lastSaved})</span>}
              </>
            )}
          </div>

          {/* Quick Metrics (Page 2 Header specs: Streak, XP, Avatar badge) */}
          <div className="flex items-center gap-4">
            
            {/* Daily streak indicator */}
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl px-3.5 py-1.5 flex items-center gap-1.5 shadow-sm">
              <Flame className="w-4 h-4 text-orange-400 animate-pulse fill-current" />
              <div>
                <p className="text-[9px] text-slate-500 font-mono leading-none uppercase">Day Streak</p>
                <p className="text-xs font-bold text-white mt-0.5">{streak}</p>
              </div>
            </div>

            {/* Total XP points */}
            <div className="bg-purple-600/10 border border-purple-500/20 rounded-xl px-3.5 py-1.5 flex items-center gap-1.5 shadow-sm">
              <Coins className="w-4 h-4 text-purple-400 fill-current" />
              <div>
                <p className="text-[9px] text-slate-500 font-mono leading-none uppercase">XP Score</p>
                <p className="text-xs font-bold text-white mt-0.5">{xp}</p>
              </div>
            </div>

            {/* Dark/Light mode theme switch */}
            <button
              onClick={() => setThemeMode(themeMode === "dark" ? "light" : "dark")}
              className="p-2.5 bg-white/5 border border-white/10 hover:bg-white/15 rounded-xl transition-all cursor-pointer flex items-center justify-center text-slate-300 hover:text-white"
              title={themeMode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {themeMode === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400 animate-pulse" />
              ) : (
                <Moon className="w-4 h-4 text-blue-500" />
              )}
            </button>

            {/* Avatar circle indicator */}
            <button
              onClick={() => setCurrentTab("profile")}
              className="flex items-center gap-2 hover:bg-white/5 p-1 rounded-xl transition-all cursor-pointer border border-white/5"
            >
              <div className="w-8 h-8 rounded-full border border-purple-500/30 bg-[#121435] flex items-center justify-center text-lg select-none">
                {userAvatarEmoji}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-xs font-bold text-white leading-none">{userName}</p>
                <p className="text-[9px] text-cyan-400 font-medium">Level {userLevel}</p>
              </div>
            </button>

          </div>
        </header>

        {/* 3. Central Application Dashboard Segment container */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderTabContent()}
        </main>

      </div>

    </div>
  );
}
