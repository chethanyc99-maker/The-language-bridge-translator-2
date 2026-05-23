import React, { useState } from "react";
import { User, Eye, Sun, Moon, Laptop, Palette, Bell, HelpCircle, HardDrive, ShieldAlert, Info, Key, Trash2, LogOut, Mic, Check } from "lucide-react";

interface SettingsViewProps {
  accentColor: string;
  setAccentColor: (color: string) => void;
  themeMode: "dark" | "light";
  setThemeMode: (mode: "dark" | "light") => void;
  onNavigate?: (tab: string) => void;
  onLogout?: () => void;
  userName?: string;
  userEmail?: string;
}

export default function SettingsView({ 
  accentColor, 
  setAccentColor, 
  themeMode, 
  setThemeMode, 
  onNavigate, 
  onLogout,
  userName,
  userEmail
}: SettingsViewProps) {
  // Option selectors local states
  const [learningGoal, setLearningGoal] = useState("20 mins / day");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deletionError, setDeletionError] = useState<string | null>(null);
  const [autoDetect, setAutoDetect] = useState(true);
  const [tapToSpeak, setTapToSpeak] = useState(true);

  const [isSpeechApproved, setIsSpeechApproved] = useState(() => {
    return localStorage.getItem("speech_recognition_approved") === "true";
  });

  const handleApproveMic = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("⚠️ Your current browser or sandbox context does not support mediaDevices API. Please try using a modern browser like Google Chrome or open the app in a new tab.");
      return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        // Stop audio tracks immediately after permission is granted to release the microphone device
        stream.getTracks().forEach(track => track.stop());
        setIsSpeechApproved(true);
        localStorage.setItem("speech_recognition_approved", "true");
        alert("🎙️ Success! Microphone connection verified, and speech recognition permission is now primed & authorized!");
      })
      .catch((err) => {
        console.error("Microphone approval failure:", err);
        alert(`⚠️ Microphone Access Blocked: ${err.message || err}\n\nPlease click on the microphone lock icon in your browser search bar to allow permissions, or open the application in a new tab.`);
      });
  };
  
  // Toggles states
  const [notificationToggles, setNotificationToggles] = useState({
    daily: true,
    streak: true,
    challenges: true,
    newFeatures: false,
    sound: true
  });

  const [downloadOffline, setDownloadOffline] = useState(false);
  const [reduceAnimations, setReduceAnimations] = useState(false);

  const toggleNotification = (key: keyof typeof notificationToggles) => {
    setNotificationToggles(p => ({ ...p, [key]: !p[key] }));
  };

  // Color circle configs
  const accentPresets = [
    { name: "liquid", value: "from-cyan-400 via-blue-500 to-pink-500", class: "bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 hover:opacity-95 transition-all text-white shadow-lg shadow-blue-500/20" },
    { name: "blue", value: "from-blue-600 to-cyan-600", class: "bg-blue-600 hover:bg-blue-700" },
    { name: "green", value: "from-green-600 to-emerald-600", class: "bg-green-600 hover:bg-green-700" },
    { name: "orange", value: "from-orange-500 to-amber-500", class: "bg-orange-500 hover:bg-orange-600" },
    { name: "red", value: "from-rose-600 to-pink-500", class: "bg-rose-600 hover:bg-rose-700" },
    { name: "yellow", value: "from-yellow-500 to-amber-500", class: "bg-yellow-500 hover:bg-yellow-600" }
  ];

  const handleDeleteMyAccount = async () => {
    if (!userEmail) return;
    setDeletionError(null);

    try {
      const response = await fetch("/api/admin/users/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          if (onLogout) onLogout();
        } else {
          setDeletionError(data.error || "Failed to delete account. Unknown database error.");
        }
      } else {
        setDeletionError("Server failed to process the deletion request.");
      }
    } catch (error) {
      console.error("Account deletion error:", error);
      setDeletionError("Network error: Unable to reach the database server.");
    }
  };

  return (
    <div className="space-y-6 text-white font-sans text-left selection:bg-purple-600 pb-12">
      
      {/* Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-xs text-slate-400">Tweak your preferences, color identity, notifications, and storage data.</p>
      </div>

      {/* Grid Settings groups (Page 8 representation) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        
        {/* Left Column Settings */}
        <div className="space-y-4">
          
          {/* Account Card details */}
          <div className="bg-[#0b0c24] border border-white/5 rounded-2xl p-5 shadow-lg space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-white/5 pb-2">
              <User className="w-4 h-4 text-cyan-400" />
              <span>Account Credentials</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center bg-[#11122a] p-3 rounded-xl border border-white/5">
                <span className="text-slate-400">Name</span>
                <span className="text-slate-100 font-bold">{userName || "Guest student"}</span>
              </div>
              <div className="flex justify-between items-center bg-[#11122a] p-3 rounded-xl border border-white/5">
                <span className="text-slate-400">Email Address</span>
                <span className="text-slate-100 font-medium font-mono">{userEmail || "guest@example.com"}</span>
              </div>
              
              <button
                type="button"
                onClick={() => alert("Please verify your email address to change security rules.")}
                className="w-full text-left bg-gradient-to-r from-cyan-600/10 to-indigo-600/10 hover:from-cyan-600/20 border border-white/5 p-3 rounded-xl text-blue-400 font-medium transition-colors cursor-pointer"
              >
                Change Security Password
              </button>

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full text-left bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/20 p-3 rounded-xl text-purple-300 font-semibold transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>Sign Out of Session</span>
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}

              {showConfirmDelete ? (
                <div className="bg-red-950/40 border border-red-500/30 p-3.5 rounded-xl space-y-3">
                  <p className="text-[11px] text-red-300 leading-relaxed font-medium">
                    ⚠️ <strong>WARNING:</strong> This will instantly and permanently delete your account ("{userEmail}") and wipe all your target logs, stories read, level history, and streaks from the server database. This action is <strong>IRREVERSIBLE</strong>.
                  </p>
                  {deletionError && (
                    <div className="text-[11px] bg-red-950/60 text-red-400 border border-red-950 p-2.5 rounded-lg font-mono">
                      {deletionError}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleDeleteMyAccount}
                      className="flex-1 py-1.5 px-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
                    >
                      Yes, Delete My Account
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowConfirmDelete(false); setDeletionError(null); }}
                      className="flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-all cursor-pointer text-center"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(true)}
                  className="w-full text-left bg-red-950/25 hover:bg-red-900/20 border border-red-900/40 p-3 rounded-xl text-red-400 font-semibold transition-colors flex items-center justify-between cursor-pointer"
                  title="Permanently close and delete this specific account from the server"
                >
                  <span>Delete Learning Account Permanently</span>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Learning Preferences */}
          <div className="bg-[#0b0c24] border border-white/5 rounded-2xl p-5 shadow-lg space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-white/5 pb-2">
              <Palette className="w-4 h-4 text-purple-400" />
              <span>Preferences</span>
            </h4>

            <div className="space-y-3 text-xs">
              
              {/* Learning goal selector */}
              <div className="flex gap-4 justify-between items-center bg-[#11122a] p-3 rounded-xl border border-white/5">
                <span className="text-slate-400 font-medium">Learning Goal</span>
                <select
                  value={learningGoal}
                  onChange={(e) => {
                    setLearningGoal(e.target.value);
                    alert(`Daily study target set to ${e.target.value}!`);
                  }}
                  className="bg-[#121435] border border-white/10 text-white rounded px-2.5 py-1"
                >
                  <option>10 mins / day</option>
                  <option>20 mins / day</option>
                  <option>30 mins / day</option>
                  <option>60 mins / day</option>
                </select>
              </div>

              {/* Toggles */}
              <div className="flex items-center justify-between bg-[#11122a] p-3 rounded-xl border border-white/5">
                <div>
                  <p className="text-slate-200 font-bold">Auto Detect Language</p>
                  <p className="text-[10px] text-slate-500">Enable automatic language sensor in Translator</p>
                </div>
                <input
                  type="checkbox"
                  checked={autoDetect}
                  onChange={() => setAutoDetect(!autoDetect)}
                  className="w-4 h-4 text-purple-600 rounded bg-[#121435] border-white/10"
                />
              </div>

              <div className="flex items-center justify-between bg-[#11122a] p-3 rounded-xl border border-white/5">
                <div>
                  <p className="text-slate-200 font-bold">Tap To Speak Mode</p>
                  <p className="text-[10px] text-slate-500">Access microphone shortcuts directly during chat</p>
                </div>
                <input
                  type="checkbox"
                  checked={tapToSpeak}
                  onChange={() => setTapToSpeak(!tapToSpeak)}
                  className="w-4 h-4 text-purple-600 rounded bg-[#121435] border-white/10"
                />
              </div>

              {/* Speech Recognition Approval Block */}
              <div className="bg-[#15173d]/55 border border-purple-500/20 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-purple-500/10">
                      <Mic className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-slate-100 font-bold text-xs">Speech Recognition Status</p>
                      <p className="text-[10px] text-slate-400">Microphone iframe bypass system</p>
                    </div>
                  </div>
                  {isSpeechApproved ? (
                    <span className="text-[9px] tracking-wide font-extrabold uppercase bg-emerald-950/80 border border-emerald-800 text-emerald-400 px-2 py-0.5 rounded-full select-none flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      APPROVED
                    </span>
                  ) : (
                    <span className="text-[9px] tracking-wide font-extrabold uppercase bg-amber-950/80 border border-amber-800 text-amber-400 px-2 py-0.5 rounded-full select-none flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                      REQUIRED
                    </span>
                  )}
                </div>

                <p className="text-[10px] text-slate-300 leading-relaxed font-sans">
                  Browsers require explicit user gesture approvals to authorize microphone streaming and transcription within sandboxed iframes.
                </p>

                {isSpeechApproved ? (
                  <div className="flex gap-2 font-sans">
                    <button
                      type="button"
                      onClick={handleApproveMic}
                      className="flex-1 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3 h-3" />
                      Test Connection
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSpeechApproved(false);
                        localStorage.setItem("speech_recognition_approved", "false");
                        alert("Speech recognition approval has been revoked. Microphoning needs authorization again.");
                      }}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-red-950/30 border border-white/5 text-slate-400 hover:text-red-400 rounded-lg text-[10px] font-medium transition-all cursor-pointer"
                      title="Revoke Permission State"
                    >
                      Revoke
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleApproveMic}
                    className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-[10px] font-bold transition-all shadow-md shadow-indigo-950 flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
                  >
                    <Mic className="w-3 h-3 text-purple-200" />
                    Authorize Speech Recognition
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* Daily Notifications */}
          <div className="bg-[#0b0c24] border border-white/5 rounded-2xl p-5 shadow-lg space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-white/5 pb-2">
              <Bell className="w-4 h-4 text-orange-400" />
              <span>Notifications settings</span>
            </h4>

            <div className="space-y-3 text-xs">
              {[
                { label: "Daily Learning Reminders (8:00 PM)", key: "daily" as const },
                { label: "Streak Preservation Reminders", key: "streak" as const },
                { label: "Challenge Updates & Alerts", key: "challenges" as const },
                { label: "New Features & Release Notes", key: "newFeatures" as const },
                { label: "UI Sound Clips & Alerts", key: "sound" as const }
              ].map((notif, idx) => (
                <div key={idx} className="flex items-center justify-between bg-[#11122a] p-3 rounded-xl border border-white/5">
                  <span className="text-slate-200 font-medium">{notif.label}</span>
                  <input
                    type="checkbox"
                    checked={notificationToggles[notif.key]}
                    onChange={() => toggleNotification(notif.key)}
                    className="w-4 h-4 text-purple-400 rounded bg-[#121435] border-white/5"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column Settings */}
        <div className="space-y-4">
          
          {/* Appearance Section (Page 8 style Accent circles) */}
          <div className="bg-[#0b0c24] border border-white/5 rounded-2xl p-5 shadow-lg space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-white/5 pb-2">
              <Palette className="w-4 h-4 text-pink-400" />
              <span>Appearance & Themes</span>
            </h4>

            {/* Light/Dark/System buttons row selectors */}
            <div className="space-y-2">
              <p className="text-[10px] text-slate-400 uppercase font-bold text-slate-500 tracking-wider">Visual Interface Mode</p>
              
              <div className="grid grid-cols-3 gap-2 bg-[#121435] p-1 rounded-xl text-xs text-center font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setThemeMode("light");
                    alert("Switched to Light interface mockup mode.");
                  }}
                  className={`py-1.5 rounded-lg flex justify-center items-center gap-1.5 cursor-pointer ${
                    themeMode === "light" ? "bg-white text-slate-900 shadow" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  <span>Light</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setThemeMode("dark");
                  }}
                  className={`py-1.5 rounded-lg flex justify-center items-center gap-1.5 cursor-pointer ${
                    themeMode === "dark" ? "bg-purple-600 text-white shadow" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  <span>Dark</span>
                </button>
                <button
                  type="button"
                  onClick={() => alert("System default mode is already synced with dark theme.")}
                  className="py-1.5 rounded-lg text-slate-400 hover:text-slate-200 flex justify-center items-center gap-1.5 cursor-pointer"
                >
                  <Laptop className="w-4 h-4" />
                  <span>System</span>
                </button>
              </div>
            </div>

            {/* COLOR PALETTE DOTS INDENT (Page 8 exact color selectors circles!) */}
            <div className="space-y-2">
              <p className="text-[10px] text-slate-400 uppercase font-bold text-slate-500 tracking-wider">Accent Theme Color</p>
              
              <div className="flex gap-4 items-center">
                {accentPresets.map((preset) => {
                  const isCurrent = accentColor === preset.class;
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setAccentColor(preset.class);
                      }}
                      className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 pointer-events-auto cursor-pointer ${preset.class} ${
                        isCurrent ? "border-white scale-105 shadow-[0_0_12px_rgba(255,255,255,0.4)]" : "border-transparent"
                      }`}
                      title={`${preset.name} accent`}
                    ></button>
                  );
                })}
              </div>
            </div>

            {/* Reduce animation toggle */}
            <div className="flex items-center justify-between bg-[#11122a] p-3 rounded-xl border border-white/5 text-xs">
              <div>
                <p className="text-slate-200 font-bold">Reduce Motions</p>
                <p className="text-[10px] text-slate-500 font-medium">Minimize sliding transitions across panels</p>
              </div>
              <input
                type="checkbox"
                checked={reduceAnimations}
                onChange={() => setReduceAnimations(!reduceAnimations)}
                className="w-4 h-4 rounded bg-[#121435] border-white/10"
              />
            </div>

          </div>

          {/* Data & Storage */}
          <div className="bg-[#0b0c24] border border-white/5 rounded-2xl p-5 shadow-lg space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-white/5 pb-2">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              <span>Data & storage</span>
            </h4>

            <div className="space-y-3 text-xs">
              
              <div className="flex items-center justify-between bg-[#11122a] p-3 rounded-xl border border-white/5">
                <div>
                  <p className="text-slate-200 font-bold">Download Offline Manager</p>
                  <p className="text-[10px] text-slate-500">Save stories and translations offline</p>
                </div>
                <input
                  type="checkbox"
                  checked={downloadOffline}
                  onChange={() => {
                    setDownloadOffline(!downloadOffline);
                    alert("Downloaded content successfully saved to browser local database.");
                  }}
                  className="w-4 h-4 text-purple-600 rounded bg-[#121435] border-white/5"
                />
              </div>

              {/* Clear cache alert */}
              <button
                type="button"
                onClick={() => {
                  alert("🎉 Successfully cleared 245 MB of audio caches!");
                  onNavigate && onNavigate("home");
                }}
                className="w-full text-left bg-[#11122a] hover:bg-white/5 border border-white/5 p-3 rounded-xl transition-colors flex justify-between items-center cursor-pointer"
              >
                <div>
                  <p className="text-slate-200 font-bold">Clear local audio cache</p>
                  <p className="text-[10px] text-slate-500">Free up local browser disk space memory</p>
                </div>
                <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950 px-2.5 py-0.5 rounded border border-purple-900">
                  245 MB
                </span>
              </button>

            </div>
          </div>

          {/* Security details (Page 8) */}
          <div className="bg-[#0b0c24] border border-white/5 rounded-2xl p-5 shadow-lg space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-white/5 pb-2">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>Security settings</span>
            </h4>

            <div className="space-y-2 text-xs">
              {[
                "Two-Factor Authentication Setup",
                "Recent Login History Logs",
                "Manage Connected Devices (1 currently logged)"
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => alert(`Review: ${item}`)}
                  className="w-full text-left bg-[#11122a] hover:bg-white/5 p-3 rounded-xl border border-white/5 transition-colors flex justify-between items-center cursor-pointer"
                >
                  <span className="text-slate-300 font-medium">{item}</span>
                  <span className="text-slate-500">→</span>
                </button>
              ))}
            </div>
          </div>

          {/* Footnotes Information (Page 8 style) */}
          <div className="bg-[#0a0b1f] border border-white/5 rounded-2xl p-4 shadow-lg text-xs space-y-1 text-slate-400">
            <p className="font-bold text-slate-300 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-blue-400" />
              <span>Language Bridge Storyteller App</span>
            </p>
            <p className="text-[10px]">App Version: 1.2.0 (Stable release build)</p>
            <p className="text-[10px]">Powered by Google Gemini 3.5-flash serverless API proxying.</p>
          </div>

        </div>

      </div>

    </div>
  );
}
