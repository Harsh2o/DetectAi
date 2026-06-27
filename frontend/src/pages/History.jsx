import React, { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Link, useNavigate } from 'react-router-dom';

export default function History() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const [historyLogs, setHistoryLogs] = useState([]);

  useEffect(() => {
    if (user && user.id) {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/history/${user.id}`)
        .then(res => res.json())
        .then(data => {
          // Map backend format to frontend format expected by History component
          const mappedLogs = data.map(item => ({
            id: item.id.toString(),
            date: item.timestamp + "Z", // ensure UTC formatting 
            type: item.modality.charAt(0).toUpperCase() + item.modality.slice(1),
            preview: item.content_snippet,
            score: Math.round(item.confidence)
          }));
          setHistoryLogs(mappedLogs);
        })
        .catch(err => console.error("Failed to fetch history:", err));
    }
  }, [user]);

  if (isSignedIn === false) {
    navigate('/login');
    return null;
  }

  const handleClearHistory = () => {
    if(window.confirm("Clearing history in the backend is not yet supported. Clear local view?")) {
      setHistoryLogs([]);
    }
  };
  
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const today = new Date();
    const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth() && date.getFullYear() === yesterday.getFullYear();
    
    const timeOptions = { hour: 'numeric', minute: '2-digit' };
    const timeString = date.toLocaleTimeString([], timeOptions);
    
    if (isToday) return `Today, ${timeString}`;
    if (isYesterday) return `Yesterday, ${timeString}`;
    
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) + `, ${timeString}`;
  };

  const getIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'text': return 'description';
      case 'image': return 'image';
      case 'audio': return 'graphic_eq';
      case 'video': return 'movie';
      default: return 'history';
    }
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
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary font-medium rounded-xl transition-all">
            <span className="material-symbols-outlined">history</span>
            History
          </button>
          <Link to="/dashboard/analytics" className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 font-medium rounded-xl transition-all">
            <span className="material-symbols-outlined">analytics</span>
            Analytics
          </Link>
          <Link to="/dashboard/settings" className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 font-medium rounded-xl transition-all">
            <span className="material-symbols-outlined">settings</span>
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8 relative">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-on-surface mb-2">History</h1>
            <p className="text-on-surface-variant">Review your past detection scans.</p>
          </div>
          {historyLogs.length > 0 && (
            <button onClick={handleClearHistory} className="text-sm font-medium text-error hover:bg-error/10 px-4 py-2 rounded-lg transition-colors border border-error/20 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">delete</span>
              Clear History
            </button>
          )}
        </header>

        <div className="bg-surface border border-white/10 rounded-2xl shadow-xl overflow-hidden">
          {historyLogs.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center justify-center opacity-50">
               <span className="material-symbols-outlined text-5xl mb-4 text-on-surface-variant">history</span>
               <p className="text-on-surface-variant font-medium">No history found. Run a scan in the Workspace to see it here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/5 bg-background/50">
                    <th className="py-4 px-6 font-medium text-on-surface-variant text-sm w-[20%]">Date</th>
                    <th className="py-4 px-6 font-medium text-on-surface-variant text-sm w-[15%]">Type</th>
                    <th className="py-4 px-6 font-medium text-on-surface-variant text-sm w-[50%]">Preview</th>
                    <th className="py-4 px-6 font-medium text-on-surface-variant text-sm text-right w-[15%]">AI Likelihood</th>
                  </tr>
                </thead>
                <tbody>
                  {historyLogs.map((log) => (
                    <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                      <td className="py-4 px-6 text-on-surface text-sm whitespace-nowrap">{formatDate(log.date)}</td>
                      <td className="py-4 px-6">
                        <span className="px-2 py-1 bg-surface border border-white/10 rounded text-xs text-on-surface-variant flex items-center w-max gap-1">
                          <span className="material-symbols-outlined text-[14px]">{getIcon(log.type)}</span> {log.type}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-on-surface-variant text-sm">
                        <div className="truncate max-w-[300px] md:max-w-[400px] xl:max-w-[500px]" title={log.preview}>
                          {log.preview}
                        </div>
                      </td>
                      <td className={`py-4 px-6 text-right font-bold ${log.score >= 50 ? 'text-error' : 'text-success'}`}>
                        {log.score}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
