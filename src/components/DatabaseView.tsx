import React, { useState, useEffect } from "react";
import { 
  Database, 
  Search, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  RefreshCw, 
  UserPlus, 
  Key, 
  ShieldAlert, 
  User, 
  Lock, 
  Check, 
  Sparkles,
  ArrowRight
} from "lucide-react";

interface UserRecord {
  email: string;
  name: string;
  passwordHash: string;
  level: number;
  xp: number;
  isProVerified?: boolean;
  avatarEmoji?: string;
  location?: string;
}

interface DatabaseViewProps {
  onImpersonate: (email: string, name: string, level: number, xp: number, extraStats?: any) => void;
  accentClass: string;
}

export default function DatabaseView({ onImpersonate, accentClass }: DatabaseViewProps) {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Edit states
  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editLevel, setEditLevel] = useState(1);
  const [editXp, setEditXp] = useState(0);
  const [editIsProVerified, setEditIsProVerified] = useState(false);
  const [editAvatarEmoji, setEditAvatarEmoji] = useState("🧑‍🎓");
  const [editLocation, setEditLocation] = useState("India");
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState<string | null>(null);

  // Create state
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newLevel, setNewLevel] = useState(1);
  const [newXp, setNewXp] = useState(0);
  const [newIsProVerified, setNewIsProVerified] = useState(false);
  const [newAvatarEmoji, setNewAvatarEmoji] = useState("🧑‍🎓");
  const [newLocation, setNewLocation] = useState("India");

  const fetchUsers = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
      } else {
        setErrorMsg(data.error || "Failed to load backend database");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error trying to fetch user databases.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!newName || !newEmail || !newPassword) {
      setErrorMsg("Please complete all registration credentials.");
      return;
    }

    try {
      const res = await fetch("/api/admin/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          password: newPassword,
          level: newLevel,
          xp: newXp,
          isProVerified: newIsProVerified,
          avatarEmoji: newAvatarEmoji,
          location: newLocation
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Successfully created new user: "${data.user.name}"`);
        setIsCreating(false);
        // Clear inputs
        setNewName("");
        setNewEmail("");
        setNewPassword("");
        setNewLevel(1);
        setNewXp(0);
        setNewIsProVerified(false);
        setNewAvatarEmoji("🧑‍🎓");
        setNewLocation("India");
        // Reload list
        fetchUsers();
      } else {
        setErrorMsg(data.error || "Could not insert user record.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to connect to backend service.");
    }
  };

  const handleStartEdit = (user: UserRecord) => {
    setEditingEmail(user.email);
    setEditName(user.name);
    setEditPassword(user.passwordHash);
    setEditLevel(user.level);
    setEditXp(user.xp);
    setEditIsProVerified(user.isProVerified || false);
    setEditAvatarEmoji(user.avatarEmoji || "🧑‍🎓");
    setEditLocation(user.location || "India");
  };

  const handleSaveEdit = async (userEmail: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await fetch("/api/admin/users/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalEmail: userEmail,
          name: editName,
          password: editPassword,
          level: editLevel,
          xp: editXp,
          isProVerified: editIsProVerified,
          avatarEmoji: editAvatarEmoji,
          location: editLocation
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Database updated successfully for ${data.user.email}!`);
        setEditingEmail(null);
        fetchUsers();
      } else {
        setErrorMsg(data.error || "Could not save database changes.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Unable to transmit update requested.");
    }
  };

  const handleDeleteUser = async (userEmail: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await fetch("/api/admin/users/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Deleted "${userEmail}" successfully.`);
        setDeleteConfirmEmail(null);
        fetchUsers();
      } else {
        setErrorMsg(data.error || "Failed to remove user record.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to communicate deletion.");
    }
  };

  const handleQuickImpersonate = (user: UserRecord) => {
    onImpersonate(user.email, user.name, user.level, user.xp, user);
    setSuccessMsg(`Switched sessions to ${user.name}! Enjoy total admin access.`);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5 text-white font-sans text-left selection:bg-purple-600 pb-12">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2">
            <Database className="w-6 h-6 text-cyan-400" />
            <span>Persistent User Database</span>
          </h2>
          <p className="text-xs text-slate-400">
            Read-write access control system for all user profiles synchronized live with the filesystem backend.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={fetchUsers}
            className="p-2.5 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/5 rounded-xl transition-all cursor-pointer"
            title="Refresh Database Records"
          >
            <RefreshCw className={`w-4 h-4 text-cyan-300 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            type="button"
            onClick={() => setIsCreating(!isCreating)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all active:scale-95 ${
              isCreating 
                ? "bg-slate-700 hover:bg-slate-600 border border-white/10" 
                : "bg-cyan-600 hover:bg-cyan-500 border border-cyan-500/20 text-white shadow-lg shadow-cyan-900/35"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{isCreating ? "Cancel" : "Add New User"}</span>
          </button>
        </div>
      </div>

      {/* Database Event Notification banners */}
      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-xs px-4 py-3 rounded-xl flex items-center gap-2 gap-y-1 animate-in fade-in duration-200">
          <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs px-4 py-3 rounded-xl flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Manual Insert User Section */}
      {isCreating && (
        <form onSubmit={handleCreateUser} className="bg-[#0b0c24] border border-cyan-500/20 rounded-2xl p-4 md:p-5 shadow-xl space-y-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span>Create New User Profile</span>
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">DB Mode: Persistent file-write</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#121435] border border-white/5 focus:border-cyan-400 text-white rounded-xl outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Email Address</label>
              <input
                type="email"
                required
                placeholder="e.g. john@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#121435] border border-white/5 focus:border-cyan-400 text-white rounded-xl outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Password Hash / Phrase</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. secret123"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#121435] border border-white/5 focus:border-cyan-400 text-white rounded-xl outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs pt-1">
            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Initial Level: {newLevel}</label>
              <input
                type="range"
                min="1"
                max="50"
                value={newLevel}
                onChange={(e) => setNewLevel(Number(e.target.value))}
                className="w-full h-1.5 bg-[#121435] rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Initial XP points: {newXp} XP</label>
              <input
                type="range"
                min="0"
                max="999"
                step="10"
                value={newXp}
                onChange={(e) => setNewXp(Number(e.target.value))}
                className="w-full h-1.5 bg-[#121435] rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Avatar Emoji</label>
              <input
                type="text"
                placeholder="e.g. 👩‍🎓"
                value={newAvatarEmoji}
                onChange={(e) => setNewAvatarEmoji(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#121435] border border-white/5 focus:border-cyan-400 text-white rounded-xl outline-none font-sans"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Location</label>
              <input
                type="text"
                placeholder="e.g. India"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#121435] border border-white/5 focus:border-cyan-400 text-white rounded-xl outline-none"
              />
            </div>

            <div className="space-y-1 flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
                <input
                  type="checkbox"
                  checked={newIsProVerified}
                  onChange={(e) => setNewIsProVerified(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-cyan-400 focus:ring-cyan-500 focus:ring-opacity-25 w-4 h-4 cursor-pointer"
                />
                <span className="font-semibold text-slate-300">Award PRO VERIFIED Badge</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-4 py-2 rounded-xl active:scale-95 transition-all cursor-pointer"
            >
              Commit User to DB
            </button>
          </div>
        </form>
      )}

      {/* Statistics counters */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#0b0c24] border border-white/5 p-3 rounded-xl">
          <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Total Core Users</p>
          <p className="text-lg md:text-xl font-black text-cyan-400 mt-1">{users.length}</p>
        </div>
        <div className="bg-[#0b0c24] border border-white/5 p-3 rounded-xl">
          <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Highest Level Achieved</p>
          <p className="text-lg md:text-xl font-black text-purple-400 mt-1">
            {users.length > 0 ? Math.max(...users.map(u => u.level)) : 1}
          </p>
        </div>
        <div className="bg-[#0b0c24] border border-white/5 p-3 rounded-xl">
          <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Total Live XP Pool</p>
          <p className="text-lg md:text-xl font-black text-emerald-400 mt-1">
            {users.length > 0 ? users.reduce((sum, u) => sum + u.xp, 0) : 0} XP
          </p>
        </div>
      </div>

      {/* Query Filter and Search block */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Filter live backend users by name, email or keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#0b0c24] border border-white/5 focus:border-cyan-500 rounded-xl outline-none text-xs text-white placeholder-slate-500 transition-colors"
        />
      </div>

      {/* Main Database Table Container */}
      <div className="bg-[#0b0c24] border border-white/5 rounded-2xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
            <span>Scanning cloud backend user registry...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No registered users match your parameters. Customize the query or add a brand-new user above!
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredUsers.map((user) => {
              const isEditing = editingEmail === user.email;
              const isRootSeed = user.email.toLowerCase() === "admin@languagebridge.com";
              const letterCode = user.name ? user.name.slice(0, 2).toUpperCase() : "US";

              return (
                <div key={user.email} className="p-4 md:p-5 flex flex-col gap-3 justify-between transition-colors hover:bg-white/[0.01]">
                  
                  {/* Row Head: Profile avatar, email name, status indicator */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="flex items-center gap-3">
                      
                      {/* Generative UI Placeholder Avatar */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-purple-600 font-bold text-xs flex items-center justify-center text-white border border-white/10 shrink-0">
                        {letterCode}
                      </div>

                      <div className="text-left">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="bg-[#121435] border border-cyan-400/50 text-white rounded px-2 py-0.5 text-xs outline-none focus:ring-1 focus:ring-cyan-400 font-bold max-w-[150px]"
                          />
                        ) : (
                          <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                            <span>{user.name}</span>
                            {isRootSeed && (
                              <span className="text-[8px] tracking-wide font-extrabold uppercase bg-red-950 text-red-400 border border-red-900/40 px-1.5 py-0.5 rounded">
                                Root Seed
                              </span>
                            )}
                          </h4>
                        )}
                        <p className="text-[10px] text-slate-400 font-mono select-all truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* Actions and Session control buttons */}
                    <div className="flex items-center gap-1.5 ml-13 sm:ml-0">
                      
                      {/* Impersonate/Super-Access button */}
                      <button
                        type="button"
                        onClick={() => handleQuickImpersonate(user)}
                        className="bg-purple-600 hover:bg-purple-500 text-white border border-purple-500/20 text-[10px] font-bold px-2.5 py-1.5 rounded-lg active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                        title="Gain full access to their app sessions"
                      >
                        <span>Impersonate Account</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(user.email)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-lg active:scale-95 transition-all cursor-pointer"
                            title="Commit Changes"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingEmail(null)}
                            className="bg-slate-700 hover:bg-slate-600 text-slate-300 p-2 rounded-lg active:scale-95 transition-all cursor-pointer"
                            title="Cancel Edit"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleStartEdit(user)}
                            className="bg-white/5 hover:bg-white/10 text-slate-300 p-2 rounded-lg active:scale-95 transition-all cursor-pointer"
                            title="Edit User profile parameters"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {isRootSeed ? (
                            <div 
                              className="bg-slate-900 border border-slate-800 text-slate-500 p-2 rounded-lg cursor-not-allowed flex items-center justify-center"
                              title="Root Admin Database Record is permanently protected and cannot be deleted"
                            >
                              <Lock className="w-3.5 h-3.5" />
                            </div>
                          ) : deleteConfirmEmail === user.email ? (
                            <div className="flex items-center gap-1.5 bg-red-950/50 border border-red-500/30 p-1 rounded-lg shrink-0">
                              <span className="text-[10px] text-red-300 font-extrabold px-1.5 animate-pulse">Sure?</span>
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(user.email)}
                                className="bg-red-600 hover:bg-red-500 text-white font-extrabold text-[9px] uppercase tracking-wider px-2 py-1 rounded cursor-pointer animate-bounce"
                                title="Permanently delete user profile"
                              >
                                Yes, Wipe
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmEmail(null)}
                                className="bg-slate-700 hover:bg-slate-600 text-[9px] font-bold text-slate-300 px-2 py-1 rounded cursor-pointer"
                                title="Abort permanent delete"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmEmail(user.email)}
                              className="bg-red-950/30 hover:bg-red-900/20 text-red-400 p-2 rounded-lg active:scale-95 transition-all cursor-pointer"
                              title="Delete user profile permanently"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Level, XP and Security metrics details block */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#11122a] p-3 rounded-xl border border-white/5 mt-1 text-xs">
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-slate-400">Level (Multiplier)</span>
                        <span className="font-bold text-cyan-300">Lvl {isEditing ? editLevel : user.level}</span>
                      </div>
                      {isEditing ? (
                        <input
                          type="range"
                          min="1"
                          max="50"
                          value={editLevel}
                          onChange={(e) => setEditLevel(Number(e.target.value))}
                          className="w-full h-1 bg-[#121435] rounded-md appearance-none cursor-pointer accent-cyan-400"
                        />
                      ) : (
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-cyan-400" 
                            style={{ width: `${Math.min(100, (user.level / 50) * 100)}%` }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-slate-400">XP Progress</span>
                        <span className="font-bold text-purple-300">{isEditing ? editXp : user.xp} / 1000 XP</span>
                      </div>
                      {isEditing ? (
                        <input
                          type="range"
                          min="0"
                          max="999"
                          step="10"
                          value={editXp}
                          onChange={(e) => setEditXp(Number(e.target.value))}
                          className="w-full h-1 bg-[#121435] rounded-md appearance-none cursor-pointer accent-purple-400"
                        />
                      ) : (
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-purple-500" 
                            style={{ width: `${(user.xp / 1000) * 100}%` }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 flex flex-col justify-center">
                      <span className="text-[10px] text-slate-400 leading-none">Password Credential</span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Key className="w-3 h-3 text-yellow-500 shrink-0" />
                        {isEditing ? (
                          <input
                            type="text"
                            value={editPassword}
                            onChange={(e) => setEditPassword(e.target.value)}
                            className="bg-[#121435] border border-cyan-400/50 text-white rounded-md px-1.5 py-0.5 text-[10px] outline-none max-w-[120px] font-mono leading-none"
                          />
                        ) : (
                          <span className="font-mono text-slate-300 text-[10px] bg-[#070519] px-2 py-0.5 rounded border border-white/5 select-all">
                            {user.passwordHash}
                          </span>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Avatar, Location and Pro Badge customization block */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#11122a]/50 p-3 rounded-xl border border-white/5 mt-2 text-xs">
                    <div className="space-y-1 text-left">
                      <span className="text-[10px] text-slate-400 block">Avatar Emoji</span>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editAvatarEmoji}
                          onChange={(e) => setEditAvatarEmoji(e.target.value)}
                          className="w-full bg-[#121435] border border-cyan-400/50 text-white rounded px-2 py-1 text-xs outline-none"
                        />
                      ) : (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-lg">{user.avatarEmoji || "🧑‍🎓"}</span>
                          <span className="text-slate-300">Emoji</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 text-left">
                      <span className="text-[10px] text-slate-400 block">User Region / Location</span>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editLocation}
                          onChange={(e) => setEditLocation(e.target.value)}
                          className="w-full bg-[#121435] border border-cyan-400/50 text-white rounded px-2 py-1 text-xs outline-none"
                        />
                      ) : (
                        <div className="text-slate-300 font-medium mt-1 select-all">
                          📍 {user.location || "India"}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 text-left flex flex-col justify-center">
                      <span className="text-[10px] text-slate-400 block">PRO VERIFIED Badge status</span>
                      <div className="mt-1 flex items-center">
                        {isEditing ? (
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={editIsProVerified}
                              onChange={(e) => setEditIsProVerified(e.target.checked)}
                              className="rounded border-slate-700 bg-slate-950 text-cyan-400 focus:ring-cyan-500 w-4 h-4 cursor-pointer"
                            />
                            <span className="text-slate-300 text-xs">Has Verified Badge</span>
                          </label>
                        ) : (
                          user.isProVerified ? (
                            <span className="text-[9px] tracking-wide font-extrabold uppercase bg-purple-950 border border-purple-800 text-purple-400 px-2 py-0.5 rounded-full select-none">
                              PRO VERIFIED ACTIVE
                            </span>
                          ) : (
                            <span className="text-[9px] tracking-wide font-bold uppercase bg-slate-900 border border-slate-800 text-slate-500 px-2 py-0.5 rounded-full select-none">
                              STANDARD ACCOUNT
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Info Footnote block */}
      <div className="bg-[#0a0b1f] border border-white/5 rounded-2xl p-4 text-xs text-slate-400 space-y-1">
        <p className="font-bold text-slate-300 flex items-center gap-1 text-[11px]">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Active Persistent Sandbox Database Engine</span>
        </p>
        <p className="leading-relaxed text-[10px]">
          Changes committed here write directly to <strong>/users_db.json</strong> in the environment workspace. 
          To test how each user experiences stories and Translator features, click the <strong>Impersonate Account</strong> button 
          to swap runtime profiles instantly!
        </p>
      </div>

    </div>
  );
}
