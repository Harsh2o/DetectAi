import React, { useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Settings() {
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  
  const [hfToken, setHfToken] = useState(localStorage.getItem('hf_token') || '');
  const [savedMsg, setSavedMsg] = useState(false);

  if (isSignedIn === false) {
    navigate('/login');
    return null;
  }

  const handleSaveToken = () => {
    localStorage.setItem('hf_token', hfToken);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };
  
  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background text-on-background font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-white/5 flex flex-col fixed h-full z-10 hidden md:flex">
        <div className="p-6">
          <Link to="/" className="font-bold text-2xl text-primary flex items-center gap-2 tracking-tight">
            <span className="material-symbols-outlined text-[28px] text-primary">troubleshoot</span>
            DetectAi
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link to="/dashboard" className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 font-medium rounded-xl transition-all">
            <span className="material-symbols-outlined">dashboard</span>
            Workspace
          </Link>
          <Link to="/dashboard/history" className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 font-medium rounded-xl transition-all">
            <span className="material-symbols-outlined">history</span>
            History
          </Link>
          <Link to="/dashboard/analytics" className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 font-medium rounded-xl transition-all">
            <span className="material-symbols-outlined">analytics</span>
            Analytics
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary font-medium rounded-xl transition-all">
            <span className="material-symbols-outlined">settings</span>
            Settings
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8 relative">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-on-surface mb-2">Settings</h1>
          <p className="text-on-surface-variant">Manage your account and engine preferences.</p>
        </header>

        <div className="max-w-3xl space-y-8">
          <div className="bg-surface border border-white/10 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-on-surface mb-4">Account Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Email Address</label>
                <input 
                  type="email" 
                  disabled 
                  className="w-full bg-background border border-white/10 rounded-xl px-4 py-2 text-on-surface opacity-70 cursor-not-allowed" 
                  value={user?.primaryEmailAddress?.emailAddress || "Loading..."} 
                />
              </div>
              <div className="flex gap-4 pt-2">
                <button className="px-4 py-2 bg-surface-container rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">Manage Clerk Profile</button>
                <button onClick={handleLogout} className="px-4 py-2 border border-error/30 text-error rounded-lg text-sm font-medium hover:bg-error/10 transition-colors">Sign Out</button>
              </div>
            </div>
          </div>
          
          <div className="bg-surface border border-white/10 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-on-surface mb-4">Engine Preferences</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1 flex items-center gap-2">
                  HuggingFace API Token
                  <span className="px-2 py-0.5 bg-primary/20 text-primary rounded text-[10px] uppercase font-bold tracking-wider">Required for Text Analysis</span>
                </label>
                <p className="text-xs text-on-surface-variant mb-3">Your token is stored locally in your browser and never sent to our servers. Only sent directly to HuggingFace.</p>
                <div className="flex gap-3">
                  <input 
                    type="password" 
                    placeholder="hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="flex-1 bg-background border border-white/10 rounded-xl px-4 py-2 text-on-surface focus:outline-none focus:border-primary/50 transition-colors" 
                    value={hfToken}
                    onChange={(e) => setHfToken(e.target.value)}
                  />
                  <button onClick={handleSaveToken} className="px-6 py-2 bg-primary text-on-primary font-medium rounded-xl hover:bg-primary-hover transition-colors">
                    Save Key
                  </button>
                </div>
                {savedMsg && <p className="text-success text-sm mt-2 flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">check_circle</span> Token saved securely to local storage.</p>}
              </div>

              <div className="border-t border-white/10 pt-6 flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-on-surface">Data Privacy</h4>
                  <p className="text-sm text-on-surface-variant mt-1">Opt-out of sending telemetry data to DetectAi servers.</p>
                </div>
                <div className="w-12 h-6 bg-surface-container rounded-full relative cursor-pointer border border-white/10">
                  <div className="w-4 h-4 bg-white/50 rounded-full absolute top-1 left-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
